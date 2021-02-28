import AudioEditor from "./AudioEditor"
import { getAudioBuffer, cloneFilterChainInContext } from "./actions"

import EncoderWorker from "../worker/encoder.worker"
import { FORMAT_MP3 } from "../worker/constants"
import { API_ENTRYPOINT, API_RESOURCE_ASSETS, API_RESOURCE_MEDIA } from "Constants"
import { getApiURL } from "../../Constants"

const worker = new EncoderWorker()

const MAX_HISTORY_SIZE = 3

const SAVE_FORMAT = FORMAT_MP3

class AudioManager {
  constructor(audioContext) {
    this.ac = audioContext
    this.editor = new AudioEditor(audioContext)
    this.buffers = []
    this.maxHistory = MAX_HISTORY_SIZE
    this.clipboard = null
  }

  load(arrayBuffer){
    const caller = this
    const ac = this.ac
    return new Promise(function(resolve, reject) {
      ac.decodeAudioData(arrayBuffer,
        data => {
          caller.push(data)
          resolve()
        },
        error => {
          reject(error)
        })
    })
  }

  peek() {
    return this.buffers[this.buffers.length - 1]
  }

  undo() {
    this.pop()
  }

  hasHistory(){
    return this.buffers.length > 1
  }

  withHistory(action) {
    const audioBuffer = this.peek()
    const result = action(audioBuffer)
    this.push(result)
    return result
  }

  mute(region) {
    this.withHistory(audioBuffer => {
      const { start, end } = this.getRegionIndexes(region, audioBuffer)
      return this.editor.mute(audioBuffer, start, end)
    })
  }

  fade(region, out) {
    this.withHistory(audioBuffer => {
      const { start, end } = this.getRegionIndexes(region, audioBuffer)
      return this.editor.fade(audioBuffer, start, end, out)
    })
  }

  cut(region) {
    this.withHistory(audioBuffer => {
      const { start, end } = this.getRegionIndexes(region, audioBuffer)
      this.copy(region)
      return this.editor.cut(audioBuffer, start, end)
    })
  }

  copy(region) {
    const audioBuffer = this.peek()
    const { start, end } = this.getRegionIndexes(region, audioBuffer)
    this.clipboard = this.editor.copy(audioBuffer, start, end)
  }

  paste(seek) {
    this.withHistory(audioBuffer => {
      const start = seek * audioBuffer.length
      return this.editor.paste(audioBuffer, this.clipboard, start)
    })
  }

  hasClipboard() {
    return this.clipboard
  }
  
  render(){
    const buffer = getAudioBuffer()
    const { numberOfChannels, length, sampleRate } = buffer

    const offlineContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(numberOfChannels, length, sampleRate)
    const offlineSource = offlineContext.createBufferSource()
    offlineSource.buffer = buffer

    const clonedFilterChain = cloneFilterChainInContext(offlineContext)
    if(clonedFilterChain.length > 0){
      offlineSource.connect(clonedFilterChain[0])
      clonedFilterChain[clonedFilterChain.length - 1].connect(offlineContext.destination)
    }else{
      offlineSource.connect(offlineContext.destination)
    }

    return new Promise(function(resolve, reject) {
      //Using event-based rendering to provide Safari compatibility
      offlineContext.oncomplete = e => {
        const { renderedBuffer } = e
        
        const audioLeft = renderedBuffer.getChannelData(0).buffer
        const audioRight = renderedBuffer.numberOfChannels > 1 ? renderedBuffer.getChannelData(1).buffer : undefined

        const transferObjects = [audioLeft]
        audioRight && transferObjects.push(audioRight)

        const task = {
          audioLeft,
          audioRight,
          sampleRate,
          format: SAVE_FORMAT
        }

        const onCompletion = msg => {
          worker.removeEventListener("message", onCompletion)
          
          const { data: { objectURL, format } } = msg
          if(objectURL && format){
            resolve({objectURL, format})
          } else {
            reject()
          }
        }

        worker.addEventListener("message", onCompletion)
        worker.postMessage(task, transferObjects)
      }

      offlineSource.start()
      offlineContext.startRendering()
    })
  }

  save() {
    return this.render().then(({objectURL, format}) => {
      this.saveObjectURL(objectURL, format)
    })
  }

  upload(assetId, fileName, previousId, token) {
    return this.render().then(({objectURL}) =>
      fetch(objectURL).then(r => r.blob()).then((blob => {
        const formData = new FormData()
        formData.append("file", blob, fileName)

        const url = `${getApiURL()}/${API_ENTRYPOINT}/${API_RESOURCE_ASSETS}/${assetId}/${API_RESOURCE_MEDIA}`
        return fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        }).then(() => previousId ? fetch(`${url}/${previousId}`,{
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          },
        }) : Promise.resolve())
      }))
    )
  }

  // Private methods
  // #############################
  push(audioBuffer) {
    if (this.buffers.length > this.maxHistory + 1) {
      this.buffers.shift()
    }
    this.buffers.push(audioBuffer)
  }

  pop() {
    if (this.buffers.length > 1) {
      this.buffers.pop()
    }
  }

  getRegionIndexes(region, audiobuffer) {
    const { sampleRate } = audiobuffer
    const { start: startTime, end: endTime } = region

    const startSeconds = startTime
    const start = Math.floor(startSeconds * sampleRate)
    const endSeconds = endTime
    const end = Math.floor(endSeconds * sampleRate)

    return { start, end }
  }

  saveObjectURL(objectURL, format){
    var a = document.createElement("a")
    document.body.appendChild(a)
    a.style = "display: none"
    a.href = objectURL
    const extension = format === FORMAT_MP3 ? "mp3" : "wav"
    a.download = `exported.${extension}`
    a.click()
  }
}

export default AudioManager
