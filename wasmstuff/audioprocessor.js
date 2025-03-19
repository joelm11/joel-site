import Module from "./gain.js";

class BasicAudioProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();

        // Wrap our WASM fx for convenience.
        this._wasmfx = Module.cwrap('processAudio', 'number', ['number', 'number']);
    }
  
    process(inputs, outputs, parameters) {
        // Calling like this works!
        // console.log(this._wasmfx(1,2));

        // Now I need to pass ptr to array of samples and length.
        const input = inputs[0];
        const output = outputs[0];
        this._wasmfx(input[0], 128);
        this._wasmfx(input[1], 128);
        for (let channel = 0; channel < input.length; ++channel) {
            for (let i = 0; i < input[0].length; ++i) {
                output[channel][i] = input[channel][i];
            }
        }

        return true;
    }
}
  
  registerProcessor("basic-audio-processor", BasicAudioProcessor);