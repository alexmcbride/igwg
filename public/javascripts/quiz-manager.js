var quizManager = (function () {
    // Object to represent a quiz. Uses simple state machine pattern. There are three states - start, question, and 
    // finish. When update is called the current state is processed and the handler moves to the next. Data is 
    // stored in local storage.
    var QuizHandler = function (pageData) {
        this.pageData = pageData;
        this.currentQuestionIndex = this.getCurrentQuestionIndex();
        this.currentState = this.loadCurrentState();
        this.currentAnswerIndex = 0;
    }

    // Gets the index of the question currently being asked.
    QuizHandler.prototype.getCurrentQuestionIndex = function () {
        if (this.pageData.answers.length > 0) {
            return this.pageData.answers.length;
        }
        return 0;
    }

    // Get the current start of the quiz.
    QuizHandler.prototype.loadCurrentState = function () {
        if (this.pageData.answers.length == this.pageData.questions.length) {
            return this.finishedState;
        } else if (this.pageData.answers.length > 0) {
            return this.questionState;
        } else {
            return this.startState;
        }
    }

    // Gets the current question object
    QuizHandler.prototype.getCurrentQuestion = function () {
        return this.pageData.questions[this.currentQuestionIndex];
    }

    // Updates the current state and displays the output
    QuizHandler.prototype.update = function () {
        var html = '<div class="question">';
        html += '<h2>' + this.pageData.title + '</h2>'
        html += this.currentState();
        html += '</div>';
        contentLoader.render(html);
    }

    // Handles the start state
    QuizHandler.prototype.startState = function () {
        return '<p><button onclick="quizManager.onStart(\'' + this.pageData.id + '\')">Start Quiz!</button></p>';
    }

    // Handles the question state (there can be multiple question states).
    QuizHandler.prototype.questionState = function () {
        var question = this.getCurrentQuestion();
        var html = '<form class="question">';
        html += '<p>' + question.text + '</p>';
        var pageData = this.pageData; // Make pageData local so don't have to use 'this' inside foreach function.
        question.options.forEach(function (option, index) {
            html += '<input type="radio" name="answer" id="answer' + index + '" onclick="quizManager.onQuestion(\'' + pageData.id + '\', ' + index + ')">';
            html += '<label for="answer' + index + '">' + option.text + '</label><br>';
        });
        html += '<br>';
        html += '<input type="button" value="Answer" onclick="quizManager.onAnswer(\'' + this.pageData.id + '\')" disabled id="answer-btn">';
        html += '</form>';
        return html;
    }

    // Handles finished state.
    QuizHandler.prototype.finishedState = function () {
        var correct = this.getNumberCorrect();
        var total = this.pageData.questions.length;
        var html = '<p>You finished the quiz!</p>';
        html += '<p>You got ' + correct + ' out of ' + total + ' correct!</p>';
        html += '<input type="button" value="Take Quiz Again!" onclick="quizManager.onRestart(\'' + this.pageData.id + '\')">';
        return html;
    }

    // Event called when start button pressed, moves state to question.
    QuizHandler.prototype.onStart = function () {
        this.currentQuestionIndex = 0;
        this.currentState = this.questionState;
        this.update();
    }

    // Event called when user selected an answer to a question
    QuizHandler.prototype.onQuestion = function (index) {
        this.currentAnswerIndex = index;
        document.getElementById('answer-btn').removeAttribute('disabled');
    }

    // Adds answer to local storage
    QuizHandler.prototype.addAnswer = function (question, answer) {
        // Add to answers list and then update local storage
        this.pageData.answers.push({ answer: answer, question: question });
        dataStore.setPage(this.pageData);
    }

    // Event called when answer button pressed, moves state to finished.
    QuizHandler.prototype.onAnswer = function () {
        this.addAnswer(this.currentQuestionIndex, this.currentAnswerIndex);

        if (this.currentQuestionIndex === (this.pageData.questions.length - 1)) {
            this.currentState = this.finishedState;
        } else {
            this.currentQuestionIndex++;
        }

        this.update();
    }

    // Counts number of correct answers the user has given.
    QuizHandler.prototype.getNumberCorrect = function () {
        var correct = 0;
        for (var i = 0; i < this.pageData.answers.length; i++) {
            var answer = this.pageData.answers[i];
            var question = this.pageData.questions[answer.question];
            if (question.options[answer.answer].correct) {
                correct++;
            }
        }
        return correct;
    }

    // Event called when restart button pressed, moves state back to start.
    QuizHandler.prototype.onRestart = function () {
        // Reset answers
        this.pageData.answers = []
        dataStore.setPage(this.pageData);

        // Set back to initial state
        this.currentState = this.questionState;
        this.currentAnswerIndex = 0;
        this.currentQuestionIndex = 0;

        this.update();
    }

    // Hash map where quiz objects are stored key by page ID, this is so multiple quizes can be kept in memory at once.
    var quizMap = [];

    // Get the quiz associated with the page key
    var getQuiz = function (pageId) {
        if (quizMap[pageId] === undefined) {
            return null;
        } else {
            return quizMap[pageId];
        }
    }

    // Tell a quiz object to draw its current state.
    var display = function (pageData) {
        var quiz = getQuiz(pageData.id);
        if (quiz === null) {
            quiz = new QuizHandler(pageData);
            quizMap[pageData.id] = quiz;
        }
        quiz.update();
    }

    // Called by start button, tells quiz to start
    var onStart = function (pageId) {
        var quiz = getQuiz(pageId);
        if (quiz !== null) {
            quiz.onStart();
        }
    }

    // Called when user selects answer
    var onQuestion = function (pageId, index) {
        var quiz = getQuiz(pageId);
        if (quiz !== null) {
            quiz.onQuestion(index);
        }
    }

    // Called when user presses answer button.
    var onAnswer = function (pageId) {
        var quiz = getQuiz(pageId);
        if (quiz !== null) {
            quiz.onAnswer();
        }
    }

    // Called when user presses restart button.
    var onRestart = function (pageId) {
        var quiz = getQuiz(pageId);
        if (quiz !== null) {
            quiz.onRestart();
        }
    }

    return {
        display: display,
        onStart: onStart,
        onQuestion: onQuestion,
        onAnswer: onAnswer,
        onRestart: onRestart
    }
})();