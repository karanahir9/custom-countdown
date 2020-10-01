const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateElement =document.getElementById('date-picker');

const countdownElement = document.getElementById('countdown');
const countdownElementTitle = document.getElementById('countdown-title');   
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeElement = document.getElementById('complete');
const completeElementInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set date input Min to today's date
const today = new Date().toISOString().split('T')[0];
dateElement.setAttribute('min', today);

// Populate countdown / Complete UI
function updateDOM() {
   countdownActive = setInterval( () => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    //Hide input
    inputContainer.hidden = true;

    // If countdown has ended show complete
    if(distance < 0) {
        countdownElement.hidden = true;
        clearInterval(countdownActive);
        completeElementInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
        completeElement.hidden = false;
    }else {
        //Else show countdown in progress
        countdownElementTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`;
        completeElement.hidden = true;
        countdownElement.hidden = false;
    } 
   }, second);
}

//Take values from form input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown)); 
    //Check for valid date
    if(countdownDate === "") {
         alert("Please select a date for the countdown!");
    }else {
        //Get number version of current date, updateDOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// reset all values
function reset() {
    // Hide countdown and show input
    completeElement.hidden = true;
    countdownElement.hidden = true;
    inputContainer.hidden = false;
    
    // Stop the countdown
    clearInterval(countdownActive);
    //Reset Values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

// Restore Previous countdown
function restorePreviousCountdown() {
    //Get countdown from local storage if available
    if(localStorage.getItem('countdown')){
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On load check local storage
restorePreviousCountdown();