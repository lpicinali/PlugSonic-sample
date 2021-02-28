import { sliderToFrequency } from "components/filters/utils"

export const BIQUAD_STATUS = "FILTERS/BIQUAD_STATUS"
export const BIQUAD_TYPE = "FILTERS/BIQUAD_TYPE"
export const BIQUAD_FREQUENCY = "FILTERS/BIQUAD_FREQUENCY"
export const BIQUAD_DETUNE = "FILTERS/BIQUAD_DETUNE"
export const BIQUAD_Q = "FILTERS/BIQUAD_Q"
export const BIQUAD_GAIN = "FILTERS/BIQUAD_GAIN"

export const setStatus = status => ({
  type: BIQUAD_STATUS,
  value: status,
})

export const setType = value => ({
  type: BIQUAD_TYPE,
  value: value,
})

export const setFrequency = value => ({
  type: BIQUAD_FREQUENCY,
  value: sliderToFrequency(value),
})

export const setDetune = value => ({
  type: BIQUAD_DETUNE,
  value: value,
})

export const setQ = value => ({
  type: BIQUAD_Q,
  value: value,
})

export const setGain = value => ({
  type: BIQUAD_GAIN,
  value: value,
})
