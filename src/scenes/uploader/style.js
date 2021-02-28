import styled from "styled-components"
import ReactDropzone from "react-dropzone"

import Icon from "material-ui/svg-icons/av/library-music"

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`

export const Dropzone = styled(ReactDropzone)`
  width: 90%;
  height: 90%;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  border: dashed thin #666;
  border-radius: 20px;

  font-size: larger;
`

export const ActionIcon = styled(Icon)`
  width: 128px !important;
  height: 128px !important;
  color: gray !important;
  margin: 20px;
`

export const Error = styled.div`
  margin: 20px;
  padding: 10px;
  color: #802F19;
  background-color: #ffeeee;
  border-radius: 4px;
  border: solid thin #802F19;
`
