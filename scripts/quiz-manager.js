var quizManager = (function () {
    // Object to represent a quiz. Uses simple state machine pattern. There are three states - start, question, and 
    // finish. When update is called the current state is processed and the handler moves to the next. Data is 
    // stored in local storage.
    var Quiz = function (pageData) {
        this.pageData = pageData;
        this.currentQuestionIndex = this.getCurrentQuestionIndex();
        this.currentState = this.loadCurrentState();
        this.currentAnswerIndex = 0;
    }

    // Gets the index of the question currently being asked.
    Quiz.prototype.getCurrentQuestionIndex = function () {
        if (this.pageData.currentAnswers.length > 0) {
            return this.pageData.answers.length;
        }
        return 0;
    }

    // Get the current start of the quiz.
    Quiz.prototype.loadCurrentState = function () {
        if (this.pageData.currentAnswers.length == this.pageData.questions.length) {
            return this.resultsState;
        } else if (this.pageData.currentAnswers.length > 0) {
            return this.questionState;
        } else {
            return this.startState;
        }
    }

    // Gets the current question object
    Quiz.prototype.getCurrentQuestion = function () {
        return this.pageData.questions[this.currentQuestionIndex];
    }

    // Updates the current state and displays the output
    Quiz.prototype.update = function () {
        var html = '<div class="question">';
        html += '<h2>' + this.pageData.title + '</h2>'
        html += this.currentState();
        html += '</div>';
        contentLoader.render(html);
    }

    // Handles the start state
    Quiz.prototype.startState = function () {
        var html = '<p><button onclick="quizManager.onStart(\'' + this.pageData.id + '\')">Start Quiz!</button></p>';
        html += '<h2>Previous Results</h2>';
        html += this.generatePreviousResultsHtml();
        return html;
    }

    // Gets the HTML for displaying previous results
    Quiz.prototype.generatePreviousResultsHtml = function() {
        // Get list of results.
        var results = [];
        for (var key in this.pageData.answers) {
            var answer = this.pageData.answers[key];
            var correct = this.getNumberCorrect(answer.answers);
            results.push({ name: answer.name, correct: correct });
        }

        // Sort descending
        results.sort(function (a, b) {
            if (a.correct > b.correct) {
                return -1;
            } else if (a.correct < b.correct) {
                return 1;
            } else {
                return 0;
            }
        });

        // Create HTML.
        var html = '<ol>';
        results.forEach(function (result) {
            html += '<li>' + result.name + ' - ' + result.correct + '</li>';
        });
        html += '</ol>';
        return html;
    }

    // Handles the question state (there can be multiple question states).
    Quiz.prototype.questionState = function () {
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

    // Handles the results state (shows user score and lets put in name).
    Quiz.prototype.resultsState = function () {
        var correct = this.getNumberCorrect(this.pageData.currentAnswers);
        var total = this.pageData.questions.length;
        var html = '<p>You completed the quiz!</p>';
        html += '<p>You got ' + correct + ' out of ' + total + ' correct!</p>';
        html += '<form>';
        html += '<div>'
        html += '<label for="name">Please enter your name:</label><br>';
        html += '<input type="text" id="name">';
        html += '</div>'
        html += '<input type="button" value="Complete the quiz!" onclick="quizManager.onComplete(\'' + this.pageData.id + '\')">';
        html += '</form>';
        return html;
    }

    // Event called when start button pressed, moves state to question.
    Quiz.prototype.onStart = function () {
        this.currentQuestionIndex = 0;
        this.currentState = this.questionState;
        this.update();
    }

    // Event called when user selected an answer to a question
    Quiz.prototype.onQuestion = function (index) {
        this.currentAnswerIndex = index;
        document.getElementById('answer-btn').removeAttribute('disabled');
    }

    // Adds answer to local storage
    Quiz.prototype.addAnswer = function (question, answer) {
        // Add to answers list and then update local storage
        this.pageData.currentAnswers.push({ answer: answer, question: question });
        dataStore.setPage(this.pageData);
    }

    // Event called when answer button pressed, moves state to finished.
    Quiz.prototype.onAnswer = function () {
        this.addAnswer(this.currentQuestionIndex, this.currentAnswerIndex);

        if (this.currentQuestionIndex === (this.pageData.questions.length - 1)) {
            this.currentState = this.resultsState;
        } else {
            this.currentQuestionIndex++;
        }

        this.update();
    }

    // Called when user preses complete button to finish the quiz
    Quiz.prototype.onComplete = function () {
        var name = document.getElementById('name').value.trim();
        if (name.length === 0) {
            alert('Enter a name');
        } else if (this.nameExistsInAnswers(name)) {
            alert('Name already in use');
        } else {
            // Push name and current answer state onto finished answers
            this.pageData.answers.push({ name: name, answers: this.pageData.currentAnswers });
            this.pageData.currentAnswers = []; // Reset current state
            dataStore.setPage(this.pageData); // Save to db

            // Go back to start state and redraw UI
            this.currentState = this.startState;
            this.update();
        }
    }    
    
    // Checks if a user with this name already appears in answers.
    Quiz.prototype.nameExistsInAnswers = function (name) {
        for (var key in this.pageData.answers) {
            if (this.pageData.answers[key].name === name) {
                return true;
            }
        }
        return false;
    }

    // Counts number of correct answers the user has given.
    Quiz.prototype.getNumberCorrect = function (answers) {
        var correct = 0;
        for (var i = 0; i < answers.length; i++) {
            var answer = answers[i];
            var question = this.pageData.questions[answer.question];
            if (question.options[answer.answer].correct) {
                correct++;
            }
        }
        return correct;
    }

    // Event called when restart button pressed, moves state back to start.
    Quiz.prototype.onRestart = function () {
        // Reset answers
        this.pageData.currentAnswers = []
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
            quiz = new Quiz(pageData);
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

    // Called when user presses complete button.
    var onComplete = function (pageId) {
        var quiz = getQuiz(pageId);
        if (quiz !== null) {
            quiz.onComplete();
        }
    }

    return {
        display: display,
        onStart: onStart,
        onQuestion: onQuestion,
        onAnswer: onAnswer,
        onRestart: onRestart,
        onComplete: onComplete
    }
})();