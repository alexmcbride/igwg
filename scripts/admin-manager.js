/**
 * Module for managing pages. This one is a bit messy, so could do with some refactoring. :)
 * The form for each page type is represented by a class, which implement the following interface:
 * 
 * - form: gets the html to display the form for creating the page
 * - update: adds existing page information to the form
 * - clear: clears a form, removing data
 * - save: saves form to datastore
 * - validates: checks that a form is valid
 * 
 * When the user changes the drop down, the currentPage is switched to the required object, 
 * which handles all input.
 * 
 *  */
var adminManager = (function () {
    var currentPage = null;

    // Helper for validating required input.
    var validateRequired = function (id, name) {
        var title = document.getElementById(id).value.trim();
        if (title.length == 0) {
            document.getElementById(id + '-error').innerHTML = name + ' is required';
            return false;
        }
        return true;
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
                id: page !== undefined ? page.id : createId(),
                type: "post",
                title: this.getTitle(),
                created: new Date().toISOString(),
                content: this.getContent()
            });
            this.clear();
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
        },
    };

    // Class to manage adding slideshow.
    var Slideshow = {
        slideInputHtml: function (page) {
            if (page === undefined) {
                page = { title: '', src: '' };
            }
            var html = '<input type="text" placeholder="Title" class="slide-title" class="form-control" value="' + page.title + '"> ';
            html += '<input type="text" placeholder="URL" class="slide-url" class="form-control" value="' + page.src + '">';
            html += '<button type="button" onclick="adminManager.deleteSlide(this)" class="btn btn-light btn-image" title="Remove Slide"><img src="images/icons/delete-button.png"></button>';
            html += '<span class="form-error slideshow-slide-error"></span>';
            return html;
        },
        form: function () {
            delete this.page;
            var html = '<div class="slideshow-form">';
            html += '<h3>Slideshow</h3>';
            html += '<div clas="form-group">';
            html += '<label for="slideshow-title">Title</label><br>';
            html += '<input type="text" id="slideshow-title" class="form-control">';
            html += '<span class="form-error" id="slideshow-title-error"></span>';
            html += '</div><br>'
            html += '<p>Add images to slideshow.</p>';
            html += '<ol id="slideshow-slides">';
            html += '</ol>';
            html += '<input type="button" value="Add Slide" onclick="adminManager.addSlide()" class="btn btn-secondary">';
            html += '</div>'
            return html;
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
            var images = this.getSlideObjects();
            dataStore.setPage({
                id: page !== undefined ? page.id : createId(),
                type: "slideshow",
                title: this.getTitle(),
                images: images
            });
            document.getElementById('slideshow-title').value = '';
        },
        validate: function () {
            var success = true;

            if (!validateRequired('slideshow-title', 'Title')) {
                success = false;
            }

            this.getSlideObjects().forEach(function (slide) {
                if (slide.title.length == 0) {
                    var errorEl = slide.el.getElementsByClassName('slideshow-slide-error')[0];
                    errorEl.innerHTML = 'Title is required';
                    success = false;
                } else if (slide.url.length == 0) {
                    var errorEl = slide.el.getElementsByClassName('slideshow-slide-error')[0];
                    errorEl.innerHTML = 'URL is required';
                    success = false;
                }
            });

            return success;
        },
        getTitle: function () {
            return document.getElementById('slideshow-title').value.trim();
        },
        getSlideObjects: function () {
            var list = document.getElementById('slideshow-slides');
            var slides = [];
            var children = list.childNodes;
            for (var child in children) {
                if (children.hasOwnProperty(child)) {
                    var item = list.childNodes[child];
                    var title = item.getElementsByClassName('slide-title')[0].value.trim();
                    var url = item.getElementsByClassName('slide-url')[0].value.trim();
                    slides.push({
                        title: title,
                        url: url,
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
            html += '<label for="video-src">Video URL</label><br>';
            html += '<input type="text" id="video-src" class="form-control">';
            html += '<span class="form-error" id="video-src-error"></span>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="video-type">Content-Type</label><br>';
            html += '<input type="text" id="video-type" class="form-control">';
            html += '<span class="form-error" id="video-type-error"></span>';
            html += '</div>';
            return html;
        },
        update: function (page) {
            this.page = page;
            document.getElementById('video-title').value = page.title;
            document.getElementById('video-src').value = page.src;
            document.getElementById('video-type').value = page.contentType;
        },
        clear: function () {
            delete this.page;
            document.getElementById('video-title').value = '';
            document.getElementById('video-src').value = '';
            document.getElementById('video-type').value = '';
        },
        save: function () {
            var page = this.page;
            dataStore.setPage({
                id: page !== undefined ? page.id : createId(),
                type: "video",
                title: this.getTitle(),
                src: this.getSrc(),
                contentType: this.getContentType()
            });
            this.clear();
        },
        validate: function () {
            var success = true;
            if (!validateRequired('video-title', 'Title')) {
                success = false;
            }
            if (!validateRequired('video-src', 'URL')) {
                success = false;
            }
            if (!validateRequired('video-type', 'Content-type')) {
                success = false;
            }
            return success;
        },
        getTitle: function () {
            return document.getElementById('video-title').value.trim();
        },
        getSrc: function () {
            return document.getElementById('video-src').value.trim();
        },
        getContentType: function () {
            return document.getElementById('video-type').value.trim();
        },
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
            html += '<label for="image-src">Image URL</label><br>';
            html += '<input type="text" id="image-src" class="form-control">';
            html += '<span class="form-error" id="image-src-error"></span>';
            html += '</div>';
            return html;
        },
        update: function (page) {
            this.page = page;
            document.getElementById('image-title').value = page.title;
            document.getElementById('image-src').value = page.src;
        },
        clear: function () {
            delete this.page;
            document.getElementById('image-title').value = '';
            document.getElementById('image-src').value = '';
        },
        save: function () {
            var page = this.page;
            dataStore.setPage({
                id: page !== undefined ? page.id : createId(),
                type: "image",
                title: this.getTitle(),
                src: this.getSrc()
            });
            this.clear();
        },
        validate: function () {
            var success = true;
            if (!validateRequired('image-title', 'Title')) {
                success = false;
            }
            if (!validateRequired('image-src', 'URL')) {
                success = false;
            }
            return success;
        },
        getTitle: function () {
            return document.getElementById('image-title').value.trim();
        },
        getSrc: function () {
            return document.getElementById('image-src').value.trim();
        }
    };

    // Class to help adding quizes
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

            html += '<p>Questions</p>'
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
        save: function () {
            var questions = this.getQuestions().map(function (question) {
                return {
                    text: question.text,
                    correctIndex: parseInt(question.correct) - 1,
                    options: question.answers.map(function (answer) {
                        return answer.text;
                    })
                };
            });

            var page = this.page;
            dataStore.setPage({
                id: page !== undefined ? page.id : createId(),
                type: "quiz",
                title: document.getElementById('quiz-title').value.trim(),
                description: document.getElementById('quiz-description').value.trim(),
                questions: questions,
                currentAnswers: [],
                answers: []
            });
            this.clear();
        },
        validate: function () {
            var success = true;

            if (!validateRequired('quiz-title', 'Title')) {
                success = false;
            }

            if (!validateRequired('quiz-description', 'Description')) {
                success = false;
            }

            function questionError(msg) {
                question.el.getElementsByClassName('quiz-question-error')[0].innerHTML = msg;
            }

            function answerError(msg) {
                question.el.getElementsByClassName('quiz-answer-error')[0].innerHTML = msg;
            }

            var questions = this.getQuestions();
            questions.forEach(function (question) {
                if (question.text.length === 0) {
                    questionError('Question is required');
                    success = false;
                } else if (question.correct.length === 0) {
                    questionError('Correct is required');
                    success = false;
                } else {
                    var correct = parseInt(question.correct);
                    if (isNaN(correct)) {
                        questionError('Correct is not a number');
                        success = false;
                    } else if (correct < 1 || correct > question.answers.length) {
                        questionError('Correct is out of range');
                        success = false;
                    }
                }
                question.answers.forEach(function (answer) {
                    if (answer.text.length === 0) {
                        answerError('Answer is required');
                        success = false;
                    }
                });
            });

            return success;
        },
        getQuestionHtml: function (question) {
            if (question === undefined) {
                question = { text: '', correctIndex: '' };
            }
            var html = '<input type="text" class="question-text" placeholder="Question text" value="' + question.text + '"> ';
            html += '<input type="text" class="question-correct" placeholder="Correct Answer" value="' + (question.correctIndex + 1) + '">';
            html += '<button type="button" onclick="adminManager.removeQuestion(this)" class="btn btn-light btn-image" title="Remove Question">';
            html += '<img src="images/icons/delete-button.png">';
            html += '</button>';
            html += '<span class="form-error quiz-question-error"></span>';
            html += '<ol class="answer-list">';
            html += '</ol>';
            html += '<button type="button" class="btn btn-secondary" onclick="adminManager.addAnswer(this)">Add Answer</button>';
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
            html += '<img src="images/icons/delete-button.png">'
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

    // Displays the current admin manager state.
    var display = function () {
        if (loginManager.isLoggedIn()) {
            if (currentPage == null) {
                currentPage = getPage('post');;
            }

            var html = generateHtml();
            content.render(html);
        } else {
            content.render('<p>You must be logged in to view this page</p>');
        }
    }

    // Generates a random ID for pages.
    var createId = function () {
        return crypto.getRandomValues(new Uint32Array(1)).join('');
    }

    // Generates HTML for page select dropdown
    var getPageSelectHtml = function () {
        var html = '<select id="page-select" onchange="adminManager.pageChange()" class="form-control">';
        html += '<option value="create">Create new page</option>';
        html += '<option disabled>----</option>';

        var pages = dataStore.findPages();
        pages.forEach(function (page) {
            html += '<option value="' + page.id + '">' + page.title + ' (' + page.type + ')</option>';
        });

        html += '</select>';
        return html;
    }

    // Causes page select dropdown to be redrawn.
    var updatePageSelectControl = function () {
        var html = getPageSelectHtml();
        document.getElementById('page-select-control').innerHTML = html;
    }

    // Generates HTML to display the admin form
    var generateHtml = function () {
        var html = '<form id="admin-form">';
        html += '<h2>Manage Pages</h2>';

        html += '<hr>';
        html += '<div class="form-group">';
        html += '<label for="page-select">Select page to manage</label><br>';
        html += '<div id="page-select-control">';
        html += getPageSelectHtml();
        html += '</div>';
        html += '<hr>';
        html += '</div>';

        html += '<div class="form-group" id="form-select-box">';
        html += '<label for="form-select">Select the type of page</label><br>';
        html += '<select id="form-select" onchange="adminManager.formChange()" class="form-control">';
        html += '<option value="post">Post</option>';
        html += '<option value="image">Image</option>';
        html += '<option value="slideshow">Slideshow</option>';
        html += '<option value="quiz">Quiz</option>';
        html += '<option value="video">Video</option>';
        html += '</select>';
        html += '<hr>';
        html += '</div>';

        html += '<p id="message"></p>';
        html += '<div id="form-content">';
        html += currentPage.form();
        html += '</div>';
        html += '<hr>';
        html += '<div>';
        html += '<input type="button" value="Save" onclick="adminManager.save()" class="btn btn-primary"> ';
        html += '<input type="button" value="Delete" onclick="adminManager.deletePage()" id="deleteButton" class="btn btn-primary" style="display: none;">';
        html += '</div>';
        html += '</form>';
        return html;
    }

    // Gets the current state based on the type string.
    var getPage = function (type) {
        switch (type) {
            case 'post':
                return Post;
            case 'slideshow':
                return Slideshow;
            case 'quiz':
                return Quiz;
            case 'video':
                return Video;
            case 'image':
                return Image;
        }
        return null;
    }

    // Called when the form select input changes, switches page to selected type
    var formChange = function () {
        var pageType = document.getElementById('form-select').value;
        performFormChange(pageType);
    }

    // Changes to show form for page type
    var performFormChange = function (pageType) {
        var page = getPage(pageType);
        if (page == null) {
            throw 'Form type not found';
        } else {
            currentPage = page;
            var html = currentPage.form();
            document.getElementById('form-content').innerHTML = html;
            message('');
        }
    }

    // Called when the page select input changes, switches page to selected
    var pageChange = function () {
        var pageId = document.getElementById('page-select').value;
        if (pageId == 'create') {
            // enable select input
            document.getElementById('form-select-box').style.display = 'block';
            document.getElementById('deleteButton').style.display = 'none';

            currentPage = getPage('post');
            document.getElementById('form-content').innerHTML = currentPage.form();
        } else {
            // disable select input
            document.getElementById('form-select-box').style.display = 'none';
            document.getElementById('deleteButton').style.display = 'inline';
            var page = dataStore.findPage(pageId);

            currentPage = getPage(page.type);
            document.getElementById('form-content').innerHTML = currentPage.form();
            currentPage.update(page);
        }
    }

    // Shortcut for displaying status message.
    var message = function (msg) {
        document.getElementById('message').innerHTML = msg;
    }

    // Clears all form error messages.
    var clearFormErrors = function () {
        var children = document.getElementsByClassName('form-error');
        for (var child in children) {
            children[child].innerHTML = '';
        }
    }

    // Called to save the current page state.
    var save = function () {
        if (currentPage == null) {
            throw 'Current page not set';
        } else {
            // Save if page valid.
            clearFormErrors();
            if (currentPage.validate()) {
                currentPage.save();
                message('Page saved!');

                app.refreshMenu(); // Tell app to redraw main menu.
                updatePageSelectControl();
            }
        }
    }

    // Removes page from local storage.
    var deletePage = function () {
        if (currentPage == null) {
            throw 'Current page not set';
        } else {
            var pageId = document.getElementById('page-select').value;
            var page = dataStore.findPage(pageId);
            if (confirm("Remove page '" + page.title + "'?")) {
                dataStore.removePage(pageId);

                document.getElementById('page-select').value = 'create';
                performFormChange('post');
                document.getElementById('form-select-box').style.display = 'block';

                app.refreshMenu();
                updatePageSelectControl();
            }
        }
    }

    // Adds a slide to the current slideshow.
    var addSlide = function () {
        Slideshow.addSlide();
    }

    // Removes a slide from the current slideshow.
    var deleteSlide = function (btnEl) {
        Slideshow.deleteSlide(btnEl);
    }

    // Adds a question to the current page.
    var addQuestion = function () {
        Quiz.addQuestion();
    }

    // Adds an answer to the current question.
    var addAnswer = function (btnEl) {
        Quiz.addAnswer(btnEl);
    }

    // Removes a question from the page.
    var removeQuestion = function (btnEl) {
        Quiz.removeQuestion(btnEl);
    }

    // Removes a question from the current question.
    var removeAnswer = function (btnEl) {
        Quiz.removeAnswer(btnEl);
    }

    return {
        display: display,
        formChange: formChange,
        pageChange: pageChange,
        save: save,
        deletePage: deletePage,
        addSlide: addSlide,
        deleteSlide: deleteSlide,
        addQuestion: addQuestion,
        addAnswer: addAnswer,
        removeAnswer: removeAnswer,
        removeQuestion: removeQuestion,
        createId: createId
    };
})();
