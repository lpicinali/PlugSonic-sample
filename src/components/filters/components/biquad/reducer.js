import { isEnabled, getParameter } from "services/audio/actions"

import { BIQUAD_STATUS, BIQUAD_TYPE, BIQUAD_FREQUENCY, BIQUAD_DETUNE, BIQUAD_Q, BIQUAD_GAIN } from "./actions"

const FILTER_NAME = "biquad"
const biquadInit = {
  enabled: isEnabled(FILTER_NAME),
  type: getParameter(FILTER_NAME, "type"),
  frequency: getParameter(FILTER_NAME, "frequency.value"),
  detune: getParameter(FILTER_NAME, "detune.value"),
  Q: getParameter(FILTER_NAME, "Q.value"),
  gain: getParameter(FILTER_NAME, "gain.value"),
}

const biquad = (state = biquadInit, action) => {
  switch (action.type) {
  case BIQUAD_STATUS:
    return {
      ...state,
      enabled: action.value,
    }
  case BIQUAD_TYPE:
    return {
      ...state,
      type: action.value,
    }
  case BIQUAD_FREQUENCY:
    return {
      ...state,
      frequency: action.value,
    }
  case BIQUAD_DETUNE:
    return {
      ...state,
      detune: action.value,
    }
  case BIQUAD_Q:
    return {
      ...state,
      Q: action.value,
    }
  case BIQUAD_GAIN:
    return {
      ...state,
      gain: action.value,
    }

  default:
    return state
  }
}

export default biquad
