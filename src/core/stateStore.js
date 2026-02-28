let state = {
  rawData: {},
  filteredData: {},
  filters: {
    month: null,
    startDate: null,
    endDate: null
  }
};

export const stateStore = {
  getState() {
    return state;
  },

  setRawData(data) {
    state.rawData = data;
  },

  setFilteredData(data) {
    state.filteredData = data;
  },

  setFilter(key, value) {
    state.filters[key] = value;
  }
};
