export const sliderToFrequency = (v) => {
  return 10+Math.pow(1.08,v)*10
}

export const frequencyToSlider = (f) => {
  return Math.log(f/10-10)/Math.log(1.08)
}

export const roundNumber = (n, decimals = 0) => Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals)
