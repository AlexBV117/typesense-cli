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
exports.application = void 0;
var typesense = require("typesense");
var file = require("./dirs");
var application = /** @class */ (function () {
    function application() {
        this.schemas = require("../vars/schemas.json");
        this.node = require("../vars/settings.json");
        this.client = new typesense.Client(this.node.serverNode);
    }
    /**
     *   This will return all the collections available on the typesense server.
     *
     * Typical response:
     *
     * [{
     *
     *  created_at: 1625751485,
     *
     *  default_sorting_field: '',
     *
     *  fields: [
     *
     *  [Object], [Object],
     *
     *  ],
     *
     *  name: 'automatic',
     *
     *  num_documents: 3906,
     *
     *  num_memory_shards: 4
     *
     * }]
     */
    application.prototype.collections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var collections;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.collections().retrieve()];
                    case 1:
                        collections = _a.sent();
                        console.log(collections);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * It will remove all collections named in the array
     * If the collection does not exist then it will throw an error
     * @param collection
     */
    application.prototype.deleteCollection = function (collection) {
        return __awaiter(this, void 0, void 0, function () {
            var i, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < collection.length)) return [3 /*break*/, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.collections(collection[i]).delete()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 5];
                    case 5:
                        console.log(collection[i] + " deleted");
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns a list of all the available schemas.
     */
    // public schemaList() {
    //   console.log(`
    //   {
    //     ${JSON.stringify(this.schemasObj, null, "   ")},
    //   }
    //   `);
    // }
    /**
     * Creates a new api key
     * If no arguments are passed then a search only key will be made that can search across all collections.
     * Only give search only keys to the client.
     * The Full API key is only given when it is created so make a note of it somewhere.
     * @param description Internal description to identify what the key is for
     * @param isAdmin If true then a new admin key will be created, If false the key is only allowed to make search requests.
     * @param collections A lsit of all collections that the key can access
     */
    application.prototype.makeKey = function (description, isAdmin, collections) {
        return __awaiter(this, void 0, void 0, function () {
            var privileges, cols, newKey, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privileges = [];
                        cols = [];
                        if (isAdmin) {
                            privileges.push("*");
                        }
                        else {
                            privileges.push("documents:search");
                        }
                        if (collections) {
                            cols = collections;
                        }
                        else {
                            cols.push("*");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.keys().create({
                                description: description,
                                actions: privileges,
                                collections: cols,
                            })];
                    case 2:
                        newKey = _a.sent();
                        console.log(newKey);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * returns all the active api keys
     */
    application.prototype.getKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.keys().retrieve()];
                    case 1:
                        key = _a.sent();
                        console.log(JSON.stringify(key, null, "  "));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes a specific API key
     * @param id The ID of the key you want to remove. Use .getKeys() to get the key id
     */
    application.prototype.removeKey = function (id) {
        this.client.keys(id).delete();
    };
    application.prototype.getSchemas = function () {
        console.log(JSON.stringify(this.schemas, null, "  "));
    };
    return application;
}());
exports.application = application;
