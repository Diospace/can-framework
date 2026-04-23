"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiCreateApp_1 = require("../src/runtime-core/apiCreateApp");
const Store_1 = require("../src/store/Store");
const persistence_1 = require("../src/store/persistence");
const App_can_1 = require("./App.can"); // Point to the source .can file
// 1. Initialize the Store
const store = (0, Store_1.createStore)({
    state: () => ({
        count: 0,
        theme: 'light'
    }),
    mutations: {
        increment(state) {
            state.count++;
        }
    }
});
// 2. Enable Persistence for the 'count' property
// This ensures the counter stays synced across page reloads
const persist = (0, persistence_1.createPersistencePlugin)('can-website-data', ['count']);
persist(store);
// 3. Create and Mount the App
const app = (0, apiCreateApp_1.createApp)(App_can_1.CanApp);
app.use(store);
app.mount('#app');
