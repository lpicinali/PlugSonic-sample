import React from "react"
import { connect } from "react-redux"

import { sourcePlay, sourceStop, sourcePause, sourceReady, sourceBusy, CONTROL_PLAY, CONTROL_BUSY } from "services/source/actions"
import { sourceActionSelector, seekSelector, regionSelector, sourceNameSelector, sourceMediaSelector } from "services/source/selectors"
import { undo, hasHistory, mute, fadeIn, fadeOut, cut, copy, hasClipboard, paste, save, upload } from "services/audio/actions"
import { showRightPanel, hideRightPanel, showLeftPanel, hideLeftPanel } from "services/gui/actions"
import { showRightSelector, showLeftSelector, isEmbeddedSelector, embeddedParamsSelector } from "services/gui/selectors"

import FlatButton from "material-ui/FlatButton"
import MenuIcon from "material-ui/svg-icons/navigation/menu"
import AvPlayArrow from "material-ui/svg-icons/av/play-arrow"
import AvStop from "material-ui/svg-icons/av/stop"
import AvPause from "material-ui/svg-icons/av/pause"
import Undo from "material-ui/svg-icons/content/undo"
import Cut from "material-ui/svg-icons/content/content-cut"
import Copy from "material-ui/svg-icons/content/content-copy"
import Paste from "material-ui/svg-icons/content/content-paste"
import Mute from "material-ui/svg-icons/av/volume-off"

const Button = props => <FlatButton {...props} style={{ minWidth: "none" , padding: "0px 10px", margin: "10px"}}/>

const Controls = ({ action, sourcePlay, sourceStop, sourcePause, sourceReady, sourceBusy, seek, region, showRight, showRightPanel, hideRightPanel, showLeft, showLeftPanel, hideLeftPanel, isEmbedded, embeddedParams, name, sourceMedia }) => {
  const busy = action === CONTROL_BUSY

  const asBusy = action => () => {
    sourceBusy()
    action()
  }

  const toggleRight = () => {
    showRight ? hideRightPanel() : showRightPanel()
  }

  const toggleLeft = () => {
    showLeft ? hideLeftPanel() : showLeftPanel()
  }

  return (
    <div>
      {!isEmbedded && <Button icon={<MenuIcon/>} onClick={toggleLeft} secondary/>}

      { action !== CONTROL_PLAY &&
        <Button title="Play" icon={<AvPlayArrow/>} onClick={sourcePlay} disabled={busy} secondary/>
      }

      { action === CONTROL_PLAY &&
        <Button title="Pause" icon={<AvPause/>} onClick={sourcePause} disabled={busy} secondary/>
      }

      <Button title="Stop" icon={<AvStop/>} onClick={sourceStop} disabled={action !== CONTROL_PLAY} secondary/>

      <Button title="Undo" icon={<Undo/>} onClick={asBusy(() => undo())} disabled={busy || !hasHistory()} secondary/>

      <Button title="Cut" icon={<Cut/>} onClick={asBusy(() => cut(region))} disabled={busy || !region} secondary />

      <Button title="Copy" icon={<Copy/>} onClick={() => copy(region)} disabled={busy || !region} secondary />

      <Button title="Paste" icon={<Paste/>} onClick={asBusy(() => paste(seek))} disabled={busy || !seek || !hasClipboard()} secondary/>

      <Button title="Mute" icon={<Mute/>} onClick={asBusy(() => mute(region))} disabled={busy || !region} secondary />

      <Button onClick={asBusy(() => fadeIn(region))} disabled={busy || !region} secondary>
        Fade In
      </Button>

      <Button onClick={asBusy(() => fadeOut(region))} disabled={busy || !region} secondary>
        Fade Out
      </Button>

      <Button onClick={toggleRight} secondary>
        Filters
      </Button>

      <Button onClick={() => {
        sourceStop()
        sourceBusy()
        save().then(() => sourceReady())
      }}
      disabled={busy} secondary>
        Export
      </Button>

      {isEmbedded && <Button onClick={() => {
        sourceStop()
        sourceBusy()
        const previousId = sourceMedia ? sourceMedia[0]._id : undefined
        upload(embeddedParams.assetId, name, previousId, embeddedParams.token).then(() => sourceReady())
      }}
      disabled={busy} secondary>
        Save
      </Button>}
    </div>
  )
}

const mapStateToProps = state => ({
  action: sourceActionSelector(state),
  seek: seekSelector(state),
  region: regionSelector(state),
  showRight: showRightSelector(state),
  showLeft: showLeftSelector(state),
  isEmbedded: isEmbeddedSelector(state),
  embeddedParams: embeddedParamsSelector(state),
  name: sourceNameSelector(state),
  sourceMedia: sourceMediaSelector(state)
})

const mapDispatchToProps = {
  sourcePlay, sourceStop, sourcePause, sourceReady, sourceBusy, showRightPanel, hideRightPanel, showLeftPanel, hideLeftPanel
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls)
