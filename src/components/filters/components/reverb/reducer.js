import { isEnabled } from "services/audio/actions"

import { REVERB_STATUS, REVERB_TYPE } from "./actions"

const FILTER_NAME = "convolver"
const reverbInit = {
  enabled: isEnabled(FILTER_NAME),
  type: "small",
}

const reverb = (state = reverbInit, action) => {
  switch (action.type) {
  case REVERB_STATUS:
    return {
      ...state,
      enabled: action.value,
    }
  case REVERB_TYPE:
    return {
      ...state,
      type: action.value,
    }
  default:
    return state
  }
}

export default reverb
