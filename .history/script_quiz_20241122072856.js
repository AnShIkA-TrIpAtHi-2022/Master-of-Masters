let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion = 50; // Time per question in seconds
let totalTime = 0;
let timeLeft;
let startTime, endTime;

// Parse URL parameters
const urlParams = new URLSearchParams(window.location.search);
const numQuestions = parseInt(urlParams.get('questions')) || 5;  // Default to 5 if not specified
const difficulty = urlParams.get('difficulty') || 'random';  // Default to 'random' if not specified

// Load questions based on parameters
async function loadQuestions() {
    // Fetch questions (replace with actual questions file)
    const response = await fetch('questions.json');
    const allQuestions = await response.json();

    // Filter questions by difficulty if needed
    if (difficulty !== 'random') {
        questions = allQuestions.filter(q => q.difficulty === difficulty);
    } else {
        questions = allQuestions;
    }

    // Shuffle questions and select the first 'numQuestions' questions
    shuffleQuestions(questions);
    questions = questions.slice(0, numQuestions); // Select number of questions
    totalTime = questions.length * timePerQuestion;  // Set total time
    timeLeft = totalTime;  // Initialize timeLeft with total time
    loadQuestion();  // Call to load the first question
}

// Shuffle questions (Fisher-Yates algorithm)
function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
}

// Load question and options
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question").innerText = question.question;
    const options = document.getElementsByClassName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].innerText = question.options[i];
    }
    if (currentQuestionIndex === 0) {
        startTimer();  // Start the timer when the first question is loaded
    }
}

function startTimer() {
    clearInterval(timer);  // Clear any existing timer
    timeLeft = totalTime;  // Reset timer
    updateTimerDisplay();  // Update display
    startTime = Date.now();  // Start time capture
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            showScore();  // Show score when time is up
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").innerText = `Time: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

function checkAnswer(selectedOptionIndex) {
    const correctAnswerIndex = questions[currentQuestionIndex].correct;
    if (selectedOptionIndex === correctAnswerIndex) {
        score++;
    }
    if (currentQuestionIndex < questions.length - 1) {
        nextQuestion();
    } else {
        clearInterval(timer);
        endTime = Date.now();
        showScore();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function showScore() {
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2); // Calculate time taken
    document.getElementById("score").innerText = `${score} / ${questions.length}`;
    document.getElementById("completion-time").innerText = `Time Taken: ${timeTaken} seconds`;
    document.getElementById("score-popup").style.display = "flex";  // Show the pop-up
}

function closePopup() {
    document.getElementById("score-popup").style.display = "none"; 
    window.location.href="home.html" // Hide the pop-up
}

// Load questions when the page loads
window.onload = loadQuestions;
