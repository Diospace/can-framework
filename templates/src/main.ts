import { createApp } from '@decaspace/can-framework';
import { App } from './App.can';

const app = createApp(App);
app.mount('#app');