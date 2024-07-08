<script setup>
import { ref, onMounted } from 'vue';
import moment from 'moment-timezone';

const selectedYear = ref(moment().tz("Asia/Manila").year());
const selectedMonth = ref(moment().tz("Asia/Manila").month());
const years = Array.from({ length: 50 }, (_, i) => moment().tz("Asia/Manila").year() - 25 + i);
const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];
const calendar = ref([]);

const updateCalendar = () => {
  const firstDayOfMonth = moment.tz({ year: selectedYear.value, month: selectedMonth.value, day: 1 }, "Asia/Manila");
  const lastDayOfMonth = firstDayOfMonth.clone().endOf('month');
  const firstDayOfWeek = firstDayOfMonth.day();
  const daysInMonth = lastDayOfMonth.date();

  let daysArray = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push({ date: null });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({ date: moment.tz({ year: selectedYear.value, month: selectedMonth.value, day: i }, "Asia/Manila").toDate(), notes: "" });
  }
  while (daysArray.length % 7 !== 0) {
    daysArray.push({ date: null });
  }

  calendar.value = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    calendar.value.push(daysArray.slice(i, i + 7));
  }
};

const emit = defineEmits(['day-selected']);

const openAddingList = (day) => {
  if (day.date) {
    emit('day-selected', day);
  }
};

const isToday = (date) => {
  if (!date) return false;
  const today = moment.tz("Asia/Manila");
  const dayDate = moment(date).tz("Asia/Manila");
  return (
    dayDate.date() === today.date() && dayDate.month() === today.month() && dayDate.year() === today.year()
  );
};

onMounted(() => {
  updateCalendar();
});
</script>

<template>
  <div class="w-2/3 max-w-4xl p-8 border rounded-lg">
    <div class="flex items-center justify-center mb-8">
      <div class="flex space-x-4">
        <label for="month" class="mr-4 text-lg">Month:</label>
        <select id="month" v-model="selectedMonth" @change="updateCalendar" class="p-2 text-lg border rounded">
          <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
        </select>
      </div>
      <div class="flex ml-8 space-x-4">
        <label for="year" class="mr-4 text-lg">Year:</label>
        <select id="year" v-model="selectedYear" @change="updateCalendar" class="p-2 text-lg border rounded">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>
    <table class="w-full text-lg border border-collapse border-gray-300">
      <thead>
        <tr>
          <th class="p-4 border border-gray-300">Sun</th>
          <th class="p-4 border border-gray-300">Mon</th>
          <th class="p-4 border border-gray-300">Tue</th>
          <th class="p-4 border border-gray-300">Wed</th>
          <th class="p-4 border border-gray-300">Thu</th>
          <th class="p-4 border border-gray-300">Fri</th>
          <th class="p-4 border border-gray-300">Sat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in calendar" :key="week[0].date">
          <td v-for="day in week" :key="day.date" class="relative p-4 border border-gray-300">
            <div @click="openAddingList(day)" class="cursor-pointer">
              <span :class="{'bg-pink-600': isToday(day.date)}">{{ day.date ? day.date.getDate() : '' }}</span>
              <div v-if="day.notes" class="marquee">{{ day.notes }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
