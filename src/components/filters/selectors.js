import { createSelector } from "reselect"

const getFilters = state => state.filters

export const enabledFiltersSelector = createSelector(
  [getFilters],
  filters => {
    const enabled = Object.keys(filters).reduce((prev, key) => {
      const { enabled } = filters[key]
      enabled && prev.push(key)
      return prev
    }, [])
    return enabled
  }
)
