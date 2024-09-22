'use strict'
var startTime
var timerInterval
var isRunning = false
function startTimer() {
  startTime = Date.now()
  timerInterval = setInterval(updateTimer, 50) // Update the timer every 50 milliseconds
  isRunning = true
}

// Update the timer display
function updateTimer() {
  var elapsedTime = Date.now() - startTime
  var minutes = Math.floor(elapsedTime / (1000 * 60)) // Calculate the minutes
  var seconds = Math.floor((elapsedTime / 1000) % 60) // Calculate the seconds

  minutes = String(minutes).padStart(2, '0') // Format minutes to always have two digits
  seconds = String(seconds).padStart(2, '0') // Format seconds to always have two digits

  // Update the timer display to show minutes, seconds, and milliseconds
  document.querySelector('.stopWatch').textContent = `${minutes}:${seconds}`
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval) // Clear the interval to stop updating the timer
  isRunning = false // Set the flag indicating the timer is no longer running
}

// Reset the timer
function resetTimer() {
  clearInterval(timerInterval) // Clear the interval
  isRunning = false // Set the flag indicating the timer is not running
  startTime = 0 // Reset the start time
  document.querySelector('.stopWatch').textContent = '00:00' // Reset the timer display
}
