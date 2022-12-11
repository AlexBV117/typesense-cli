"use strict";
"Use Strict";
const obj = {
    country: 'Chile',
    name: 'Tom',
};
// ✅ Get object value by variable key
const myVar = 'country';
console.log(obj[myVar]); // 👉️ "Chile"
// ✅ Set object key by variable
const num = 4;
obj['myKey' + num] = 'someValue';
console.log(obj.myKey4); // 👉️ "someValue"
