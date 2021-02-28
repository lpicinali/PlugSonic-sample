const DEVELOP_URL = "https://develop.pluggy.eu"
const BETA_URL = "https://beta.pluggy.eu"
const PRODUCTION_URL = "https://pluggy.eu"

export const API_ENTRYPOINT = "api/v1"
export const API_RESOURCE_ASSETS = "assets"
export const API_RESOURCE_MEDIA = "media"

export const getApiURL = () => {
  const { referrer } = document
  const url = new URL(referrer)

  switch (url.origin) {
  case BETA_URL:
    return BETA_URL
  case PRODUCTION_URL:
    return PRODUCTION_URL
  default:
    return DEVELOP_URL
  }
}
