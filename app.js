import VersionData from './VersionData.js';

const data = new VersionData(3, 5);

data.addRecord({ name: "Alice", age: 20 });
data.addRecord({ age: 21 });
data.addRecord({ city: "Taipei" });
data.addRecord({ country: "Taiwan" });

console.log("Latest:", data.getLatest());
console.log("Archive:", data.getArchive());
console.log("History:", data.getHistory());
// [ { name: "Alice", age: 21 }, { city: "Taipei" }, { country: "Taiwan" } ]

data.addRecord({ name: "Blice", age: 80, city: "LosAnglelos" });
data.addRecord({ country: "BB" });
data.addRecord({ age: 700 });

console.log("Latest:", data.getLatest());
console.log("Archive:", data.getArchive());
console.log("History:", data.getHistory());
// [
//   { name: "Blice", age: 80, city: "LosAnglelos", country: "Taipei" },
//   { country: "BB" },
//   { age: 700 }
// ]

data.addRecord({ new: "KKK", age: 0, city: "AMO" });
data.addRecord({ age: 21 });
data.addRecord({ country: "CC" });

console.log("Latest:", data.getLatest());
console.log("Archive:", data.getArchive());
console.log("History:", data.getHistory());
// [
//   { new: "KKK", name: "Blice", age: 0, city: "AMO", country: "BB" },
//   { age: 21 },
//   { country: "CC" }
// ]

data.addRecord({ age: 88 });
data.addRecord({ new: "TEST", country: "GG" });
data.addRecord({ city: "Cool" });

console.log("Latest:", data.getLatest());
console.log("Archive:", data.getArchive());
console.log("History:", data.getHistory());
// [
//   { new: "KKK", name: "Blice", age: 88, city: "AMO", country: "CC" },
//   { new: "TEST", country: "GG" },
//   { city: "Cool" }
// ]


data.addRecord({ NEWB: "EZ" });
data.addRecord({ Check: "EZ2" });
data.addRecord({ ATTEND: "EZ3" });

console.log("Latest:", data.getLatest());
console.log("Archive:", data.getArchive());
console.log("History:", data.getHistory());
// [
//   { NEWB: "EZ", new: "TEST", name: "Blice", age: 88, city: "Cool", country: "GG" },
//   { Check: "EZ2" },
//   { ATTEND: "EZ3" }
// ]