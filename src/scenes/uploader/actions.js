import { setLoading, setName, loadingError } from "services/source/actions"
import { load } from "services/audio/actions"

export const onDrop = (accepted, rejected, history) => dispatch => {
  if(accepted.length === 0){
    dispatch(loadingError("Unsupported file format"))
  }else if(accepted.length === 1){
    const { name } = accepted[0]
    dispatch(setLoading(true))
    dispatch(setName(name))
    const reader = new FileReader()

    reader.onload = () => {
      load(reader.result).then(() => {
        dispatch(setLoading(false))
        history.push("/edit")
      }).catch(e => dispatch(loadingError("Unable to decode audio data")))
    }

    reader.onabort = () => dispatch(loadingError("File reading was aborted"))
    reader.onerror = () => dispatch(loadingError("File reading has failed"))

    reader.readAsArrayBuffer(accepted[0])
  }else{
    dispatch(loadingError("Please load only one file"))
  }
}
