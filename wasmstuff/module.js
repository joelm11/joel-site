/**
 * I am new to Javascript and WASM but this makes my skin crawl. - Joel
 * Compiled with:
 * emcc gain.cpp -o gain.js -sEXPORTED_FUNCTIONS=_processAudio -sEXPORTED_RUNTIME_METHODS=ccall,cwrap -sALLOW_MEMORY_GROWTH -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1 --post-js module.js
 */

/* global Module */

// EXPORT_ES6 option does not work as described at
// https://github.com/kripken/emscripten/issues/6284, so we have to
// manually add this by '--post-js' setting when the Emscripten compilation.
export default Module;