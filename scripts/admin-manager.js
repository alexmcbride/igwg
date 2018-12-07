// Module for managing pages. The currentPage is set to an object from admin-forms.js 
// module, depending on the page select drop down. If page select set to 'create' then 
// a second drop down for form-select is available that switches between forms for 
// different pages.
var adminManager = (function () {
    var currentPage = null;

    // Displays the current admin manager state.
    var display = function () {
        if (loginManager.isLoggedIn()) {
            if (currentPage === null) {
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
        dataStore.findPages().forEach(function (page) {
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
                return adminForms.Post;
            case 'slideshow':
                return adminForms.Slideshow;
            case 'quiz':
                return adminForms.Quiz;
            case 'video':
                return adminForms.Video;
            case 'image':
                return adminForms.Image;
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
