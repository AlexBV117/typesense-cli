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
var fs = require("fs");
var fsPromises = require("fs").promises;
var i = require("./modules/changeNodeSettings");
var createEnvironment = /** @class */ (function () {
    function createEnvironment() {
        this.home = process.env.HOME;
        this.help = "Welcome to Typesense-cli!!! \n\n  List of Commands: \n  \n  --help          -h      prints this message;\n  --index         -i      Indexes documents into a collection;\n  --schemas       -s      returns out the list of defined schemas in ~/.typesense-cli/schemas.json file;\n  --version       -v      returns the version of typesense-cli that you are running;\n  --server        n/a     allows you to update the server node that the cli will use;\n  --collections   -c      returns the collections on the server;\n  --key           -k      returns the active Api keys;\n  --new           -n      append to either --keys to create a new api keys;\n  --remove        -r      append to either --keys or --collections and will remove all keys or collections passed;\n  \n  for more information on these commands and how to structure arguments please see the README.md \n  in the typesense-cli repo.\n  ";
    }
    createEnvironment.prototype.createContent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var x, y, z;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, i.nodeSettings()];
                    case 1:
                        x = _a.sent();
                        y = {
                            serverNode: {
                                nodes: [
                                    {
                                        host: x.host,
                                        port: x.port,
                                        protocol: x.protocol,
                                    },
                                ],
                                apiKey: x.apiKey,
                            },
                            chunckSize: 10000,
                            displayTitle: true,
                        };
                        z = {
                            automatic: {
                                name: "automatic",
                                fields: [{ name: ".*", type: "auto" }],
                            },
                        };
                        this.schemas = JSON.stringify(z);
                        this.settings = JSON.stringify(y);
                        return [2 /*return*/];
                }
            });
        });
    };
    createEnvironment.prototype.createFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createContent()];
                    case 1:
                        _a.sent();
                        fsPromises
                            .mkdir(this.home + "/.typesense-cli", { recursive: true }, function (err) {
                            if (err)
                                throw err;
                        })
                            .then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                console.log("New directory .typesense-cli created in the home directory");
                                fsPromises
                                    .mkdir(this.home + "/.typesense-cli/data", { recursive: true }, function (err) {
                                    if (err)
                                        throw err;
                                })
                                    .then(function () {
                                    console.log("New data directory created in .typesense-cli");
                                });
                                fsPromises
                                    .writeFile(this.home + "/.typesense-cli/typesense-cli.config.json", this.settings, function (err) {
                                    if (err)
                                        throw err;
                                })
                                    .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var set, error_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                console.log("typesense-cli.config.json successfully created in .typesense-cli");
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, fsPromises.open(this.home + "/.typesense-cli/typesense-cli.config.json", "r")];
                                            case 2:
                                                set = _a.sent();
                                                fs.fchmod(set.fd, 511, function (err) {
                                                    if (err)
                                                        throw err;
                                                    console.log("permissions for typesense-cli.config.json updated to rwx for all users");
                                                });
                                                return [3 /*break*/, 4];
                                            case 3:
                                                error_1 = _a.sent();
                                                console.log(error_1);
                                                return [3 /*break*/, 4];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                fsPromises
                                    .writeFile(this.home + "/.typesense-cli/schemas.json", this.schemas, function (err) {
                                    if (err)
                                        throw err;
                                })
                                    .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var sch, error_2;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                console.log("schemas.json successfully created in .typesense-cli");
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, fsPromises.open(this.home + "/.typesense-cli/schemas.json", "r")];
                                            case 2:
                                                sch = _a.sent();
                                                fs.fchmod(sch.fd, 511, function (err) {
                                                    if (err)
                                                        throw err;
                                                    console.log("permissions for schemas.json updated to rwx for all users");
                                                });
                                                return [3 /*break*/, 4];
                                            case 3:
                                                error_2 = _a.sent();
                                                console.log(error_2);
                                                return [3 /*break*/, 4];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                fsPromises
                                    .writeFile(this.home + "/.typesense-cli/help.txt", this.help, function (err) {
                                    if (err)
                                        throw err;
                                })
                                    .then(function () {
                                    console.log("help.txt successfully created in .typesense-cli");
                                });
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    return createEnvironment;
}());
var App = new createEnvironment();
App.createFiles();
