const holes = document.querySelectorAll(".hole"); //produces a node list with 6 elements
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const countdownBoard = document.querySelector(".countdown");
const startButton = document.querySelector(".startButton");
const quizScore = document.querySelector(".quizScore");

let lastHole;
let timeUp = false;
let timeLimit = 30000; //30 seconds
let score = 0;
let countdown;

function pickRandomHole(holes) {
  const randomHole = Math.floor(Math.random() * holes.length);
  const hole = holes[randomHole]; //selects a random hole
  if (hole === lastHole) {
    //prevents the same mole being selected twice in succession
    return pickRandomHole(holes);
  }
  lastHole = hole;
  return hole; //returns the selcted hole
}

function popOut() {
  const time = Math.random() * 1200;
  const hole = pickRandomHole(holes); //select random hole from the 6 available
  hole.classList.add("up"); //add the 'up' class to the selected hole. Results in the 'top' value in the .mole class being changed from 100% to 0 (i.e. the mole appears)
  setTimeout(function () {
    hole.classList.remove("up"); //makes the mole slide back down again after 'time' has elapsed
    if (!timeUp) popOut();
  }, time);
}

function startGame() {
  countdown = timeLimit / 1000;
  scoreBoard.textContent = 0;
  scoreBoard.style.display = "block"; //makes the score visible when the game is started
  countdownBoard.textContent = countdown;
  quizScore.style.display = "none";
  timeUp = false;
  score = 0;
  popOut();
  setTimeout(function () {
    //runs the callback function once the timeLimit has been reached
    timeUp = true;
    scoreBoard.style.display = "none";
    quizScore.style.display = "block";
  }, timeLimit); //the above happens when the game has ended

  let startCountdown = setInterval(function () {
    //runs the callback function every specified time period until clearInterval is called
    countdown -= 1;
    countdownBoard.textContent = countdown;
    if (countdown > 0) {
      startButton.style.pointerEvents = "none";
    }
    if (countdown < 0) {
      countdown = 0;
      startButton.style.pointerEvents = "all";
      clearInterval(startCountdown); //clearInterval is only called once the time has elapsed
      countdownBoard.textContent = "Time's up";
      let quizResult = 0;
      switch (true) {
        case score >= 30:
          quizResult = 3;
          quizScore.textContent = `Congratulations, you scored ${quizResult} quiz points - you really enjoyed hitting Mark!`;
          break;
        case score >= 25:
          quizResult = 2.5;
          quizScore.textContent = `Congratulations, you scored ${quizResult} quiz points - you gave Mark a good hiding!`;
          break;
        case score >= 20:
          quizResult = 2;
          quizScore.textContent = `Congratulations, you scored ${quizResult} quiz points - well done on giving Mark a beating!`;
          break;
        case score >= 15:
          quizResult = 1.5;
          quizScore.textContent = `Congratulations, you scored ${quizResult} quiz points - don't you feel better for whacking Mark!`;
          break;
        case score >= 10:
          quizResult = 1;
          quizScore.textContent = `Congratulations, you scored ${quizResult} quiz point - start each day by hitting Mark a few times!`;
          break;
        case score >= 5:
          quizResult = 0.5;
          quizScore.textContent = `Congratulations, you scored ${quizResult} quiz points - you could have hit Mark a few more times!`;
          break;
        case score >= 0:
          quizResult = 0;
          quizScore.textContent = `Commiserations, you scored ${quizResult} quiz points - you definitely need to hit Mark more often!`;
      }
      
    }
  }, 1000);
}
startButton.addEventListener("click", startGame);

function whack(e) {
  score++;
  this.style.backgroundImage = 'url("./images/hitMark.png")'; //change the image to show when the mole is hit
  this.style.pointerEvents = "none"; //disables all mouse interactions with that element - prevents multiple hits on the same mole at the same time
  setTimeout(() => {
    //used an ES6 arrow function which includes the 'bind' method automatically.  This is necessary because after the setTimeout period, 'this' no longer refers to the object (i.e. the mole that was hit).  This is because after after the setTimeout period, it has been removed from the execution stack
    this.style.backgroundImage = 'url("./images/bigMark.png")';
    this.style.pointerEvents = "all"; //allows that mole to be hit next time it pops up after the setTimeout period
  }, 200);
  scoreBoard.textContent = score;
}
moles.forEach((mole) => mole.addEventListener("click", whack)); //moles is a node list, so have to use forEach
