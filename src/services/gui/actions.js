export const GUI_HIDE_LEFT_PANEL = "GUI/HIDE_LEFT_PANEL"
export const GUI_SHOW_LEFT_PANEL = "GUI/SHOW_LEFT_PANEL"
export const GUI_HIDE_RIGHT_PANEL = "GUI/HIDE_RIGHT_PANEL"
export const GUI_SHOW_RIGHT_PANEL = "GUI/SHOW_RIGHT_PANEL"
export const GUI_EMBEDDED = "GUI/EMBEDDED"

export const showLeftPanel = () => ({
  type: GUI_SHOW_LEFT_PANEL,
})

export const hideLeftPanel = () => ({
  type: GUI_HIDE_LEFT_PANEL,
})

export const showRightPanel = () => ({
  type: GUI_SHOW_RIGHT_PANEL,
})

export const hideRightPanel = () => ({
  type: GUI_HIDE_RIGHT_PANEL,
})

export const switchToEmbedded = (assetId, token) => ({
  type: GUI_EMBEDDED,
  assetId,
  token
})
