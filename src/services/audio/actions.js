import AudioManager from "./AudioManager"
import FilterManager from "./FilterManager"

const ctx = new (window.AudioContext || window.webkitAudioContext)()
const audioManager = new AudioManager(ctx)
const filterManager = new FilterManager(ctx)

export const getContext = () => ctx
export const getAudioBuffer = () => audioManager.peek()
export const load = arrayBuffer => audioManager.load(arrayBuffer)
export const hasHistory = () => audioManager.hasHistory()
export const undo = () => audioManager.undo()
export const mute = region => audioManager.mute(region)
export const fadeIn = region => audioManager.fade(region, false)
export const fadeOut = region => audioManager.fade(region, true)
export const cut = region => audioManager.cut(region)
export const copy = region => audioManager.copy(region)
export const hasClipboard = () => audioManager.hasClipboard()
export const paste = seek => audioManager.paste(seek)
export const save = () => audioManager.save()
export const upload = (assetId, fileName, previousId, token) => audioManager.upload(assetId, fileName, previousId, token)

export const getAvailableFilters = () => filterManager.getAvailableFilters()
export const isAvailable = filterName =>  filterManager.isAvailable(filterName)
export const isEnabled = filterName =>  filterManager.isEnabled(filterName)
export const setFilterState = (filterName, state) => filterManager.setState(filterName, state)
export const setFilterParameter = (filterName, parameter, value) => filterManager.setParameter(filterName, parameter, value)
export const getParameter = (filterName, parameter) => filterManager.getParameter(filterName, parameter)
export const setParameter = (filterName, parameter, value) => filterManager.setParameter(filterName, parameter, value)
export const getMinMax = (filter, parameter) => filterManager.getMinMax(filter, parameter)
export const getFilters = () => filterManager.getFilters()
export const loadImpulseResponse = ir => filterManager.loadImpulseResponse(ir)
export const cloneFilterChainInContext = ctx => filterManager.cloneFilterChainInContext(ctx)
