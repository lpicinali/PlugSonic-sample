import React from "react"
import PropTypes from "prop-types"
import Toggle from "material-ui/Toggle"

const onToggleChange = action => {
  return (e, v) => {
    action(v)
  }
}

const ParameterToggle = ({ action, value, style }) => (
  <Toggle onToggle={onToggleChange(action)} toggled={value} style={style}/>
)

ParameterToggle.defaultProps = {
  action: () => {},
}

ParameterToggle.propTypes = {
  action: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  style: PropTypes.object,
}

export default ParameterToggle
