<template>
  <main class="container mt-5">
    <h1 class="text-center mb-4">Create Reservation</h1>
    <form @submit.prevent="submitReservation" class="shadow p-4 rounded border">
      
      <div class="mb-3">
        <label for="Computers" class="form-label">Izvēlaties kuru datoru jūs vēlaties</label>
        <select v-model="reservation.Computers" id="Computers" class="form-select">
          <option value="1">Computer 1</option>
          <option value="2">Computer 2</option>
          <option value="3">Computer 3</option>
          <option value="4">Computer 4</option>
          <option value="5">Computer 5</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="start_time" class="form-label">Ievadiet sākuma laiku un datumu</label>
        <input type="datetime-local" v-model="reservation.start_time" id="start_time" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="end_time" class="form-label">Ievadiet beigu laiku un datumu</label>
        <input type="datetime-local" v-model="reservation.end_time" id="end_time" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="first_name" class="form-label">Ievadiet savu vārdu</label>
        <input type="text" v-model="reservation.first_name" id="first_name" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="last_name" class="form-label">Ievadiet savu uzvārdu</label>
        <input type="text" v-model="reservation.last_name" id="last_name" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="phone" class="form-label">Ievadiet savu telefona nummuru</label>
        <input type="text" v-model="reservation.phone" id="phone" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Ievadiet savu ēpastu</label>
        <input type="email" v-model="reservation.email" id="email" class="form-control" required />
      </div>

      <div class="d-flex justify-content-center mt-4">
        <button class="btn btn-primary" type="submit">Submit</button>
      </div>
    </form>
  </main>
</template>

<script>
export default {
  data() {
    return {
      reservation: {
        Computers: "",
        start_time: "",
        end_time: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: ""
      }
    };
  },
  methods: {
    submitReservation() {
      console.log("Reservation data before sending:", this.reservation); 

      fetch("http://localhost:3004/create-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.reservation)
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Reservation created successfully!");
        })
        .catch((error) => {
          console.error("Error creating reservation:", error);
          alert("There was an error creating the reservation.");
        });
    }
  }
};
</script>

<style scoped>

label {
  font-weight: bold;
}

input, select {
  max-width: 100%;
}

button {
  width: auto;
}
</style>
