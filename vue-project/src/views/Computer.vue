<template>
  <div>
    <h1 class="fw-bold">Computer Data</h1>

    <!-- Button to open Add New Computer form -->
    <button v-if="isAdmin" class="btn btn-success" @click="openAddForm">Add New Computer</button>

    <!-- Display Computers Data -->
    <div v-for="(items, computerId) in groupedData" :key="computerId">
      <h2 class="mt-4">Computer: {{ computerId }}</h2>
      <table class="table table-dark table-bordered small-table">
        <thead>
          <tr>
            <th class="col-pc-name">PC Name</th>
            <th class="col-os">Operating System</th>
            <th class="col-rinda">Rinda</th>
            <th class="col-colona">Colona</th>
            <th v-if="isAdmin">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.Computer_ID">
            <td>{{ item.PC_Name }}</td>
            <td>{{ item.Operating_System }}</td>
            <td>{{ item.Rinda }}</td>
            <td>{{ item.Colona }}</td>
            <td v-if="isAdmin">
              <button class="btn btn-primary btn-sm" @click="editItem(item)">
                Edit
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteItem(item.Computer_ID)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Form -->
    <div v-if="editFormVisible" class="modal">
      <div class="modal-content">
        <h2>Edit Computer</h2>
        <form @submit.prevent="saveEdit">
          <div class="mb-3">
            <label class="form-label">PC Name:</label>
            <input v-model="editFormData.PC_Name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Operating System:</label>
            <input v-model="editFormData.Operating_System" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Rinda:</label>
            <input v-model.number="editFormData.Rinda" type="number" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Colona:</label>
            <input v-model.number="editFormData.Colona" type="number" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-success">Save Changes</button>
          <button type="button" class="btn btn-secondary" @click="closeEditForm">Cancel</button>
        </form>
      </div>
    </div>

    <!-- Add New Computer Form -->
    <div v-if="addFormVisible" class="modal">
      <div class="modal-content">
        <h2>Add New Computer</h2>
        <form @submit.prevent="addNewComputer">
          <div class="mb-3">
            <label class="form-label">PC Name:</label>
            <input v-model="newComputer.PC_Name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Operating System:</label>
            <input v-model="newComputer.Operating_System" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Rinda:</label>
            <input v-model.number="newComputer.Rinda" type="number" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Colona:</label>
            <input v-model.number="newComputer.Colona" type="number" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-success">Add Computer</button>
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
      computers: [],
      editFormVisible: false,
      addFormVisible: false,
      newComputer: {
        PC_Name: "",
        Operating_System: "",
        Rinda: 0,
        Colona: 0,
      },
      editFormData: {
        Computer_ID: null,
        PC_Name: "",
        Operating_System: "",
        Rinda: 0,
        Colona: 0,
      },
    };
  },
  computed: {
    isAdmin() {
      const store = useStore();
      return store.getters.isAdmin;
    },
    groupedData() {
      return this.computers.reduce((groups, item) => {
        if (!groups[item.Computer_ID]) {
          groups[item.Computer_ID] = [];
        }
        groups[item.Computer_ID].push(item);
        return groups;
      }, {});
    },
  },
  methods: {
    fetchComputers() {
      axios
        .get("http://localhost:3003/api/data")
        .then((response) => {
          this.computers = response.data;
        })
        .catch((error) => {
          console.error("Error fetching computers:", error);
        });
    },
    editItem(item) {
      this.editFormData = { ...item };
      this.editFormVisible = true;
    },
    saveEdit() {
      const { Computer_ID, ...updateData } = this.editFormData;
      axios
        .put(`http://localhost:3003/api/data/${Computer_ID}`, updateData)
        .then((response) => {
          console.log("Update successful:", response.data);
          this.editFormVisible = false;
          this.fetchComputers();
        })
        .catch((error) => {
          console.error("Error updating data:", error);
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
    addNewComputer() {
      axios
        .post("http://localhost:3003/api/data", this.newComputer)
        .then((response) => {
          console.log("New computer added:", response.data);
          this.addFormVisible = false;
          this.fetchComputers(); // Refresh the table with the new data
        })
        .catch((error) => {
          console.error("Error adding new computer:", error);
        });
    },
    deleteItem(id) {
      if (confirm("Are you sure you want to delete this computer?")) {
        axios
          .delete(`http://localhost:3003/api/data/${id}`)
          .then((response) => {
            console.log("Computer deleted:", response.data);
            this.fetchComputers(); // Refresh the list after deletion
          })
          .catch((error) => {
            console.error("Error deleting computer:", error);
          });
      }
    },
  },
  mounted() {
    this.fetchComputers();
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

.col-pc-name {
  width: 20%;
}

.col-os {
  width: 25%;
}

.col-rinda {
  width: 15%;
}

.col-colona {
  width: 15%;
}

.small-table {
  width: 80%;
}

h2 {
  margin-left: 255px;
  margin-top: 20px;
  font-size: 24px;
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
