#include <emscripten.h>
#include <vector>
#include <stdio.h>

extern "C" {

// Process a buffer of audio samples (dummy example: volume boost)
EMSCRIPTEN_KEEPALIVE
int processAudio(float* samples, int length) {
    for (int i = 0; i < length; i++) {
        samples[i] *= 1.f;  // Simple gain (boost volume)
        printf("%1.2f", samples[i]);
    }
    printf("%c",'\n');
    return 0;
}
}
