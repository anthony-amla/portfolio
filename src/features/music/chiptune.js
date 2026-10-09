/**
 * Lo-fi chiptune soundtrack synthesized with the Web Audio API (no audio files).
 * A minor, 84 bpm, looping Am7 · Fmaj7 · C · G. The melody joins on every
 * other loop to keep it from getting repetitive.
 */

const BPM = 84
const STEP = 60 / BPM / 4 // sixteenth note, in seconds
const STEPS_PER_BAR = 16
const VOLUME = 0.045
const LOOKAHEAD = 0.12 // seconds of notes scheduled ahead
const TICK_MS = 25

const midi = (n) => 440 * 2 ** ((n - 69) / 12)

const CHORDS = [
  [57, 60, 64, 67], // Am7
  [53, 57, 60, 64], // Fmaj7
  [48, 52, 55, 60], // C
  [43, 47, 50, 55], // G
]
const BASS = [45, 41, 48, 43]
const ARP = [0, 1, 2, 3, 2, 1, 0, 2]

// A minor pentatonic melody, one row per bar; null is a rest.
const _ = null
const MELODY = [
  [76, _, _, _, 74, _, 72, _, _, _, 69, _, _, _, _, _],
  [72, _, _, _, 69, _, 67, _, 69, _, _, _, _, _, _, _],
  [67, _, 72, _, _, _, 74, _, 76, _, _, _, 74, _, 72, _],
  [74, _, _, _, _, _, 71, _, 67, _, _, _, _, _, _, _],
]

export function createChiptune() {
  let ctx = null
  let master = null
  let bus = null // mix input, filtered before the master gain
  let noise = null
  let timer = null
  let step = 0
  let nextTime = 0

  function setup() {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    const soften = ctx.createBiquadFilter()
    soften.type = 'lowpass'
    soften.frequency.value = 2400
    master = ctx.createGain()
    master.gain.value = 0
    soften.connect(master).connect(ctx.destination)
    bus = soften

    noise = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }

  function tone(freq, time, dur, type, gain) {
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    env.gain.setValueAtTime(0, time)
    env.gain.linearRampToValueAtTime(gain, time + 0.01)
    env.gain.exponentialRampToValueAtTime(gain * 0.6, time + dur * 0.5)
    env.gain.exponentialRampToValueAtTime(0.0001, time + dur + 0.08)
    osc.connect(env).connect(bus)
    osc.start(time)
    osc.stop(time + dur + 0.1)
  }

  function hat(time) {
    const src = ctx.createBufferSource()
    const hp = ctx.createBiquadFilter()
    const env = ctx.createGain()
    src.buffer = noise
    hp.type = 'highpass'
    hp.frequency.value = 7000
    env.gain.setValueAtTime(0.06, time)
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
    src.connect(hp).connect(env).connect(bus)
    src.start(time)
  }

  function kick(time) {
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.frequency.setValueAtTime(120, time)
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12)
    env.gain.setValueAtTime(0.3, time)
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.18)
    osc.connect(env).connect(bus)
    osc.start(time)
    osc.stop(time + 0.2)
  }

  function schedule(s, time) {
    const loop = Math.floor(s / (STEPS_PER_BAR * 4))
    const bar = Math.floor(s / STEPS_PER_BAR) % 4
    const pos = s % STEPS_PER_BAR

    if (pos % 8 === 0) tone(midi(BASS[bar]), time, STEP * 6, 'triangle', 0.35)
    if (pos % 2 === 0) tone(midi(CHORDS[bar][ARP[pos / 2]] + 12), time, STEP * 1.6, 'triangle', 0.16)
    if (pos === 0 || pos === 8) kick(time)
    if (pos % 4 === 2) hat(time)

    const note = MELODY[bar][pos]
    if (loop % 2 === 1 && note) tone(midi(note), time, STEP * 2.5, 'square', 0.07)
  }

  function tick() {
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      schedule(step, nextTime)
      nextTime += STEP
      step++
    }
  }

  /**
   * Starts playback. Resolves to false when the browser blocks audio because
   * the visitor has not interacted yet; resume() may never settle in that
   * case, hence the timeout.
   */
  async function play() {
    if (!ctx) setup()
    if (ctx.state !== 'running') {
      await Promise.race([ctx.resume().catch(() => {}), new Promise((r) => window.setTimeout(r, 300))])
    }
    if (ctx.state !== 'running') return false
    nextTime = ctx.currentTime + 0.05
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(VOLUME, ctx.currentTime, 0.6)
    if (!timer) timer = window.setInterval(tick, TICK_MS)
    return true
  }

  async function pause() {
    if (!ctx) return
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.15)
    window.clearInterval(timer)
    timer = null
    await new Promise((r) => window.setTimeout(r, 500))
    if (!timer) await ctx.suspend()
  }

  return { play, pause }
}
