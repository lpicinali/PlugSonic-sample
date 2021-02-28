export const REVERB_STATUS = "FILTERS/REVERB_STATUS"
export const REVERB_TYPE = "FILTERS/REVERB_TYPE"

export const setStatus = status => ({
  type: REVERB_STATUS,
  value: status,
})

export const setType = type => ({
  type: REVERB_TYPE,
  value: type,
})
