"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.other = exports.index = void 0;
var typesense = require("typesense");
var file = require("./dirs");
var fs = require("fs");
var h = process.env.HOME;
var node = require(h + "/.typesense-cli/typesense-cli.config.json");
var schemas = require(h + "/.typesense-cli/schemas.json");
var client = new typesense.Client(node.serverNode);
var index = /** @class */ (function () {
    function index() {
        this.finalResult = [];
    }
    index.prototype.appendData = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.json = JSON.parse(p);
                        return [4 /*yield*/, this.getCol()];
                    case 1:
                        _a.sent();
                        this.start_time = new Date();
                        console.log("Appending Data...\n");
                        this.inputValidation();
                        return [4 /*yield*/, this.chunkData()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(this.finalResult)];
                    case 3:
                        results = _a.sent();
                        this.finish_time = new Date();
                        console.log("\nFinished Appendind data " + this.getNumberOfIndexed(this.finalResult).toString() + " documents into memory in " + this.timeTaken());
                        return [2 /*return*/, results];
                }
            });
        });
    };
    index.prototype.indexData = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.json = JSON.parse(p);
                        return [4 /*yield*/, this.getCol()];
                    case 1:
                        _a.sent();
                        this.start_time = new Date();
                        console.log("Staring Index...\n");
                        this.inputValidation();
                        return [4 /*yield*/, this.refreshSchemas()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.chunkData()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(this.finalResult)];
                    case 4:
                        results = _a.sent();
                        this.finish_time = new Date();
                        console.log("\nFinished indexing " + this.getNumberOfIndexed(this.finalResult).toString() + " documents into memory in " + this.timeTaken());
                        return [2 /*return*/, results];
                }
            });
        });
    };
    index.prototype.inputValidation = function () {
        if (this.schemasExist()) {
            this.dataExists();
        }
    };
    index.prototype.schemasExist = function () {
        for (var i = 0; i < this.json.length; i++) {
            if (!schemas[this.json[i].collection]) {
                throw new Error("\"" + this.json[i].collection + "\" is not a known collection!!!");
            }
        }
        return true;
    };
    index.prototype.dataExists = function () {
        for (var i = 0; i < this.json.length; i++) {
            for (var i2 = 0; i2 < this.json[i].data.length; i2++) {
                if (!file.directoryExists(this.json[i].data[i2])) {
                    throw new Error("Path to data file does not exist: " + this.json[i].data[i2]);
                }
            }
        }
        return true;
    };
    index.prototype.refreshSchemas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.json.length === undefined) {
                            throw new Error("Expected args for --index are [string]");
                        }
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < this.json.length)) return [3 /*break*/, 12];
                        if (!this.alreadyACollection(i)) return [3 /*break*/, 7];
                        console.log("Refreshing " + this.json[i].collection + " collection:");
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, client.collections(this.json[i].collection).delete()];
                    case 3:
                        _b.sent();
                        console.log("\u251C\u2500\u2500 Old " + this.json[i].collection + " collection deleted");
                        return [4 /*yield*/, client.collections().create(schemas[this.json[i].collection])];
                    case 4:
                        _b.sent();
                        console.log("\u2514\u2500\u2500 New " + this.json[i].collection + " collection created");
                        return [3 /*break*/, 6];
                    case 5:
                        _a = _b.sent();
                        (function (error) {
                            console.log(error);
                        });
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 11];
                    case 7:
                        console.log("Creating the " + this.json[i].collection + " collection:");
                        _b.label = 8;
                    case 8:
                        _b.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, client.collections().create(schemas[this.json[i].collection])];
                    case 9:
                        _b.sent();
                        console.log("\u2514\u2500\u2500 " + this.json[i].collection + " collection created");
                        return [3 /*break*/, 11];
                    case 10:
                        error_1 = _b.sent();
                        console.log(error_1);
                        return [3 /*break*/, 11];
                    case 11:
                        i++;
                        return [3 /*break*/, 1];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    index.prototype.alreadyACollection = function (i) {
        for (var i2 = 0; i2 < this.collection.length; i2++) {
            if (this.collection[i2].name === this.json[i].collection) {
                return true;
            }
        }
        return false;
    };
    index.prototype.getCol = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, client.collections().retrieve()];
                    case 1:
                        _a.collection = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    index.prototype.chunkData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, i2, last, chunkSize, data, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.json.length)) return [3 /*break*/, 10];
                        console.log("\n" + this.json[i].collection + ":");
                        i2 = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i2 < this.json[i].data.length)) return [3 /*break*/, 9];
                        last = void 0;
                        if (i2 === this.json[i].data.length - 1) {
                            last = true;
                        }
                        else {
                            last = false;
                        }
                        chunkSize = node.chunckSize;
                        data = require(this.json[i].data[i2]);
                        if (!(data.length < chunkSize)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.indexToCollections(i, data, last)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(data.length > chunkSize)) return [3 /*break*/, 6];
                        ret = data.splice(0, chunkSize);
                        return [4 /*yield*/, this.indexToCollections(i, ret, false)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 6: return [4 /*yield*/, this.indexToCollections(i, data, last)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        i2++;
                        return [3 /*break*/, 2];
                    case 9:
                        i++;
                        return [3 /*break*/, 1];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    index.prototype.timeTaken = function () {
        var time = this.finish_time - this.start_time;
        var response;
        var x;
        if (time >= 60000) {
            x = time / 60000;
            response = x.toFixed(2) + " minutes";
            return response;
        }
        else {
            x = time / 1000;
            response = x.toFixed(2) + " seconds";
            return response;
        }
    };
    index.prototype.indexToCollections = function (i, dataAtIndex, last) {
        return __awaiter(this, void 0, void 0, function () {
            var returned, failed, error_2, i_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, client
                                .collections(this.json[i].collection)
                                .documents()
                                .import(dataAtIndex)];
                    case 1:
                        returned = _a.sent();
                        failed = returned.filter(function (item) { return item.success === false; });
                        if (failed.length > 0) {
                            throw new Error("\u2514\u2500\u2500 Error Indexing Items");
                        }
                        this.finalResult.push(returned);
                        if (last) {
                            console.log("\u2514\u2500\u2500 Successfully indexed " + dataAtIndex.length + " docunents into the " + this.json[i].collection + " collection");
                        }
                        else {
                            console.log("\u251C\u2500\u2500 Successfully indexed " + dataAtIndex.length + " docunents into the " + this.json[i].collection + " collection");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        for (i_1 = 0; i_1 < error_2.importResults.length; i_1++) {
                            if (error_2.importResults[i_1].success === false) {
                                console.log("Error With Document: " + error_2.importResults[i_1].error);
                            }
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    index.prototype.getNumberOfIndexed = function (indexedData) {
        var dataSet = indexedData.length;
        var count = 0;
        for (var i = 0; i < dataSet; i++) {
            var setLength = indexedData[i].length;
            count += setLength;
        }
        return count;
    };
    return index;
}());
exports.index = index;
var other = /** @class */ (function () {
    function other() {
    }
    other.prototype.collections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var collections;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.collections().retrieve()];
                    case 1:
                        collections = _a.sent();
                        console.log(collections);
                        return [2 /*return*/];
                }
            });
        });
    };
    other.prototype.deleteCollection = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var collections, _i, collections_1, collection;
            return __generator(this, function (_a) {
                collections = args.split(" ");
                for (_i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
                    collection = collections_1[_i];
                    try {
                        client.collections(collection).delete();
                        console.log(collection + " deleted");
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    other.prototype.makeKey = function (x) {
        return __awaiter(this, void 0, void 0, function () {
            var json, newKey, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json = JSON.parse(x);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, client.keys().create({
                                description: json.description,
                                actions: json.actions,
                                collections: json.collections,
                            })];
                    case 2:
                        newKey = _a.sent();
                        console.log(newKey);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    other.prototype.getKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.keys().retrieve()];
                    case 1:
                        key = _a.sent();
                        console.log(JSON.stringify(key, null, "  "));
                        return [2 /*return*/];
                }
            });
        });
    };
    other.prototype.removeKey = function (arg) {
        var id = arg.split(" ");
        for (var _i = 0, id_1 = id; _i < id_1.length; _i++) {
            var ids = id_1[_i];
            client.keys(ids).delete();
            console.log("key: " + ids + " deleted");
        }
    };
    other.prototype.getSchemas = function () {
        console.log(JSON.stringify(schemas, null, "  "));
    };
    other.prototype.version = function () {
        var pack = require("../package.json");
        console.log("Version: " + pack.version);
    };
    other.prototype.help = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                fs.readFile(h + "/.typesense-cli/help.txt", "utf8", function (err, data) {
                    if (err)
                        throw err;
                    console.log(data);
                });
                return [2 /*return*/];
            });
        });
    };
    return other;
}());
exports.other = other;
