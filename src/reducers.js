import { combineReducers } from "redux"

import source from "services/source/reducer"
import gui from "services/gui/reducer"
import filters from "components/filters/reducers"

const app = combineReducers({
  source,
  gui,
  filters
})
 
export default app
