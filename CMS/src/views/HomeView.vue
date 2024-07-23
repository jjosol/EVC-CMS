  <script setup>
  import { ref } from 'vue';
  import NavBar from '../components/NavBar.vue'
  import Calendar from '../components/Calendar.vue';
  import AddList from '../components/AddList.vue';

  const currentDay = ref({ date: new Date() });

  // Handler to update the current day selected in the calendar
  const handleDaySelected = (day) => {
    currentDay.value = day;
  };
  </script>

  <template>
  <NavBar/>
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex w-full max-w-6xl">
        <Calendar @day-selected="handleDaySelected" /> 
        <AddList :current-day="currentDay" />
      </div>
    </div>
  </template>
