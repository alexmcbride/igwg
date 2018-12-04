var adminManager = (function () {
    var currentForm = null;

    var generateHtml = function (form) {
        var html = '<form>';
        html += '<h2>Admin</h2>';
        html += '<p>Pure add, edit, and delete pages, and all that.</p>';
        html += '<select id="form-select" onchange="adminManager.formChange()">';
        html += '<option value="page">Page</option>';
        html += '<option value="slideshow">Slideshow</option>';
        html += '<option value="quiz">Quiz</option>';
        html += '<option value="video">Video</option>';
        html += '</select>';
        html += '<hr>';
        html += '<div id="form-content">';
        html += form;
        html += '</div>';
        html += '<hr>';
        html += '<div>';
        html += '<input type="button" id="saveForm" value="Save">';
        html += '</div>';
        html += '</form>';
        return html;
    }

    var pageForm = function () {
        return 'pageForm';
    }

    var slideshowForm = function () {
        return 'slideshowForm';
    }

    var quizForm = function () {
        return 'quizForm';
    }

    var videoForm = function () {
        return 'videoForm';
    }

    var display = function () {
        if (currentForm == null) {
            currentForm = pageForm;
        }

        var form = currentForm();
        var html = generateHtml(form);
        contentLoader.render(html);
    }

    var getFormType = function (type) {
        switch (type) {
            case 'page':
                return pageForm;
            case 'slideshow':
                return slideshowForm;
            case 'quiz':
                return quizForm;
            case 'video':
                return videoForm;                
        }
        return null;
    }

    var formChange = function () {
        var type = document.getElementById('form-select').value;
        formType = getFormType(type);
        if (formType == null) {
            alert('Form type not found');
        } else {
            currentForm = formType;
            display();
        }
    }

    return {
        display: display,
        formChange: formChange
    };
})();
