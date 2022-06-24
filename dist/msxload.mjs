var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Demodulator_inversionCounter, _Demodulator_prevSignal;
import { $ } from "zx";
const samplingRate = 48000;
$.verbose = false;
class Demodulator {
    constructor() {
        _Demodulator_inversionCounter.set(this, 1);
        _Demodulator_prevSignal.set(this, false);
    }
    read(chunk) {
        var _a;
        for (const value of chunk) {
            const signal = value >= 64;
            if (signal !== __classPrivateFieldGet(this, _Demodulator_prevSignal, "f")) {
                const inversionFrequency = samplingRate / __classPrivateFieldGet(this, _Demodulator_inversionCounter, "f");
                console.log(inversionFrequency);
                __classPrivateFieldSet(this, _Demodulator_inversionCounter, 0, "f");
            }
            __classPrivateFieldSet(this, _Demodulator_inversionCounter, (_a = __classPrivateFieldGet(this, _Demodulator_inversionCounter, "f"), _a++, _a), "f");
            __classPrivateFieldSet(this, _Demodulator_prevSignal, signal, "f");
        }
    }
}
_Demodulator_inversionCounter = new WeakMap(), _Demodulator_prevSignal = new WeakMap();
const recProcess = $ `rec --bits 8 --channels 1 --encoding signed-integer --rate ${samplingRate} --type raw -`;
try {
    const demodulator = new Demodulator();
    for await (const chunk of recProcess.stdout) {
        const buffer = chunk;
        demodulator.read(new Int8Array(buffer));
    }
}
finally {
    recProcess.kill("SIGINT");
    await recProcess;
}
