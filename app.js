import VersionData from './VersionData.js';

const data = new VersionData({
    maxDataSize: 3,
    maxArchiveSize: 5
});

//AUTO TESTER
let expectedData;
let expectedArchive;
let expectedHistory;
let actualData;
let actualArchive;
let actualHistory;

console.log("===Test 1===");
data.addData({ name: "Alice", age: 20 });
data.addData({ age: 21 });
data.addData({ city: "Taipei" });
data.addData({ country: "Taiwan" });
actualData = data.getData();
actualArchive = data.getArchive();
actualHistory = data.getHistory();
expectedData = { name: 'Alice', age: 21, city: 'Taipei', country: 'Taiwan' };
expectedArchive = [{ name: 'Alice', age: 20 }];
expectedHistory = [
    { name: 'Alice', age: 21 },
    { city: 'Taipei' },
    { country: 'Taiwan' }
];
console.log("Data match:", JSON.stringify(actualData) === JSON.stringify(expectedData));
console.log("Archive match:", JSON.stringify(actualArchive) === JSON.stringify(expectedArchive));
console.log("History match:", JSON.stringify(actualHistory) === JSON.stringify(expectedHistory));


console.log("===Test 2===");
data.addData({ name: "Blice", age: 80, city: "LosAnglelos" });
data.addData({ country: "BB" });
data.addData({ age: 700 });
actualData = data.getData();
actualArchive = data.getArchive();
actualHistory = data.getHistory();
expectedData = { name: 'Blice', age: 700, city: 'LosAnglelos', country: 'BB' };
expectedArchive = [
    { name: 'Alice', age: 20 },
    { name: 'Alice', age: 21 },
    { name: 'Alice', age: 21, city: 'Taipei' },
    { name: 'Alice', age: 21, city: 'Taipei', country: 'Taiwan' }
];
expectedHistory = [
    { name: 'Blice', age: 80, city: 'LosAnglelos', country: 'Taiwan' },
    { country: 'BB' },
    { age: 700 }
];
console.log("Data match:", JSON.stringify(actualData) === JSON.stringify(expectedData));
console.log("Archive match:", JSON.stringify(actualArchive) === JSON.stringify(expectedArchive));
console.log("History match:", JSON.stringify(actualHistory) === JSON.stringify(expectedHistory));


console.log("===Test 3===");
data.addData({ new: "KKK", age: 0, city: "AMO" });
data.addData({ age: 21 });
data.addData({ country: "CC" });
actualData = data.getData();
actualArchive = data.getArchive();
actualHistory = data.getHistory();
expectedData = { name: 'Blice', age: 21, city: 'AMO', country: 'CC', new: 'KKK' };
expectedArchive = [
    { name: 'Alice', age: 21, city: 'Taipei' },
    { name: 'Alice', age: 21, city: 'Taipei', country: 'Taiwan' },
    { name: 'Blice', age: 80, city: 'LosAnglelos', country: 'Taiwan' },
    { name: 'Blice', age: 80, city: 'LosAnglelos', country: 'BB' },
    { name: 'Blice', age: 700, city: 'LosAnglelos', country: 'BB' }
];
expectedHistory = [
    { name: 'Blice', age: 0, city: 'AMO', country: 'BB', new: 'KKK' },
    { age: 21 },
    { country: 'CC' }
];
console.log("Data match:", JSON.stringify(actualData) === JSON.stringify(expectedData));
console.log("Archive match:", JSON.stringify(actualArchive) === JSON.stringify(expectedArchive));
console.log("History match:", JSON.stringify(actualHistory) === JSON.stringify(expectedHistory));


console.log("===Test 4===");
data.addData({ age: 88 });
data.addData({ new: "TEST", country: "GG" });
data.addData({ city: "Cool" });
actualData = data.getData();
actualArchive = data.getArchive();
actualHistory = data.getHistory();
expectedData = { name: 'Blice', age: 88, city: 'Cool', country: 'GG', new: 'TEST' };
expectedArchive = [
    { name: 'Blice', age: 80, city: 'LosAnglelos', country: 'BB' },
    { name: 'Blice', age: 700, city: 'LosAnglelos', country: 'BB' },
    { name: 'Blice', age: 0, city: 'AMO', country: 'BB', new: 'KKK' },
    { name: 'Blice', age: 21, city: 'AMO', country: 'BB', new: 'KKK' },
    { name: 'Blice', age: 21, city: 'AMO', country: 'CC', new: 'KKK' }
];
expectedHistory = [
    { name: 'Blice', age: 88, city: 'AMO', country: 'CC', new: 'KKK' },
    { new: 'TEST', country: 'GG' },
    { city: 'Cool' }
];
console.log("Data match:", JSON.stringify(actualData) === JSON.stringify(expectedData));
console.log("Archive match:", JSON.stringify(actualArchive) === JSON.stringify(expectedArchive));
console.log("History match:", JSON.stringify(actualHistory) === JSON.stringify(expectedHistory));


console.log("===Test 5===");
data.addData({ NEWB: "EZ" });
data.addData({ Check: "EZ2" });
data.addData({ ATTEND: "EZ3" });
data.addData({ name: null });
actualData = data.getData();
actualArchive = data.getArchive();
actualHistory = data.getHistory();
expectedData = {
    age: 88,
    city: 'Cool',
    country: 'GG',
    new: 'TEST',
    NEWB: 'EZ',
    Check: 'EZ2',
    ATTEND: 'EZ3'
};
expectedArchive = [
    { name: 'Blice', age: 21, city: 'AMO', country: 'CC', new: 'KKK' },
    { name: 'Blice', age: 88, city: 'AMO', country: 'CC', new: 'KKK' },
    { name: 'Blice', age: 88, city: 'AMO', country: 'GG', new: 'TEST' },
    { name: 'Blice', age: 88, city: 'Cool', country: 'GG', new: 'TEST' },
    {
        name: 'Blice',
        age: 88,
        city: 'Cool',
        country: 'GG',
        new: 'TEST',
        NEWB: 'EZ'
    }
];
expectedHistory = [
    {
        name: 'Blice',
        age: 88,
        city: 'Cool',
        country: 'GG',
        new: 'TEST',
        NEWB: 'EZ',
        Check: 'EZ2'
    },
    { ATTEND: 'EZ3' },
    { name: null }
];
console.log("Data match:", JSON.stringify(actualData) === JSON.stringify(expectedData));
console.log("Archive match:", JSON.stringify(actualArchive) === JSON.stringify(expectedArchive));
console.log("History match:", JSON.stringify(actualHistory) === JSON.stringify(expectedHistory));


console.log("===Test SearchKey===");

const key = "name";
console.log(`SEARCHING: ${key}`, data.searchKey(key));
console.log("===restore check===");
data.forceRestoreKey(key, 5);
actualData = data.getData();
actualArchive = data.getArchive();
actualHistory = data.getHistory();
expectedData = {
    age: 88,
    city: 'Cool',
    country: 'GG',
    new: 'TEST',
    NEWB: 'EZ',
    Check: 'EZ2',
    ATTEND: 'EZ3',
    name: 'Blice'
};
expectedArchive = [
    { name: 'Blice', age: 21, city: 'AMO', country: 'CC', new: 'KKK' },
    { name: 'Blice', age: 88, city: 'AMO', country: 'CC', new: 'KKK' },
    { name: 'Blice', age: 88, city: 'AMO', country: 'GG', new: 'TEST' },
    { name: 'Blice', age: 88, city: 'Cool', country: 'GG', new: 'TEST' },
    {
        name: 'Blice',
        age: 88,
        city: 'Cool',
        country: 'GG',
        new: 'TEST',
        NEWB: 'EZ'
    }
];
expectedHistory = [
    {
        name: 'Blice',
        age: 88,
        city: 'Cool',
        country: 'GG',
        new: 'TEST',
        NEWB: 'EZ',
        Check: 'EZ2'
    },
    { ATTEND: 'EZ3' },
    { name: 'Blice' }
];
console.log("Data match:", JSON.stringify(actualData) === JSON.stringify(expectedData));
console.log("Archive match:", JSON.stringify(actualArchive) === JSON.stringify(expectedArchive));
console.log("History match:", JSON.stringify(actualHistory) === JSON.stringify(expectedHistory));

const key2 = "age";
console.log(`SEARCHING: ${key2}`, data.searchKey(key2));
console.log("===restore check===");
data.restoreKey(key2, 0);
actualData = data.getData();
actualArchive = data.getArchive();
actualHistory = data.getHistory();
expectedData = {
    age: 21,
    city: 'Cool',
    country: 'GG',
    new: 'TEST',
    NEWB: 'EZ',
    Check: 'EZ2',
    ATTEND: 'EZ3',
    name: 'Blice'
};
expectedArchive = [
    { name: 'Blice', age: 88, city: 'AMO', country: 'CC', new: 'KKK' },
    { name: 'Blice', age: 88, city: 'AMO', country: 'GG', new: 'TEST' },
    { name: 'Blice', age: 88, city: 'Cool', country: 'GG', new: 'TEST' },
    {
        name: 'Blice',
        age: 88,
        city: 'Cool',
        country: 'GG',
        new: 'TEST',
        NEWB: 'EZ'
    },
    {
        name: 'Blice',
        age: 88,
        city: 'Cool',
        country: 'GG',
        new: 'TEST',
        NEWB: 'EZ',
        Check: 'EZ2'
    }
];
expectedHistory = [
    {
        name: 'Blice',
        age: 88,
        city: 'Cool',
        country: 'GG',
        new: 'TEST',
        NEWB: 'EZ',
        Check: 'EZ2',
        ATTEND: 'EZ3'
    },
    { name: 'Blice' },
    { age: 21 }
];
console.log("Data match:", JSON.stringify(actualData) === JSON.stringify(expectedData));
console.log("Archive match:", JSON.stringify(actualArchive) === JSON.stringify(expectedArchive));
console.log("History match:", JSON.stringify(actualHistory) === JSON.stringify(expectedHistory));


const saveData = data.getSave().data;
const newData = new VersionData(saveData);
console.log("Checking save data to new data... result:", JSON.stringify(newData.getData()) === JSON.stringify(data.getData()));

async function testing() {
    const saveDataCompress = await data.getSave().compress();
    
    const newDataCompress = new VersionData({});
    console.log(newDataCompress);
    await newDataCompress.getSave().decompress(saveDataCompress);
    
    console.log("Checking Compress save data to new data... result:", JSON.stringify(newDataCompress.getData()) === JSON.stringify(data.getData()));
}
testing();