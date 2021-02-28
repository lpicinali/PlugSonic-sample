const filterContainer = (name, filter, enabled) => ({
  name,
  filter,
  params: {},
  enabled,
})

class FilterManager {
  constructor(audioCtx) {
    this.ac = audioCtx
    const filters = {}

    const biquadNode = audioCtx.createBiquadFilter && audioCtx.createBiquadFilter()
    const biquad = (biquadNode && filterContainer("biquad", biquadNode, false)) || null
    biquad && (filters["biquad"] = biquad)

    const compressorNode = audioCtx.createDynamicsCompressor && audioCtx.createDynamicsCompressor()
    const compressor = (compressorNode && filterContainer("compressor", compressorNode, false)) || null
    compressor && (filters["compressor"] = compressor)

    const convolverNode = audioCtx.createConvolver && audioCtx.createConvolver()
    const convolver = (convolverNode && filterContainer("convolver", convolverNode, false)) || null
    convolver && (filters["convolver"] = convolver)

    const pannerNode = audioCtx.createStereoPanner && audioCtx.createStereoPanner()
    const panner = (pannerNode && filterContainer("panner", pannerNode, false)) || null
    panner && (filters["panner"] = panner)

    this.filters = filters

    //Debug filters
    // biquad && this.debugFilter(biquad, ["frequency", "detune", "Q", "gain"])
    // compressor && this.debugFilter(compressor, ["threshold", "knee", "ratio", "attack", "release"])
    // panner && this.debugFilter(panner, ["pan"])
  }

  debugFilter(filterContainer, params){
    console.log(filterContainer.name)
    params.forEach(param => {
      console.log(param+": "+JSON.stringify(this.getMinMax(filterContainer.name,param)))
    })
    console.log(filterContainer.filter)
    console.log("")
  }

  rebuildFilterChain(){
    const chain = []
    Object.keys(this.filters).forEach(key => {
      const container = this.filters[key]
      const { params, enabled, filter } = container

      filter.disconnect()

      Object.keys(params).forEach(paramKey => {
        this.setFilterParameter(filter, paramKey, params[paramKey])
      })

      enabled && chain.push(filter)
    })

    //Connect chain elements
    chain.reduce((prev, curr) => {
      if(prev != null){
        prev.connect(curr)
      }
      return curr
    }, null)

    return chain

  }

  cloneFilterChainInContext(ctx){
    const chain = []
    Object.keys(this.filters).forEach(key => {
      const container = this.filters[key]
      const { params, enabled } = container

      if(!enabled){
        return
      }

      let node
      switch(key){
      case "biquad":
        node = ctx.createBiquadFilter()
        break
      case "compressor":
        node = ctx.createDynamicsCompressor()
        break
      case "convolver":
        node = ctx.createConvolver()
        break
      case "panner":
        node = ctx.createStereoPanner()
        break
      default:
        break
      }

      if(node == undefined){
        return
      }

      Object.keys(params).forEach(paramKey => {
        this.setFilterParameter(node, paramKey, params[paramKey])
      })

      chain.push(node)

    })

    //Connect chain elements
    chain.reduce((prev, curr) => {
      if(prev != null){
        prev.connect(curr)
      }
      return curr
    }, null)

    return chain
  }

  getAvailableFilters(){
    return Object.keys(this.filters)
  }

  isAvailable(name) {
    return this.filters[name] !== undefined
  }

  isEnabled(name) {
    return this.filters[name] && this.filters[name].enabled
  }

  setState(name, state) {
    this.filters[name].enabled = state
  }

  setParameter(filterName, parameter, value) {
    if(!value){
      return
    }

    const container = this.filters[filterName]
    container.params[parameter] = value
    this.setFilterParameter(this.filters[filterName]["filter"], parameter, value)
  }

  setFilterParameter(filter, parameter, value){
    const p = parameter.split(".")[0]
    const hasValue = parameter.split(".")[1] === "value"
    if(hasValue) {
      value && (filter[p].value = value)
    }else{
      value && (filter[p] = value)
    }
  }

  getParameter(filterName, parameter) {
    const p = parameter.split(".")[0]
    const hasValue = parameter.split(".")[1] === "value"
    if(hasValue){
      return (this.filters[filterName] && (this.filters[filterName]["filter"][p].value))
    }else{
      return (this.filters[filterName] && (this.filters[filterName]["filter"][p]))
    }
  }

  getMinMax(filter, parameter){
    const { minValue, maxValue } = this.filters[filter]["filter"][parameter]
    return {
      minValue,
      maxValue
    }
  }

  getFilters(){
    return this.rebuildFilterChain()
  }

  loadImpulseResponse(ir){
    const { ac } = this

    let irFile
    switch(ac.destination.channelCount) {
    case 2:
      irFile = ir.stereo
      break
    default:
      irFile = ir.mono
    }

    fetch(irFile)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader()

        reader.onload = () => {
          this.loadArrayBuffer(reader.result)
            .then(arrayBuffer => this.setParameter("convolver", "buffer", arrayBuffer))
        }

        reader.onError = error => {
          throw new Error(error)
        }

        reader.readAsArrayBuffer(blob)
      }).catch(error => console.log(error))
  }

  loadArrayBuffer(arrayBuffer){
    const ac = this.ac
    return new Promise(function(resolve, reject) {
      ac.decodeAudioData(arrayBuffer,
        data => {
          resolve(data)
        },
        error => {
          reject(error)
        })
    })
  }
}

export default FilterManager
