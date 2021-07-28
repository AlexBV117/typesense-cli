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
var fs = require("fs");
var application = /** @class */ (function () {
    function application() {
        this.h = process.env.HOME;
        this.node = require(this.h + "/.typesense-cli/typesense-cli.config.json");
        this.schemas = require(this.h + "/.typesense-cli/schemas.json");
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
            return __generator(this, function (_a) {
                try {
                    this.client.collections(collection).delete();
                    console.log(collection + " deleted");
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    application.prototype.makeKey = function (x) {
        return __awaiter(this, void 0, void 0, function () {
            var json, newKey, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json = JSON.parse(x);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.keys().create({
                                description: json.description,
                                actions: json.actions,
                                collections: json.collections,
                            })];
                    case 2:
                        newKey = _a.sent();
                        console.log(newKey);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
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
    application.prototype.removeKey = function (arg) {
        var id = arg.split(" ");
        for (var _i = 0, id_1 = id; _i < id_1.length; _i++) {
            var ids = id_1[_i];
            this.client.keys(ids).delete();
            console.log("key: " + ids + " deleted");
        }
    };
    application.prototype.getSchemas = function () {
        console.log(JSON.stringify(this.schemas, null, "  "));
    };
    application.prototype.version = function () {
        var pack = require("../../package.json");
        console.log("Version: " + pack.version);
    };
    application.prototype.help = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                fs.readFile("../../help.txt", "utf8", function (err, data) {
                    if (err)
                        throw err;
                    console.log(data);
                });
                return [2 /*return*/];
            });
        });
    };
    return application;
}());
exports.application = application;
