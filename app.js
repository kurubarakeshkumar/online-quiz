// Quiz Application Data
const QUIZ_DATA = {
    "General Knowledge": [
        {
            id: 1,
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correct: 2
        },
        {
            id: 2,
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correct: 1
        },
        {
            id: 3,
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            correct: 3
        },
        {
            id: 4,
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
            correct: 1
        },
        {
            id: 5,
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correct: 2
        }
    ],
    "Computer Science": [
        {
            id: 1,
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
            correct: 0
        },
        {
            id: 2,
            question: "Which of these is a JavaScript framework?",
            options: ["Django", "Laravel", "React", "Rails"],
            correct: 2
        },
        {
            id: 3,
            question: "What does CSS stand for?",
            options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
            correct: 2
        },
        {
            id: 4,
            question: "Which HTTP method is used to retrieve data?",
            options: ["POST", "GET", "PUT", "DELETE"],
            correct: 1
        },
        {
            id: 5,
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
            correct: 1
        }
    ],
    "Verbal Reasoning": [
        {
            id: 1,
            question: "Choose the word that best completes the analogy: Book is to Reading as Fork is to ___",
            options: ["Eating", "Kitchen", "Spoon", "Food"],
            correct: 0
        },
        {
            id: 2,
            question: "Which word is the opposite of 'abundant'?",
            options: ["Scarce", "Plenty", "Rich", "Full"],
            correct: 0
        },
        {
            id: 3,
            question: "If all roses are flowers and some flowers are red, which statement is definitely true?",
            options: ["All roses are red", "Some roses are red", "Some flowers are roses", "All red things are flowers"],
            correct: 2
        },
        {
            id: 4,
            question: "Choose the word that doesn't belong: Apple, Orange, Carrot, Banana",
            options: ["Apple", "Orange", "Carrot", "Banana"],
            correct: 2
        },
        {
            id: 5,
            question: "Complete the sequence: Monday, Wednesday, Friday, ___",
            options: ["Saturday", "Sunday", "Tuesday", "Thursday"],
            correct: 1
        }
    ]
};

// Global Quiz State
let quizState = {
    username: '',
    category: '',
    currentQuestion: 0,
    score: 0,
    answers: [],
    timeLeft: 600,
    timer: null,
    startTime: null,
    endTime: null,
    selectedAnswer: null,
    isQuizActive: false
};

// DOM Elements
let elements = {};

// Initialize when DOM is ready
function initQuizApp() {
    // Cache DOM elements
    elements = {
        // Landing page
        usernameInput: document.getElementById('username'),
        categorySelect: document.getElementById('category'),
        startBtn: document.getElementById('start-quiz-btn'),
        
        // Quiz page
        quizCategory: document.getElementById('quiz-category'),
        userGreeting: document.getElementById('user-greeting'),
        currentScore: document.getElementById('current-score'),
        timer: document.getElementById('timer'),
        progressFill: document.getElementById('progress-fill'),
        questionCounter: document.getElementById('question-counter'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        nextBtn: document.getElementById('next-btn'),
        
        // Results page
        resultsGreeting: document.getElementById('results-greeting'),
        finalScore: document.getElementById('final-score'),
        percentage: document.getElementById('percentage'),
        correctCount: document.getElementById('correct-count'),
        wrongCount: document.getElementById('wrong-count'),
        timeTaken: document.getElementById('time-taken'),
        resultsCategory: document.getElementById('results-category'),
        performanceBadge: document.getElementById('performance-badge'),
        retryBtn: document.getElementById('retry-btn'),
        newCategoryBtn: document.getElementById('new-category-btn'),
        shareBtn: document.getElementById('share-btn')
    };
    
    bindEvents();
}

function bindEvents() {
    // Landing page events
    if (elements.usernameInput) {
        elements.usernameInput.addEventListener('input', validateForm);
    }
    if (elements.categorySelect) {
        elements.categorySelect.addEventListener('change', validateForm);
    }
    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', startQuiz);
    }
    
    // Quiz page events
    if (elements.nextBtn) {
        elements.nextBtn.addEventListener('click', handleNextButton);
    }
    
    // Results page events
    if (elements.retryBtn) {
        elements.retryBtn.addEventListener('click', retryQuiz);
    }
    if (elements.newCategoryBtn) {
        elements.newCategoryBtn.addEventListener('click', newCategory);
    }
    if (elements.shareBtn) {
        elements.shareBtn.addEventListener('click', shareResults);
    }
}

function validateForm() {
    const username = elements.usernameInput.value.trim();
    const category = elements.categorySelect.value;
    
    if (username && category) {
        elements.startBtn.disabled = false;
        elements.startBtn.classList.remove('btn--disabled');
    } else {
        elements.startBtn.disabled = true;
        elements.startBtn.classList.add('btn--disabled');
    }
}

function startQuiz(e) {
    if (e) e.preventDefault();
    
    // Get form data
    quizState.username = elements.usernameInput.value.trim();
    quizState.category = elements.categorySelect.value;
    quizState.currentQuestion = 0;
    quizState.score = 0;
    quizState.answers = [];
    quizState.timeLeft = 600;
    quizState.startTime = Date.now();
    quizState.endTime = null;
    quizState.selectedAnswer = null;
    quizState.isQuizActive = true;
    
    // Show quiz page
    showPage('quiz');
    updateQuizHeader();
    displayQuestion();
    startTimer();
}

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-container');
    pages.forEach(page => page.classList.add('hidden'));
    
    // Show target page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
}

function updateQuizHeader() {
    if (elements.quizCategory) {
        elements.quizCategory.textContent = quizState.category;
    }
    if (elements.userGreeting) {
        elements.userGreeting.textContent = `Welcome, ${quizState.username}!`;
    }
    if (elements.currentScore) {
        elements.currentScore.textContent = quizState.score;
    }
}

function displayQuestion() {
    const questions = QUIZ_DATA[quizState.category];
    const current = questions[quizState.currentQuestion];
    
    // Update progress
    const progress = ((quizState.currentQuestion + 1) / questions.length) * 100;
    if (elements.progressFill) {
        elements.progressFill.style.width = progress + '%';
    }
    if (elements.questionCounter) {
        elements.questionCounter.textContent = `Question ${quizState.currentQuestion + 1} of ${questions.length}`;
    }
    
    // Show question
    if (elements.questionText) {
        elements.questionText.textContent = current.question;
    }
    
    // Show options
    if (elements.optionsContainer) {
        elements.optionsContainer.innerHTML = '';
        
        current.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option}</span>
            `;
            btn.onclick = () => selectAnswer(index);
            elements.optionsContainer.appendChild(btn);
        });
    }
    
    // Reset next button
    if (elements.nextBtn) {
        elements.nextBtn.disabled = true;
        const isLastQuestion = quizState.currentQuestion === questions.length - 1;
        elements.nextBtn.textContent = isLastQuestion ? 'Finish Quiz' : 'Next Question';
    }
    
    quizState.selectedAnswer = null;
}

function selectAnswer(answerIndex) {
    // Remove previous selections
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Mark selected option
    const options = document.querySelectorAll('.option-btn');
    if (options[answerIndex]) {
        options[answerIndex].classList.add('selected');
    }
    
    quizState.selectedAnswer = answerIndex;
    
    // Enable next button
    if (elements.nextBtn) {
        elements.nextBtn.disabled = false;
    }
    
    // Show feedback
    showAnswerFeedback();
}

function showAnswerFeedback() {
    const questions = QUIZ_DATA[quizState.category];
    const current = questions[quizState.currentQuestion];
    const correctIndex = current.correct;
    
    document.querySelectorAll('.option-btn').forEach((btn, index) => {
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === quizState.selectedAnswer && index !== correctIndex) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });
}

function handleNextButton() {
    const questions = QUIZ_DATA[quizState.category];
    const current = questions[quizState.currentQuestion];
    
    // Record answer
    const isCorrect = quizState.selectedAnswer === current.correct;
    quizState.answers.push({
        questionId: current.id,
        selected: quizState.selectedAnswer,
        correct: current.correct,
        isCorrect: isCorrect
    });
    
    // Update score
    if (isCorrect) {
        quizState.score++;
        if (elements.currentScore) {
            elements.currentScore.textContent = quizState.score;
        }
    }
    
    // Move to next question or finish
    quizState.currentQuestion++;
    
    // Check if quiz is complete
    if (quizState.currentQuestion >= questions.length) {
        finishQuiz();
    } else {
        // Add small delay for better UX
        setTimeout(() => {
            displayQuestion();
        }, 300);
    }
}

function startTimer() {
    // Stop any existing timer first
    if (quizState.timer) {
        clearInterval(quizState.timer);
    }
    
    updateTimerDisplay();
    
    quizState.timer = setInterval(() => {
        if (!quizState.isQuizActive) {
            clearInterval(quizState.timer);
            return;
        }
        
        quizState.timeLeft--;
        updateTimerDisplay();
        
        // Time's up
        if (quizState.timeLeft <= 0) {
            finishQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    // Ensure time doesn't go negative
    const timeRemaining = Math.max(0, quizState.timeLeft);
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timeString = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    
    if (elements.timer) {
        elements.timer.textContent = timeString;
        elements.timer.classList.remove('timer-warning', 'timer-danger');
        
        if (timeRemaining <= 60 && timeRemaining > 0) {
            elements.timer.classList.add('timer-danger');
        } else if (timeRemaining <= 180 && timeRemaining > 60) {
            elements.timer.classList.add('timer-warning');
        }
    }
}

function finishQuiz() {
    // Stop the quiz immediately
    quizState.isQuizActive = false;
    quizState.endTime = Date.now();
    
    // Clear timer
    if (quizState.timer) {
        clearInterval(quizState.timer);
        quizState.timer = null;
    }
    
    // If we haven't completed all questions, record remaining as unanswered
    const questions = QUIZ_DATA[quizState.category];
    while (quizState.answers.length < questions.length) {
        const questionIndex = quizState.answers.length;
        quizState.answers.push({
            questionId: questions[questionIndex].id,
            selected: null,
            correct: questions[questionIndex].correct,
            isCorrect: false
        });
    }
    
    // Show results immediately
    showResults();
}

function showResults() {
    showPage('results');
    
    const questions = QUIZ_DATA[quizState.category];
    const total = questions.length;
    const correct = quizState.score;
    const wrong = total - correct;
    const percentage = Math.round((correct / total) * 100);
    
    // Calculate time taken
    const timeUsedMs = quizState.endTime - quizState.startTime;
    const timeUsedSeconds = Math.floor(timeUsedMs / 1000);
    const minutes = Math.floor(timeUsedSeconds / 60);
    const seconds = timeUsedSeconds % 60;
    const timeFormatted = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    
    // Update results display
    if (elements.resultsGreeting) {
        elements.resultsGreeting.textContent = `Great job, ${quizState.username}!`;
    }
    if (elements.finalScore) {
        elements.finalScore.textContent = correct;
    }
    if (elements.percentage) {
        elements.percentage.textContent = percentage + '%';
    }
    if (elements.correctCount) {
        elements.correctCount.textContent = correct;
    }
    if (elements.wrongCount) {
        elements.wrongCount.textContent = wrong;
    }
    if (elements.timeTaken) {
        elements.timeTaken.textContent = timeFormatted;
    }
    if (elements.resultsCategory) {
        elements.resultsCategory.textContent = quizState.category;
    }
    
    // Performance badge
    if (elements.performanceBadge) {
        elements.performanceBadge.classList.remove('excellent', 'good', 'needs-improvement');
        
        if (percentage >= 80) {
            elements.performanceBadge.textContent = 'Excellent! 🎉';
            elements.performanceBadge.classList.add('excellent');
        } else if (percentage >= 60) {
            elements.performanceBadge.textContent = 'Good Job! 👍';
            elements.performanceBadge.classList.add('good');
        } else {
            elements.performanceBadge.textContent = 'Keep Practicing! 📚';
            elements.performanceBadge.classList.add('needs-improvement');
        }
    }
}

function retryQuiz() {
    // Reset quiz state but keep user info
    quizState.currentQuestion = 0;
    quizState.score = 0;
    quizState.answers = [];
    quizState.timeLeft = 600;
    quizState.startTime = Date.now();
    quizState.endTime = null;
    quizState.selectedAnswer = null;
    quizState.isQuizActive = true;
    
    // Clear any existing timer
    if (quizState.timer) {
        clearInterval(quizState.timer);
        quizState.timer = null;
    }
    
    showPage('quiz');
    updateQuizHeader();
    displayQuestion();
    startTimer();
}

function newCategory() {
    // Stop any running timer
    if (quizState.timer) {
        clearInterval(quizState.timer);
        quizState.timer = null;
    }
    
    // Reset form but keep username
    if (elements.usernameInput) {
        elements.usernameInput.value = quizState.username;
    }
    if (elements.categorySelect) {
        elements.categorySelect.value = '';
    }
    if (elements.startBtn) {
        elements.startBtn.disabled = true;
    }
    
    // Reset state
    quizState.category = '';
    quizState.currentQuestion = 0;
    quizState.score = 0;
    quizState.answers = [];
    quizState.selectedAnswer = null;
    quizState.isQuizActive = false;
    quizState.timeLeft = 600;
    quizState.startTime = null;
    quizState.endTime = null;
    
    showPage('landing');
}

function shareResults() {
    const questions = QUIZ_DATA[quizState.category];
    const percentage = Math.round((quizState.score / questions.length) * 100);
    const shareText = `I just scored ${quizState.score}/${questions.length} (${percentage}%) on the ${quizState.category} quiz in the Modern Quiz System! 🎯`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Quiz Results',
            text: shareText,
            url: window.location.href
        }).catch(() => {
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        }).catch(() => {
            alert('Share your results:\n\n' + text);
        });
    } else {
        alert('Share your results:\n\n' + text);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuizApp);
} else {
    initQuizApp();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const currentPage = document.querySelector('.page-container:not(.hidden)');
    if (!currentPage || currentPage.id !== 'quiz-page' || !quizState.isQuizActive) return;
    
    // Number keys 1-4 for options
    if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        const options = document.querySelectorAll('.option-btn');
        if (options[index] && !options[index].disabled) {
            selectAnswer(index);
        }
    }
    
    // Enter for next question
    if (e.key === 'Enter' && elements.nextBtn && !elements.nextBtn.disabled) {
        handleNextButton();
    }
});