<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <v-container class="auth-container">
    <v-row>
      <v-col>
        <v-form @submit.prevent="signInWithEmail" v-if="!isSignedIn">
          <v-divider class="mb-4"></v-divider>
          <v-h2>Sign in</v-h2>
          <v-text-field v-model="email" label="Email" required></v-text-field>
          <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
          <v-row>
            <v-col>
              <v-btn type="submit" color="primary">Sign in</v-btn>
            </v-col>
          </v-row>
          <v-divider class="mt-4"></v-divider>
          <v-alert v-if="submittedSignIn && !validatePassword(password)" type="error" dense>
            Password must be at least 6 characters.
          </v-alert>
          <v-alert v-if="signInError" type="error" dense>
            {{ signInError }}
          </v-alert>
        </v-form>
      </v-col>

      <v-col>
        <v-form @submit.prevent="registerWithEmail" v-if="!isSignedIn">
          <v-divider class="mb-4"></v-divider>
          <v-h2>Register</v-h2>
          <v-text-field v-model="registerEmail" label="Email" required></v-text-field>
          <v-text-field v-model="registerPassword" label="Password" type="password" required></v-text-field>
          <v-row>
            <v-col>
              <v-btn type="submit" color="primary">Register</v-btn>
            </v-col>
          </v-row>
          <v-divider class="mt-4"></v-divider>
          <v-alert v-if="submittedRegister && !validatePassword(registerPassword)" type="error" dense>
            Password must be at least 6 characters.
          </v-alert>
          <v-alert v-if="registerError" type="error" dense>
            {{ registerError }}
          </v-alert>
        </v-form>

        <v-btn @click="signOut" v-if="isSignedIn" color="primary">Sign out</v-btn>
      </v-col>
    </v-row>
  </v-container>
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
      isSignedIn: false,
    };
  },
  methods: {
    async signInWithEmail() {
      this.signInError = "";

      if (!this.validateEmail(this.email) || !this.validatePassword(this.password)) {
        console.error("Invalid email or password");
        this.signInError = "Invalid email or password.";
        this.submittedSignIn = true;
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        console.log("User signed in successfully with email and password!");
      } catch (error) {
        console.error("Error signing in with email and password:", error.message);
        if (error.code === "auth/invalid-credential") {
          this.signInError = "Email address does not exist.";
        } else {
          this.signInError = "Error signing in.";
        }
      }
    },
    async signOut() {
      try {
        await signOut(auth);
        console.log("User signed out successfully!");
      } catch (error) {
        console.error("Error signing out:", error.message);
      }
    },
    async registerWithEmail() {
      this.registerError = "";

      if (!this.validateEmail(this.registerEmail) || !this.validatePassword(this.registerPassword)) {
        console.error("Invalid email or password");
        this.registerError = "Invalid email or password.";
        this.submittedRegister = true;
        return;
      }

      try {
        await createUserWithEmailAndPassword(
          auth,
          this.registerEmail,
          this.registerPassword
        );
        console.log("User registered successfully with email and password!");
      } catch (error) {
        console.error(
          "Error registering with email and password:",
          error.code,
          error.message
        );

        if (error.code === "auth/email-already-in-use") {
          this.registerError = "Email address is already registered.";
        } else {
          this.registerError = "Error registering.";
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
  created() {
    // Adaugă un observator pentru a verifica dacă utilizatorul este autentificat
    auth.onAuthStateChanged((user) => {
      this.isSignedIn = !!user;
    });
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 900px;
}
</style>
