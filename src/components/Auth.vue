<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <v-container v-if="!isSignedIn">
    <v-row justify="center">
      <v-col cols="12" sm="10">
        <v-card class="elevation-6 mt-10">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" md="6">
                  <v-form
                    ref="signInForm"
                    @submit.prevent="signInWithEmail"
                  >
                    <v-card-text class="mt-8">
                      <h4 class="text-h4 text-green">
                        Login in to Your Account
                      </h4>
                      <v-row justify="center">
                        <v-col cols="12" sm="8">
                          <v-text-field
                            v-model="email"
                            label="Email"
                            outlined
                            dense
                            color="green"
                            autocomplete="false"
                            class="mt-16"
                            required
                            :rules="signInRules.email"
                          />
                          <v-text-field
                            v-model="password"
                            label="Password"
                            outlined
                            dense
                            color="green"
                            autocomplete="false"
                            type="password"
                            required
                            :rules="signInRules.password"
                          />
                          <v-row>
                            <v-col cols="12" sm="7">
                              <v-checkbox
                                label="Remember Me"
                                class="mt-n1"
                                color="green"
                              >
                              </v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="5">
                              <span class="caption text-green"
                                >Forgot password</span
                              >
                            </v-col>
                          </v-row>
                          <v-btn color="green" type="submit" dark block tile
                            >Log in</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-form>
                </v-col>
                <v-col cols="12" md="6" class="bg-green rounded-bl-xl">
                  <div style="text-align: center; padding: 200px 0">
                    <v-card-text class="text-h5">
                      <h3>Don't Have an Account Yet?</h3>
                    </v-card-text>
                    <div>
                      <v-btn tile outlined dark @click="step++">SIGN UP</v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row>
                <v-col cols="12" md="6" class="bg-green rounded-br-xl">
                  <div style="text-align: center; padding: 180px 0">
                    <v-card-text class="text-white text-h5 pt-16">
                      <h3>Already Signed up?</h3>
                    </v-card-text>
                    <div class="pt-6">
                      <v-btn tile outlined dark @click="step--">Log in</v-btn>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <v-form
                    ref="registerForm"
                    @submit.prevent="registerWithEmail"
                  >
                    <v-card-text class="mt-12 text-h6">
                      <h4 class="text-center text-green">
                        Sign Up for an Account
                      </h4>
                      <v-row justify="center">
                        <v-col cols="12" sm="8">
                          <v-text-field
                            v-model="registerName"
                            label="Name"
                            outlined
                            dense
                            color="green"
                            autocomplete="false"
                            class="mt-4"
                            :rules="registerRules.registerName"
                          />

                          <v-text-field
                            v-model="registerEmail"
                            label="Email"
                            outlined
                            dense
                            color="green"
                            autocomplete="false"
                            :rules="registerRules.registerEmail"
                          />
                          <v-text-field
                            v-model="registerPassword"
                            label="Password"
                            outlined
                            dense
                            color="green"
                            autocomplete="false"
                            type="password"
                            :rules="registerRules.registerPassword"
                          />
                          <v-row>
                            <v-col cols="12" sm="8">
                              <v-checkbox
                                label="I Accept Terms and Conditions"
                                class="mt-n1"
                                color="green"
                              >
                              </v-checkbox>
                            </v-col>
                          </v-row>
                          <v-btn
                            color="green"
                            dark
                            block
                            tile
                            class="mb-11"
                            @click="registerWithEmail"
                            >Sign up</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-form>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
</template>

<script>
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import axios from "axios";

export default {
  data() {
    return {
      step: 1,
      email: "",
      password: "",
      registerName: "",
      registerEmail: "",
      registerPassword: "",
      isSignedIn: false,
      signInRules: {
        email: [
          (v) => !!v || "Email is required",
          (v) => this.validateEmail(v) || "Invalid email address",
        ],
        password: [
          (v) => !!v || "Password is required",
          (v) =>
            this.validatePassword(v) ||
            "Password must be at least 6 characters",
        ],
      },
      registerRules: {
        registerName: [
          (v) => !!v || "Name is required",
          (v) =>
            this.validateName(v) ||
            "Name must be at least 3 characters and contains only letters",
        ],
        registerEmail: [
          (v) => !!v || "Email is required",
          (v) => this.validateEmail(v) || "Invalid email address",
        ],
        registerPassword: [
          (v) => !!v || "Password is required",
          (v) =>
            this.validatePassword(v) ||
            "Password must be at least 6 characters",
        ],
      },
    };
  },
  methods: {
    async signInWithEmail() {
      // Resetează regulile la începutul fiecărei încercări de login
      this.$refs.signInForm.resetValidation();
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        console.log("User signed in successfully with email and password!");
        // Emite evenimentul personalizat către părintele componentei
        this.$emit("user-logged", auth.currentUser);
      } catch (error) {
        console.log(error);
        console.error(
          "Error signing in with email and password:",
          error.message
        );

        // Verificăm dacă eroarea este specifică lipsei de existență a utilizatorului
        if (error.code === "auth/invalid-credential") {
          this.signInRules.password.push("Invalid email or password.");
          this.signInRules.email.push("Invalid email or password.");
          this.$refs.signInForm.validate();
        }
      }
    },
    async registerWithEmail() {
      this.$refs.registerForm.resetValidation();
      try {
        await createUserWithEmailAndPassword(
          auth,
          this.registerEmail,
          this.registerPassword
        );

        const user = auth.currentUser;

        // Actualizează profilul utilizatorului cu numele introdus
        await updateProfile(user, {
          displayName: this.registerName,
        });
        await axios.post('http://localhost:3000/generate-data', { user_id: auth.currentUser.uid });
        this.$emit("user-registered", auth.currentUser);
        this.$store.dispatch("fetchTeams", { userId: auth.currentUser.uid });
        this.$store.dispatch("fetchPlayers", { userId: auth.currentUser.uid });
        console.log("User registered successfully with email and password!");
      } catch (error) {
        console.error(
          "Error registering with email and password:",
          error.code,
          error.message
        );

        if (error.code === "auth/email-already-in-use") {
          // Adaugă mesajul de eroare la regulile pentru adresa de email
          this.registerRules.registerEmail.push(
            "Email address is already registered."
          );
          // Validează formularul
          this.$refs.registerForm.validate();
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
    validateName(registerName) {
      const nameRegex = /^[a-zA-Z]{3,}$/;
      return nameRegex.test(registerName);
    },
  },
  
};
</script>

<style scoped>
.rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}
.rounded-br-xl {
  border-top-right-radius: 300px !important;
}
</style>
