import { setTimeout } from 'timers/promises';
import { brotliCompress, brotliDecompress } from 'zlib';

class VersionData {
    constructor({ maxDataSize = 3, maxArchiveSize = 7, records = [], archive = [], diffs = [], currentState = {} }) {
        this.set({ maxDataSize, maxArchiveSize, records, archive, diffs, currentState });
    }

    set({ maxDataSize = 3, maxArchiveSize = 7, records = [], archive = [], diffs = [], currentState = {} }) {
        /**歷史資料最大容量 */
        this.maxDataSize = maxDataSize;
        /**遺棄資料最大容量 */
        this.maxArchiveSize = maxArchiveSize;
        /**完整狀態快照 */
        this.records = records;
        this.archive = archive;
        /**每筆的最小變更 patch（只包含變動的欄位） */
        this.diffs = diffs;
        /**當前完整狀態 */
        this.currentState = currentState;
    }

    /**helper: shallow clone (避免引用問題) */
    _clone(obj) {
        return (obj && typeof obj === "object") ? { ...obj } : obj;
    }

    /**新增資料: 插入/更新/刪除操作
     * 
     * 插入: {newKey: newValue}
     * 
     * 更新: {recentKey: newValue}
     * 
     * 刪除 (刪除key且在歷史紀錄中留下 null): {recentKey: null}
     */
    addData(newData) {
        let diff;

        if (typeof newData === "object" && newData !== null) {
            // 計算最小變更：只包含與 currentState 不同的欄位（或新欄位）
            diff = {};
            // 先複製一份 currentState
            let nextState = { ...this.currentState };

            for (const key of Object.keys(newData)) {
                const newVal = newData[key];
                const oldVal = this.currentState[key];
                if (newVal === null) {
                    // 如果值是 null 移除 key
                    if (key in nextState) {
                        delete nextState[key];
                        // 記錄成 null，表示刪除
                        diff[key] = null;
                    }
                }
                // treat NaN as equal? 這裡用簡單相等判斷
                else if (oldVal !== newVal) {
                    diff[key] = newVal;
                    nextState[key] = newVal;
                }
            }
            // 如果沒有任何欄位變動（完全相同），仍然記一個空物件或特殊標記
            // 這裡我們記一個空物件，代表沒有變更
            // 更新 currentState（建立新物件避免引用問題）
            this.currentState = nextState;
        } else {
            // primitive value: 視為整個 state 被替換
            diff = newData;
            this.currentState = newData;
        }

        // push 完整快照（clone）
        this.records.push(this._clone(this.currentState));
        // push diff（clone）
        this.diffs.push(this._clone(diff));

        // 超過容量時處理 archive 與 diffs 合併
        if (this.records.length > this.maxDataSize) {
            // 丟到 archive（把最舊的完整快照移出）
            this.archive.push(this.records[0]);
            if (this.archive.length > this.maxArchiveSize) {
                this.archive.shift();
            }
            this.records.shift();

            // diffs 也要裁切：把最舊的兩筆合併成一筆（先舊後新，後者覆蓋）
            if (this.diffs.length >= 2) {
                const merged = { ...this.diffs[0], ...this.diffs[1] };
                // 把合併後的放到開頭，並移除前兩筆
                this.diffs = [merged, ...this.diffs.slice(2)];
            } else if (this.diffs.length === 1) {
                // 只有一筆 diffs 時，直接移除最舊（已被 archive）
                this.diffs = [...this.diffs.slice(1)];
            }
        }
    }

    /**當前最新資料 */
    getData() {
        if (this.records.length === 0) return null;
        return this._clone(this.records[this.records.length - 1]);
    }

    /**歷史資料 */
    getHistory() {
        // 回傳 diffs 的淺複本（避免外部修改內部資料）
        return this.diffs.map(d => this._clone(d));
    }

    /**遺棄資料: 有多的合併歷史紀錄被移置此存放區
     * 
     * (若最新一筆歷史資料移入超出遺棄資料最大容量，第一筆資料將永久被移除)
     */
    getArchive() {
        return this.archive.map(a => this._clone(a));
    }

    /**儲存資料: 建立物件將儲存資料導入
     * 
     * 壓縮技術使用 Brotli: 高壓縮率
     * 儲存可選擇壓縮儲存法
     */
    getSave() {
        const base = () => {
            return {
                maxDataSize: this.maxDataSize,
                maxArchiveSize: this.maxArchiveSize,
                records: this.records,
                archive: this.archive,
                diffs: this.diffs,
                currentState: this.currentState
            }
        }
        const json = JSON.stringify(base());

        return {
            data: base(),
            json: json,
            /**Brotli 壓縮成二進位資料 */
            compress: async () => {
                let data;
                console.log(`json 檔案大小: ${Buffer.byteLength(json)} bytes`);
                brotliCompress(Buffer.from(json), (err, compressed) => {
                    if (err) {
                        throw err;
                    }
                    data = compressed;
                    console.log(`壓縮: ${data}, ${data.length} bytes`);
                });
                await setTimeout(200);
                return data;
            },
            /**自動解壓縮後直接設置進資料 */
            decompress: async (compressedData) => {
                let data;
                brotliDecompress(compressedData, (err, decompressed) => {
                    if (err) {
                        throw err;
                    }
                    data = decompressed;
                    console.log(`解壓縮: ${data}`);
                });
                await setTimeout(200);
                this.set(JSON.parse(data.toString()));
                return data;
            }
        }
    }

    /**查詢某個 key 的歷史紀錄 (包含 records 與 archive)
     * 
     * 排序: 舊至新
     */
    searchKey(key) {
        const history = [];
        let index = 0;

        // archive
        for (const snapshot of this.getArchive()) {
            if (snapshot && key in snapshot) {
                history.push({ index, from: "archive", [key]: snapshot[key] });
                index++;
            }
        }

        // history
        for (const snapshot of this.getHistory()) {
            if (snapshot && key in snapshot) {
                history.push({ index, from: "records", [key]: snapshot[key] });
                index++;
            }
        }

        return history;
    }
    /**恢復 key 的指定紀錄: 重新新增指定的 key 到最後一筆歷史紀錄
     * 
     * 注意: 會修改整體歷史及遺棄資料
     * 
     * @ 如果遺棄資料容量已到達上限，restore key 會使遺棄資料最後一筆記錄移除
     */
    restoreKey(key, index, confirm = () => { return true }) {
        const searchHistory = this.searchKey(key);
        if (index < 0 || index >= searchHistory.length) {
            throw new Error("Index out of range");
        }
        if (this.archive.length >= this.maxArchiveSize) {
            if (!confirm("此操作將刪除最後一筆遺棄資料是否繼續?")) {
                return;
            }
        }
        const value = searchHistory[index][key];
        // 用 addData 把這個 key 的值搬到最新一筆
        this.addData({ [key]: value });
    }
    /**強制恢復 key 的指定紀錄: 修改最後一筆歷史紀錄(key merge 進最後一筆歷史紀錄) */
    forceRestoreKey(key, index) {
        const searchHistory = this.searchKey(key);
        if (index < 0 || index >= searchHistory.length) {
            throw new Error("Index out of range");
        }
        const value = searchHistory[index][key];

        this.diffs[this.diffs.length - 1][key] = value;
        this.records[this.records.length - 1][key] = value;
        this.currentState[key] = value;
    }
}

export default VersionData