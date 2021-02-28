import { expect } from "chai"
import AudioEditor from "./AudioEditor"

class MockAudioBuffer {
  constructor(numberOfChannels = 2, length = 6, sampleRate = 1){
    this.numberOfChannels = numberOfChannels
    this.channelData = [Float32Array.from(Array(length).keys()), Float32Array.from(Array(length).keys())]
    this.sampleRate = sampleRate
    this.length = length
  }

  getChannelData = channel => this.channelData[channel]

}

const mockAudioContext = {
  createBuffer: (numberOfChannels, length, sampleRate) => new MockAudioBuffer(numberOfChannels, length, sampleRate)
}

describe("AudioEditor", function() {
  it("should init with provided AudioContext", function() {
    const ae = new AudioEditor(mockAudioContext)

    expect(ae.ac).to.equal(mockAudioContext)
  })

  it("should create a copy of a buffer", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()

    const dst = ae.cloneBuffer(src)
    expect(src).to.not.equal(dst)
  })

  it("should create a copy of a buffer with a different length", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()

    const dst = ae.cloneBuffer(src, 2*src.length)
    expect(dst.length).to.equal(src.length*2)
  })

  it("should create a copy of a buffer longer than source and filled with 0", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()

    const dst = ae.cloneBuffer(src, 2*src.length)
    expect(dst.getChannelData(0)[src.length]).to.equal(0)
  })

  it("should create a copy of a buffer shorter than source and truncated", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const newLength = 0.5 * src.length

    const dst = ae.cloneBuffer(src, newLength)
    expect(dst.length).to.equal(newLength)
    expect(dst.getChannelData(0)[dst.length-1]).to.equal(src.getChannelData(0)[newLength-1])
  })
})

describe("AudioEditor arrays", function() {
  it("should insert samples at the end", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const srcAD = src.getChannelData(0)
    const dst = ae.insertSamples(srcAD, [9,8])
    expect([dst[6], dst[7]]).to.deep.equal([9,8])
    expect(dst.slice(0,6)).to.deep.equal(srcAD.slice(0,6))
  })

  it("should insert samples in middle", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const srcAD = src.getChannelData(0)

    const dst = ae.insertSamples(srcAD, [9,8], 2)
    expect(dst.slice(2,4)).to.deep.equal(Float32Array.from([9,8]))
    expect(dst.slice(0,2)).to.deep.equal(srcAD.slice(0,2))
    expect(dst.slice(4,7)).to.deep.equal(srcAD.slice(2,5))
  })

  it("should insert silence at the end", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const srcAD = src.getChannelData(0)

    const dst = ae.insertSilence(srcAD, 2)
    expect(dst.slice(6,8)).to.deep.equal(Float32Array.from([0,0]))
    expect(dst.slice(0,6)).to.deep.equal(srcAD.slice(0,6))
  })

  it("should insert silence in middle", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const srcAD = src.getChannelData(0)

    const dst = ae.insertSilence(srcAD, 2, 2)
    expect(dst.slice(2,4)).to.deep.equal(Float32Array.from([0,0]))
    expect(dst.slice(0,2)).to.deep.equal(srcAD.slice(0,2))
    expect(dst.slice(4,7)).to.deep.equal(srcAD.slice(2,5))
  })

  it("should swap samples", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const ctl = ae.cloneBuffer(src)
    const srcCD = src.getChannelData(0)
    const ctlCD = ctl.getChannelData(0)
    ae.swapSamples(ctlCD, 1, 2)
    expect([srcCD[1],srcCD[2]]).to.deep.equal([ctlCD[2],ctlCD[1]])
  })

  it("should swap regions", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const ctl = ae.cloneBuffer(src)

    const srcCD = src.getChannelData(0)
    const ctlCD = ctl.getChannelData(0)
    ae.swapRegion(ctlCD, 1, 2, 3)
    expect([srcCD[1],srcCD[2]]).to.deep.equal([ctlCD[3],ctlCD[4]])
  })

  it("should cut samples", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const srcCD = src.getChannelData(0)
    const dstCD = ae.cutSamples(srcCD, 2, 4)
    expect(dstCD.slice(2,4)).to.deep.equal(srcCD.slice(4,6))
    expect(dstCD.length).to.equal(4)
  })

  it("should copy samples", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const srcCD = src.getChannelData(0)

    const copied = ae.copySamples(srcCD, 2, 4)
    srcCD[2] = 9
    expect(copied).to.deep.equal(Float32Array.from([2, 3]))
    expect(srcCD.length).to.equal(6)
  })

  it("should paste samples, mixing values", () => {
    const ae = new AudioEditor(mockAudioContext, 2)
    const src = mockAudioContext.createBuffer(1, 6, 1)
    const dst = mockAudioContext.createBuffer(1, 4, 1)
    src.channelData = [Float32Array.from([10, 10, 10, 10, 10, 10])]
    dst.channelData = [Float32Array.from([0, 0, 0, 0])]
    const mixed = ae.paste(src, dst, 2)
    expect(mixed.getChannelData(0)).to.deep.equal(Float32Array.from([10, 5, 0, 5, 10, 10]))
  })

})

describe("AudioEditor AudioBuffer", function() {
  it("should mute a region", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const dst = ae.mute(src, 2, 4)
    const dstCD = dst.getChannelData(0)
    expect(dstCD.slice(2, 4)).to.deep.equal(Float32Array.from([0, 0]))
  })

  it("should fade in a region", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const dst = ae.fade(src, 0, 2, 0)
    const dstCD = dst.getChannelData(0)
    expect(dstCD.slice(0, 3)).to.deep.equal(Float32Array.from([0, 0.5, 2]))
  })

  it("should fade out a region", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const dst = ae.fade(src, 3, 5, 1)
    const dstCD = dst.getChannelData(0)
    expect(dstCD.slice(4, 6)).to.deep.equal(Float32Array.from([2, 0]))
  })

  it("should cut a region", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const dst = ae.cut(src, 0, 2)
    const dstCD = dst.getChannelData(0)
    expect(dstCD.length).to.equal(4)
    expect(dstCD.slice(0, 2)).to.deep.equal(Float32Array.from([2, 3]))
  })

  it("should copy a region", () => {
    const ae = new AudioEditor(mockAudioContext)
    const src = mockAudioContext.createBuffer()
    const dst = ae.copy(src, 2, 4)
    const dstCD = dst.getChannelData(0)
    expect(dstCD.length).to.equal(2)
    expect(dstCD).to.deep.equal(Float32Array.from([2, 3]))
  })

  it("should paste a region", () => {
    const ae = new AudioEditor(mockAudioContext, 2)
    const srcA = mockAudioContext.createBuffer(1, 6, 300)
    const srcB = mockAudioContext.createBuffer(1, 6, 300)

    srcA.channelData = [Float32Array.from([4, 4, 4, 4, 4, 4])]
    srcB.channelData = [Float32Array.from([0, 0, 0, 0, 0, 0])]
    const dst = ae.paste(srcA, srcB, 2)
    const dstCD = dst.getChannelData(0)
    expect(dstCD).to.deep.equal(Float32Array.from([4, 2, 0, 0, 0, 2, 4, 4]))
  })
})
