import { isEnabled, getParameter } from "services/audio/actions"

import { COMPRESSOR_STATUS, COMPRESSOR_THRESHOLD, COMPRESSOR_KNEE, COMPRESSOR_RATIO, COMPRESSOR_ATTACK, COMPRESSOR_RELEASE } from "./actions"

const FILTER_NAME = "compressor"
const compressorInit = {
  enabled: isEnabled(FILTER_NAME),
  threshold: getParameter(FILTER_NAME, "threshold.value"),
  knee: getParameter(FILTER_NAME, "knee.value"),
  ratio: getParameter(FILTER_NAME, "ratio.value"),
  attack: getParameter(FILTER_NAME, "attack.value"),
  release: getParameter(FILTER_NAME, "release.value"),
}

const compressor = (state = compressorInit, action) => {
  switch (action.type) {
  case COMPRESSOR_STATUS:
    return {
      ...state,
      enabled: action.value,
    }
  case COMPRESSOR_THRESHOLD:
    return {
      ...state,
      threshold: action.value,
    }
  case COMPRESSOR_KNEE:
    return {
      ...state,
      knee: action.value,
    }
  case COMPRESSOR_RATIO:
    return {
      ...state,
      ratio: action.value,
    }
  case COMPRESSOR_ATTACK:
    return {
      ...state,
      attack: action.value,
    }
  case COMPRESSOR_RELEASE:
    return {
      ...state,
      release: action.value,
    }

  default:
    return state
  }
}

export default compressor
