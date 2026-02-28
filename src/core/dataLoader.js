import { SHEETS } from "../config/sheetConfig.js";
import { stateStore } from "./stateStore.js";
import { eventBus } from "./eventBus.js";

export async function loadAllData() {
  eventBus.emit("DATA_LOADING_START");

  const result = {};

  for (const domain in SHEETS) {
    result[domain] = {};

    for (const sheet in SHEETS[domain]) {
      const url = SHEETS[domain][sheet];

      const response = await fetch(url);
      const text = await response.text();

      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true
      });

      result[domain][sheet] = parsed.data;
    }
  }

  stateStore.setRawData(result);
  stateStore.setFilteredData(result);

  eventBus.emit("DATA_LOADING_COMPLETE");
}
