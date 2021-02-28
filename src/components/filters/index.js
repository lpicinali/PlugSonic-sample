import React from "react"
import PropTypes from "prop-types"
import muiThemeable from "material-ui/styles/muiThemeable"
import { List } from "material-ui/List"
import Subheader from "material-ui/Subheader"
import Divider from "material-ui/Divider"

import Biquad from "./components/biquad"
import Compressor from "./components/compressor"
import Reverb from "./components/reverb"
import Panner from "./components/panner"

import { isAvailable } from "services/audio/actions"

const Filters = ({ muiTheme }) => {
  const { palette: { alternateTextColor }} = muiTheme
  return (
    <div>
      <List>
        <Subheader style={{ color: alternateTextColor }}>Audio Filters</Subheader>
        <Divider/>

        {isAvailable("biquad") &&
          <span>
            <Biquad/>
            <Divider/>
          </span>
        }
        {isAvailable("compressor") &&
          <span>
            <Compressor/>
            <Divider/>
          </span>
        }
        {isAvailable("convolver") &&
          <span>
            <Reverb/>
            <Divider/>
          </span>
        }
        {false && isAvailable("panner") &&
          <span>
            <Panner/>
            <Divider/>
          </span>
        }
      </List>
    </div>
  )
}

Filters.propTypes = {
  muiTheme: PropTypes.object.isRequired
}

export default muiThemeable()(Filters)
