import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { List, ListItem } from "material-ui/List"

import FilterParam from "components/filters/components/shared/FilterParam"
import Toggle from "components/filters/components/shared/Toggle"
import Slider from "components/filters/components/shared/Slider"
import Select from "components/filters/components/shared/Select"

import * as actions from "./actions"
import * as selectors from "./selectors"

import { frequencyToSlider, roundNumber } from "components/filters/utils"
import { setFilterState, setFilterParameter } from "services/audio/actions"

const CONTROL_MAPPING = {
  gain: ["lowshelf", "highshelf","peaking"],
  Q:["bandpass", "peaking", "notch"]
}

const showParam = (type, parameter) => (CONTROL_MAPPING[parameter].indexOf(type) >= 0)

const setBiquadStatus = action => status => {
  setFilterState("biquad", status)
  action(status)
}

class Biquad extends Component {

  componentDidUpdate({
    type: oldType,
    frequency: oldFrequency,
    Q: oldQ,
    gain: oldGain
  }){
    const { type, frequency, Q, gain } = this.props

    if(type !== oldType){
      setFilterParameter("biquad", "type", type)
    }
    if (frequency !== oldFrequency){
      setFilterParameter("biquad", "frequency.value", frequency)
    }
    if (Q !== oldQ){
      setFilterParameter("biquad", "Q.value", Q)
    }
    if (gain !== oldGain){
      setFilterParameter("biquad", "gain.value", gain)
    }
  }

  render() {
    const { enabled, type, frequency, Q, gain, setStatus, setType, setFrequency, setQ, setGain } = this.props

    const items = []
    items.push(
      <ListItem
        key={`biquad-${items.length}`}
        primaryText="Enabled"
        rightToggle={<Toggle action={setBiquadStatus(setStatus)} value={enabled}/>}
      />
    )

    items.push(
      <ListItem
        key={`biquad-${items.length}`}
        primaryText={<FilterParam title="Type"/>}
        secondaryText={
          <Select
            value={type}
            action={setType}
            values={[
              { id: "lowpass", label:"Lowpass" },
              { id: "highpass", label:"Highpass" },
              { id: "bandpass", label:"Bandpass" },
              { id: "lowshelf", label:"Lowshelf" },
              { id: "highshelf", label:"Highshelf" },
              { id: "peaking", label:"Peaking" },
              { id: "notch", label:"Notch" }]}
          />
        }
      />
    )

    items.push(
      <ListItem
        key={`biquad-${items.length}`}
        primaryText={<FilterParam title="Frequency" value={roundNumber(frequency)}/>}
        secondaryText={
          <Slider
            value={frequencyToSlider(frequency)}
            action={setFrequency}
            min={0}
            max={100}
            step={1}
          />
        }
      />
    )

    showParam(type, "Q") && items.push(
      <ListItem
        key={`biquad-${items.length}`}
        primaryText={<FilterParam title="Q" value={Q}/>}
        secondaryText={
          <Slider
            value={Q}
            action={setQ}
            min={0.1}
            max={2}
            step={0.1}
          />
        }
      />
    )

    showParam(type, "gain") && items.push(
      <ListItem
        key={`biquad-${items.length}`}
        primaryText={<FilterParam title="Gain" value={gain}/>}
        secondaryText={
          <Slider
            value={gain}
            action={setGain}
            min={-40}
            max={40}
          />
        }
      />
    )

    return (
      <List>
        <ListItem
          primaryText="Equaliser"
          primaryTogglesNestedList={true}
          nestedItems={items}
        />
      </List>
    )
  }
}

Biquad.propTypes = {
  enabled: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  frequency: PropTypes.number.isRequired,
  Q: PropTypes.number.isRequired,
  gain: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  enabled: selectors.getEnabled(state),
  type: selectors.getType(state),
  frequency: selectors.getFrequency(state),
  Q: selectors.getQ(state),
  gain: selectors.getGain(state),
})

const mapDispatchToProps = {
  setStatus: actions.setStatus,
  setType: actions.setType,
  setFrequency: actions.setFrequency,
  setQ: actions.setQ,
  setGain: actions.setGain,
}

export default connect(mapStateToProps, mapDispatchToProps)(Biquad)
