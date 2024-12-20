<template>
  <main class="container mt-5">
    <h1 class="text-center mb-4">Rezervāciju Apstiprināšana</h1>

    <!-- Filter Buttons -->
    <div class="text-center mb-4">
      <button class="btn btn-primary" @click="filterStatus('pending')">Pending</button>
      <button class="btn btn-success" @click="filterStatus('approved')">Approved</button>
      <button class="btn btn-danger" @click="filterStatus('declined')">Declined</button>
    </div>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Computer</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Created at</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pieteikums in filteredPieteikumi" :key="pieteikums.pieteikuma_id">
          <td>{{ pieteikums.pieteikuma_id }}</td>
          <td>{{ pieteikums.Computers }}</td>
          <td>{{ pieteikums.start_time }}</td>
          <td>{{ pieteikums.end_time }}</td>
          <td>{{ pieteikums.first_name }}</td>
          <td>{{ pieteikums.last_name }}</td>
          <td>{{ pieteikums.phone }}</td>
          <td>{{ pieteikums.email }}</td>
          <td>{{ pieteikums.Created_at }}</td>
          <td>
            <!-- Show buttons only for pending reservations -->
            <button 
              v-if="pieteikums.status === 'pending'" 
              class="btn btn-success" 
              @click="approveReservation(pieteikums)">Approve</button>
            <button 
              v-if="pieteikums.status === 'pending'" 
              class="btn btn-danger" 
              @click="denyReservation(pieteikums)">Deny</button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      pieteikumi: [], // All fetched reservations
      filteredPieteikumi: [] // Filtered reservations based on status
    };
  },
  methods: {
    // Fetch all reservations and store them in pieteikumi
    fetchPieteikumi() {
      axios
        .get("http://localhost:3009/api/pieteikumi")
        .then((response) => {
          this.pieteikumi = response.data;
          
          // Format the start_time and end_time fields
          this.pieteikumi.forEach((pieteikums) => {
            pieteikums.start_time = new Date(pieteikums.start_time).toLocaleString('en-GB', {
              weekday: 'short', // Short day (Mon, Tue, etc.)
              year: 'numeric', // Full year (2024)
              month: 'short', // Abbreviated month (Dec)
              day: 'numeric', // Day (17)
              hour: '2-digit', // 2-digit hour (14)
              minute: '2-digit', // 2-digit minute (00)
              hour12: false, // 24-hour format
            });

            pieteikums.end_time = new Date(pieteikums.end_time).toLocaleString('en-GB', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
          });

          // Filter by status 'pending' initially
          this.filterStatus('pending'); 
        })
        .catch((error) => {
          console.error("Error fetching pieteikumi:", error);
        });
    },

    // Filter reservations by status (pending, approved, declined)
    filterStatus(status) {
      // Filter the pieteikumi array based on the status
      this.filteredPieteikumi = this.pieteikumi.filter((pieteikums) => pieteikums.status === status);
    },

    denyReservation(pieteikums) {
      axios
        .put(`http://localhost:3009/api/pieteikumi/${pieteikums.pieteikuma_id}/status`, { status: "declined" })
        .then(() => {
          alert("Reservation denied");
          this.fetchPieteikumi(); // Refresh the table data
        })
        .catch((error) => {
          console.error("Error denying reservation:", error.response ? error.response.data : error);
          alert("Failed to deny reservation");
        });
    },

    approveReservation(pieteikums) {
      // Log the reservation data being sent
      console.log("Sending data for reservation:", pieteikums);

      // Manually adjust time without losing local timezone accuracy
      const startTime = new Date(pieteikums.start_time);
      const endTime = new Date(pieteikums.end_time);

      // Convert start and end time to Europe/Riga time (Latvian Time)
      const localStartTime = new Date(startTime.toLocaleString("en-US", { timeZone: "Europe/Riga" }));
      const localEndTime = new Date(endTime.toLocaleString("en-US", { timeZone: "Europe/Riga" }));

      // Manually format them as strings in `YYYY-MM-DD HH:MM:SS` format
      const formattedStartTime = localStartTime.getFullYear() + '-' +
        ('0' + (localStartTime.getMonth() + 1)).slice(-2) + '-' +
        ('0' + localStartTime.getDate()).slice(-2) + ' ' +
        ('0' + localStartTime.getHours()).slice(-2) + ':' +
        ('0' + localStartTime.getMinutes()).slice(-2) + ':' +
        ('0' + localStartTime.getSeconds()).slice(-2);

      const formattedEndTime = localEndTime.getFullYear() + '-' +
        ('0' + (localEndTime.getMonth() + 1)).slice(-2) + '-' +
        ('0' + localEndTime.getDate()).slice(-2) + ' ' +
        ('0' + localEndTime.getHours()).slice(-2) + ':' +
        ('0' + localEndTime.getMinutes()).slice(-2) + ':' +
        ('0' + localEndTime.getSeconds()).slice(-2);

      // Construct the reservation object
      const newRezervacija = {
        pieteikuma_id: pieteikums.pieteikuma_id,
        Computer_id: pieteikums.Computers,
        start_time: formattedStartTime,  // Use the manually formatted time
        end_time: formattedEndTime,      // Use the manually formatted time
      };

      // Validate that all fields are present
      if (!newRezervacija.pieteikuma_id || !newRezervacija.Computer_id || !newRezervacija.start_time || !newRezervacija.end_time) {
        alert("Missing required fields");
        console.error("Missing required fields", newRezervacija);
        return;
      }

      // Log the data before sending it to the backend
      console.log("Data being sent to backend:", newRezervacija);

      // Send the reservation data to the backend
      axios
        .post("http://localhost:3009/api/rezervacijas", newRezervacija)  // Send in the correct time format
        .then(() => {
          return axios.put(`http://localhost:3009/api/pieteikumi/${pieteikums.pieteikuma_id}/status`, { status: "approved" });
        })
        .then(() => {
          alert("Reservation approved");
          this.fetchPieteikumi(); // Refresh the table data
        })
        .catch((error) => {
          console.error("Error approving reservation:", error.response ? error.response.data : error);
          alert("Failed to approve reservation");
        });
    },
  },
  mounted() {
    this.fetchPieteikumi();
  },
};
</script>

<style scoped>
table {
  width: 100%;
  text-align: center;
}
button {
  margin: 0 5px;
}
</style>
