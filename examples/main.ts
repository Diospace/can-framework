import { createApp } from '../src/runtime-core/apiCreateApp';
import { createStore } from '../src/store/Store';
import { createPersistencePlugin } from '../src/store/persistence';
import { CanApp } from './App.can'; // Point to the source .can file


// 1. Initialize the Store
const store = createStore({
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
const persist = createPersistencePlugin('can-website-data', ['count']);
persist(store);

// 3. Create and Mount the App
const app = createApp(CanApp); 

app.use(store);
app.mount('#app');