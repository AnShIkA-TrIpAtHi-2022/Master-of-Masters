
const API_KEY = "3d9d230ab8mshb82d62d1db3fafap152239jsn2afb51b9ab40";
const API_HOST = "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com";


let questions = new Array(10).fill(null);
let currentQuestionIndex = 0;
let answers = new Array(10).fill(null);
let score = 0;


window.onload = initializeQuiz;

function initializeQuiz() {
    generateQuestion(currentQuestionIndex);
}

async function generateQuestion(index) {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = "<p>Loading question...</p>";

    try {
        if (!questions[index]) {
            const userQuestion = `Generate a unique OS MCQ question about ${getTopicForIndex(index)} with exactly this format:
Question: [your question]
A) [option1]
B) [option2]
C) [option3]
D) [option4]
Correct: [A/B/C/D]`;

            const payload = {
                model: "gpt-4-turbo-preview",
                messages: [{ role: "user", content: userQuestion }],
                max_tokens: 300,
                temperature: 0.9,
            };

            const response = await fetch(`https://${API_HOST}/v1/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": API_KEY,
                    "X-RapidAPI-Host": API_HOST,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            questions[index] = parseQuestion(data.choices[0].message.content);
            
            
            if (!questions[index].options || questions[index].options.length !== 4 || !questions[index].correctAnswer) {
                throw new Error("Invalid question format received");
            }
        }

        renderQuestion(index);
    } catch (error) {
        console.error(error);
        quizContainer.innerHTML = `<p>Error: ${error.message}</p>
            <button onclick="generateQuestion(${index})">Retry</button>`;
    }
}

// Function to get different topics for each question
function getTopicForIndex(index) {
    const topics = [
        "Process Management",
        "Memory Management",
        "File Systems",
        "Deadlocks",
        "CPU Scheduling",
        "Virtual Memory",
        "Synchronization",
        "I/O Systems",
        "Protection and Security",
        "Distributed Systems"
    ];
    return topics[index];
}

function parseQuestion(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    // Extract question
    const questionLine = lines.find(line => line.startsWith('Question:'));
    if (!questionLine) throw new Error("Question format invalid");
    const questionText = questionLine.replace('Question:', '').trim();
    
    // Extract options
    const options = [];
    const optionRegex = /^([A-D])\)\s*(.+)$/;
    const optionLines = lines.filter(line => optionRegex.test(line));
    
    if (optionLines.length !== 4) throw new Error("Invalid number of options");
    
    optionLines.forEach(line => {
        const match = line.match(optionRegex);
        if (match) {
            options.push(match[2].trim());
        }
    });
    
    // Extract correct answer
    const correctLine = lines.find(line => line.toLowerCase().startsWith('correct:'));
    if (!correctLine) throw new Error("No correct answer specified");
    
    const correctLetter = correctLine.match(/[A-D]/)?.[0];
    if (!correctLetter) throw new Error("Invalid correct answer format");
    
    const correctIndex = correctLetter.charCodeAt(0) - 65; // Convert A=0, B=1, etc.
    const correctAnswer = options[correctIndex];

    return {
        questionText,
        options,
        correctAnswer,
        correctLetter // Keep track of the letter for verification
    };
}
function renderQuestion(index) {
    const quizContainer = document.getElementById("quiz");
    const question = questions[index];

    if (!question || !question.options || question.options.length !== 4) {
        quizContainer.innerHTML = "<p>Error loading question. Please try again.</p>";
        return;
    }

    quizContainer.innerHTML = `
        <div class="question">
            <p><strong>Question ${index + 1} of 10</strong></p>
            <p>${question.questionText}</p>
            <div class="options">
                ${['A', 'B', 'C', 'D'].map((letter, i) => `
                    <div class="option">
                        <input type="radio" 
                               id="option${i}" 
                               name="question${index}" 
                               value="${question.options[i]}"
                               ${answers[index] === question.options[i] ? 'checked' : ''}>
                        <label for="option${i}">${letter}) ${question.options[i]}</label>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="navigation">
            ${index > 0 ? `<button onclick="prevQuestion()">Previous</button>` : ''}
            ${index < 9 ? 
                `<button onclick="nextQuestion()">Next</button>` : 
                `<button onclick="submitQuiz()">Submit Quiz</button>`}
        </div>
    `;
}
function prevQuestion() {
    saveAnswer();
    currentQuestionIndex--;
    renderQuestion(currentQuestionIndex);
}

function nextQuestion() {
    saveAnswer();
    currentQuestionIndex++;
    // Generate next question if it doesn't exist
    if (!questions[currentQuestionIndex]) {
        generateQuestion(currentQuestionIndex);
    } else {
        renderQuestion(currentQuestionIndex);
    }
}

function saveAnswer() {
    const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
    if (selectedOption) {
        answers[currentQuestionIndex] = selectedOption.value;
    }
}

function submitQuiz() {
    saveAnswer();
    score = questions.reduce((total, question, index) => {
        return total + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>Your Score: ${score} out of 10</p>
        <button onclick="showAnswers()">Show Answers</button>
    `;
}

function showAnswers() {
    const quizContainer = document.getElementById("quiz");
    let answersHTML = `
        <h2>Quiz Results</h2>
        <p>Your Score: ${score} out of 10</p>
        <div class="answers-review">
    `;

    questions.forEach((question, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        answersHTML += `
            <div class="question-review ${isCorrect ? 'correct' : 'incorrect'}">
                <p><strong>Question ${index + 1}:</strong> ${question.questionText}</p>
                <div class="all-options">
                    ${question.options.map((option, i) => `
                        <div class="review-option ${option === question.correctAnswer ? 'correct-answer' : ''} 
                                                 ${option === userAnswer ? 'user-answer' : ''}">
                            ${['A', 'B', 'C', 'D'][i]}) ${option}
                            ${option === question.correctAnswer ? ' ✓' : ''}
                            ${option === userAnswer && !isCorrect ? ' ✗' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    answersHTML += `
        </div>
        <button onclick="restartQuiz()">Back to Home</button>
    `;

    quizContainer.innerHTML = answersHTML;
}

function restartQuiz() {
    questions = new Array(10).fill(null);
    currentQuestionIndex = 0;
    answers = new Array(10).fill(null);
    score = 0;
    initializeQuiz();
    window.location.href="../home.html";
}
