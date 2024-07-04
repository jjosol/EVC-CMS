<template>
    <div class="max-w-xl p-4 mx-auto border rounded-lg">
      <div class="flex items-center justify-center mb-4">
        <div class="flex space-x-2">
          <label for="month" class="mr-2">Month:</label>
          <select id="month" v-model="selectedMonth" @change="updateCalendar" class="p-2 border rounded">
            <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
          </select>
        </div>
        <div class="flex ml-4 space-x-2">
          <label for="year" class="mr-2">Year:</label>
          <select id="year" v-model="selectedYear" @change="updateCalendar" class="p-2 border rounded">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>
      <table class="w-full border border-collapse border-gray-300">
        <thead>
          <tr>
            <th class="p-2 border border-gray-300">Sun</th>
            <th class="p-2 border border-gray-300">Mon</th>
            <th class="p-2 border border-gray-300">Tue</th>
            <th class="p-2 border border-gray-300">Wed</th>
            <th class="p-2 border border-gray-300">Thu</th>
            <th class="p-2 border border-gray-300">Fri</th>
            <th class="p-2 border border-gray-300">Sat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="week in calendar" :key="week[0].date">
            <td v-for="day in week" :key="day.date" class="relative p-2 border border-gray-300">
              <div @click="openModal(day)" class="cursor-pointer">
                <span :class="{'bg-blue-100': isToday(day.date)}">{{ day.date ? day.date.getDate() : '' }}</span>
                <div v-if="day.notes" class="marquee">{{ day.notes }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div class="w-1/3 p-4 bg-white rounded-lg">
          <h2 class="mb-2 text-xl">Edit Note</h2>
          <textarea v-model="currentNote" class="w-full h-24 p-2 border rounded"></textarea>
          <div class="flex justify-end mt-4 space-x-2">
            <button @click="saveNote" class="p-2 text-white bg-blue-500 rounded">Save</button>
            <button @click="closeModal" class="p-2 text-white bg-gray-500 rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import moment from 'moment-timezone';
  
  export default {
    data() {
      return {
        selectedYear: moment().tz("Asia/Manila").year(),
        selectedMonth: moment().tz("Asia/Manila").month(),
        years: Array.from({ length: 50 }, (_, i) => moment().tz("Asia/Manila").year() - 25 + i),
        months: [
          "January", "February", "March", "April", "May", "June", 
          "July", "August", "September", "October", "November", "December"
        ],
        calendar: [],
        showModal: false,
        currentDay: null,
        currentNote: '',
      };
    },
    methods: {
      updateCalendar() {
        const firstDayOfMonth = moment.tz({ year: this.selectedYear, month: this.selectedMonth, day: 1 }, "Asia/Manila");
        const lastDayOfMonth = firstDayOfMonth.clone().endOf('month');
        const firstDayOfWeek = firstDayOfMonth.day();
        const daysInMonth = lastDayOfMonth.date();
  
        let daysArray = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
          daysArray.push({ date: null, notes: "", isEditing: false });
        }
        for (let i = 1; i <= daysInMonth; i++) {
          daysArray.push({ date: moment.tz({ year: this.selectedYear, month: this.selectedMonth, day: i }, "Asia/Manila").toDate(), notes: "", isEditing: false });
        }
        while (daysArray.length % 7 !== 0) {
          daysArray.push({ date: null, notes: "", isEditing: false });
        }
  
        this.calendar = [];
        for (let i = 0; i < daysArray.length; i += 7) {
          this.calendar.push(daysArray.slice(i, i + 7));
        }
      },
      openModal(day) {
        if (day.date) {
          this.currentDay = day;
          this.currentNote = day.notes;
          this.showModal = true;
        }
      },
      closeModal() {
        this.showModal = false;
        this.currentDay = null;
        this.currentNote = '';
      },
      saveNote() {
        if (this.currentDay) {
          this.$set(this.currentDay, 'notes', this.currentNote);
        }
        this.closeModal();
      },
      isToday(date) {
        if (!date) return false;
        const today = moment.tz("Asia/Manila");
        const dayDate = moment(date).tz("Asia/Manila");
        return (
          dayDate.date() === today.date() &&
          dayDate.month() === today.month() &&
          dayDate.year() === today.year()
        );
      },
    },
    mounted() {
      this.updateCalendar();
    },
  };
  </script>
  
  <style scoped>
  textarea {
    resize: none;
  }
  .marquee {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
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
  