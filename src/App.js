import React, { Component } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { connect } from "react-redux"

import Menu from "./components/mainmenu"
import Filters from "./components/filters"
import DrawerHost from "./components/drawerhost"
import Home from "./scenes/home"
import Uploader from "./scenes/uploader"
import Loader from "./scenes/loader"
import Editor from "./scenes/editor"
import Controls from "./components/controls"

import { Container, Nav } from "./style"

import { showLeftSelector, showRightSelector } from "services/gui/selectors"

class App extends Component {
  render() {
    const { showLeft, showRight } = this.props
    const left = <Menu/>
    const right = <Filters/>

    return (
      <Router>
        <Container>
          <Nav>
            <Route exact path="/edit" component={Controls}/>
          </Nav>
          <DrawerHost left={left} right={right} showLeft={showLeft} showRight={showRight}>
            <Route exact path="/" component={Home}/>
            <Route exact path="/upload" component={Uploader}/>
            <Route exact path="/load/:assetId" component={Loader}/>
            <Route exact path="/edit" component={Editor}/>
          </DrawerHost>
        </Container>
      </Router>
    )
  }
}

const mapStateToProps = state => ({
  showLeft: showLeftSelector(state),
  showRight: showRightSelector(state),
})

export default connect(mapStateToProps)(App)
