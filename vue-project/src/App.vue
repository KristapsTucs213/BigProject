<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

// Check if the user is logged in from Vuex state
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const isAdmin = computed(() => store.getters.isAdmin);



// Logout method
const handleLogout = () => {
  store.commit('logout'); // Clear the Vuex store
  router.push('/login'); // Redirect to login page
};
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="navbar navbar-expand-lg custom-navbar">
        <div class="container-fluid">
          <RouterLink class="navbar-brand" to="/login">Pieslēgties</RouterLink>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <!-- <li class="nav-item">
                <RouterLink class="nav-link active" to="/">Home</RouterLink>
              </li> -->
              <!-- <li class="nav-item">
                <RouterLink class="nav-link" to="/about">About us</RouterLink>
              </li> -->
              <li class="nav-item">
                <RouterLink class="nav-link" to="/computer">Visi datori</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/computer_parts">Informacija par datora kompanentēm</RouterLink>
              </li>
              <li class="nav-item " v-if="isAdmin">
                <RouterLink class="nav-link" to="/parts">Parts</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/computer_software">Informacija par datora programatūru</RouterLink>
              </li>
              <li class="nav-item" v-if="isAdmin">
                <RouterLink class="nav-link" to="/software">Software</RouterLink>
              </li>
              <li class="nav-item" v-if="isAdmin">
                <RouterLink class="nav-link" to="/rezervacija">Rezervacija</RouterLink>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto">
              <li
                class="nav-item"
                v-if="isLoggedIn"
              >
                <a class="nav-link" href="#" @click.prevent="handleLogout">Logout</a>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link fw-bold" to="/pieteikums">Izveidot Pieteikumu</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
.custom-navbar {
  background-color: bisque;
}

.custom-navbar .nav-link:hover {
  color: white;
}

.fw-bold {
  font-weight: bold;
}
</style>



