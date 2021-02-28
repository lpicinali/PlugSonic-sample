const MIX_SAMPLES = 220

class AudioEditor {
  constructor(audioContext, mixDuration) {
    this.ac = audioContext
    this.mixDuration = mixDuration || MIX_SAMPLES
  }

  // Public methods
  // ###########################################
  // All following methods return a new AudioBuffer object

  mute(audioBuffer, from, to) {
    const destination = this.cloneBuffer(audioBuffer)
    for(let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const channelData = destination.getChannelData(c)
      this.muteRegion(channelData, from, to)
    }
    return destination
  }

  fade(audioBuffer, from, to, out) {
    const destination = this.cloneBuffer(audioBuffer)
    for(let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const channelData = destination.getChannelData(c)
      //TODO: move in fadeRegion method
      for (var i = from; i <= to; i++) {
        const multiplier = (i - from) / (to - from)
        channelData[i] *= out ? 1-multiplier : multiplier
      }
    }
    return destination
  }

  cut(audioBuffer, from, to) {
    const length = audioBuffer.length - (to - from)
    const destination = this.ac.createBuffer(audioBuffer.numberOfChannels, length, audioBuffer.sampleRate)
    for(let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const channelData = audioBuffer.getChannelData(c)
      const destinationChannelData = destination.getChannelData(c)
      this.cutSamples(channelData, from, to, destinationChannelData)
    }
    return destination
  }

  copy(audioBuffer, from, to) {
    const length = to - from
    const destination = this.ac.createBuffer(audioBuffer.numberOfChannels, length, audioBuffer.sampleRate)
    for(let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const channelData = audioBuffer.getChannelData(c)
      const destinationChannelData = destination.getChannelData(c)
      this.copySamples(channelData, from, to, destinationChannelData)
    }
    return destination
  }

  paste(audioBuffer, source, from) {
    this.checkAudioBufferFormat(audioBuffer, source)
    const length = audioBuffer.length + source.length
    const destination = this.ac.createBuffer(audioBuffer.numberOfChannels, length, audioBuffer.sampleRate)
    for(let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const channelData = audioBuffer.getChannelData(c)
      const sourceChannelData = source.getChannelData(c)
      const destinationChannelData = destination.getChannelData(c)
      this.spliceSamples(channelData, destinationChannelData, from, 0, sourceChannelData)
    }
    const mixStart = this.mix(destination, from, this.mixDuration)
    const mixEnd = this.mix(mixStart, from + source.length - this.mixDuration, this.mixDuration)
    return mixEnd
  }

  mix(audioBuffer, from, length) {
    if(from < length){
      throw new Error("Mix out of bound exception")
    }
    const bufferLength = audioBuffer.length - length
    const destination = this.ac.createBuffer(audioBuffer.numberOfChannels, bufferLength, audioBuffer.sampleRate)
    for(let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const channelData = audioBuffer.getChannelData(c)
      const destinationChannelData = destination.getChannelData(c)
      this.mixSamples(channelData, destinationChannelData, from, length)
    }
    return destination
  }

  // Private methods
  // #############################
  // Float32Array Operations
  // All methods that change the array size return a new object

  insertSamples(source, samples, from = 0, destination) {
    const start = from || source.length
    const length = source.length + samples.length
    const dst = destination || new Float32Array(length)

    this.spliceSamples(source, dst, start, 0, samples)
    return dst
  }

  insertSilence(source, n_samples, from) {
    const start = from || source.length
    const samples = new Float32Array(n_samples).fill(0)
    return this.insertSamples(source, samples, start)
  }

  swapSamples(source, from, to) {
    this.checkIndexBoundaries(source.length, from, to)
    const tmp = source[to]
    source[to] = source[from]
    source[from] = tmp
  }

  swapRegion(source, from, length, to) {
    this.checkIndexBoundaries(source.length, from + length, to)
    for(let i=0; i<length; i++) {
      this.swapSamples(source, from+i, to+i)
    }
  }

  muteRegion(source, from, to) {
    this.checkIndexBoundaries(source.length, from, to)
    for(let i = from; i < to; i++){
      source[i] = 0
    }
  }

  cutSamples(source, from, to, destination) {
    this.checkIndexBoundaries(source.length, from, to)
    const drop = to - from
    const length = source.length - drop
    const dst = destination || new Float32Array(length)
    this.spliceSamples(source, dst, from, drop)
    return dst
  }

  copySamples(source, from, to, destination) {
    this.checkIndexBoundaries(source.length, from, to)
    const dst = destination || new Float32Array(to - from)
    return source.slice(from, to).map((s,i) => dst[i]=s)
  }

  spliceSamples(source, destination, from, del, newSamples = []) {
    const length = source.length - del + newSamples.length

    let head = 0
    let tail = 0
    let added = 0
    let drop = del

    while(head < length){
      if(head >= from){
        if(drop > 0){
          tail++
          drop--
          continue
        }
        if(added<newSamples.length){
          destination[head++] = newSamples[added++]
          continue
        }
        if(tail > source.length) {
          destination[head++] = 0
          continue
        }
      }
      destination[head++] = source[tail++]
    }
  }


  mixSamples(channelData, destinationChannelData, from, length) {
    const grad = 1.0 / length

    let i = 0
    let j = length
    let tail = 0

    while(tail<destinationChannelData.length){
      const a = channelData[j]
      const b = channelData[i]
      const mul = Math.min(Math.max(0, (i - from + length) * grad), 1)
      destinationChannelData[tail++] = mul * a + (1 - mul) * b
      i++
      j++
    }
  }

  // Utils
  // #######

  cloneBuffer(source, newLength) {
    /**
     * @param {AudioBuffer} audioBuffer The source AudioBuffer
     * @param {number} newLength Specify a new lenght for the cloned AudioBuffer.
     It will be extended with silence at the end if newLength > audiobuffer.length
     and truncated if newLength < audiobuffer.length
     * @returns {AudioBuffer} a copy of the source AudioBuffer
     */
    const length = newLength || source.length
    const destination = this.ac.createBuffer(source.numberOfChannels, length, source.sampleRate)

    for(let channel = 0; channel < source.numberOfChannels; channel++){
      const sourceAudioData = source.getChannelData(channel)
      const destinationAudioData = destination.getChannelData(channel)
      for(let i = 0; i < length; i++){
        destinationAudioData[i] = sourceAudioData[i] || 0
      }
    }
    return destination
  }

  checkIndexBoundaries(length, min, max){
    if(min < 0 || max > length || max < min){
      throw new Error("Index out of bounds exception")
    }
  }

  checkAudioBufferFormat(source, destination){
    const { numberOfChannels, sampleRate } = source
    if(destination.numberOfChannels != numberOfChannels){
      throw new Error("Index numberOfChannels mismatch exception")
    }
    if(destination.sampleRate != sampleRate){
      throw new Error("SampleRate mismatch exception")
    }
  }

}

export default AudioEditor
