/**
 * This module contains a class for each page form, which all have the following implicit interface methods:
 * 
 * - form: gets the html to display the form for creating the page
 * - update: adds existing page information to the form
 * - clear: clears a form, removing data
 * - save: saves form to data store
 * - validates: checks that a form is valid
 * 
 * These are called from admin-manager.js.
 */
var adminForms = (function () {
    // Helper for validating required input.
    var validateRequired = function (id, name) {
        var title = document.getElementById(id).value.trim();
        if (title.length === 0) {
            document.getElementById(id + '-error').innerHTML = name + ' is required';
            return false;
        }
        return true;
    };

    var getOrCreateId = function(page) {
        return page === undefined ? adminManager.createId() : page.id;
    }

    // Class to represent adding post.
    var Post = {
        form: function () {
            delete this.page;
            var html = '<div class="post-form">';
            html += '<h3>Post</h3>';
            html += '<label for="post-title">Title</label><br>';
            html += '<input type="text" id="post-title" class="form-control">';
            html += '<span class="form-error" id="post-title-error"></span>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="post-content">Content</label><br>';
            html += '<textarea id="post-content" rows="10" class="form-control"></textarea>';
            html += '<span class="form-error" id="post-content-error"></span>';
            html += '</div>';
            return html;
        },
        update: function (page) {
            this.page = page;
            document.getElementById('post-title').value = page.title;
            document.getElementById('post-content').value = page.content;
        },
        clear: function () {
            delete this.page;
            document.getElementById('post-title').value = '';
            document.getElementById('post-content').value = '';
        },
        save: function () {
            var page = this.page;
            dataStore.setPage({
                id: getOrCreateId(page),
                type: "post",
                title: this.getTitle(),
                created: new Date().toISOString(),
                content: this.getContent()
            });
        },
        validate: function () {
            var success = true;

            if (!validateRequired('post-title', 'Title')) {
                success = false;
            }

            if (!validateRequired('post-content', 'Content')) {
                success = false;
            }

            return success;
        },
        getTitle: function () {
            return document.getElementById('post-title').value.trim();
        },
        getContent: function () {
            var value = document.getElementById('post-content').value;
            if (value !== undefined) {
                return value.trim();
            }
            return '';
        }
    };

    // Class to manage adding slideshow.
    var Slideshow = {
        slideInputHtml: function (page) {
            if (page === undefined) {
                page = { title: '', src: '' };
            }
            var html = '';
            html += '<input type="text" placeholder="Title" class="slide-title" class="form-control" value="' + page.title + '"> ';
            html += '<input type="text" placeholder="URL" class="slide-url" class="form-control" value="' + page.src + '">';
            html += '<button type="button" onclick="adminManager.deleteSlide(this)" class="btn btn-light btn-image" title="Remove Slide"><img src="images/icons/delete-button.png"></button>';
            html += '<span class="form-error slideshow-slide-error"></span>';
            return html;
        },
        form: function () {
            delete this.page;
            var html = '<div class="slideshow-form">';
            html += '<h3>Slideshow</h3>';
            html += '<div class="form-group">';
            html += '<label for="slideshow-title">Title</label><br>';
            html += '<input type="text" id="slideshow-title" class="form-control">';
            html += '<span class="form-error" id="slideshow-title-error"></span>';
            html += '</div><br>';
            html += '<p>Slideshow Images</p>';
            html += '<ol id="slideshow-slides">';
            html += '</ol>';
            html += '<input type="button" value="Add Slide" onclick="adminManager.addSlide()" class="btn btn-secondary">';
            html += '</div>';
            return html;
        },
        clear: function () {
            delete this.page;
            document.getElementById('slideshow-title').value = '';
            document.getElementById('slideshow-slides').innerHTML = '';
        },        
        update: function (page) {
            this.page = page;
            document.getElementById('slideshow-title').value = page.title;
            page.images.forEach(function (image) {
                var html = this.slideInputHtml(image);
                this.addSlide(html)
            }.bind(this));
        },
        save: function () {
            var page = this.page;
            var images = this.getSlides();
            dataStore.setPage({
                id: page !== undefined ? page.id : adminManager.createId(),
                type: "slideshow",
                title: this.getTitle(),
                images: images
            });
        },
        validate: function () {
            var success = true;

            if (!validateRequired('slideshow-title', 'Title')) {
                success = false;
            }

            this.getSlides().forEach(function (slide) {
                if (slide.title.length === 0) {
                    slide.el.getElementsByClassName('slideshow-slide-error')[0].innerHTML = 'Title is required';
                    success = false;
                } else if (slide.src.length === 0) {
                    slide.el.getElementsByClassName('slideshow-slide-error')[0].innerHTML = 'URL is required';
                    success = false;
                }
            });

            return success;
        },
        getTitle: function () {
            return document.getElementById('slideshow-title').value.trim();
        },
        getSlides: function () {
            var list = document.getElementById('slideshow-slides');
            var slides = [];
            var children = list.childNodes;
            for (var child in children) {
                if (children.hasOwnProperty(child)) {
                    var item = list.childNodes[child];
                    var title = item.getElementsByClassName('slide-title')[0].value.trim();
                    var src = item.getElementsByClassName('slide-url')[0].value.trim();
                    slides.push({
                        title: title,
                        src: src,
                        el: item
                    });
                }
            }
            return slides;
        },
        addSlide: function (html) {
            if (html === undefined) {
                html = this.slideInputHtml();
            }
            var list = document.getElementById('slideshow-slides');
            var listItem = document.createElement('li');
            listItem.innerHTML = html;
            list.appendChild(listItem);
        },
        deleteSlide: function (btnEl) {
            var listItem = btnEl.parentNode;
            var list = document.getElementById('slideshow-slides');
            list.removeChild(listItem);
        }
    };

    // Class to manage adding video.
    var Video = {
        form: function () {
            delete this.page;
            var html = '<div class="video-form">';
            html += '<h3>Video</h3>';
            html += '<div class="form-group">';
            html += '<label for="video-title">Title</label><br>';
            html += '<input type="text" id="video-title" class="form-control">';
            html += '<span class="form-error" id="video-title-error"></span>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="video-description">Description</label><br>';
            html += '<input type="text" id="video-description" class="form-control">';
            html += '<span class="form-error" id="video-description-error"></span>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="video-src">Video URL</label><br>';
            html += '<input type="text" id="video-src" class="form-control">';
            html += '<span class="form-error" id="video-src-error"></span>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="video-type">Content-Type</label><br>';
            html += '<input type="text" id="video-type" class="form-control">';
            html += '<span class="form-error" id="video-type-error"></span>';
            html += '</div>';
            html += '</div>';
            return html;
        },
        update: function (page) {
            this.page = page;
            document.getElementById('video-title').value = page.title;
            document.getElementById('video-description').value = page.description;
            document.getElementById('video-src').value = page.src;
            document.getElementById('video-type').value = page.contentType;
        },
        clear: function () {
            delete this.page;
            document.getElementById('video-title').value = '';
            document.getElementById('video-description').value = '';
            document.getElementById('video-src').value = '';
            document.getElementById('video-type').value = '';
        },
        save: function () {
            var page = this.page;
            dataStore.setPage({
                id: getOrCreateId(page),
                type: "video",
                title: document.getElementById('video-title').value.trim(),
                description: document.getElementById('video-description').value.trim(),
                src: document.getElementById('video-src').value.trim(),
                contentType: document.getElementById('video-type').value.trim()
            });
        },
        validate: function () {
            var success = true;
            if (!validateRequired('video-title', 'Title')) {
                success = false;
            }
            if (!validateRequired('video-description', 'Description')) {
                success = false;
            }
            if (!validateRequired('video-src', 'URL')) {
                success = false;
            }
            if (!validateRequired('video-type', 'Content-type')) {
                success = false;
            }
            return success;
        }
    };

    // Class to help adding images.
    var Image = {
        form: function () {
            delete this.page;
            var html = '<div class="image-form">';
            html += '<h3>Image</h3>';
            html += '<div class="form-group">';
            html += '<label for="image-title">Title</label><br>';
            html += '<input type="text" id="image-title" class="form-control">';
            html += '<span class="form-error" id="image-title-error"></span>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="image-description">Description</label><br>';
            html += '<input type="text" id="image-description" class="form-control">';
            html += '<span class="form-error" id="image-description-error"></span>';
            html += '</div>';            
            html += '<div class="form-group">';
            html += '<label for="image-src">Image URL</label><br>';
            html += '<input type="text" id="image-src" class="form-control">';
            html += '<span class="form-error" id="image-src-error"></span>';
            html += '</div>';
            return html;
        },
        update: function (page) {
            this.page = page;
            document.getElementById('image-title').value = page.title;
            document.getElementById('image-description').value = page.description;
            document.getElementById('image-src').value = page.src;
        },
        clear: function () {
            delete this.page;
            document.getElementById('image-title').value = '';
            document.getElementById('image-description').value = '';
            document.getElementById('image-src').value = '';
        },
        save: function () {
            var page = this.page;
            dataStore.setPage({
                id: getOrCreateId(page),
                type: "image",
                title: document.getElementById('image-title').value.trim(),
                description: document.getElementById('image-description').value.trim(),
                src: document.getElementById('image-src').value.trim()
            });
        },
        validate: function () {
            var success = true;
            if (!validateRequired('image-title', 'Title')) {
                success = false;
            }
            if (!validateRequired('image-description', 'Description')) {
                success = false;
            }
            if (!validateRequired('image-src', 'URL')) {
                success = false;
            }
            return success;
        }
    };

    // Class to help adding quizzes
    var Quiz = {
        form: function () {
            delete this.page;
            var html = '<div class="quiz-form">';
            html += '<h3>Quiz</h3>';
            html += '<div class="form-group">';
            html += '<label for="quiz-title">Title</label><br>';
            html += '<input type="text" id="quiz-title" class="form-control">';
            html += '<span class="form-error" id="quiz-title-error"></span>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="quiz-description">Description</label><br>';
            html += '<input type="text" id="quiz-description" class="form-control">';
            html += '<span class="form-error" id="quiz-description-error"></span>';
            html += '</div>';
            html += '<p>Questions</p>';
            html += '<div class="question-panel">';
            html += '<ol id="question-list">';
            html += '</ol>';
            html += '<button type="button" class="btn btn-secondary" onclick="adminManager.addQuestion()">Add Question</button>';
            html += '</div>';
            return html;
        },
        update: function (page) {
            this.page = page;
            document.getElementById('quiz-title').value = page.title;
            document.getElementById('quiz-description').value = page.description;
            page.questions.forEach(function (question) {
                this.addQuestion(question);
            }.bind(this));
        },
        clear: function () {
            delete this.page;
            document.getElementById('quiz-title').value = '';
            document.getElementById('quiz-description').value = '';
            document.getElementById('question-list').innerHTML = '';
        },
        getSavableQuestions: function () {
            return this.getQuestions().map(function (question) {
                return {
                    text: question.text,
                    correctIndex: parseInt(question.correct) - 1,
                    options: question.answers.map(function (answer) {
                        return answer.text;
                    })
                };
            });
        },
        save: function () {
            var questions = this.getSavableQuestions();
            var page = this.page;
            dataStore.setPage({
                id: getOrCreateId(page),
                type: "quiz",
                title: document.getElementById('quiz-title').value.trim(),
                description: document.getElementById('quiz-description').value.trim(),
                questions: questions,
                currentAnswers: [],
                answers: []
            });
        },
        validate: function () {
            var success = true;

            if (!validateRequired('quiz-title', 'Title')) {
                success = false;
            }

            if (!validateRequired('quiz-description', 'Description')) {
                success = false;
            }

            function questionError(question, msg) {
                question.el.getElementsByClassName('quiz-question-error')[0].innerHTML = msg;
            }

            function answerError(question, msg) {
                question.el.getElementsByClassName('quiz-answer-error')[0].innerHTML = msg;
            }

            var questions = this.getQuestions();
            questions.forEach(function (question) {
                if (question.text.length === 0) {
                    questionError(question, 'Question is required');
                    success = false;
                } else if (question.correct.length === 0) {
                    questionError(question, 'Correct is required');
                    success = false;
                } else {
                    var correct = parseInt(question.correct);
                    if (isNaN(correct)) {
                        questionError(question, 'Correct is not a number');
                        success = false;
                    } else if (correct < 1 || correct > question.answers.length) {
                        questionError(question, 'Correct is out of range');
                        success = false;
                    }
                }
                question.answers.forEach(function (answer) {
                    if (answer.text.length === 0) {
                        answerError(question, 'Answer is required');
                        success = false;
                    }
                });
            });

            return success;
        },
        getQuestionHtml: function (question) {
            if (question === undefined) {
                question = { text: '', correctIndex: '' };
            } else {
                question.correctIndex++;
            }
            var html = '<input type="text" style="width: 150px;" class="question-text" placeholder="Question text" value="' + question.text + '"> ';
            html += '<input type="text" class="question-correct" placeholder="Correct Index" value="' + question.correctIndex + '">';
            html += '<button type="button" onclick="adminManager.removeQuestion(this)" class="btn btn-light btn-image" title="Remove Question">';
            html += '<img src="images/icons/delete-button.png">';
            html += '</button>';
            html += '<span class="form-error quiz-question-error"></span>';
            html += '<ol class="answer-list" style="margin-top: 10px;">';
            html += '</ol>';
            html += '<button type="button" class="btn btn-secondary" onclick="adminManager.addAnswer(this)" style="margin-top: 10px;">Add Answer</button>';
            html += '<hr>';
            return html;
        },
        addQuestion: function (question) {
            var ol = document.getElementById('question-list');
            var li = document.createElement('li');
            li.setAttribute('class', 'question-item');
            li.innerHTML = this.getQuestionHtml(question);
            ol.appendChild(li);

            // If question passed, populate answers.
            if (question !== undefined) {
                question.options.forEach(function (answer) {
                    this.performAddAnswer(li, answer);
                }.bind(this));
            }
        },
        getAnswerHtml: function (answer) {
            if (answer === undefined) {
                answer = '';
            }
            var html = '<input type="text" class="answer-text" placeholder="Answer text" value="' + answer + '" style="width: 300px;">';
            html += '<button type="button" onclick="adminManager.removeAnswer(this)" class="btn btn-light btn-image" title="Remove Answer">';
            html += '<img src="images/icons/delete-button.png" alt="Delete">';
            html += '</button>';
            html += '<span class="form-error quiz-answer-error"></span>';
            return html;
        },
        addAnswer: function (btnEl) {
            var questionEl = btnEl.parentNode;
            this.performAddAnswer(questionEl);
        },
        performAddAnswer: function (questionEl, answer) {
            var answerListEl = questionEl.getElementsByClassName('answer-list')[0];
            var answerEl = document.createElement('li');
            answerEl.setAttribute('class', 'answer-item');
            answerEl.innerHTML = this.getAnswerHtml(answer);
            answerListEl.append(answerEl);
        },
        removeQuestion: function (btnEl) {
            var questionEl = btnEl.parentNode;
            var questionListEl = questionEl.parentNode;
            questionListEl.removeChild(questionEl);
        },
        removeAnswer: function (btnEl) {
            var answerEl = btnEl.parentNode;
            var answerListEl = answerEl.parentNode;
            answerListEl.removeChild(answerEl);
        },
        getAnswers: function (questionEl) {
            var answers = [];
            var answerEls = questionEl.getElementsByClassName('answer-item');
            for (var key in answerEls) {
                if (answerEls.hasOwnProperty(key)) {
                    var answerEl = answerEls[key];
                    var text = answerEl.getElementsByClassName('answer-text')[0].value.trim();
                    answers.push({
                        text: text,
                        el: answerEl
                    });
                }
            }
            return answers;
        },
        getQuestions: function () {
            var questions = [];
            var questionListEl = document.getElementById('question-list');
            var questionEls = questionListEl.getElementsByClassName('question-item');
            for (var key in questionEls) {
                if (questionEls.hasOwnProperty(key)) {
                    var questionEl = questionEls[key];
                    var text = questionEl.getElementsByClassName('question-text')[0].value.trim();
                    var correct = questionEl.getElementsByClassName('question-correct')[0].value.trim();
                    var answers = this.getAnswers(questionEl);
                    questions.push({
                        text: text,
                        correct: correct,
                        el: questionEl,
                        answers: answers
                    });
                }
            }
            return questions;
        }
    };

    return {
        Post: Post,
        Image: Image,
        Video: Video,
        Slideshow: Slideshow,
        Quiz: Quiz
    }
})();