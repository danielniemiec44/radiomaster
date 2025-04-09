class MyWorkletProcessor extends AudioWorklet {
    process(inputs, outputs) {
        // Tutaj umieść logikę przetwarzania audio
        const input = inputs[0];
        const output = outputs[0];
        // Przykładowo kopiujemy próbki
        for (let channel = 0; channel < output.length; channel++) {
            output[channel].set(input[channel]);
        }
        const inputData = e.inputBuffer.getChannelData(0);
        recordedChunksRef.current.push(new Float32Array(inputData));
        return true;
    }
}