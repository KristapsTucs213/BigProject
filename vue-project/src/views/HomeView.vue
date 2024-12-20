<script setup>
// import { useStore } from 'vuex';

// const store = useStore();

// // Get user role and login status from the store

// console.log("store.getters.isLoggedIn:");
// console.log(store.getters.isLoggedIn);
// console.log("store.getters.getUser:");
// console.log(store.getters.getUser);
// console.log("store.getters.isAdmin:");
// console.log(store.getters.isAdmin);

// const isLoggedIn = store.getters.isLoggedIn; // Assuming you have this getter
// const userRole = isLoggedIn ? store.getters.getUserRole:null; // Corrected: no space in 'getUser Role'
</script>

<template>
  <main>
    <h1>Home of Datorklase 104</h1>
    <br>
    <br>
    <p class="fw-medium">Šajā mājaslapā tu vari izveidot pietiekumu un rezervēt kādu no mūsu datoriem uz konkrētu laika periodu.</p>
    <br>
    <br>
    <p class="fw-medium">Katrs dators ir unikāls un sastāv no dažādām 'toptier' sastāvdaļām un programatūram</p>
    <br>
    <br>
    <p class="fw-medium">Katrs pieteikums tiks apskatīts un apstiprināts pēc konkrēta laika perioda</p>
    <br>
    <br>
    <p class="fw-medium">Informāciju par datoriem var apskatīt attiecošā sadaļā</p>
    <br>
    <br>
    <!-- <p class="fw-medium">
      {{ isLoggedIn 
        ? `You are logged in as a ${userRole === 1 ? 'Admin' : 'User '}` 
        : 'You are not logged in.' }}
    </p> -->
  </main>
</template>

<style>
p {
  text-align: center;
  font-size: 40px;
}
</style>