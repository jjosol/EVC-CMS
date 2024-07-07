<script setup>
import { ref, watch } from 'vue';

// Props to receive the current day from the parent component
const props = defineProps({
  currentDay: {
    type: Object,
    default: null
  }
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedPerson = ref(null);
const newPerson = ref({ name: '', section: '', age: '' });

// List to store names and other details
const people = ref([]);

// Watch the currentDay prop to load the corresponding list of names
watch(() => props.currentDay, (newVal) => {
  if (newVal && newVal.date) {
    // Load the list of names for the selected day
    // For demo purposes, we'll use a placeholder list
    people.value = [
    ];
  } else {
    people.value = [];
  }
});

const addPerson = () => {
  if (newPerson.value.name && newPerson.value.section && newPerson.value.age) {
    people.value.push({ ...newPerson.value });
    newPerson.value = { name: '', section: '', age: '' };
    showAddModal.value = false;
  }
};

const deletePerson = (index) => {
  people.value.splice(index, 1);
};

const openEditModal = (person) => {
  selectedPerson.value = { ...person };
  showEditModal.value = true;
};

const savePerson = () => {
  const index = people.value.findIndex(p => p.name === selectedPerson.value.name);
  if (index !== -1) {
    people.value[index] = { ...selectedPerson.value };
    showEditModal.value = false;
  }
};
</script>

<template>
  <div class="w-1/3 ml-9">
    <div class="p-4 border rounded-lg">
      <h2 class="mb-4 text-2xl font-bold">Selected Date: {{ props.currentDay && props.currentDay.date ? props.currentDay.date.toDateString() : 'None' }}</h2>
      <p class="text-lg">CONFINEMENTS</p>
      <ul class="mt-4 overflow-y-auto max-h-60">
        <li v-for="(person, index) in people" :key="index" class="flex items-center justify-between mb-2 text-lg">
          <span @click="openEditModal(person)" class="cursor-pointer">{{ person.name }} - {{ person.section }}</span>
          <button @click="deletePerson(index)" class="p-2 text-white bg-red-500 rounded">Delete</button>
        </li>
      </ul>
      <button @click="showAddModal = true" class="p-2 mt-4 text-white bg-blue-500 rounded">+</button>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div class="w-1/3 p-4 bg-white rounded-lg">
        <h2 class="mb-2 text-xl">Add Person</h2>
        <input v-model="newPerson.name" placeholder="Name" class="w-full p-2 mb-2 border rounded">
        <input v-model="newPerson.section" placeholder="Section" class="w-full p-2 mb-2 border rounded">
        <input v-model="newPerson.age" placeholder="Age" class="w-full p-2 mb-2 border rounded">
        <div class="flex justify-end mt-4">
          <button @click="addPerson" class="p-2 text-white bg-green-500 rounded">Add</button>
          <button @click="showAddModal = false" class="p-2 ml-2 text-white bg-gray-500 rounded">Cancel</button>
        </div>
      </div>
    </div>
    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div class="w-1/3 p-4 bg-white rounded-lg">
        <h2 class="mb-2 text-xl">Edit Person</h2>
        <input v-model="selectedPerson.name" placeholder="Name" class="w-full p-2 mb-2 border rounded">
        <input v-model="selectedPerson.section" placeholder="Section" class="w-full p-2 mb-2 border rounded">
        <input v-model="selectedPerson.age" placeholder="Age" class="w-full p-2 mb-2 border rounded">
        <div class="flex justify-end mt-4">
          <button @click="savePerson" class="p-2 text-white bg-green-500 rounded">Save</button>
          <button @click="showEditModal = false" class="p-2 ml-2 text-white bg-gray-500 rounded">Cancel</button>
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

  height: 1.5em; /* Set a fixed height */
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
</style>
