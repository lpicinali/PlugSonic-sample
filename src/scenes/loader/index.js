import React from "react"
import { connect } from "react-redux"
import qs from "query-string"

import CircularProgress from "material-ui/CircularProgress"
import { hideLeftPanel, switchToEmbedded } from "services/gui/actions"

import { loadingError, setMediaContent } from "services/source/actions"
import { loadAudioFile } from "./actions"
import { sourceLoadingSelector, sourceErrorSelector } from "services/source/selectors"

import { Container, Alert, AlertBody, Asset } from "./style"
import { API_ENTRYPOINT, API_RESOURCE_ASSETS, API_RESOURCE_MEDIA } from "Constants"
import { getApiURL } from "../../Constants"

class SocialPlatformLoader extends React.Component {
  state = {
    assetObject: undefined,
  }

  componentDidMount() {
    const { location, match, hideLeftPanel, switchToEmbedded } = this.props

    const { params } = match
    const { assetId } = params
    const { token } = qs.parse(location.search)

    hideLeftPanel()
    switchToEmbedded(assetId, token)

    this.loadAsset(assetId)
  }

  loadAsset = async (assetId) => {
    const { loadAudioFile, history, loadingError, setMediaContent } = this.props
    
    try {
      const assetData = await fetch(`${getApiURL()}/${API_ENTRYPOINT}/${API_RESOURCE_ASSETS}/${assetId}`)
      const { success, data } = await assetData.json()
      
      if (!success){
        loadingError("There has been an error while decoding the asset")
  
      } else {
        this.setState({
          assetObject: data
        }, () => {
          const { mediaContent } = data
          if(mediaContent && mediaContent.length > 0){
            setMediaContent(mediaContent)

            const { _id: mediaId, filename } = mediaContent[mediaContent.length - 1]
  
            const url = `${getApiURL()}/${API_ENTRYPOINT}/${API_RESOURCE_ASSETS}/${assetId}/${API_RESOURCE_MEDIA}/${mediaId}`
            loadAudioFile(url, filename, history)
          
          } else {
            loadingError("This asset has no associated media")

          }
        })
      }

    } catch(e) {
      loadingError("There has been an error while downloading the asset")
    }
  }

  renderError = (error) => (
    <Container>
      <Alert>
        <div>{error}</div>
      </Alert>
    </Container>
  )


  render() {  
    const { error } = this.props
    const { assetObject = {} } = this.state

    const { title, description } = assetObject
    if (error) {
      return this.renderError(error)  
    }

    return (
      <Container>
        <Alert>
          <AlertBody>
            <CircularProgress size={40} thickness={5} />
            <Asset>
              <header>Loading Asset</header>
              {title && <h1>{title}</h1>}
              {description && <p>{description}</p>}
            </Asset>
          </AlertBody>
        </Alert>
      </Container> 
    )
  }
}

const mapStateToProps = state => ({
  loading: sourceLoadingSelector(state),
  error: sourceErrorSelector(state)
})

const mapDispatchToProps = { hideLeftPanel, loadAudioFile, loadingError, switchToEmbedded, setMediaContent }

export default connect(mapStateToProps, mapDispatchToProps)(SocialPlatformLoader)
