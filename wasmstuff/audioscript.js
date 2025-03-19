let audioContext = null;
const audioElement = document.querySelector("audio");

/* Construct our audio processor as an audio graph node */
async function createBasicAudioProcessor() {
    if (!audioContext) {
      try {
        audioContext = new AudioContext();
      } catch (e) {
        console.log("** Error: Unable to create audio context");
        return null;
      }
    }

    // Add the WASM module to the audioWorklet global scope.
    await audioContext.audioWorklet.addModule('wasm/gain.js');
  
    let processorNode;
  
    try {
      processorNode = new AudioWorkletNode(audioContext, "basic-audio-processor");
    } catch (e) {
      try {
        console.log("adding...");
        await audioContext.audioWorklet.addModule("audioprocessor.js");
        processorNode = new AudioWorkletNode(audioContext, "basic-audio-processor");
      } catch (e) {
        console.log(`** Error: Unable to create worklet node: ${e}`);
        return null;
      }
    }
  
    await audioContext.resume();
    return processorNode;
};

async function startAudio() {
    const procNode = await createBasicAudioProcessor();

    // pass it into the audio context
    const track = audioContext.createMediaElementSource(audioElement);
    track.connect(procNode).connect(audioContext.destination);
};

// Select our play button
const playButton = document.getElementById("playPause");
if(playButton === null) {
    console.log("Failed to find button");
}

playButton.addEventListener(
  "click",
  () => {
    if (!audioContext) {
        startAudio();
    }

    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Play or pause track depending on state
    if (playButton.dataset.playing === "false") {
      audioElement.play();
      playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true") {
      audioElement.pause();
      playButton.dataset.playing = "false";
    }
  },
  false,
);

audioElement.addEventListener(
    "ended",
    () => {
      playButton.dataset.playing = "false";
    },
    false,
);
  