import { WASI } from './wasi.js';

const wasi = new WASI();
const importModule = {
  wasi_snapshot_preview1: wasi,
};

(async () => {
  const result = await WebAssembly.instantiateStreaming(fetch('app.wasm'), importModule);
  wasi.setModuleInstance(result.instance);
  result.instance.exports._start();
})();
