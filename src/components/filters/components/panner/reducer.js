import { isEnabled, getParameter } from "services/audio/actions"

import { PANNER_STATUS, PANNER_VALUE } from "./actions"

const FILTER_NAME = "panner"
const pannerInit = {
  enabled: isEnabled(FILTER_NAME),
  pan: getParameter(FILTER_NAME, "pan.value"),
}

const panner = (state = pannerInit, action) => {
  switch (action.type) {
  case PANNER_STATUS:
    return {
      ...state,
      enabled: action.value,
    }
  case PANNER_VALUE:
    return {
      ...state,
      pan: action.value,
    }
  default:
    return state
  }
}

export default panner
