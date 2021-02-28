import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const drawerWidth = "240px"
const rightDrawerWidth = "305px"

const Drawer = styled.div.attrs({
  width: props => props.width || drawerWidth
})`
  width: ${props => props.width};
  overflow-x: hidden;
  overflow-y: scroll;
  transition: width 1s;
`

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;

  & .hidden {
    width: 0;
  }
`

const Body = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border-left: solid 1px lightgray;
  border-right: solid 1px lightgray;
`

class DrawerHost extends Component {
  render() {
    const { children, left, showLeft, right, showRight } = this.props

    const leftDrawer =
      <Drawer className={!showLeft && "hidden"}>
        {left}
      </Drawer>

    const rightDrawer =
      <Drawer className={!showRight && "hidden"} width={rightDrawerWidth}>
        {right}
      </Drawer>

    return (
      <Container>
        {left && leftDrawer}
        <Body>
          {children}
        </Body>
        {right && rightDrawer}
      </Container>
    )
  }
}

DrawerHost.defaultProps = {
  showLeft: false,
  showRight: false,
}

DrawerHost.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  showLeft: PropTypes.bool,
  showRight: PropTypes.bool,
}

export default DrawerHost
