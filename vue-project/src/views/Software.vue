<template>
    <div>
      <h1 class="fw-bold">Software Data</h1>
  
      <!-- Button to open Add New Software form -->
      <button v-if="isAdmin" class="btn btn-success" @click="openAddForm">Add New Software</button>
  
      <!-- Display Software Data in one table -->
      <table class="table table-dark table-bordered small-table">
        <thead>
          <tr>
            <th class="col-software-name">Software Name</th>
            <th class="col-version">Version</th>
            <th v-if="isAdmin">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in software" :key="item.Software_ID">
            <td>{{ item.Software_Name }}</td>
            <td>{{ item.Version }}</td>
            <td v-if="isAdmin">
              <button class="btn btn-primary btn-sm" @click="editItem(item)">
                Edit
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteItem(item.Software_ID)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Edit Form -->
      <div v-if="editFormVisible" class="modal">
        <div class="modal-content">
          <h2>Edit Software</h2>
          <form @submit.prevent="saveEdit">
            <div class="mb-3">
              <label class="form-label">Software Name:</label>
              <input v-model="editFormData.Software_Name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Version:</label>
              <input v-model="editFormData.Version" type="text" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-success">Save Changes</button>
            <button type="button" class="btn btn-secondary" @click="closeEditForm">Cancel</button>
          </form>
        </div>
      </div>
  
      <!-- Add New Software Form -->
      <div v-if="addFormVisible" class="modal">
        <div class="modal-content">
          <h2>Add New Software</h2>
          <form @submit.prevent="addNewSoftware">
            <div class="mb-3">
              <label class="form-label">Software Name:</label>
              <input v-model="newSoftware.Software_Name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Version:</label>
              <input v-model="newSoftware.Version" type="text" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-success">Add Software</button>
            <button type="button" class="btn btn-secondary" @click="closeAddForm">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useStore } from "vuex";


  
  export default {
    data() {
      return {
        software: [],
        editFormVisible: false,
        addFormVisible: false,
        newSoftware: {
          Software_Name: "",
          Version: "",
        },
        editFormData: {
          Software_ID: null,
          Software_Name: "",
          Version: "",
        },
      };
    },
    computed: {
      isAdmin() {
        const store = useStore();
        return store.getters.isAdmin;
      },
    },
    methods: {
      fetchSoftware() {
        axios
          .get("http://localhost:3007/api/software")
          .then((response) => {
            this.software = response.data;
          })
          .catch((error) => {
            console.error("Error fetching software:", error);
          });
      },
      editItem(item) {
        this.editFormData = { ...item };
        this.editFormVisible = true;
      },
      saveEdit() {
        const { Software_ID, ...updateData } = this.editFormData;
        axios
          .put(`http://localhost:3007/api/software/${Software_ID}`, updateData)
          .then((response) => {
            console.log("Update successful:", response.data);
            this.editFormVisible = false;
            this.fetchSoftware();
          })
          .catch((error) => {
            console.error("Error updating software:", error);
          });
      },
      closeEditForm() {
        this.editFormVisible = false;
      },
      openAddForm() {
        this.addFormVisible = true;
      },
      closeAddForm() {
        this.addFormVisible = false;
      },
      addNewSoftware() {
        axios
          .post("http://localhost:3007/api/software", this.newSoftware)
          .then((response) => {
            console.log("New software added:", response.data);
            this.addFormVisible = false;
            this.fetchSoftware(); // Refresh the table with the new data
          })
          .catch((error) => {
            console.error("Error adding new software:", error);
          });
      },
      deleteItem(id) {
        if (confirm("Are you sure you want to delete this software?")) {
          axios
            .delete(`http://localhost:3007/api/software/${id}`)
            .then((response) => {
              console.log("Software deleted:", response.data);
              this.fetchSoftware(); // Refresh the list after deletion
            })
            .catch((error) => {
              console.error("Error deleting software:", error);
            });
        }
      },
    },
    mounted() {
      this.fetchSoftware();
    },
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px auto;
    font-size: 14px;
    table-layout: fixed;
  }
  
  th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #444;
  }
  
  th {
    background-color: #333;
    color: white;
  }
  
  .col-software-name {
    width: 30%;
  }
  
  .col-version {
    width: 25%;
  }
  
  .col-license {
    width: 25%;
  }
  
  .small-table {
    width: 80%;
  }
  
  h1 {
    text-align: center;
    font-size: 36px;
  }
  
  .btn {
    cursor: pointer;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    text-align: center;
  }

  .btn-success {
    margin-left: 255px;
  }
  </style>
  