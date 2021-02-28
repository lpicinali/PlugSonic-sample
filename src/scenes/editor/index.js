import React, { Component } from "react"
import { connect } from "react-redux"
import { Redirect, Prompt } from "react-router-dom"
import Dialog from "material-ui/Dialog"
import CircularProgress from "material-ui/CircularProgress"

import { hideLeftPanel, showLeftPanel, hideRightPanel } from "services/gui/actions"
import { sourceBusy, sourceReady, sourcePlay, sourcePause, sourceStop, seek, setRegion, loadingError, CONTROL_BUSY } from "services/source/actions"
import { sourceActionSelector, sourceNameSelector } from "services/source/selectors"
import { getContext, getAudioBuffer, getFilters } from "services/audio/actions"
import { enabledFiltersSelector } from "components/filters/selectors"

import { Container, Filename } from "./style"
import WaveSurfer from "./components/wavesurfer"

class Editor extends Component {
  constructor(props){
    super(props)
    this.state = {
      filters: getFilters(),
    }
  }
  componentDidMount(){
    const { hideLeftPanel } = this.props
    hideLeftPanel()
  }

  componentWillUnmount() {
    const { showLeftPanel, hideRightPanel } = this.props
    showLeftPanel()
    hideRightPanel()
  }

  componentWillReceiveProps({ enabledFilters }){
    const { enabledFilters: oldFilters } = this.props
    if ( enabledFilters != oldFilters ){
      this.setState({ filters: getFilters() })
    }
  }

  render() {
    const { name, action, sourceReady, sourcePlay, sourcePause, sourceStop, seek, setRegion, loadingError } = this.props
    const { filters } = this.state
    const data = getAudioBuffer()
    const busy = action === CONTROL_BUSY

    return (
      data ?
        <Container>
          <Prompt
            message={location =>
              "Are you sure you want to stop editing? All unsaved changes will be lost."
            }
          />
          <Dialog modal open={busy} contentStyle={{ width: "130px"}}>
            <CircularProgress size={80} thickness={5} />
          </Dialog>
          <Filename>{name}</Filename>
          <WaveSurfer
            audioContext={getContext()}
            audio={data}
            loadingError={loadingError}
            action={action}
            playbackReady={sourceReady}
            playbackStarted={sourcePlay}
            playbackPaused={sourcePause}
            playbackEnded={sourceStop}
            regionChanged={setRegion}
            seekChanged={seek}
            filters={filters}
          />
        </Container>
        :
        <Redirect to="/"/>
    )
  }
}

const mapStateToProps = state => ({
  name: sourceNameSelector(state),
  action: sourceActionSelector(state),
  enabledFilters: enabledFiltersSelector(state),
})

const mapDispatchToProps = { sourceBusy, sourceReady, sourcePlay, sourcePause, sourceStop, loadingError, seek, setRegion, hideLeftPanel, showLeftPanel, hideRightPanel }

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
