import { $ } from "zx";

const samplingRate = 48000;

$.verbose = false;

class Demodulator {
  #inversionCounter = 1;
  #prevSignal = false;

  read(chunk: Int8Array) {
    for (const value of chunk) {
      const signal = value >= 64;

      if (signal !== this.#prevSignal) {
        const inversionFrequency = samplingRate / this.#inversionCounter;

        console.log(inversionFrequency);

        this.#inversionCounter = 0;
      }

      this.#inversionCounter++;
      this.#prevSignal = signal;
    }
  }
}

const recProcess = $`rec --bits 8 --channels 1 --encoding signed-integer --rate ${samplingRate} --type raw -`;

try {
  const demodulator = new Demodulator();

  for await (const chunk of recProcess.stdout) {
    const buffer: Buffer = chunk;

    demodulator.read(new Int8Array(buffer));
  }
} finally {
  recProcess.kill("SIGINT");
  await recProcess;
}
