export const PANNER_STATUS = "FILTERS/PANNER_STATUS"
export const PANNER_VALUE = "FILTERS/PANNER_VALUE"

export const setStatus = status => ({
  type: PANNER_STATUS,
  value: status,
})

export const setPan = value => ({
  type: PANNER_VALUE,
  value: value,
})
