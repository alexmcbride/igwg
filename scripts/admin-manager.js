// Module for managing pages. The currentForm is set to an object from admin-forms.js 
// module, depending on the page select drop down. If page select set to 'create' then 
// a second drop down for form-select is available that switches between forms for 
// different pages.
var adminManager = (function () {
    var currentForm = null;

    // Displays the current form state.
    var display = function () {
        if (loginManager.isLoggedIn()) {
            if (currentForm === null) {
                currentForm = getPageForm('post');
            }

            var formHtml = currentForm.form();
            var pageHtml = generateHtml(formHtml);
            app.render(pageHtml);
        } else {
            // Not logged in.
            app.render('<p>You must be logged in to view this page</p>');
        }
    };

    // Generates a random ID for new pages.
    var createId = function () {
        return crypto.getRandomValues(new Uint32Array(1)).join('');
    };

    // Gets value of the page select drop down.
    var getSelectedPageValue = function () {
        var el = document.getElementById('page-select');
        if (el !== null) {
            return el.value;
        }
        return null;
    };

    // Generates HTML for page select drop down
    var getPageSelectHtml = function () {
        var value = getSelectedPageValue();
        var html = '<select id="page-select" onchange="adminManager.pageChange()" class="form-control">';
        html += '<option value="create">Create new page</option>';
        html += '<option disabled>----</option>';
        dataStore.findPages().forEach(function (page) {
            var selected = page.id === value ? ' selected' : '';
            html += '<option value="' + page.id + '"' + selected + '>' + page.title + ' (' + page.type + ')</option>';
        });
        html += '</select>';
        return html;
    };

    // Causes page select drop down to be redrawn.
    var updatePageSelectControl = function () {
        document.getElementById('page-select-control').innerHTML = getPageSelectHtml();
    };

    var getFormSelectHtml = function () {
        var getFormSelected = function (name) {
            return currentForm.name === name ? ' selected' : '';
        };
        var html = '<select id="form-select" onchange="adminManager.formChange()" class="form-control">';
        html += '<option value="post"' + getFormSelected('post') + '>Post</option>';
        html += '<option value="image"' + getFormSelected('image') + '>Image</option>';
        html += '<option value="slideshow"' + getFormSelected('slideshow') + '>Slideshow</option>';
        html += '<option value="quiz"' + getFormSelected('quiz') + '>Quiz</option>';
        html += '<option value="video"' + getFormSelected('video') + '>Video</option>';
        html += '<option value="heroes"' + getFormSelected('heroes') + '>Heroes</option>';
        html += '</select>';
        return html;
    };

    // Generates HTML to display the admin form
    var generateHtml = function (formHtml) {
        var html = '<form id="admin-form">';
        html += '<h2>Manage Pages</h2>';

        html += '<hr>';
        html += '<div class="form-group">';
        html += '<label for="page-select">Select page to manage:</label><br>';
        html += '<div id="page-select-control">';
        html += getPageSelectHtml();
        html += '</div>';
        html += '<hr>';
        html += '</div>';

        html += '<div class="form-group" id="form-select-box">';
        html += '<label for="form-select">Select the type of page to create:</label><br>';
        html += getFormSelectHtml();
        html += '<hr>';
        html += '</div>';

        html += '<p id="message"></p>';
        html += '<div id="form-content">';
        html += formHtml;
        html += '</div>';
        html += '<hr>';
        html += '<input type="button" value="Save" onclick="adminManager.save()" class="btn btn-primary"> ';
        html += '<input type="button" value="Delete" onclick="adminManager.deletePage()" id="deleteButton" class="btn btn-primary" style="display: none;">';
        html += '</form>';
        return html;
    };

    // Gets the current state based on the type string.
    var getPageForm = function (type) {
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
            case 'heroes':
                return adminForms.Heroes;
        }
        return null;
    };

    // Called when the form select input changes, switches page to selected type
    var formChange = function () {
        var pageType = document.getElementById('form-select').value;
        performFormChange(pageType);
    };

    // Changes to show form for page type
    var performFormChange = function (pageType) {
        var pageForm = getPageForm(pageType);
        if (pageForm == null) {
            throw 'Form type not found';
        } else {
            currentForm = pageForm;
            document.getElementById('form-content').innerHTML = currentForm.form();
            message('');
        }
    };

    // Called when the page select input changes, switches page to selected
    var pageChange = function () {
        var pageId = document.getElementById('page-select').value;
        if (pageId === 'create') {
            // enable select input
            document.getElementById('form-select-box').style.display = 'block';
            document.getElementById('deleteButton').style.display = 'none';

            currentForm = getPageForm('post');
            document.getElementById('form-content').innerHTML = currentForm.form();
        } else {
            // disable select input
            document.getElementById('form-select-box').style.display = 'none';
            document.getElementById('deleteButton').style.display = 'inline';

            var page = dataStore.findPage(pageId);
            currentForm = getPageForm(page.type);
            document.getElementById('form-content').innerHTML = currentForm.form();
            currentForm.update(page);
        }
    };

    // Shortcut for displaying status message.
    var message = function (msg) {
        document.getElementById('message').innerHTML = msg;
    };

    // Clears all form error messages.
    var clearFormErrors = function () {
        var children = document.getElementsByClassName('form-error');
        for (var child in children) {
            children[child].innerHTML = '';
        }
    };

    // Called to save the current page state.
    var save = function () {
        if (currentForm == null) {
            throw 'Current page not set';
        } else {
            // Save if page valid.
            clearFormErrors();
            if (currentForm.validate()) {
                currentForm.save();
                message('Page saved!');

                app.refreshMenu(); // Tell app to redraw main menu.
                updatePageSelectControl();
            }
        }
    };

    // Removes page from local storage.
    var deletePage = function () {
        if (currentForm == null) {
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
    };

    // Adds a slide to the current slideshow.
    var addSlide = function () {
        currentForm.addSlide();
    };

    // Removes a slide from the current slideshow.
    var deleteSlide = function (btnEl) {
        currentForm.deleteSlide(btnEl);
    };

    // Adds a question to the current page.
    var addQuestion = function () {
        currentForm.addQuestion();
    };

    // Adds an answer to the current question.
    var addAnswer = function (btnEl) {
        currentForm.addAnswer(btnEl);
    };

    // Removes a question from the page.
    var removeQuestion = function (btnEl) {
        currentForm.removeQuestion(btnEl);
    };

    // Removes a question from the current question.
    var removeAnswer = function (btnEl) {
        currentForm.removeAnswer(btnEl);
    };

    // Removes a question from the current question.
    var addHero = function () {
        currentForm.addHero();
    };

    // Removes a hero from the current heroes thing.
    var removeHero = function (btnEl) {
        currentForm.removeHero(btnEl);
    };

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
        createId: createId,
        addHero: addHero,
        removeHero: removeHero
    };
})();
