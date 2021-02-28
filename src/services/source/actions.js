export const SOURCE_LOADING = "SOURCE/LOADING"
export const SOURCE_NAME = "SOURCE/NAME"
export const SOURCE_MEDIA = "SOURCE/MEDIA"
export const SOURCE_ERROR = "SOURCE/ERROR"
export const SOURCE_CONTROL = "SOURCE/CONTROL"
export const CONTROL_PLAY = "PLAY"
export const CONTROL_PAUSE = "PAUSE"
export const CONTROL_STOP = "STOP"
export const CONTROL_LOAD = "LOAD"
export const CONTROL_BUSY = "BUSY"
export const CONTROL_READY = "READY"
export const SOURCE_REGION = "SOURCE/REGION"
export const SOURCE_SEEK = "SOURCE/SEEK"

export const setLoading = isLoading => ({
  type: SOURCE_LOADING,
  value: isLoading,
})

export const setName = name => ({
  type: SOURCE_NAME,
  value: name,
})

export const setMediaContent = media => ({
  type: SOURCE_MEDIA,
  value: media,
})

export const loadingError = error => ({
  type: SOURCE_ERROR,
  value: error,
})

export const sourcePlay = () => ({
  type: SOURCE_CONTROL,
  value: CONTROL_PLAY,
})

export const sourcePause = () => ({
  type: SOURCE_CONTROL,
  value: CONTROL_PAUSE,
})

export const sourceStop = () => ({
  type: SOURCE_CONTROL,
  value: CONTROL_STOP,
})

export const sourceBusy = () => ({
  type: SOURCE_CONTROL,
  value: CONTROL_BUSY,
})

export const sourceReady = () => ({
  type: SOURCE_CONTROL,
  value: CONTROL_READY,
})

export const seek = seek => ({
  type: SOURCE_SEEK,
  value: seek,
})

export const setRegion = region => ({
  type: SOURCE_REGION,
  value: region,
})
