import React from "react"
import PropTypes from "prop-types"
import Slider from "material-ui/Slider"

const onSliderChange = action => {
  return (e, v) => {
    action(v)
  }
}

const ParameterSlider = ({ action, min, max, step, value }) => {
  return (
    <Slider
      min={min} max={max} step={step} defaultValue={value}
      onChange={onSliderChange(action)}
      sliderStyle={{ marginBottom: "0px" }}
    />
  )
}

ParameterSlider.defaultProps = {
  action: () => {},
}

ParameterSlider.propTypes = {
  action: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  value: PropTypes.number,
}

export default ParameterSlider
