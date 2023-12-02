<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div class="auth-container">
    <form @submit.prevent="signInWithEmail">
      <h2>Sign in</h2>
      <div class="auth-section">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required />
          <div v-if="submittedSignIn && !validatePassword(password)" class="error-message">
            Parola trebuie să aibă cel puțin 6 caractere.
          </div>
          <div v-if="signInError" class="error-message">
            {{ signInError }}
          </div>
        </div>
        <button type="submit" @click="submittedSignIn = true">Sign in</button>
      </div>
    </form>

    <form @submit.prevent="registerWithEmail">
      <h2>Register</h2>
      <div class="auth-section">
        <div class="form-group">
          <label for="registerEmail">Email:</label>
          <input type="email" v-model="registerEmail" id="registerEmail" required />
        </div>
        <div class="form-group">
          <label for="registerPassword">Password:</label>
          <input type="password" v-model="registerPassword" id="registerPassword" required />
          <div v-if="submittedRegister && !validatePassword(registerPassword)" class="error-message">
            Parola trebuie să aibă cel puțin 6 caractere.
          </div>
          <div v-if="registerError" class="error-message">
            {{ registerError }}
          </div>
        </div>
        <button type="submit" @click="submittedRegister = true">Log in</button>
      </div>
    </form>
  </div>
  <button @click="signOut">Sign out</button>
</template>

<script>
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default {
  data() {
    return {
      email: "",
      password: "",
      registerEmail: "",
      registerPassword: "",
      submittedSignIn: false,
      submittedRegister: false,
      signInError: "",
      registerError: "",
    };
  },
  methods: {
    async signInWithEmail() {
      this.signInError = "";

      if (!this.validateEmail(this.email) || !this.validatePassword(this.password)) {
        console.error("Adresa de email sau parola invalidă");
        this.submittedSignIn = true;
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        console.log("Utilizator autentificat cu succes cu email și parolă!");
      } catch (error) {
        console.error(
          "Eroare la autentificare cu email și parolă:",
          error.message
        );
        console.log(error.code)
        if (error.code === "auth/invalid-credential") {
          this.signInError = "Adresa de email nu există.";
        } else {
          this.signInError = "Eroare la autentificare.";
        }
      }
    },
    async signOut() {
      try {
        await signOut(auth);
        console.log("Utilizator deconectat cu succes!");
      } catch (error) {
        console.error("Eroare la deconectare:", error.message);
      }
    },
    async registerWithEmail() {
      this.registerError = "";

      if (!this.validateEmail(this.registerEmail) || !this.validatePassword(this.registerPassword)) {
        console.error("Adresa de email sau parola invalidă");
        this.submittedRegister = true;
        return;
      }

      try {
        await createUserWithEmailAndPassword(
          auth,
          this.registerEmail,
          this.registerPassword
        );
        console.log("Utilizator înregistrat cu succes cu email și parolă!");
      } catch (error) {
        console.error(
          "Eroare la înregistrare cu email și parolă:",
          error.code,
          error.message
        );

        // Verifică dacă eroarea este email-already-in-use
        if (error.code === "auth/email-already-in-use") {
          this.registerError = "Adresa de email este deja înregistrată.";
        } else {
          this.registerError = "Eroare la înregistrare.";
        }
      }
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    validatePassword(password) {
      return password.length >= 6;
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center; /* Aliniază pe axa orizontală */
  align-items: center; /* Aliniază pe axa verticală */
}
.auth-section {
  margin: 0 50px; /* Adaugă un spațiu între secțiuni */
}
.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  width: 10%; /* Face eticheta să ocupe întreaga lățime */
  text-align: left; /* Aliniază textul la stânga */
  margin-bottom: 5px; /* Adaugă spațiu între label și input */
}

.form-group input {
  box-sizing: border-box; /* Include și padding-ul și border-ul în lățimea totală */
  width: 310px;
}

.error-message {
  color: red;
  margin-top: 5px;
}
</style>
