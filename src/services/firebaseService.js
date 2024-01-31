// ./services/firebaseService.js

import { auth } from '../../firebaseConfig'; // importă obiectul auth din modulul Firebase

const getAxiosConfig = async () => {
  try {
    const idToken = await auth.currentUser.getIdToken();
    const config = {
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    };
    return config;
  } catch (error) {
    console.error('Eroare la obținerea configurației Axios:', error);
    throw error; // aruncă eroarea mai departe pentru a fi tratată în componentă
  }
};

export default getAxiosConfig;
