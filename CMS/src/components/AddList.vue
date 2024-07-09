<script setup>
import { ref, computed, watch } from 'vue';

// Props to receive the current day from the parent component
const props = defineProps({
  currentDay: {
    type: Object,
    default: () => ({ date: new Date() }) // Default to today's date
  }
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const showMedicineModal = ref(false);
const selectedPerson = ref();
const selectedDate = computed(() => props.currentDay.date.toDateString());
const selectedTime = ref('');
const searchQuery = ref('');
const medicineSearchQuery = ref('');

const people = ref([]);

const allPeople = ref([
  { name: 'John Doe', section: 'A', age: 30, sex: 'male' },
  { name: 'Jane Smith', section: 'B', age: 25, sex: 'male' },
  { name: 'Alice Johnson', section: 'C', age: 28, sex: 'male' },
  { name: 'Bob Brown', section: 'D', age: 32, sex: 'male' },
]);

watch(() => props.currentDay, (newVal) => {
  if (newVal && newVal.date) {
    if (newVal.date.toDateString() === new Date().toDateString()) {
      people.value = [];
    } else {
      people.value = [];
    }
  } else {
    people.value = [];
  }
});

const filteredPeople = computed(() => {
  if (!searchQuery.value) {
    return allPeople.value;
  }
  return allPeople.value.filter(person => person.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const allMedicines = ref([
  { name: 'Paracetamol' },
  { name: 'Ibuprofen' },
  { name: 'Aspirin' },
  { name: 'Amoxicillin' },
]);

const filteredMedicines = computed(() => {
  if (!medicineSearchQuery.value) {
    return allMedicines.value;
  }
  return allMedicines.value.filter(medicine => medicine.name.toLowerCase().includes(medicineSearchQuery.value.toLowerCase()));
});

const addPerson = (person) => {
  const now = new Date();
  if (person.name && person.section) {
    people.value.push({ ...person, addedAt: now, medicines: [] });
    showAddModal.value = false;
    openEditModal({ ...person, addedAt: now, medicines: [] });
  }
};

const deletePerson = (index) => {
  people.value.splice(index, 1);
};

const openEditModal = (person) => {
  selectedPerson.value = { ...person };
  selectedTime.value = formatAMPM(new Date());
  showEditModal.value = true;
};

const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

const savePerson = () => {
  const index = people.value.findIndex(p => p.name === selectedPerson.value.name);
  if (index !== -1) {
    people.value[index] = { ...selectedPerson.value };
    showEditModal.value = false;
  }
};

const openMedicineModal = () => {
  showMedicineModal.value = true;
};

const addMedicine = (medicine) => {
  if (!selectedPerson.value.medicines) {
    selectedPerson.value.medicines = [];
  }
  selectedPerson.value.medicines.push(medicine);
  showMedicineModal.value = false;
};

const removeMedicine = (index) => {
  selectedPerson.value.medicines.splice(index, 1);
};
</script>

<template>
  <div class="w-1/3 ml-9">
    <div class="p-4 border rounded-lg">
      <h2 class="mb-4 text-2xl font-bold">Selected Date: {{ props.currentDay && props.currentDay.date ? props.currentDay.date.toDateString() : 'None' }}</h2>
      <p class="text-lg">CONFINEMENTS</p>
      <ul class="mt-4 overflow-y-auto max-h-60">
        <li v-for="(person, index) in people" :key="index" class="flex items-center justify-between mb-2 text-lg confinement-item">
          <span @click="openEditModal(person)" class="cursor-pointer confinement-details">{{ person.name }} - {{ person.section }} - {{ formatAMPM(person.addedAt) }}</span>
          <button @click="deletePerson(index)" class="p-2 text-white bg-red-500 rounded">Delete</button>
        </li>
      </ul>
      <button @click="showAddModal = true" class="p-2 mt-4 text-white bg-blue-500 rounded">+</button>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div class="w-1/3 p-4 bg-white rounded-lg">
        <h2 class="mb-2 text-xl">Add Person</h2>
        <input v-model="searchQuery" placeholder="Search" class="w-full p-2 mb-2 border rounded">
        <ul class="mt-4 overflow-y-auto max-h-60">
          <li v-for="person in filteredPeople" :key="person.name" class="flex items-center justify-between mb-2 text-lg">
            <span>{{ person.name }} - {{ person.section }}</span>
            <button @click="addPerson(person)" class="p-2 text-white bg-green-500 rounded">Add</button>
          </li>
        </ul>
        <div class="flex justify-end mt-4">
          <button @click="showAddModal = false" class="p-2 ml-2 text-white bg-gray-500 rounded">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div class="w-1/3 p-4 bg-white rounded-lg">
        <h2 class="mb-2 text-xl">Edit Person</h2>
        <div class="mb-4">
          <p>Name: {{ selectedPerson.name }}</p>
          <p>Section: {{ selectedPerson.section }}</p>
          <p>Age: {{ selectedPerson.age }}</p>
          <p>Sex: {{ selectedPerson.sex }}</p>
          <p><strong>Date:</strong> {{ selectedDate }}</p>
          <p><strong>Time:</strong> {{ selectedTime }}</p>
        </div>
        <div>
          <textarea v-model="selectedPerson.generalComplaint" placeholder="General Complaint" class="w-full p-2 mb-2 border rounded"></textarea>
          <textarea v-model="selectedPerson.remarks" placeholder="Remarks" class="w-full p-2 mb-2 border rounded"></textarea>
          <div class="mb-4">
            <input type="checkbox" id="option2" v-model="selectedPerson.confined" class="text-blue-500 form-checkbox">
            <label for="option2" class="ml-2">Confined</label>
          </div>
          <div class="mb-4">
            <input type="checkbox" id="option1" v-model="selectedPerson.medicationAdministration" class="text-blue-500 form-checkbox">
            <label for="option1" class="ml-2">Medication Administration</label>
          </div>
          <ul class="mt-4">
            <li v-for="(medicine, index) in selectedPerson.medicines" :key="index" class="flex items-center justify-between mb-2">
              {{ medicine.name }}
              <button @click="removeMedicine(index)" class="p-2 text-white bg-red-500 rounded">Remove</button>
            </li>
          </ul>
          <button v-if="selectedPerson.medicationAdministration" @click="openMedicineModal" class="p-2 mt-4 text-white bg-blue-500 rounded">Add Medicine</button>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="savePerson" class="p-2 text-white bg-green-500 rounded">Save</button>
          <button @click="showEditModal = false" class="p-2 ml-2 text-white bg-gray-500 rounded">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Medicine Modal -->
    <div v-if="showMedicineModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div class="w-1/3 p-4 bg-white rounded-lg">
        <h2 class="mb-2 text-xl">Add Medicine</h2>
        <input v-model="medicineSearchQuery" placeholder="Search Medicine" class="w-full p-2 mb-2 border rounded">
        <ul class="mt-4 overflow-y-auto max-h-60">
          <li v-for="medicine in filteredMedicines" :key="medicine.name" class="flex items-center justify-between mb-2 text-lg">
            <span>{{ medicine.name }}</span>
            <button @click="addMedicine(medicine)" class="p-2 text-white bg-green-500 rounded">Add</button>
          </li>
        </ul>
        <div class="flex justify-end mt-4">
          <button @click="showMedicineModal = false" class="p-2 ml-2 text-white bg-gray-500 rounded">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  textarea {
    resize: none;
  }
  .marquee {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    height: 1.5em;
  }
  .marquee:hover {
    animation: scroll-left 10s linear infinite;
  }
  @keyframes scroll-left {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100%);
    }
  }
  .confinement-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .confinement-details {
    flex-grow: 1;
    margin-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>