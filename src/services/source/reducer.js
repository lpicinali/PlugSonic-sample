import { SOURCE_LOADING, SOURCE_NAME, SOURCE_MEDIA, SOURCE_ERROR, SOURCE_CONTROL, SOURCE_SEEK, SOURCE_REGION } from "./actions"

const sourceInit = {
  loading: false,
  name: null,
  media: null,
  error: null,
  action: null,
  seek: null,
  region: null,
}

const source = (state = sourceInit, action) => {
  switch (action.type) {
  case SOURCE_LOADING:
    return {
      ...state,
      loading : action.value,
    }
  case SOURCE_NAME:
    return {
      ...state,
      name: action.value,
    }
  case SOURCE_MEDIA:
    return {
      ...state,
      media: action.value,
    }
  case SOURCE_ERROR:
    return {
      ...sourceInit,
      error: action.value,
    }
  case SOURCE_CONTROL:
    return {
      ...state,
      action: action.value,
    }
  case SOURCE_SEEK:
    return {
      ...state,
      seek: action.value,
    }
  case SOURCE_REGION:
    return {
      ...state,
      region: action.value,
    }
  default:
    return state
  }
}

export default source
