const fs = require("fs");
const loader = require("@assemblyscript/loader");
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"),
	{
		outConsole: {
			log(messagePtr) {
				console.log(wasmModule.exports.__getString(messagePtr));
			},
			time(labelPtr) {
				console.time(wasmModule.exports.__getString(labelPtr));
			},
			timeEnd(labelPtr) {
				console.timeEnd(wasmModule.exports.__getString(labelPtr));
			}
		}
	}
);
module.exports = wasmModule.exports;
