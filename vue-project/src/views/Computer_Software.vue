<template>
  <div>
    <h1 class="fw-bold">Datora programatūra</h1>
    <div v-for="(items, computerId) in groupedData" :key="computerId">
      <h2>Computer: {{ computerId }}</h2>
      <button v-if="isAdmin" class="btn btn-success" @click="showAddSoftwareModal(computerId)">
        Add Software
      </button>
      <table class="table table-dark table-borderless small-table">
        <thead>
          <tr>
            <th class="col-software-name">Software Name</th>
            <th class="col-version">Version</th>
            <th v-if="isAdmin">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.software_id">
            <td>{{ item.Software_Name }}</td>
            <td>{{ item.Version }}</td>
            <td v-if="isAdmin">
              <button class="btn btn-danger btn-sm" @click="deleteItem(item.Computer_software_ID)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Software Modal -->
    <div v-if="addSoftwareModalVisible" class="modal">
      <div class="modal-content">
        <h2>Select Software to Add</h2>
        <select v-model="selectedSoftware" class="form-control">
          <option v-for="software in softwareList" :key="software.Software_ID" :value="software.Software_ID">
            {{ software.Software_Name }} - {{ software.Version }}
          </option>
        </select>
        <button class="btn btn-success mt-3" @click="addSoftwareToComputer">Add Software</button>
        <button class="btn btn-secondary mt-3" @click="closeAddSoftwareModal">Cancel</button>
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
      data: [],
      softwareList: [],
      selectedSoftware: null, // Ensure this is correctly bound
      editFormVisible: false,
      addSoftwareModalVisible: false,
      currentComputerId: null,
      editFormData: {
        software_id: null,
        Software_Name: "",
        Version: "",
        Computer_ID: null,
      },
    };
  },
  computed: {
    isAdmin() {
      const store = useStore();
      return store.getters.isAdmin;
    },
    groupedData() {
      return this.data.reduce((groups, item) => {
        if (!groups[item.Computer_ID]) {
          groups[item.Computer_ID] = [];
        }
        groups[item.Computer_ID].push(item);
        return groups;
      }, {});
    },
  },
  methods: {
    fetchData() {
      axios
        .get("http://localhost:3001/api/data")
        .then((response) => {
          this.data = response.data;
        })
        .catch((error) => {
          console.error("There was an error fetching the data:", error);
        });
    },
    fetchSoftwareList() {
      axios
        .get("http://localhost:3001/api/software")
        .then((response) => {
          this.softwareList = response.data;
        })
        .catch((error) => {
          console.error("There was an error fetching software list:", error);
        });
    },
    showAddSoftwareModal(computerId) {
      this.currentComputerId = computerId;
      this.selectedSoftware = null; // Reset selectedSoftware to null to avoid unwanted state
      this.addSoftwareModalVisible = true;
      this.fetchSoftwareList();
    },
    closeAddSoftwareModal() {
      this.addSoftwareModalVisible = false;
    },
    addSoftwareToComputer() {
      // Debugging the selectedSoftware before sending the request
      console.log("Selected Software ID: ", this.selectedSoftware);

      if (!this.selectedSoftware) {
        alert("Please select a software to add.");
        return;
      }

      const requestBody = {
        Computer_ID: this.currentComputerId,
        Software_ID: this.selectedSoftware,
      };

      axios
        .post("http://localhost:3001/api/add-software", requestBody)
        .then((response) => {
          console.log("Software added successfully:", response.data);
          this.addSoftwareModalVisible = false;
          this.fetchData(); // Refresh the data
        })
        .catch((error) => {
          console.error("Error adding software:", error);
        });
    },
    deleteItem(computerSoftwareId) {
      if (confirm("Are you sure you want to delete this software entry?")) {
        axios
          .delete(`http://localhost:3001/api/data/${computerSoftwareId}`)
          .then((response) => {
            this.fetchData(); // Refresh the data
          })
          .catch((error) => {
            console.error("Error deleting software entry:", error);
            alert("Failed to delete the software entry. Please try again.");
          });
      }
    },
  },
  mounted() {
    this.fetchData();
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

.col-software-name {
  width: 20%;
}

.col-version {
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

.btn-success{
  margin-left: 255px;
}
</style>
