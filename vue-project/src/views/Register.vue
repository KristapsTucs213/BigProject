<template>
    <div class="register-container d-flex justify-content-center align-items-start vh-100">
      <div class="card shadow p-4 rounded" style="max-width: 600px; width: 100%; padding: 30px;">
        <h1 class="text-center mb-4">Register</h1>
  
        
        <form @submit.prevent="submitRegister">
          
          <div class="mb-4">
            <label for="email" class="form-label">Email:</label>
            <input
              type="email"
              v-model="register.email"
              id="email"
              class="form-control"
              required
              placeholder="Enter your email"
            />
          </div>
  
          
          <div class="mb-4">
            <label for="password" class="form-label">Password:</label>
            <input
              type="password"
              v-model="register.password"
              id="password"
              class="form-control"
              required
              placeholder="Enter your password"
            />
          </div>
  
          
          <div class="d-flex justify-content-center mt-4">
            <button class="btn btn-primary w-100" type="submit" :disabled="isLoading">
              <span v-if="isLoading">Registering...</span>
              <span v-else>Submit</span>
            </button>
          </div>
        </form>
  
        
        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
          {{ successMessage }}
        </div>
        
        <!-- Register Link -->
        <div class="d-flex justify-content-center mt-3">
          <a href="/login">Already have an account? Login</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        register: {
          email: "",
          password: "",
        },
        isLoading: false,
        errorMessage: "",
        successMessage: "",
      };
    },
    methods: {
      submitRegister() {
        
        this.errorMessage = "";
        this.successMessage = "";
  
        
        this.isLoading = true;
  
        // Send POST request to server
        fetch("http://localhost:3006/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.register),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message) {
              
              this.successMessage = data.message;
              this.$router.push('/'); 
            } else {
              
              this.errorMessage = data.error || "An unexpected error occurred.";
            }
          })
          .catch((error) => {
            console.error("Error during registration:", error);
            this.errorMessage = "There was an error creating the account.";
          })
          .finally(() => {
            
            this.isLoading = false;
          });
      },
    },
  };
  </script>
  
  <style scoped>
  
  .register-container {
    display: flex;
    justify-content: center;
    align-items: flex-start; 
    height: 100vh;
    padding-top: 50px; 
  }
  
  .card {
    width: 100%;
    max-width: 600px; 
    padding: 30px; 
    margin-top: 200px; 
  }
  
 
  .alert {
    font-size: 1rem;
  }
  
  
  a {
    font-size: 14px;
    color: #007bff;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
  