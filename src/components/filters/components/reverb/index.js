import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { List, ListItem } from "material-ui/List"

import FilterParam from "components/filters/components/shared/FilterParam"
import Toggle from "components/filters/components/shared/Toggle"
import Select from "components/filters/components/shared/Select"

import * as actions from "./actions"
import * as selectors from "./selectors"

import SmallM from "./Irs/Small_M.wav"
import SmallST from "./Irs/Small_ST.wav"
import MediumM from "./Irs/Medium_M.wav"
import MediumST from "./Irs/Medium_ST.wav"
import LargeM from "./Irs/Large_M.wav"
import LargeST from "./Irs/Large_ST.wav"

import { setFilterState, loadImpulseResponse } from "services/audio/actions"

const setReverbStatus = action => status => {
  setFilterState("convolver", status)
  action(status)
}

const getIRs = () => (
  {
    small: {
      mono: SmallM,
      stereo: SmallST,
    },
    medium: {
      mono: MediumM,
      stereo: MediumST,
    },
    large: {
      mono: LargeM,
      stereo: LargeST,
    }
  }
)

const loadIR = (type) => {
  const irObj = getIRs()[type]
  irObj && loadImpulseResponse(irObj)
}

class Reverb extends Component {
  constructor(props){
    super(props)
    loadIR("small")
  }

  componentDidUpdate({ type: oldType }){
    const { type } = this.props

    if(type !== oldType){
      loadIR(type)
    }
  }

  render() {
    const { enabled, type, setStatus, setType } = this.props

    const items = []
    items.push(
      <ListItem
        key={`reverb-${items.length}`}
        primaryText="Enabled"
        rightToggle={<Toggle action={setReverbStatus(setStatus)} value={enabled}/>}
      />
    )

    items.push(
      <ListItem
        key={`reverb-${items.length}`}
        primaryText={<FilterParam title="Reverb"/>}
        secondaryText={
          <Select
            value={type}
            action={setType}
            values={[
              { id: "small", label:"Small" },
              { id: "medium", label:"Medium" },
              { id: "large", label:"Large" },
            ]}
          />
        }
      />
    )

    return (
      <List>
        <ListItem
          primaryText="Reverb"
          primaryTogglesNestedList={true}
          nestedItems={items}
        />
      </List>
    )
  }
}

Reverb.propTypes = {
  enabled: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  enabled: selectors.getEnabled(state),
  type: selectors.getType(state),
})

const mapDispatchToProps = {
  setStatus: actions.setStatus,
  setType: actions.setType,
}

export default connect(mapStateToProps, mapDispatchToProps)(Reverb)
