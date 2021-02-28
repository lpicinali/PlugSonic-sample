import { combineReducers } from "redux"

import biquad from "./components/biquad/reducer"
import compressor from "./components/compressor/reducer"
import reverb from "./components/reverb/reducer"
import panner from "./components/panner/reducer"

const filters = combineReducers({
  biquad,
  compressor,
  reverb,
  panner,
})

export default filters
