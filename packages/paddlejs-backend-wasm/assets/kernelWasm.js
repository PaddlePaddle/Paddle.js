
/* eslint-disable */
var WasmBackendModule = (function () {
    var _scriptDir = '';
    if (typeof __filename !== 'undefined') _scriptDir = '';
    return (
        function (wasmBinaryFile, wasmMemory) {
            const globalWasmMemory = wasmMemory;
            WasmBackendModule = WasmBackendModule || {};

            var Module = typeof WasmBackendModule !== "undefined" ? WasmBackendModule : {};
            var readyPromiseResolve, readyPromiseReject;
            Module["ready"] = new Promise(function (resolve, reject) {
                readyPromiseResolve = resolve;
                readyPromiseReject = reject
            });
            var moduleOverrides = {};
            var key;
            for (key in Module) {
                if (Module.hasOwnProperty(key)) {
                    moduleOverrides[key] = Module[key]
                }
            }
            var arguments_ = [];
            var thisProgram = "./this.program";
            var quit_ = function (status, toThrow) {
                throw toThrow
            };
            var ENVIRONMENT_IS_WEB = false;
            var ENVIRONMENT_IS_WORKER = false;
            var ENVIRONMENT_IS_NODE = false;
            var ENVIRONMENT_IS_SHELL = false;
            ENVIRONMENT_IS_WEB = typeof window === "object";
            ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
            ENVIRONMENT_IS_NODE = !ENVIRONMENT_IS_WEB && typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
            ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
            var scriptDirectory = "";

            function locateFile(path) {
                if (Module["locateFile"]) {
                    return Module["locateFile"](path, scriptDirectory)
                }
                return path.indexOf('http') >= 0 ? path : (scriptDirectory + path)
            }
            var read_, readAsync, readBinary, setWindowTitle;
            var nodeFS;
            var nodePath;
            if (ENVIRONMENT_IS_NODE) {
                if (ENVIRONMENT_IS_WORKER) {
                    scriptDirectory = require("path").dirname(scriptDirectory) + "/"
                } else {
                    scriptDirectory = __dirname + "/"
                }
                read_ = function shell_read(filename, binary) {
                    if (!nodeFS) nodeFS = require("fs");
                    if (!nodePath) nodePath = require("path");
                    filename = nodePath["normalize"](filename);
                    return nodeFS["readFileSync"](filename, binary ? null : "utf8")
                };
                readBinary = function readBinary(filename) {
                    var ret = read_(filename, true);
                    if (!ret.buffer) {
                        ret = new Uint8Array(ret)
                    }
                    assert(ret.buffer);
                    return ret
                };
                if (process["argv"].length > 1) {
                    thisProgram = process["argv"][1].replace(/\\/g, "/")
                }
                arguments_ = process["argv"].slice(2);
                process["on"]("uncaughtException", function (ex) {
                    if (!(ex instanceof ExitStatus)) {
                        throw ex
                    }
                });
                process["on"]("unhandledRejection", abort);
                quit_ = function (status) {
                    process["exit"](status)
                };
                Module["inspect"] = function () {
                    return "[Emscripten Module object]"
                }
            } else if (ENVIRONMENT_IS_SHELL) {
                if (typeof read != "undefined") {
                    read_ = function shell_read(f) {
                        return read(f)
                    }
                }
                readBinary = function readBinary(f) {
                    var data;
                    if (typeof readbuffer === "function") {
                        return new Uint8Array(readbuffer(f))
                    }
                    data = read(f, "binary");
                    assert(typeof data === "object");
                    return data
                };
                if (typeof scriptArgs != "undefined") {
                    arguments_ = scriptArgs
                } else if (typeof arguments != "undefined") {
                    arguments_ = arguments
                }
                if (typeof quit === "function") {
                    quit_ = function (status) {
                        quit(status)
                    }
                }
                if (typeof print !== "undefined") {
                    if (typeof console === "undefined") console = {};
                    console.log = print;
                    console.warn = console.error = typeof printErr !== "undefined" ? printErr : print
                }
            } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
                if (ENVIRONMENT_IS_WORKER) {
                    scriptDirectory = self.location.href
                } else if (typeof document !== "undefined" && document.currentScript) {
                    scriptDirectory = document.currentScript.src
                }
                if (_scriptDir) {
                    scriptDirectory = _scriptDir
                }
                if (scriptDirectory.indexOf("blob:") !== 0) {
                    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
                } else {
                    scriptDirectory = ""
                } {
                    read_ = function (url) {
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, false);
                        xhr.send(null);
                        return xhr.responseText
                    };
                    if (ENVIRONMENT_IS_WORKER) {
                        readBinary = function (url) {
                            var xhr = new XMLHttpRequest;
                            xhr.open("GET", url, false);
                            xhr.responseType = "arraybuffer";
                            xhr.send(null);
                            return new Uint8Array(xhr.response)
                        }
                    }
                    readAsync = function (url, onload, onerror) {
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, true);
                        xhr.responseType = "arraybuffer";
                        xhr.onload = function () {
                            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                                onload(xhr.response);
                                return
                            }
                            onerror()
                        };
                        xhr.onerror = onerror;
                        xhr.send(null)
                    }
                }
                setWindowTitle = function (title) {
                    document.title = title
                }
            } else {}
            var out = Module["print"] || console.log.bind(console);
            var err = Module["printErr"] || console.warn.bind(console);
            for (key in moduleOverrides) {
                if (moduleOverrides.hasOwnProperty(key)) {
                    Module[key] = moduleOverrides[key]
                }
            }
            moduleOverrides = null;
            if (Module["arguments"]) arguments_ = Module["arguments"];
            if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
            if (Module["quit"]) quit_ = Module["quit"];
            var STACK_ALIGN = 16;

            function warnOnce(text) {
                if (!warnOnce.shown) warnOnce.shown = {};
                if (!warnOnce.shown[text]) {
                    warnOnce.shown[text] = 1;
                    err(text)
                }
            }

            function convertJsFunctionToWasm(func, sig) {
                if (typeof WebAssembly.Function === "function") {
                    var typeNames = {
                        "i": "i32",
                        "j": "i64",
                        "f": "f32",
                        "d": "f64"
                    };
                    var type = {
                        parameters: [],
                        results: sig[0] == "v" ? [] : [typeNames[sig[0]]]
                    };
                    for (var i = 1; i < sig.length; ++i) {
                        type.parameters.push(typeNames[sig[i]])
                    }
                    return new WebAssembly.Function(type, func)
                }
                var typeSection = [1, 0, 1, 96];
                var sigRet = sig.slice(0, 1);
                var sigParam = sig.slice(1);
                var typeCodes = {
                    "i": 127,
                    "j": 126,
                    "f": 125,
                    "d": 124
                };
                typeSection.push(sigParam.length);
                for (var i = 0; i < sigParam.length; ++i) {
                    typeSection.push(typeCodes[sigParam[i]])
                }
                if (sigRet == "v") {
                    typeSection.push(0)
                } else {
                    typeSection = typeSection.concat([1, typeCodes[sigRet]])
                }
                typeSection[1] = typeSection.length - 2;
                var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(typeSection, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]));
                var module = new WebAssembly.Module(bytes);
                var instance = new WebAssembly.Instance(module, {
                    "e": {
                        "f": func
                    }
                });
                var wrappedFunc = instance.exports["f"];
                return wrappedFunc
            }
            var freeTableIndexes = [];
            var functionsInTableMap;

            function getEmptyTableSlot() {
                if (freeTableIndexes.length) {
                    return freeTableIndexes.pop()
                }
                try {
                    wasmTable.grow(1)
                } catch (err) {
                    if (!(err instanceof RangeError)) {
                        throw err
                    }
                    throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."
                }
                return wasmTable.length - 1
            }

            function addFunctionWasm(func, sig) {
                if (!functionsInTableMap) {
                    functionsInTableMap = new WeakMap;
                    for (var i = 0; i < wasmTable.length; i++) {
                        var item = wasmTable.get(i);
                        if (item) {
                            functionsInTableMap.set(item, i)
                        }
                    }
                }
                if (functionsInTableMap.has(func)) {
                    return functionsInTableMap.get(func)
                }
                var ret = getEmptyTableSlot();
                try {
                    wasmTable.set(ret, func)
                } catch (err) {
                    if (!(err instanceof TypeError)) {
                        throw err
                    }
                    var wrapped = convertJsFunctionToWasm(func, sig);
                    wasmTable.set(ret, wrapped)
                }
                functionsInTableMap.set(func, ret);
                return ret
            }
            var tempRet0 = 0;
            var setTempRet0 = function (value) {
                tempRet0 = value
            };
            var wasmBinary;
            if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
            var noExitRuntime = Module["noExitRuntime"] || true;
            if (typeof WebAssembly !== "object") {
                abort("no native wasm support detected")
            }
            var wasmMemory;
            var ABORT = false;
            var EXITSTATUS;

            function assert(condition, text) {
                if (!condition) {
                    abort("Assertion failed: " + text)
                }
            }

            function getCFunc(ident) {
                var func = Module["_" + ident];
                assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
                return func
            }

            function ccall(ident, returnType, argTypes, args, opts) {
                var toC = {
                    "string": function (str) {
                        var ret = 0;
                        if (str !== null && str !== undefined && str !== 0) {
                            var len = (str.length << 2) + 1;
                            ret = stackAlloc(len);
                            stringToUTF8(str, ret, len)
                        }
                        return ret
                    },
                    "array": function (arr) {
                        var ret = stackAlloc(arr.length);
                        writeArrayToMemory(arr, ret);
                        return ret
                    }
                };

                function convertReturnValue(ret) {
                    if (returnType === "string") return UTF8ToString(ret);
                    if (returnType === "boolean") return Boolean(ret);
                    return ret
                }
                var func = getCFunc(ident);
                var cArgs = [];
                var stack = 0;
                if (args) {
                    for (var i = 0; i < args.length; i++) {
                        var converter = toC[argTypes[i]];
                        if (converter) {
                            if (stack === 0) stack = stackSave();
                            cArgs[i] = converter(args[i])
                        } else {
                            cArgs[i] = args[i]
                        }
                    }
                }
                var ret = func.apply(null, cArgs);
                ret = convertReturnValue(ret);
                if (stack !== 0) stackRestore(stack);
                return ret
            }
            var ALLOC_STACK = 1;
            var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

            function UTF8ArrayToString(heap, idx, maxBytesToRead) {
                var endIdx = idx + maxBytesToRead;
                var endPtr = idx;
                while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
                if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
                    return UTF8Decoder.decode(heap.subarray(idx, endPtr))
                } else {
                    var str = "";
                    while (idx < endPtr) {
                        var u0 = heap[idx++];
                        if (!(u0 & 128)) {
                            str += String.fromCharCode(u0);
                            continue
                        }
                        var u1 = heap[idx++] & 63;
                        if ((u0 & 224) == 192) {
                            str += String.fromCharCode((u0 & 31) << 6 | u1);
                            continue
                        }
                        var u2 = heap[idx++] & 63;
                        if ((u0 & 240) == 224) {
                            u0 = (u0 & 15) << 12 | u1 << 6 | u2
                        } else {
                            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
                        }
                        if (u0 < 65536) {
                            str += String.fromCharCode(u0)
                        } else {
                            var ch = u0 - 65536;
                            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                        }
                    }
                }
                return str
            }

            function UTF8ToString(ptr, maxBytesToRead) {
                return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
            }

            function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
                if (!(maxBytesToWrite > 0)) return 0;
                var startIdx = outIdx;
                var endIdx = outIdx + maxBytesToWrite - 1;
                for (var i = 0; i < str.length; ++i) {
                    var u = str.charCodeAt(i);
                    if (u >= 55296 && u <= 57343) {
                        var u1 = str.charCodeAt(++i);
                        u = 65536 + ((u & 1023) << 10) | u1 & 1023
                    }
                    if (u <= 127) {
                        if (outIdx >= endIdx) break;
                        heap[outIdx++] = u
                    } else if (u <= 2047) {
                        if (outIdx + 1 >= endIdx) break;
                        heap[outIdx++] = 192 | u >> 6;
                        heap[outIdx++] = 128 | u & 63
                    } else if (u <= 65535) {
                        if (outIdx + 2 >= endIdx) break;
                        heap[outIdx++] = 224 | u >> 12;
                        heap[outIdx++] = 128 | u >> 6 & 63;
                        heap[outIdx++] = 128 | u & 63
                    } else {
                        if (outIdx + 3 >= endIdx) break;
                        heap[outIdx++] = 240 | u >> 18;
                        heap[outIdx++] = 128 | u >> 12 & 63;
                        heap[outIdx++] = 128 | u >> 6 & 63;
                        heap[outIdx++] = 128 | u & 63
                    }
                }
                heap[outIdx] = 0;
                return outIdx - startIdx
            }

            function stringToUTF8(str, outPtr, maxBytesToWrite) {
                return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
            }

            function lengthBytesUTF8(str) {
                var len = 0;
                for (var i = 0; i < str.length; ++i) {
                    var u = str.charCodeAt(i);
                    if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
                    if (u <= 127) ++len;
                    else if (u <= 2047) len += 2;
                    else if (u <= 65535) len += 3;
                    else len += 4
                }
                return len
            }
            var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

            function writeArrayToMemory(array, buffer) {
                HEAP8.set(array, buffer)
            }

            function writeAsciiToMemory(str, buffer, dontAddNull) {
                for (var i = 0; i < str.length; ++i) {
                    HEAP8[buffer++ >> 0] = str.charCodeAt(i)
                }
                if (!dontAddNull) HEAP8[buffer >> 0] = 0
            }
            var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

            function updateGlobalBufferAndViews(buf) {
                buffer = buf;
                Module["HEAP8"] = HEAP8 = new Int8Array(buf);
                Module["HEAP16"] = HEAP16 = new Int16Array(buf);
                Module["HEAP32"] = HEAP32 = new Int32Array(buf);
                Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
                Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
                Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
                Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
                Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
            }
            var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 2097152e3;
            var wasmTable;
            var __ATPRERUN__ = [];
            var __ATINIT__ = [];
            var __ATMAIN__ = [];
            var __ATPOSTRUN__ = [];
            var runtimeInitialized = false;
            var runtimeExited = false;
            __ATINIT__.push({
                func: function () {
                    ___wasm_call_ctors()
                }
            });

            function preRun() {
                if (Module["preRun"]) {
                    if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                    while (Module["preRun"].length) {
                        addOnPreRun(Module["preRun"].shift())
                    }
                }
                callRuntimeCallbacks(__ATPRERUN__)
            }

            function initRuntime() {
                runtimeInitialized = true;
                callRuntimeCallbacks(__ATINIT__)
            }

            function preMain() {
                callRuntimeCallbacks(__ATMAIN__)
            }

            function exitRuntime() {
                runtimeExited = true
            }

            function postRun() {
                if (Module["postRun"]) {
                    if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                    while (Module["postRun"].length) {
                        addOnPostRun(Module["postRun"].shift())
                    }
                }
                callRuntimeCallbacks(__ATPOSTRUN__)
            }

            function addOnPreRun(cb) {
                __ATPRERUN__.unshift(cb)
            }

            function addOnPostRun(cb) {
                __ATPOSTRUN__.unshift(cb)
            }
            var runDependencies = 0;
            var runDependencyWatcher = null;
            var dependenciesFulfilled = null;

            function addRunDependency(id) {
                runDependencies++;
                if (Module["monitorRunDependencies"]) {
                    Module["monitorRunDependencies"](runDependencies)
                }
            }

            function removeRunDependency(id) {
                runDependencies--;
                if (Module["monitorRunDependencies"]) {
                    Module["monitorRunDependencies"](runDependencies)
                }
                if (runDependencies == 0) {
                    if (runDependencyWatcher !== null) {
                        clearInterval(runDependencyWatcher);
                        runDependencyWatcher = null
                    }
                    if (dependenciesFulfilled) {
                        var callback = dependenciesFulfilled;
                        dependenciesFulfilled = null;
                        callback()
                    }
                }
            }
            Module["preloadedImages"] = {};
            Module["preloadedAudios"] = {};

            function abort(what) {
                if (Module["onAbort"]) {
                    Module["onAbort"](what)
                }
                what += "";
                err(what);
                ABORT = true;
                EXITSTATUS = 1;
                what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
                var e = new WebAssembly.RuntimeError(what);
                readyPromiseReject(e);
                throw e
            }

            function hasPrefix(str, prefix) {
                return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0
            }
            var dataURIPrefix = "data:application/octet-stream;base64,";

            function isDataURI(filename) {
                return hasPrefix(filename, dataURIPrefix)
            }
            var fileURIPrefix = "file://";

            function isFileURI(filename) {
                return hasPrefix(filename, fileURIPrefix)
            }
            // var wasmBinaryFile = "assets/pdjs-backend-wasm.wasm";
            // var wasmBinaryFile = "build/pdjs-backend-wasm.wasm";
            // var wasmBinaryFile = "vmdemo/pdjs-backend-wasm.wasm";
            if (!isDataURI(wasmBinaryFile)) {
                wasmBinaryFile = locateFile(wasmBinaryFile)
            }

            function getBinary(file) {
                try {
                    if (file == wasmBinaryFile && wasmBinary) {
                        return new Uint8Array(wasmBinary)
                    }
                    if (readBinary) {
                        return readBinary(file)
                    } else {
                        throw "both async and sync fetching of the wasm failed"
                    }
                } catch (err) {
                    abort(err)
                }
            }

            function getBinaryPromise() {
                if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
                    if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
                        return fetch(wasmBinaryFile).then(function (response) {
                            if (!response["ok"]) {
                                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                            }
                            return response["arrayBuffer"]()
                        }).catch(function () {
                            return getBinary(wasmBinaryFile)
                        })
                    } else {
                        if (readAsync) {
                            return new Promise(function (resolve, reject) {
                                readAsync(wasmBinaryFile, function (response) {
                                    resolve(new Uint8Array(response))
                                }, reject)
                            })
                        }
                    }
                }
                return Promise.resolve().then(function () {
                    return getBinary(wasmBinaryFile)
                })
            }

            function createWasm() {
                var info = {
                    "env": asmLibraryArg,
                    "wasi_snapshot_preview1": asmLibraryArg
                };

                function receiveInstance(instance, module) {
                    var exports = instance.exports;
                    Module["asm"] = exports;
                    wasmMemory = Module["asm"]["memory"] || globalWasmMemory;
                    updateGlobalBufferAndViews(wasmMemory.buffer);
                    wasmTable = Module["asm"]["__indirect_function_table"];
                    removeRunDependency("wasm-instantiate")
                }
                addRunDependency("wasm-instantiate");

                function receiveInstantiatedSource(output) {
                    receiveInstance(output["instance"])
                }

                function instantiateArrayBuffer(receiver) {
                    return getBinaryPromise().then(function (binary) {
                        return WebAssembly.instantiate(binary, info)
                    }).then(receiver, function (reason) {
                        err("failed to asynchronously prepare wasm: " + reason);
                        abort(reason)
                    })
                }

                function instantiateAsync() {
                    if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
                        return fetch(wasmBinaryFile,  {
                            credentials: "same-origin",
                            headers: {
                                "Content-Type": "application/wasm"
                            }
                        }).then(function (response) {
                            return response.arrayBuffer();
                            }).then(arraybuffer => {
                            // return WebAssembly.instantiateStreaming(response, info)
                            return WebAssembly.instantiate(arraybuffer, info)
                                .then(receiveInstantiatedSource, function (reason) {
                                    err("wasm streaming compile failed: " + reason);
                                    err("falling back to ArrayBuffer instantiation");
                                    return instantiateArrayBuffer(receiveInstantiatedSource);
                                }).catch(e =>{
                                    console.log(e)
                                }).finally(() => {
                                });
                        })
                    } else {
                        return instantiateArrayBuffer(receiveInstantiatedSource)
                    }
                }
                if (Module["instantiateWasm"]) {
                    try {
                        var exports = Module["instantiateWasm"](info, receiveInstance);
                        return exports
                    } catch (e) {
                        err("Module.instantiateWasm callback failed with error: " + e);
                        return false
                    }
                }
                instantiateAsync().catch(readyPromiseReject);
                return {}
            }
            var tempDouble;
            var tempI64;

            function callRuntimeCallbacks(callbacks) {
                while (callbacks.length > 0) {
                    var callback = callbacks.shift();
                    if (typeof callback == "function") {
                        callback(Module);
                        continue
                    }
                    var func = callback.func;
                    if (typeof func === "number") {
                        if (callback.arg === undefined) {
                            wasmTable.get(func)()
                        } else {
                            wasmTable.get(func)(callback.arg)
                        }
                    } else {
                        func(callback.arg === undefined ? null : callback.arg)
                    }
                }
            }

            function demangle(func) {
                return func
            }

            function demangleAll(text) {
                var regex = /\b_Z[\w\d_]+/g;
                return text.replace(regex, function (x) {
                    var y = demangle(x);
                    return x === y ? x : y + " [" + x + "]"
                })
            }

            function jsStackTrace() {
                var error = new Error;
                if (!error.stack) {
                    try {
                        throw new Error
                    } catch (e) {
                        error = e
                    }
                    if (!error.stack) {
                        return "(no stack trace available)"
                    }
                }
                return error.stack.toString()
            }

            function ___assert_fail(condition, filename, line, func) {
                abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"])
            }

            function _atexit(func, arg) {}

            function ___cxa_atexit(a0, a1) {
                return _atexit(a0, a1)
            }

            function _abort() {
                abort()
            }

            function _emscripten_memcpy_big(dest, src, num) {
                HEAPU8.copyWithin(dest, src, src + num)
            }

            function abortOnCannotGrowMemory(requestedSize) {
                abort("OOM")
            }

            function _emscripten_resize_heap(requestedSize) {
                abortOnCannotGrowMemory(requestedSize)
            }
            var SYSCALLS = {
                mappings: {},
                buffers: [null, [],
                    []
                ],
                printChar: function (stream, curr) {
                    var buffer = SYSCALLS.buffers[stream];
                    if (curr === 0 || curr === 10) {
                        (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
                        buffer.length = 0
                    } else {
                        buffer.push(curr)
                    }
                },
                varargs: undefined,
                get: function () {
                    SYSCALLS.varargs += 4;
                    var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
                    return ret
                },
                getStr: function (ptr) {
                    var ret = UTF8ToString(ptr);
                    return ret
                },
                get64: function (low, high) {
                    return low
                }
            };

            function _fd_write(fd, iov, iovcnt, pnum) {
                var num = 0;
                for (var i = 0; i < iovcnt; i++) {
                    var ptr = HEAP32[iov + i * 8 >> 2];
                    var len = HEAP32[iov + (i * 8 + 4) >> 2];
                    for (var j = 0; j < len; j++) {
                        SYSCALLS.printChar(fd, HEAPU8[ptr + j])
                    }
                    num += len
                }
                HEAP32[pnum >> 2] = num;
                return 0
            }

            function _setTempRet0($i) {
                setTempRet0($i | 0)
            }
            var ASSERTIONS = false;
            var asmLibraryArg = {
                "__assert_fail": ___assert_fail,
                "__cxa_atexit": ___cxa_atexit,
                "abort": _abort,
                "emscripten_memcpy_big": _emscripten_memcpy_big,
                "emscripten_resize_heap": _emscripten_resize_heap,
                "fd_write": _fd_write,
                "setTempRet0": _setTempRet0,
                "memory": globalWasmMemory
            };
            var asm = createWasm();
            var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function () {
                return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["__wasm_call_ctors"]).apply(null, arguments)
            };
            var _run_add = Module["_run_add"] = function () {
                return (_run_add = Module["_run_add"] = Module["asm"]["run_add"]).apply(null, arguments)
            };
            var _init = Module["_init"] = function () {
                return (_init = Module["_init"] = Module["asm"]["init"]).apply(null, arguments)
            };
            var __ZN4wasm15register_tensorEmmPv = Module["__ZN4wasm15register_tensorEmmPv"] = function () {
                return (__ZN4wasm15register_tensorEmmPv = Module["__ZN4wasm15register_tensorEmmPv"] = Module["asm"]["_ZN4wasm15register_tensorEmmPv"]).apply(null, arguments)
            };
            var __ZN4wasm12dispose_dataEm = Module["__ZN4wasm12dispose_dataEm"] = function () {
                return (__ZN4wasm12dispose_dataEm = Module["__ZN4wasm12dispose_dataEm"] = Module["asm"]["_ZN4wasm12dispose_dataEm"]).apply(null, arguments)
            };
            var __ZN4wasm7disposeEv = Module["__ZN4wasm7disposeEv"] = function () {
                return (__ZN4wasm7disposeEv = Module["__ZN4wasm7disposeEv"] = Module["asm"]["_ZN4wasm7disposeEv"]).apply(null, arguments)
            };
            var _run_conv2d = Module["_run_conv2d"] = function () {
                return (_run_conv2d = Module["_run_conv2d"] = Module["asm"]["run_conv2d"]).apply(null, arguments)
            };
            var _run_mul = Module["_run_mul"] = function () {
                return (_run_mul = Module["_run_mul"] = Module["asm"]["run_mul"]).apply(null, arguments)
            };
            var _run_pool2d = Module["_run_pool2d"] = function () {
                return (_run_pool2d = Module["_run_pool2d"] = Module["asm"]["run_pool2d"]).apply(null, arguments)
            };
            var _run_relu = Module["_run_relu"] = function () {
                return (_run_relu = Module["_run_relu"] = Module["asm"]["run_relu"]).apply(null, arguments)
            };
            var _pdjs_test = Module["_pdjs_test"] = function () {
                return (_pdjs_test = Module["_pdjs_test"] = Module["asm"]["pdjs_test"]).apply(null, arguments)
            };
            var _run_softmax = Module["_run_softmax"] = function () {
                return (_run_softmax = Module["_run_softmax"] = Module["asm"]["run_softmax"]).apply(null, arguments)
            };
            var _writeShape = Module["_writeShape"] = function () {
                return (_writeShape = Module["_writeShape"] = Module["asm"]["writeShape"]).apply(null, arguments)
            };
            var _malloc = Module["_malloc"] = function () {
                return (_malloc = Module["_malloc"] = Module["asm"]["malloc"]).apply(null, arguments)
            };
            var _free = Module["_free"] = function () {
                return (_free = Module["_free"] = Module["asm"]["free"]).apply(null, arguments)
            };
            var ___errno_location = Module["___errno_location"] = function () {
                return (___errno_location = Module["___errno_location"] = Module["asm"]["__errno_location"]).apply(null, arguments)
            };
            var _emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = function () {
                return (_emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = Module["asm"]["emscripten_main_thread_process_queued_calls"]).apply(null, arguments)
            };
            var stackSave = Module["stackSave"] = function () {
                return (stackSave = Module["stackSave"] = Module["asm"]["stackSave"]).apply(null, arguments)
            };
            var stackRestore = Module["stackRestore"] = function () {
                return (stackRestore = Module["stackRestore"] = Module["asm"]["stackRestore"]).apply(null, arguments)
            };
            var stackAlloc = Module["stackAlloc"] = function () {
                return (stackAlloc = Module["stackAlloc"] = Module["asm"]["stackAlloc"]).apply(null, arguments)
            };
            var dynCall_iijjiiii = Module["dynCall_iijjiiii"] = function () {
                return (dynCall_iijjiiii = Module["dynCall_iijjiiii"] = Module["asm"]["dynCall_iijjiiii"]).apply(null, arguments)
            };
            var dynCall_jiji = Module["dynCall_jiji"] = function () {
                return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["dynCall_jiji"]).apply(null, arguments)
            };
            var calledRun;

            function ExitStatus(status) {
                this.name = "ExitStatus";
                this.message = "Program terminated with exit(" + status + ")";
                this.status = status
            }
            dependenciesFulfilled = function runCaller() {
                if (!calledRun) run();
                if (!calledRun) dependenciesFulfilled = runCaller
            };

            function run(args) {
                args = args || arguments_;
                if (runDependencies > 0) {
                    return
                }
                preRun();
                if (runDependencies > 0) {
                    return
                }

                function doRun() {
                    if (calledRun) return;
                    calledRun = true;
                    Module["calledRun"] = true;
                    if (ABORT) return;
                    initRuntime();
                    preMain();
                    readyPromiseResolve(Module);
                    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                    postRun()
                }
                if (Module["setStatus"]) {
                    Module["setStatus"]("Running...");
                    setTimeout(function () {
                        setTimeout(function () {
                            Module["setStatus"]("")
                        }, 1);
                        doRun()
                    }, 1)
                } else {
                    doRun()
                }
            }
            Module["run"] = run;
            if (Module["preInit"]) {
                if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
                while (Module["preInit"].length > 0) {
                    Module["preInit"].pop()()
                }
            }
            run();


            return WasmBackendModule.ready
        }
    );
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = WasmBackendModule;
else if (typeof define === 'function' && define['amd'])
    define([], function () {
        return WasmBackendModule;
    });
else if (typeof exports === 'object')
    exports["WasmBackendModule"] = WasmBackendModule;
