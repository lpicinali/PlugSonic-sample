import React from "react"
import PropTypes from "prop-types"
import { withRouter } from "react-router-dom"

import { List, ListItem } from "material-ui/List"
import HomeIcon from "material-ui/svg-icons/action/home"
import SearchIcon from "material-ui/svg-icons/action/search"
import UploadIcon from "material-ui/svg-icons/file/file-upload"

import { Logo } from "./style"

const Menu = ({ history }) => (
  <div>
    <Logo src="/pluggy.png"/>
    <List>
      <ListItem primaryText="Home" leftIcon={<HomeIcon/>} onClick={() => history.push("/")}/>
      <ListItem primaryText="Upload" leftIcon={<UploadIcon/>} onClick={() => history.push("/upload")}/>
      <ListItem primaryText="Search asset" leftIcon={<SearchIcon/>} disabled/>
    </List>
  </div>
)

Menu.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(Menu)
