import React from "react"
import ReactDOM from "react-dom"
import { createStore, applyMiddleware, compose } from "redux"
import { Provider } from "react-redux"
import thunk from "redux-thunk"

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import getMuiTheme from "material-ui/styles/getMuiTheme"

import appReducer from "./reducers"
import App from "./App"

import "./index.css"

const middleware = (
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__()))
  ||
  applyMiddleware(thunk)

const store = createStore(appReducer, middleware)

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#AA412B",
    accent1Color: "white",
    alternateTextColor: "#AA412B",
    textColor: "#000",
  },
})

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <App />
    </MuiThemeProvider>
  </Provider>
  , document.getElementById("root")
)
