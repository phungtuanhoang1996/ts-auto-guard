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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processProject = exports.generate = void 0;
var lodash_1 = require("lodash");
var ts_morph_1 = require("ts-morph");
// -- Helpers --
function reportError(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // tslint:disable-next-line:no-console
    console.error.apply(console, __spread(["ERROR: " + message], args));
}
function findExportableNode(type) {
    var symbol = type.getSymbol();
    if (symbol === undefined) {
        return null;
    }
    return (lodash_1.flatMap(symbol.getDeclarations(), function (d) { return __spread([d], d.getAncestors()); })
        .filter(ts_morph_1.TypeGuards.isExportableNode)
        .find(function (n) { return n.isExported(); }) || null);
}
function typeToDependency(type, addDependency) {
    var exportable = findExportableNode(type);
    if (exportable === null) {
        return;
    }
    var sourceFile = exportable.getSourceFile();
    var name = exportable.getSymbol().getName();
    var isDefault = exportable.isDefaultExport();
    if (!exportable.isExported()) {
        reportError(name + " is not exported from " + sourceFile.getFilePath());
    }
    addDependency(sourceFile, name, isDefault);
}
function outFilePath(sourcePath) {
    return sourcePath.replace(/\.(ts|tsx|d\.ts)$/, '.guard.ts');
}
// https://github.com/dsherret/ts-simple-ast/issues/108#issuecomment-342665874
function isClassType(type) {
    var e_1, _a;
    if (type.getConstructSignatures().length > 0) {
        return true;
    }
    var symbol = type.getSymbol();
    if (symbol == null) {
        return false;
    }
    try {
        for (var _b = __values(symbol.getDeclarations()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var declaration = _c.value;
            if (ts_morph_1.TypeGuards.isClassDeclaration(declaration)) {
                return true;
            }
            if (ts_morph_1.TypeGuards.isVariableDeclaration(declaration) &&
                declaration.getType().getConstructSignatures().length > 0) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
function isFunctionType(type) {
    return type.getCallSignatures().length > 0;
}
function isReadonlyArrayType(type) {
    var symbol = type.getSymbol();
    if (symbol === undefined) {
        return false;
    }
    return (symbol.getName() === 'ReadonlyArray' && type.getTypeArguments().length === 1);
}
function getReadonlyArrayType(type) {
    return type.getTypeArguments()[0];
}
function getTypeGuardName(jsDocs) {
    var e_2, _a, e_3, _b;
    try {
        for (var jsDocs_1 = __values(jsDocs), jsDocs_1_1 = jsDocs_1.next(); !jsDocs_1_1.done; jsDocs_1_1 = jsDocs_1.next()) {
            var doc = jsDocs_1_1.value;
            try {
                for (var _c = (e_3 = void 0, __values(doc.getInnerText().split('\n'))), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var line = _d.value;
                    var match = line
                        .trim()
                        .match(/@see\s+(?:{\s*(\w+)\s*}\s+)?ts-auto-guard:([^\s]*)/);
                    if (match !== null) {
                        var _e = __read(match, 3), typeGuardName = _e[1], command = _e[2];
                        if (command !== 'type-guard') {
                            reportError("command " + command + " is not supported!");
                            return null;
                        }
                        return typeGuardName;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (jsDocs_1_1 && !jsDocs_1_1.done && (_a = jsDocs_1.return)) _a.call(jsDocs_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return null;
}
// -- Main program --
function ors() {
    var statements = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        statements[_i] = arguments[_i];
    }
    return statements.join(' || \n');
}
function ands() {
    var statements = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        statements[_i] = arguments[_i];
    }
    return statements.join(' && \n');
}
function eq(a, b) {
    return a + " === " + b;
}
function typeOf(varName, type) {
    return eq("typeof " + varName, "\"" + type + "\"");
}
function typeUnionConditions(varName, types, addDependency, project, path, arrayDepth, debug) {
    var conditions = [];
    conditions.push.apply(conditions, __spread(types
        .map(function (type) {
        return typeConditions(varName, type, addDependency, project, path, arrayDepth, true, debug);
    })
        .filter(function (v) { return v !== null; })));
    return parens(ors.apply(void 0, __spread(conditions)));
}
function parens(code) {
    return "(\n" + code + "\n)";
}
function arrayCondition(varName, arrayType, addDependency, project, path, arrayDepth, debug) {
    if (arrayType.getText() === 'never') {
        return ands("Array.isArray(" + varName + ")", eq(varName + ".length", '0'));
    }
    var indexIdentifier = "i" + arrayDepth;
    var elementPath = path + "[${" + indexIdentifier + "}]";
    var conditions = typeConditions('e', arrayType, addDependency, project, elementPath, arrayDepth + 1, true, debug);
    if (conditions === null) {
        reportError("No conditions for " + varName + ", with array type " + arrayType.getText());
        // TODO: Or `null`???
        return 'true';
    }
    // Bit of a hack, just check if the second argument is used before actually
    // creating it. This avoids unused parameter errors.
    var secondArg = conditions.includes(elementPath)
        ? ", " + indexIdentifier + ": number"
        : '';
    return ands("Array.isArray(" + varName + ")", varName + ".every((e: any" + secondArg + ") =>\n" + conditions + "\n)");
}
function objectTypeCondition(varName, type) {
    return typeOf(varName, isFunctionType(type) ? 'function' : 'object');
}
function objectCondition(varName, type, addDependency, useGuard, project, path, arrayDepth, debug) {
    var conditions = [];
    var symbol = type.getSymbol();
    if (symbol === undefined) {
        // I think this is happening when the type is declare in a node module.
        // tslint:disable-next-line:no-console
        console.error("Unable to get symbol for type " + type.getText());
        return typeOf(varName, 'object');
    }
    var declarations = symbol.getDeclarations();
    // TODO: https://github.com/rhys-vdw/ts-auto-guard/issues/29
    var declaration = declarations[0];
    if (declaration === undefined) {
        reportError("Couldn't find declaration for type " + type.getText());
        return null;
    }
    // JSDoc is attached to the type alias rather than the object literal in the
    // case of eg. `type Foo = { x: number }`
    var docNode = ts_morph_1.TypeGuards.isJSDocableNode(declaration)
        ? declaration
        : declaration.getParentIfKind(ts_morph_1.SyntaxKind.TypeAliasDeclaration) || null;
    var typeGuardName = docNode === null ? null : getTypeGuardName(docNode.getJsDocs());
    if (useGuard && typeGuardName !== null) {
        var sourcePath = declaration.getSourceFile().getFilePath();
        addDependency(findOrCreate(project, outFilePath(sourcePath)), typeGuardName, false);
        // NOTE: Cast to boolean to stop type guard property and prevent compile
        //       errors.
        return typeGuardName + "(" + varName + ") as boolean";
    }
    if (type.isInterface()) {
        if (!useGuard || typeGuardName === null) {
            if (!ts_morph_1.TypeGuards.isInterfaceDeclaration(declaration)) {
                throw new TypeError('Extected declaration to be an interface delcaration!');
            }
            declaration.getBaseTypes().forEach(function (baseType) {
                var condition = typeConditions(varName, baseType, addDependency, project, path, arrayDepth, true, debug);
                if (condition !== null) {
                    conditions.push(condition);
                }
            });
            if (conditions.length === 0) {
                conditions.push(objectTypeCondition(varName, type));
            }
            conditions.push.apply(conditions, __spread(propertiesConditions(varName, declaration.getProperties(), addDependency, project, path, arrayDepth, debug)));
        }
    }
    else {
        conditions.push(objectTypeCondition(varName, type));
        // Get object literal properties...
        try {
            var properties = type.getProperties();
            var propertySignatures = properties.map(function (p) { return p.getDeclarations()[0]; });
            conditions.push.apply(conditions, __spread(propertiesConditions(varName, propertySignatures, addDependency, project, path, arrayDepth, debug)));
        }
        catch (error) {
            if (error instanceof TypeError) {
                // see https://github.com/dsherret/ts-simple-ast/issues/397
                reportError("Internal ts-simple-ast error for " + type.getText(), error);
            }
        }
    }
    return ands.apply(void 0, __spread(conditions));
}
function tupleCondition(varName, type, addDependency, project, path, arrayDepth, debug) {
    var types = type.getTupleElements();
    var conditions = types.reduce(function (acc, elementType, i) {
        var condition = typeConditions(varName + "[" + i + "]", elementType, addDependency, project, path, arrayDepth, true, debug);
        if (condition !== null) {
            acc.push(condition);
        }
        return acc;
    }, ["Array.isArray(" + varName + ")"]);
    return ands.apply(void 0, __spread(conditions));
}
function literalCondition(varName, type, addDependency) {
    if (type.isEnumLiteral()) {
        var node = type
            .getSymbol()
            .getDeclarations()
            .find(ts_morph_1.TypeGuards.isEnumMember)
            .getParent();
        if (node === undefined) {
            reportError("Couldn't find enum literal parent");
            return null;
        }
        if (!ts_morph_1.TypeGuards.isEnumDeclaration(node)) {
            reportError('Enum literal parent was not an enum declaration');
            return null;
        }
        typeToDependency(type, addDependency);
    }
    return eq(varName, type.getText());
}
function typeConditions(varName, type, addDependency, project, path, arrayDepth, useGuard, debug) {
    if (type.isNull()) {
        return eq(varName, 'null');
    }
    if (type.getText() === 'any') {
        return null;
    }
    if (type.getText() === 'never') {
        return typeOf(varName, 'undefined');
    }
    if (type.isBoolean()) {
        return typeOf(varName, 'boolean');
    }
    if (type.isUnion()) {
        // Seems to be bug here where enums can only be detected with enum
        // literal + union check... odd.
        if (type.isEnumLiteral()) {
            typeToDependency(type, addDependency);
        }
        return typeUnionConditions(varName, type.getUnionTypes(), addDependency, project, path, arrayDepth, debug);
    }
    if (type.isIntersection()) {
        return typeUnionConditions(varName, type.getIntersectionTypes(), addDependency, project, path, arrayDepth, debug);
    }
    if (type.isArray()) {
        return arrayCondition(varName, type.getArrayElementType(), addDependency, project, path, arrayDepth, debug);
    }
    if (isReadonlyArrayType(type)) {
        return arrayCondition(varName, getReadonlyArrayType(type), addDependency, project, path, arrayDepth, debug);
    }
    if (isClassType(type)) {
        typeToDependency(type, addDependency);
        return varName + " instanceof " + type.getSymbol().getName();
    }
    if (type.isObject()) {
        return objectCondition(varName, type, addDependency, useGuard, project, path, arrayDepth, debug);
    }
    if (type.isTuple()) {
        return tupleCondition(varName, type, addDependency, project, path, arrayDepth, debug);
    }
    if (type.isLiteral()) {
        return literalCondition(varName, type, addDependency);
    }
    return typeOf(varName, type.getText());
}
function propertyConditions(objName, property, addDependency, project, path, arrayDepth, debug) {
    // working around a bug in ts-simple-ast
    var propertyName = property === undefined ? '(???)' : property.getName();
    var varName = objName + "." + propertyName;
    var propertyPath = path + "." + propertyName;
    var expectedType = property.getType().getText();
    var conditions = typeConditions(varName, property.getType(), addDependency, project, propertyPath, arrayDepth, true, debug);
    if (debug) {
        return (conditions &&
            "evaluate(" + conditions + ", `" + propertyPath + "`, " + JSON.stringify(expectedType) + ", " + varName + ")");
    }
    return conditions;
}
function propertiesConditions(varName, properties, addDependency, project, path, arrayDepth, debug) {
    return properties
        .map(function (prop) {
        return propertyConditions(varName, prop, addDependency, project, path, arrayDepth, debug);
    })
        .filter(function (v) { return v !== null; });
}
function generateTypeGuard(functionName, typeName, type, addDependency, project, shortCircuitCondition, debug) {
    var defaultArgumentName = lodash_1.lowerFirst(typeName);
    var conditions = typeConditions('obj', type, addDependency, project, '${argumentName}', // tslint:disable-line:no-invalid-template-strings
    0, false, debug);
    var secondArgument = debug
        ? "argumentName: string = \"" + defaultArgumentName + "\""
        : "_argumentName?: string";
    var signature = "export function " + functionName + "(obj: any, " + secondArgument + "): obj is " + typeName + " {\n";
    var shortCircuit = shortCircuitCondition
        ? "if (" + shortCircuitCondition + ") return true\n"
        : '';
    return [signature, shortCircuit, "return (\n" + conditions + "\n)\n}\n"].join('');
}
// -- Process project --
function findOrCreate(project, path) {
    var outFile = project.getSourceFile(path);
    if (outFile === undefined) {
        outFile = project.createSourceFile(path);
    }
    return outFile;
}
function createAddDependency(dependencies) {
    return function addDependency(sourceFile, name, isDefault) {
        var alias = name;
        if (isDefault) {
            name = 'default';
        }
        var imports = dependencies.get(sourceFile);
        if (imports === undefined) {
            imports = {};
            dependencies.set(sourceFile, imports);
        }
        var previousAlias = imports[name];
        if (previousAlias !== undefined && previousAlias !== alias) {
            reportError("Conflicting export alias for \"" + sourceFile.getFilePath() + "\": \"" + alias + "\" vs \"" + previousAlias + "\"");
        }
        imports[name] = alias;
    };
}
var evaluateFunction = "function evaluate(\n  isCorrect: boolean,\n  varName: string,\n  expected: string,\n  actual: any\n): boolean {\n  if (!isCorrect) {\n    console.error(\n      `${varName} type mismatch, expected: ${expected}, found:`,\n      actual\n    )\n  }\n  return isCorrect\n}\n";
function generate(_a) {
    var _b = _a.paths, paths = _b === void 0 ? [] : _b, tsConfigFilePath = _a.project, processOptions = _a.processOptions;
    return __awaiter(this, void 0, void 0, function () {
        var project;
        return __generator(this, function (_c) {
            project = new ts_morph_1.Project({
                addFilesFromTsConfig: paths.length === 0,
                tsConfigFilePath: tsConfigFilePath,
            });
            project.addSourceFilesAtPaths(paths);
            processProject(project, processOptions);
            return [2 /*return*/, project.save()];
        });
    });
}
exports.generate = generate;
function processProject(project, options) {
    if (options === void 0) { options = { debug: false }; }
    // Delete previously generated guard.
    project
        .getSourceFiles('./**/*.guard.ts')
        .forEach(function (sourceFile) { return sourceFile.delete(); });
    // Generate new guard files.
    project.getSourceFiles().forEach(function (sourceFile) {
        var dependencies = new Map();
        var addDependency = createAddDependency(dependencies);
        var functions = sourceFile
            .getChildAtIndex(0)
            .getChildren()
            .reduce(function (acc, child) {
            if (!ts_morph_1.TypeGuards.isJSDocableNode(child)) {
                return acc;
            }
            var typeGuardName = getTypeGuardName(child.getJsDocs());
            if (typeGuardName === null) {
                return acc;
            }
            if (!ts_morph_1.TypeGuards.isExportableNode(child)) {
                reportError("Must be exportable:\n\n" + child.getText() + "\n");
                return acc;
            }
            if (ts_morph_1.TypeGuards.isEnumDeclaration(child) ||
                ts_morph_1.TypeGuards.isInterfaceDeclaration(child) ||
                ts_morph_1.TypeGuards.isTypeAliasDeclaration(child)) {
                if (!child.isExported()) {
                    reportError("Node must be exported:\n\n" + child.getText() + "\n");
                }
                acc.push(generateTypeGuard(typeGuardName, child.getName(), child.getType(), addDependency, project, options.shortCircuitCondition, options.debug));
                var exportName = child.getName();
                addDependency(sourceFile, exportName, child.isDefaultExport());
            }
            else {
                reportError("Unsupported:\n\n" + child.getText() + "\n");
                return acc;
            }
            return acc;
        }, []);
        if (functions.length > 0) {
            if (options.debug) {
                functions.unshift(evaluateFunction);
            }
            var outFile_1 = project.createSourceFile(outFilePath(sourceFile.getFilePath()), functions.join('\n'), { overwrite: true });
            outFile_1.addImportDeclarations(Array.from(dependencies.entries()).reduce(function (structures, _a) {
                var _b = __read(_a, 2), importFile = _b[0], imports = _b[1];
                if (outFile_1 === importFile) {
                    return structures;
                }
                var moduleSpecifier = outFile_1.getRelativePathAsModuleSpecifierTo(importFile);
                var defaultImport = imports.default;
                delete imports.default;
                var namedImports = Object.entries(imports).map(function (_a) {
                    var _b = __read(_a, 2), alias = _b[0], name = _b[1];
                    return alias === name ? name : { name: name, alias: alias };
                });
                structures.push({
                    defaultImport: defaultImport,
                    kind: ts_morph_1.StructureKind.ImportDeclaration,
                    moduleSpecifier: moduleSpecifier,
                    namedImports: namedImports,
                });
                return structures;
            }, []));
            var path = outFile_1.getRelativePathTo(sourceFile);
            outFile_1.insertStatements(0, [
                "/*",
                " * Generated type guards for \"" + path + "\".",
                " * WARNING: Do not manually change this file.",
                " */",
            ].join('\n'));
            outFile_1.formatText();
        }
    });
    return project.save();
}
exports.processProject = processProject;
//# sourceMappingURL=index.js.map