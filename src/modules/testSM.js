"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serverManagement_1 = require("./serverManagement");
var App = new serverManagement_1.application();
// App.indexData(
//   ["autoSchema"],
//   [["manualData", "examplesData", "referenceData"]]
// );
App.indexData(
  ["autoSchema", "forumSchema"],
  [["manualData", "examplesData", "referenceData"], ["forumData"]]
);
// App.collections();
// App.createCollection();
