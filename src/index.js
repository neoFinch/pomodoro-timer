const timerFace = document.querySelector(".timer-face");
const timerFill = document.querySelector(".timer-fill");
const hand = document.querySelector(".hand");

function createMarkers(min) {
  // create markers
  let deg = Math.floor(360 / min);
  console.log({ deg });
  for (let i = 0; i < min; i++) {
    const marker = document.createElement("div");
    marker.className = "marker";
    marker.style.transform = `rotate(${i * deg}deg)`;

    if (i % 5 === 0) {
      marker.style.width = "4px";
      const text = document.createElement("div");
      text.className = "marker-text";
      text.textContent = i;
      marker.appendChild(text);
    }

    timerFace.appendChild(marker);
  }
}

/**
 * @type {HTMLAudioElement}
 * */
let audioEl = document.getElementById("timer-sound");

const maxSet = 2;
const maxRepition = 4;
const decrementBy = 1;
const initialTimer = 25;
const minSetTime = 2;
const maxSetTime = 45;

document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    minToDeg: 12,
    minTime: minSetTime,
    maxTime: maxSetTime,
    wholeSetCompleted: 0,
    maxSet: maxSet,
    maxRepition: maxRepition,
    set: 0,
    repition: 0,
    phase: "start",
    showTimerInput: true,
    count: 0,
    timer: null,
    initialTimer: initialTimer,
    formattedTime: "XX:XX",

    startTimer() {
      createMarkers(this.initialTimer);
      this.minToDeg = 360 / this.initialTimer;
      if (this.set === this.maxSet && this.repition === this.maxRepition) {
        this.set = 0;
        this.repition = 0;
        this.wholeSetCompleted++;
      }
      if (this.set === 0 && this.repition === 0) {
        this.set = 1;
        this.repition = 1;
      } else {
        this.set = this.repition === 4 ? this.set + 1 : this.set;
        this.repition = this.repition === 4 ? 1 : this.repition + 1;
      }
      this.phase = "progress";
      this.showTimerInput = false;
      let totalSeconds = this.initialTimer * 60;
      this.count = totalSeconds;
      this.timer = setInterval(() => {
        this.count -= decrementBy;
        // seconds to hour and minutes
        let minutes = Math.floor((this.count % 3600) / 60);
        let seconds = this.count % 60;
        if (minutes < 10) {
          minutes = `0${minutes}`;
        }
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
        this.formattedTime = `${minutes}:${seconds}`;
        this.updateTimer2();
        if (this.count <= 0) {
          this.phase = "completed";
          audioEl.play();
          this.stopTimer();
        }
      }, 1000);
    },

    stopTimer() {
      this.formattedTime = "XX:XX";
      this.showTimerInput = true;
      clearInterval(this.timer);

      timerFill.style.background = `conic-gradient(
        #4CAF50 0deg,
        transparent 0deg
      )`;

      hand.style.transform = `translateX(50%) rotate(0deg)`;
    },

    pauseTimer() {
      clearInterval(this.timer);
      this.phase = "paused";
    },

    resumeTimer() {
      
      this.phase = "progress";
      this.timer = setInterval(() => {
        this.count -= decrementBy;
        // seconds to hour and minutes
        let minutes = Math.floor((this.count % 3600) / 60);
        let seconds = this.count % 60;
        if (minutes < 10) {
          minutes = `0${minutes}`;
        }
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
        this.formattedTime = `${minutes}:${seconds}`;
        this.updateTimer2();
        if (this.count <= 0) {
          this.phase = "completed";
          audioEl.play();
          this.stopTimer();
        }
      }, 1000);
    },

    restart() {
      clearInterval(this.timer);

      this.minTime = minSetTime;
      this.maxTime = maxSetTime;
      this.wholeSetCompleted = 0;
      this.maxSet = maxSet;
      this.maxRepition = maxRepition;
      this.set = 0;
      this.repition = 0;
      this.phase = "start";
      this.showTimerInput = true;
      this.count = 0;
      this.timer = null;
      this.initialTimer = initialTimer;
      this.formattedTime = "XX:XX";
    },

    updateTimer2() {
      let minutes = ((this.count % 3600) / 60).toFixed(2);
      const degrees = ((this.initialTimer - minutes) * this.minToDeg).toFixed(
        2
      );

      console.log({degrees, minutes})

      timerFill.style.background = `conic-gradient(
        #4CAF50 ${degrees}deg,
        transparent ${degrees}deg
      )`;

      hand.style.transform = `translateX(50%) rotate(${degrees}deg)`;
    },
  })); // end of alpine data
});
