import React from "react"
import PropTypes from "prop-types"
import SelectField from "material-ui/SelectField"
import MenuItem from "material-ui/MenuItem"
import muiThemeable from "material-ui/styles/muiThemeable"

const onSelect = (action, values) => {
  return (e, i) => {
    action(values[i].id)
  }
}

const ParameterSelect = ({ action, value, values, style, muiTheme }) => {
  const { palette: { alternateTextColor }} = muiTheme

  return (
    <SelectField
      value={value}
      onChange={onSelect(action, values)}
      selectedMenuItemStyle={{ color: alternateTextColor }}
    >
      {
        values.map((v, i) => <MenuItem key={`value-${i}`} value={v.id} primaryText={v.label} />)
      }
    </SelectField>
  )
}

ParameterSelect.defaultProps = {
  values: [],
  action: () => {},
}

ParameterSelect.propTypes = {
  action: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  values: PropTypes.array,
  style: PropTypes.object,
  muiTheme: PropTypes.object.isRequired,
}

export default muiThemeable()(ParameterSelect)
