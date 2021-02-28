import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { List, ListItem } from "material-ui/List"

import FilterParam from "components/filters/components/shared/FilterParam"
import Toggle from "components/filters/components/shared/Toggle"
import Slider from "components/filters/components/shared/Slider"

import * as actions from "./actions"
import * as selectors from "./selectors"

import { roundNumber } from "components/filters/utils"
import { setFilterState, setFilterParameter, getMinMax } from "services/audio/actions"

const setCompressorStatus = action => status => {
  setFilterState("compressor", status)
  action(status)
}

class Compressor extends Component {
  componentDidUpdate({
    threshold: oldThreshold,
    knee: oldKnee,
    ratio: oldRatio,
    attack: oldAttack,
    release: oldRelease,
  }){
    const { threshold, knee, ratio, attack, release } = this.props

    if(threshold !== oldThreshold){
      setFilterParameter("compressor", "threshold.value", threshold)
    }
    if (knee !== oldKnee){
      setFilterParameter("compressor", "knee.value", knee)
    }
    if (ratio !== oldRatio){
      setFilterParameter("compressor", "ratio.value", ratio)
    }
    if (attack !== oldAttack){
      setFilterParameter("compressor", "attack.value", attack)
    }
    if (release !== oldRelease){
      setFilterParameter("compressor", "release.value", release)
    }
  }

  render() {
    const { enabled, threshold, knee, ratio, attack, release, setStatus, setThreshold, setKnee, setRatio, setAttack, setRelease } = this.props

    const items = []
    items.push(
      <ListItem
        key={`compressor-${items.length}`}
        primaryText="Enabled"
        rightToggle={<Toggle action={setCompressorStatus(setStatus)} value={enabled}/>}
      />
    )

    items.push(
      <ListItem
        key={`compressor-${items.length}`}
        primaryText={<FilterParam title="Threshold" value={threshold}/>}
        secondaryText={
          <Slider
            value={threshold}
            action={setThreshold}
            min={getMinMax("compressor", "threshold").minValue}
            max={getMinMax("compressor", "threshold").maxValue}
            step={1}
          />
        }
      />
    )

    items.push(
      <ListItem
        key={`compressor-${items.length}`}
        primaryText={<FilterParam title="Knee" value={knee}/>}
        secondaryText={
          <Slider
            value={knee}
            action={setKnee}
            min={getMinMax("compressor", "knee").minValue}
            max={getMinMax("compressor", "knee").maxValue}
            step={1}
          />
        }
      />
    )

    items.push(
      <ListItem
        key={`compressor-${items.length}`}
        primaryText={<FilterParam title="Ratio" value={roundNumber(ratio,2)}/>}
        secondaryText={
          <Slider
            value={ratio}
            action={setRatio}
            min={getMinMax("compressor", "ratio").minValue}
            max={getMinMax("compressor", "ratio").maxValue}
            step={0.01}
          />
        }
      />
    )

    items.push(
      <ListItem
        key={`compressor-${items.length}`}
        primaryText={<FilterParam title="Attack" value={roundNumber(attack, 2)}/>}
        secondaryText={
          <Slider
            value={attack}
            action={setAttack}
            min={getMinMax("compressor", "attack").minValue}
            max={getMinMax("compressor", "attack").maxValue}
            step={0.01}
          />
        }
      />
    )

    items.push(
      <ListItem
        key={`compressor-${items.length}`}
        primaryText={<FilterParam title="Release" value={roundNumber(release, 2)}/>}
        secondaryText={
          <Slider
            value={release}
            action={setRelease}
            min={getMinMax("compressor", "release").minValue}
            max={getMinMax("compressor", "release").maxValue}
            step={0.01}
          />
        }
      />
    )

    return (
      <List>
        <ListItem
          primaryText="Compressor"
          primaryTogglesNestedList={true}
          nestedItems={items}
        />
      </List>
    )
  }
}

Compressor.propTypes = {
  enabled: PropTypes.bool.isRequired,
  threshold: PropTypes.number.isRequired,
  knee: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  attack: PropTypes.number.isRequired,
  release: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  enabled: selectors.getEnabled(state),
  threshold: selectors.getThreshold(state),
  knee: selectors.getKnee(state),
  ratio: selectors.getRatio(state),
  attack: selectors.getAttack(state),
  release: selectors.getRelease(state),
})

const mapDispatchToProps = {
  setStatus: actions.setStatus,
  setThreshold: actions.setThreshold,
  setKnee: actions.setKnee,
  setRatio: actions.setRatio,
  setAttack: actions.setAttack,
  setRelease: actions.setRelease,
}

export default connect(mapStateToProps, mapDispatchToProps)(Compressor)
