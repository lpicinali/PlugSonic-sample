import { createSelector } from "reselect"

export const guiSelector = state => state.gui

export const showLeftSelector = createSelector(
  [guiSelector],
  gui => gui.showLeftPanel
)

export const showRightSelector = createSelector(
  [guiSelector],
  gui => gui.showRightPanel
)

export const isEmbeddedSelector = createSelector(
  [guiSelector],
  gui => gui.isEmbedded
)

export const embeddedParamsSelector = createSelector(
  [guiSelector],
  gui => ({ assetId: gui.assetId, token: gui.token })
)