class VersionData {
    constructor(maxDataSize, maxArchiveSize) {
        this.maxDataSize = maxDataSize;
        this.maxArchiveSize = maxArchiveSize;
        /**完整狀態快照 */
        this.records = [];
        this.archive = [];
        /**每筆的最小變更 patch（只包含變動的欄位） */
        this.diffs = [];
        /**當前完整狀態 */
        this.currentState = {};
    }

    // helper: shallow clone (避免引用問題)
    _clone(obj) {
        return (obj && typeof obj === "object") ? { ...obj } : obj;
    }

    addRecord(record) {
        let diff;

        if (typeof record === "object" && record !== null) {
            // 計算最小變更：只包含與 currentState 不同的欄位（或新欄位）
            diff = {};
            for (const key of Object.keys(record)) {
                const newVal = record[key];
                const oldVal = this.currentState[key];
                // treat NaN as equal? 這裡用簡單相等判斷
                if (oldVal !== newVal) {
                    diff[key] = newVal;
                }
            }
            // 如果沒有任何欄位變動（完全相同），仍然記一個空物件或特殊標記
            // 這裡我們記一個空物件，代表沒有變更
            // 更新 currentState（建立新物件避免引用問題）
            this.currentState = { ...this.currentState, ...record };
        } else {
            // primitive value: 視為整個 state 被替換
            diff = record;
            this.currentState = record;
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

    getLatest() {
        if (this.records.length === 0) return null;
        return this._clone(this.records[this.records.length - 1]);
    }

    getHistory() {
        // 回傳 diffs 的淺複本（避免外部修改內部資料）
        return this.diffs.map(d => this._clone(d));
    }

    getArchive() {
        return this.archive.map(a => this._clone(a));
    }
}

export default VersionData