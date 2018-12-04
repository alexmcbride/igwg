var adminManager = (function () {
    var currentState = null;

    var createId = function () {
        return crypto.getRandomValues(new Uint32Array(4)).join('');
    }

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
        html += '<input type="button" value="Save" onclick="adminManager.save()">';
        html += '</div>';
        html += '<div id="message"></div>';
        html += '</form>';
        return html;
    }

    var Page = {
        form: function () {
            var html = '<div class="page-form">';
            html += '<div clas="form-input">';
            html += '<label for="title">Title</label><br>';
            html += '<input type="text" id="title">';
            html += '<span class="form-error" id="title-error"></span>';
            html += '</div>'
            html += '<div class="form-input">'
            html += '<label for="content">Content</label><br>';
            html += '<textarea id="content"></textarea>';
            html += '<span class="form-error" id="content-error"></span>';
            html += '</div>'
            html += '</div>'
            return html;
        },
        getValue: function(id) {
            var value = document.getElementById(id).value;
            if (value !== undefined) {
                return value;
            }
            return '';
        },
        save: function () {
            if (this.validate()) {
                var post = {
                    id: createId(),
                    type: "post",
                    title: this.getValue('title'),
                    created: new Date().toISOString(),
                    content: this.getValue('content')
                };
                dataStore.setPage(post);
                document.getElementById('message').innerHTML = 'Yay, I was saved!';

                // todo: tell main menu to refresh
            } else {
                document.getElementById('message').innerHTML = 'Problem on form :(';
            }
        },
        validate: function () {
            var success = true;
            var title = this.getValue('title');
            if (title.length == 0) {
                document.getElementById('title-error').innerHTML = 'Title is required';
                success = false;
            }
            var content = this.getValue('content');
            if (content.length == 0) {
                document.getElementById('content-error').innerHTML = 'Content is required';
                success = false;
            }
            return success;
        }
    };

    var slideshowForm = function () {
        return 'slideshowForm';
    }

    var slideshowSave = function () {

    }

    var quizForm = function () {
        return 'quizForm';
    }

    var quizSave = function () {

    }

    var videoForm = function () {
        return 'videoForm';
    }

    var videoSave = function () {

    }

    var display = function () {
        if (currentState == null) {
            currentState = getState('page');;
        }

        var form = currentState.form();
        var html = generateHtml(form);
        contentLoader.render(html);
    }

    var getState = function (type) {
        switch (type) {
            case 'page':
                return Page;
            // case 'slideshow':
            //     return { form: slideshowForm, save: slideshowSave };
            // case 'quiz':
            //     return { form: quizForm, save: quizSave };
            // case 'video':
            //     return { form: videoForm, save: videoSave };
        }
        return null;
    }

    var formChange = function () {
        var type = document.getElementById('form-select').value;
        var cls = getState(type);
        if (cls == null) {
            throw 'Form type not found';
        } else {
            currentState = cls;
            display();
        }
    }

    var save = function () {
        if (currentState == null) {
            throw 'Current state not set';
        } else {
            currentState.save();
        }
    }

    return {
        display: display,
        formChange: formChange,
        save: save
    };
})();
