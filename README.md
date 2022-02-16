A very barebones implementation of WASI for web browsers, intend to be used/tested with Free Pascal.

For building wasm, execute `fpc -Twasi -Pwasm32 -MObjFPC -oapp.wasm app.pas`

For running, use a server to serve the files (for example `python -m http.server`), the wasm result after opening `index.html` will be available in web browser's console.
