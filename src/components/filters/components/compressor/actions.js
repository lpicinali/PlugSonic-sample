export const COMPRESSOR_STATUS = "FILTERS/COMPRESSOR_STATUS"
export const COMPRESSOR_THRESHOLD = "FILTERS/COMPRESSOR_THRESHOLD"
export const COMPRESSOR_KNEE = "FILTERS/COMPRESSOR_KNEE"
export const COMPRESSOR_RATIO = "FILTERS/COMPRESSOR_RATIO"
export const COMPRESSOR_ATTACK = "FILTERS/COMPRESSOR_ATTACK"
export const COMPRESSOR_RELEASE = "FILTERS/COMPRESSOR_RELEASE"

export const setStatus = status => ({
  type: COMPRESSOR_STATUS,
  value: status,
})

export const setThreshold = value => ({
  type: COMPRESSOR_THRESHOLD,
  value: value,
})

export const setKnee = value => ({
  type: COMPRESSOR_KNEE,
  value: value,
})

export const setRatio = value => ({
  type: COMPRESSOR_RATIO,
  value: value,
})

export const setAttack = value => ({
  type: COMPRESSOR_ATTACK,
  value: value,
})

export const setRelease = value => ({
  type: COMPRESSOR_RELEASE,
  value: value,
})
