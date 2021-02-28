import { GUI_SHOW_LEFT_PANEL, GUI_HIDE_LEFT_PANEL, GUI_SHOW_RIGHT_PANEL, GUI_HIDE_RIGHT_PANEL, GUI_EMBEDDED } from "./actions"

const guiInit = {
  showLeftPanel: true,
  showRightPanel: false,
  isEmbedded: false,
}

const gui = (state = guiInit, action) => {
  switch (action.type) {
  case GUI_SHOW_LEFT_PANEL:
    return {
      ...state,
      showLeftPanel: true,
    }
  case GUI_HIDE_LEFT_PANEL:
    return {
      ...state,
      showLeftPanel: false,
    }
  case GUI_SHOW_RIGHT_PANEL:
    return {
      ...state,
      showRightPanel: true,
    }
  case GUI_HIDE_RIGHT_PANEL:
    return {
      ...state,
      showRightPanel: false,
    }
  case GUI_EMBEDDED:
    return {
      ...state,
      isEmbedded: true,
      assetId: action.assetId,
      token: action.token
    }
  default:
    return state
  }
}

export default gui
