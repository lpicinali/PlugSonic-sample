import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Container = styled.div`
  clear: both;
`

const Title = styled.div`
  float: left;
`

const Value = styled.div`
  float: right;
`

const FilterParam = ({ title, value }) => (
  <Container>
    <Title>{title}</Title>
    <Value>{value}</Value>
  </Container>
)

FilterParam.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}

export default FilterParam
