import { createLocalStorageAdapter } from "./src/persistence/localStorageAdapter.js";
import { createStore } from "./src/store/createStore.js";
import { createAppUI } from "./src/ui/createAppUI.js";

const adapter = createLocalStorageAdapter({
  key: "livify_state_v3",
  fallbackKeys: ["livify_state_v2", "livify_state_v1"],
});

let ui = null;

const store = createStore({
  adapter,
  onChange: (state) => {
    if (!ui) return;
    ui.render(state);
  },
});

ui = createAppUI({ store });
