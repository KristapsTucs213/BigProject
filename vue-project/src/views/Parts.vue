<template>
    <div>
      <h1 class="fw-bold">Parts Data</h1>
  
      <!-- Button to open Add New Part form -->
      <button v-if="isAdmin" class="btn btn-success" @click="openAddForm">Add New Part</button>
  
      <!-- Display Parts Data in one table -->
      <table class="table table-dark table-bordered small-table">
        <thead>
          <tr>
            <th class="col-part-name">Part Name</th>
            <th class="col-part-type">Part Type</th>
            <th class="col-description">Description</th>
            <th v-if="isAdmin">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in parts" :key="item.Part_ID">
            <td>{{ item.Part_name }}</td>
            <td>{{ item.Part_type }}</td>
            <td>{{ item.apraksts }}</td>
            <td v-if="isAdmin">
              <button class="btn btn-primary btn-sm" @click="editItem(item)">
                Edit
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteItem(item.Part_ID)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Edit Form -->
      <div v-if="editFormVisible" class="modal">
        <div class="modal-content">
          <h2>Edit Part</h2>
          <form @submit.prevent="saveEdit">
            <div class="mb-3">
              <label class="form-label">Part Name:</label>
              <input v-model="editFormData.Part_name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Part Type:</label>
              <input v-model="editFormData.Part_type" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Description:</label>
              <textarea v-model="editFormData.apraksts" class="form-control" required></textarea>
            </div>
            <button type="submit" class="btn btn-success">Save Changes</button>
            <button type="button" class="btn btn-secondary" @click="closeEditForm">Cancel</button>
          </form>
        </div>
      </div>
  
      <!-- Add New Part Form -->
      <div v-if="addFormVisible" class="modal">
        <div class="modal-content">
          <h2>Add New Part</h2>
          <form @submit.prevent="addNewPart">
            <div class="mb-3">
              <label class="form-label">Part Name:</label>
              <input v-model="newPart.Part_name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Part Type:</label>
              <input v-model="newPart.Part_type" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Description:</label>
              <textarea v-model="newPart.apraksts" class="form-control" required></textarea>
            </div>
            <button type="submit" class="btn btn-success">Add Part</button>
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
        parts: [],
        editFormVisible: false,
        addFormVisible: false,
        newPart: {
          Part_name: "",
          Part_type: "",
          apraksts: "",
        },
        editFormData: {
          Part_ID: null,
          Part_name: "",
          Part_type: "",
          apraksts: "",
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
      fetchParts() {
        axios
          .get("http://localhost:3008/api/parts")
          .then((response) => {
            this.parts = response.data;
          })
          .catch((error) => {
            console.error("Error fetching parts:", error);
          });
      },
      editItem(item) {
        this.editFormData = { ...item };
        this.editFormVisible = true;
      },
      saveEdit() {
        const { Part_ID, ...updateData } = this.editFormData;
        axios
          .put(`http://localhost:3008/api/parts/${Part_ID}`, updateData)
          .then((response) => {
            console.log("Update successful:", response.data);
            this.editFormVisible = false;
            this.fetchParts();
          })
          .catch((error) => {
            console.error("Error updating part:", error);
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
      addNewPart() {
        axios
          .post("http://localhost:3008/api/parts", this.newPart)
          .then((response) => {
            console.log("New part added:", response.data);
            this.addFormVisible = false;
            this.fetchParts();
          })
          .catch((error) => {
            console.error("Error adding new part:", error);
          });
      },
      deleteItem(id) {
        if (confirm("Are you sure you want to delete this part?")) {
          axios
            .delete(`http://localhost:3008/api/parts/${id}`)
            .then((response) => {
              console.log("Part deleted:", response.data);
              this.fetchParts();
            })
            .catch((error) => {
              console.error("Error deleting part:", error);
            });
        }
      },
    },
    mounted() {
      this.fetchParts();
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
  
  th,
  td {
    padding: 10px;
    text-align: left;
    border: 1px solid #444;
  }
  
  th {
    background-color: #333;
    color: white;
  }
  
  .col-part-name {
    width: 30%;
  }
  
  .col-part-type {
    width: 25%;
  }
  
  .col-description {
    width: 30%;
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
  