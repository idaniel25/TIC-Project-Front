import { createApp } from 'vue';
import App from './App.vue';
import firebase from 'firebase/app';
import 'firebase/firestore';

const app = createApp(App);

const firebaseConfig = {
    apiKey: "AIzaSyDoNuL0andjEGg_SeGFkp38zMqw5RzQzIc",
    authDomain: "tic-project-9df42.firebaseapp.com",
    projectId: "tic-project-9df42",
    storageBucket: "tic-project-9df42.appspot.com",
    messagingSenderId: "122907587232",
    appId: "1:122907587232:web:21cd4d509f33d463374fc5"
};

firebase.initializeApp(firebaseConfig);

app.mount('#app');
