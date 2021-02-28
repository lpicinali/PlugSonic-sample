import React from "react"
import { connect } from "react-redux"
import Dialog from "material-ui/Dialog"
import CircularProgress from "material-ui/CircularProgress"

import { onDrop } from "./actions"
import { sourceLoadingSelector, sourceErrorSelector } from "services/source/selectors"

import { Container, Dropzone, ActionIcon, Error } from "./style"

const Uploader = ({ onDrop, loading, error, history }) => (
  <Container>
    <Dialog modal open={loading} contentStyle={{ width: "130px"}}>
      <CircularProgress size={80} thickness={5} />
    </Dialog>
    <Dropzone accept="audio/*"
      onDrop={(accepted, rejected) => {
        onDrop(accepted, rejected, history)
      }}>
      <div>
        <div><ActionIcon/></div>
        <div>Drag and drop here or click to choose a file.</div>
        {error && <Error>{error}</Error>}
      </div>
    </Dropzone>
  </Container>
)

const mapStateToProps = state => ({
  loading: sourceLoadingSelector(state),
  error: sourceErrorSelector(state)
})

export default connect(mapStateToProps, { onDrop })(Uploader)
