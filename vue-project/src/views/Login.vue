<template>
  <div class="login-container d-flex justify-content-center align-items-start vh-100">
    <div class="card shadow p-4 rounded" style="max-width: 600px; width: 100%; padding: 30px;">
      <h1 class="text-center mb-4">Login</h1>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="form-label">Email:</label>
          <input
            type="email"
            v-model="email"
            id="email"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="mb-4">
          <label for="password" class="form-label">Password:</label>
          <input
            type="password"
            v-model="password"
            id="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>

        <div class="d-flex justify-content-center mt-4">
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </div>
      </form>

      <div class="d-flex justify-content-center mt-3">
        <a href="/register">Register</a>
      </div>

      <p v-if="errorMessage" class="error text-center text-danger mt-3">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3005/login', {
          email: this.email,
          password: this.password,
        });

        if (response.status === 200) {
          const { token, user } = response.data;

          // Store the user and token in Vuex
          this.$store.commit('setUser', { token, user });

          // Redirect based on role
          if (user.role === 'admin') {
            this.$router.push('/admin');  // Redirect to admin dashboard
          } else {
            this.$router.push('/');  // Redirect to user homepage
          }
        }
      } catch (error) {
  console.error('Error during login:', error); // Log error details

  if (error.response) {
    console.error('Error response:', error.response.data); // Log response data
    this.errorMessage = error.response.data.error || 'An error occurred.';
  } else if (error.request) {
    console.error('No response received:', error.request); // Log request details
    this.errorMessage = 'No response from the server. Please try again later.';
  } else {
    console.error('Request setup error:', error.message); // Log setup issues
    this.errorMessage = 'An error occurred. Please try again.';
  }
}

    },
  },
};
</script>


<style scoped>

.login-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  height: 100vh;
  padding-top: 100px; 
}

.card {
  width: 100%;
  max-width: 600px; 
  padding: 30px; 
  margin-top: 200px; 
}


a {
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}


.error {
  font-size: 1rem;
  color: red;
}


input {
  font-size: 1rem;
  padding: 12px;
}


button {
  font-size: 1rem;
  padding: 12px;
}
</style>
