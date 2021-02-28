import React, { Component } from "react"
import PropTypes from "prop-types"
import sizeMe from "react-sizeme"
import Ws from "wavesurfer.js"
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions"

import { CONTROL_PLAY, CONTROL_STOP, CONTROL_PAUSE } from "services/source/actions"

import { defaultConfiguration } from "./constants"
import { Container } from "./style"

const absoluteToRelative = (position, duration) => {
  return position / duration
}

class WaveSurfer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      region: null,
      seek: 0,
    }
  }

  componentDidMount() {
    const { audioContext } = this.props
    var wavesurfer = Ws.create({
      ...defaultConfiguration,
      audioContext,
      container: this.waveform,
      height: this.waveform.offsetHeight,
      plugins: [
        RegionsPlugin.create()
      ]
    })

    const { loadingError, playbackReady, playbackStarted, playbackPaused, playbackEnded, seekChanged, regionChanged } = this.props

    wavesurfer.on("error", e => loadingError(e))
    wavesurfer.on("ready", () => {
      wavesurfer.enableDragSelection({
        loop: true,
      })
      playbackReady()
    })
    wavesurfer.on("play", () => playbackStarted())
    wavesurfer.on("pause", () => playbackPaused())
    wavesurfer.on("finish", () => playbackEnded())
    wavesurfer.on("seek", (position) => {
      this.setState({seek: position})
      seekChanged(position)
      const { region } = this.state
      const duration = this.wavesurfer.getDuration()
      if(region){
        if(position < absoluteToRelative(region.start, duration) || position > absoluteToRelative(region.end, duration)){
          this.clearRegions()
        }
      }
    })
    wavesurfer.on("region-created", () => {
      this.clearRegions()
    })
    wavesurfer.on("region-update-end", (region) => {
      this.setState({ region })
      const { start, end } = region
      regionChanged({ start, end })
      wavesurfer.pause()
    })

    this.wavesurfer = wavesurfer
    this.loadAudio()
  }

  clearRegions() {
    const { regionChanged } = this.props
    this.wavesurfer.clearRegions()
    regionChanged(null)
    this.setState({region: null})
  }

  componentDidUpdate({ audio: oldAudio, action: oldAction, size: oldSize, filters: oldFilters }){
    const { size, audio, action, filters } = this.props
    const { region } = this.state

    if(oldSize !== size){
      this.wavesurfer._onResize()
    }
    if(oldAudio !== audio){
      this.loadAudio()
    }
    if(oldAction !== action){
      switch(this.props.action){
      case CONTROL_PLAY:
        this.wavesurfer.play(region ? region.start : undefined)
        break

      case CONTROL_STOP:
        this.wavesurfer.stop()
        break

      case CONTROL_PAUSE:
        this.wavesurfer.pause()
        break

      default:
        break
      }
    }
    if(oldFilters !== filters){
      this.wavesurfer.backend.setFilters(filters)
    }
  }

  componentWillUnmount() {
    this.wavesurfer.destroy()
  }

  loadAudio() {
    const { audio } = this.props
    if (this.wavesurfer.isPlaying()){
      this.wavesurfer.stop()
      this.wavesurfer.seekTo(0)
    }
    this.clearRegions()
    this.wavesurfer.loadDecodedBuffer(audio)
  }

  render() {
    return (
      <Container innerRef={waveform => this.waveform = waveform} />
    )
  }
}

WaveSurfer.defaultProps = {
  playbackReady: () => {},
  playbackStarted: () => {},
  playbackPaused: () => {},
  playbackEnded: () => {},
  seekChanged: () => {},
  regionChanged: () => {},
}

WaveSurfer.propTypes = {
  audio: PropTypes.object.isRequired,
  audioContext: PropTypes.object,
  loadingError: PropTypes.func.isRequired,
  playbackReady: PropTypes.func,
  playbackStarted: PropTypes.func,
  playbackPaused: PropTypes.func,
  playbackEnded: PropTypes.func,
  seekChanged: PropTypes.func,
  regionChanged: PropTypes.func,
  filters: PropTypes.array.isRequired,
}

export default sizeMe()(WaveSurfer)
