import lamejs from "lamejs"
import { FORMAT_MP3, FORMAT_WAV, MP3_ENCODER_BLOCK_SIZE, MP3_ENCODE_KBPS } from "./constants"

onmessage = (msg) => {
  const { data: { audioLeft, audioRight, sampleRate, format } } = msg

  const numberOfChannels = audioRight ? 2 : 1
  switch(format){
  case FORMAT_MP3:
    encodeAsMp3(audioLeft, audioRight, numberOfChannels, sampleRate)
    break
  default:
    encodeAsWav(audioLeft, audioRight, numberOfChannels, sampleRate)
  }
  
}

const encodeAsMp3 = (leftChannelBuffer, rightChannelBuffer, numberOfChannels, sampleRate) => {
  const leftChannelData = new Float32Array(leftChannelBuffer)
  const rightChannelData = new Float32Array(rightChannelBuffer)

  const mp3encoder = new lamejs.Mp3Encoder(numberOfChannels, sampleRate, MP3_ENCODE_KBPS)
  const mp3data = []
  let i = 0

  do {
    let leftChunk = leftChannelData.subarray(i, i + MP3_ENCODER_BLOCK_SIZE).map(d => floatValueTo16BitPCM(d))
    let rightChunk = rightChannelData && rightChannelData.subarray(i, i + MP3_ENCODER_BLOCK_SIZE).map(d => floatValueTo16BitPCM(d))

    let mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk)
    if(mp3buf.length>0){
      mp3data.push(mp3buf)
    }

    i += MP3_ENCODER_BLOCK_SIZE

  } while (i<leftChannelData.length)

  mp3data.push(mp3encoder.flush())

  const blob = new Blob(mp3data, {
    type: "audio/mp3"
  })
  const objectURL = URL.createObjectURL(blob)
  
  const result = {
    objectURL: objectURL,
    format: FORMAT_MP3
  }

  self.postMessage(result)
}

const encodeAsWav = (leftChannelBuffer, rightChannelBuffer, numberOfChannels, sampleRate) => {
  const leftChannelData = new Float32Array(leftChannelBuffer)
  const rightChannelData = new Float32Array(rightChannelBuffer)

  let data
  if (numberOfChannels === 2) {
    data = interleave(leftChannelData, rightChannelData)
  } else {
    data = leftChannelData
  }

  const wav = encodeWAV(data, 3, sampleRate, numberOfChannels, 32)
  var blob = new Blob([ new DataView(wav) ], {
    type: "audio/wav"
  })
  const objectURL = URL.createObjectURL(blob)

  const result = {
    objectURL: objectURL,
    format: FORMAT_WAV
  }

  self.postMessage(result)
}

/**
 * Code inspired by Recorder.js
 * https://github.com/mattdiamond/Recorderjs/blob/master/src/recorder.js
 */
function encodeWAV (samples, format, sampleRate, numChannels, bitDepth) {
  var bytesPerSample = bitDepth / 8
  var blockAlign = numChannels * bytesPerSample

  var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  var view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, "RIFF")
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  /* RIFF type */
  writeString(view, 8, "WAVE")
  /* format chunk identifier */
  writeString(view, 12, "fmt ")
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw) */
  view.setUint16(20, format, true)
  /* channel count */
  view.setUint16(22, numChannels, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true)
  /* bits per sample */
  view.setUint16(34, bitDepth, true)
  /* data chunk identifier */
  writeString(view, 36, "data")
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true)
  if (format === 1) { // Raw PCM
    floatTo16BitPCM(view, 44, samples)
  } else {
    writeFloat32(view, 44, samples)
  }

  return buffer
}

function interleave (inputL, inputR) {
  var length = inputL.length + inputR.length
  var result = new Float32Array(length)

  var index = 0
  var inputIndex = 0

  while (index < length) {
    result[index++] = inputL[inputIndex]
    result[index++] = inputR[inputIndex]
    inputIndex++
  }
  return result
}

function writeFloat32 (output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true)
  }
}

function floatTo16BitPCM (output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    output.setInt16(floatValueTo16BitPCM(input[i]), true)
  }
}

const floatValueTo16BitPCM = (input) => {
  var s = Math.max(-1, Math.min(1, input))
  return s < 0 ? s * 0x8000 : s * 0x7FFF
}

function writeString (view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}