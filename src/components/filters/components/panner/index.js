import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { List, ListItem } from "material-ui/List"

import FilterParam from "components/filters/components/shared/FilterParam"
import Toggle from "components/filters/components/shared/Toggle"
import Slider from "components/filters/components/shared/Slider"

import * as actions from "./actions"
import * as selectors from "./selectors"

import { setFilterState, setFilterParameter, getMinMax } from "services/audio/actions"

const setPannerStatus = action => status => {
  setFilterState("panner", status)
  action(status)
}

class Panner extends Component {

  componentDidUpdate({
    pan: oldPan,
  }){
    const { pan } = this.props

    if(pan !== oldPan){
      setFilterParameter("panner", "pan.value", pan)
    }
  }

  render() {
    const { enabled, pan, setStatus, setPan } = this.props

    const items = []
    items.push(
      <ListItem
        key={`panner-${items.length}`}
        primaryText="Enabled"
        rightToggle={<Toggle action={setPannerStatus(setStatus)} value={enabled}/>}
      />
    )

    items.push(
      <ListItem
        key={`panner-${items.length}`}
        primaryText={<FilterParam title="L - R" value={pan}/>}
        secondaryText={
          <Slider
            value={pan}
            action={setPan}
            min={getMinMax("panner", "pan").minValue}
            max={getMinMax("panner", "pan").maxValue}
            step={0.01}
          />
        }
      />
    )

    return (
      <List>
        <ListItem
          primaryText="Panner"
          primaryTogglesNestedList={true}
          nestedItems={items}
        />
      </List>
    )
  }
}

Panner.propTypes = {
  enabled: PropTypes.bool.isRequired,
  pan: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  enabled: selectors.getEnabled(state),
  pan: selectors.getPan(state),
})

const mapDispatchToProps = {
  setStatus: actions.setStatus,
  setPan: actions.setPan,
}

export default connect(mapStateToProps, mapDispatchToProps)(Panner)
