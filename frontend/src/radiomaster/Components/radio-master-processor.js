// radio-master-processor.js

class RadioMasterProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super(options);
        // Initialize any state here.
        // Optionally, you can receive initial configuration data via options.processorOptions.
    }

    process(inputs, outputs, parameters) {
        // inputs is an array of inputs; usually, we’re interested in the first one.
        const input = inputs[0];

        // If input is available and has data from the first channel:
        if (input && input[0]) {
            // For example, send this chunk of audio data back to the main thread.
            // Be cautious: sending large arrays very frequently may affect performance.
            this.port.postMessage(input[0]);
        }

        // Return true to keep the processor alive.
        return true;
    }
}

registerProcessor('radio-master-processor', RadioMasterProcessor);
