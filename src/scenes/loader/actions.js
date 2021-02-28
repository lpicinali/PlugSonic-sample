import { setLoading, setName, loadingError } from "services/source/actions"
import { load } from "services/audio/actions"

export const loadAudioFile = (url, name, history) => async dispatch => {
  dispatch(setName(name))

  const reader = new FileReader()

  reader.onload = () => {
    load(reader.result).then(() => {
      dispatch(setLoading(false))
      history.push("/edit")
    }).catch(() => {
      dispatch(loadingError("Unable to decode audio data"))})
  }

  reader.onabort = () => dispatch(loadingError("Asset loading was aborted"))
  reader.onerror = () => dispatch(loadingError("Asset loading has failed"))
  
  try {
    const data = await fetch(`${url}`)
    switch(data.status){
    case 200:
      const blob = await data.blob()
      reader.readAsArrayBuffer(blob)
      break
    
    case 404:
      dispatch(loadingError("Asset data not found"))
      break

    case 401:
      dispatch(loadingError("You don't have permission to load this asset"))
      break

    default:
      dispatch(loadingError("There has been an error while loading the asset"))
    }
    
  } catch(e) {
    dispatch(loadingError("Unable to load the asset"))
  }
}
