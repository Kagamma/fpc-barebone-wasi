A very barebones implementation of WASI for web browsers, intend to be used/tested with Free Pascal.

For building wasm, execute `fpc -Twasi -Pwasm32 -MObjFPC -Filib/wasm32-wasi -Fu. -FUlib/wasm32-wasi -FE. -oapp.wasm app.pas`

For running, use a server to serve the files (for example `python -m http.server`), the wasm result after opening `index.html` will be available in web browser's console.

As of this moment, with FPC 3.3.1-9825-gd2447026de, include `Classes` unit will result in error in web browsers. The same error also occur if I try to run it on https://webassembly.sh/.

I also try to run the same wasm binary with wasmer (https://github.com/wasmerio/wasmer):
- wasmer v0.12.0 cannot run the binary generated by fpc, even though it can run the provided binary in example.
- I cannot get wasmer 1.0.0 or higher working.
