var adminManager = (function () {
    var currentPage = null;

    // Class to represent adding post.
    var Post = {
        form: function () {
            var html = '<div class="post-form">';
            html += '<h3>Add Post</h3>';
            html += '<div clas="form-input">';
            html += '<label for="post-title">Title</label><br>';
            html += '<input type="text" id="post-title">';
            html += '<span class="form-error" id="post-title-error"></span>';
            html += '</div>'
            html += '<div class="form-input">'
            html += '<label for="post-content">Content</label><br>';
            html += '<textarea id="post-content" rows="10" cols="40"></textarea>';
            html += '<span class="form-error" id="post-content-error"></span>';
            html += '</div>'
            html += '</div>'
            return html;
        },
        save: function () {
            dataStore.setPage({
                id: createId(),
                type: "post",
                title: this.getTitle(),
                created: new Date().toISOString(),
                content: this.getContent()
            });
            document.getElementById('post-title').value = '';
            document.getElementById('post-content').value = '';
        },
        validate: function () {
            var success = true;
            var title = this.getTitle();
            if (title.length == 0) {
                document.getElementById('post-title-error').innerHTML = 'Title is required';
                success = false;
            }
            var content = this.getContent();
            if (content.length == 0) {
                document.getElementById('post-content-error').innerHTML = 'Content is required';
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
        slideInputHtml: function () {
            var html = '<input type="text" value="Slide Title" class="slide-title"> - ';
            html += '<input type="text" value="http://..." class="slide-url"> ';
            html += '<input type="button" value="Delete" onclick="adminManager.deleteSlide(this)">';
            return html;
        },
        form: function () {
            var html = '<div class="slideshow-form">';
            html += '<h3>Add Slideshow</h3>';
            html += '<div clas="form-input">';
            html += '<label for="slideshow-title">Title</label><br>';
            html += '<input type="text" id="slideshow-title">';
            html += '<span class="form-error" id="slideshow-title-error"></span>';
            html += '</div>'
            html += '<p>Add images to slideshow</p>';
            html += '<ol id="slideshow-slides">';
            html += '<li>' + this.slideInputHtml() + '</li>';
            html += '</ol>';
            html += '<input type="button" value="Add Slide" onclick="adminManager.addSlide()">';
            html += '</div>'
            return html;
        },
        save: function () {
            var images = this.getSlideObjects();
            dataStore.setPage({
                id: createId(),
                type: "slideshow",
                title: this.getTitle(),
                images: images
            });
            document.getElementById('slideshow-title').value = '';
        },
        validate: function () {
            var success = true;
            var title = this.getTitle();
            if (title.length == 0) {
                document.getElementById('slideshow-title-error').innerHTML = 'Title is required';
                success = false;
            }

            // Check each slide... yay. maybe create little slide class?

            return success;
        },
        getTitle: function () {
            return document.getElementById('slideshow-title').value.trim();
        },
        getSlideObjects: function () {
            var list = document.getElementById('slideshow-slides');
            return list.childNodes.map(function (item) {
                var title = item.getElementsByClassName('slide-title')[0].value;
                var url = item.getElementsByClassName('slide-url')[0].value;
                return {
                    title: title,
                    src: url
                };
            });
        },        
        addSlide: function () {
            var list = document.getElementById('slideshow-slides');
            var listItem = document.createElement('li');
            listItem.innerHTML = this.slideInputHtml();
            list.appendChild(listItem);
        },
        deleteSlide: function (btnEl) {
            var listItem = btnEl.parentNode;
            var list = document.getElementById('slideshow-slides');
            list.removeChild(listItem);
        }
    };
    
    // Displays the current admin manager state.
    var display = function () {
        if (currentPage == null) {
            currentPage = getState('post');;
        }

        var html = generateHtml();
        contentLoader.render(html);
    }

    // Generates a random ID for pages.
    var createId = function () {
        return crypto.getRandomValues(new Uint32Array(1)).join('');
    }

    // Generates HTML to display the admin form
    var generateHtml = function () {
        var html = '<form>';
        html += '<h2>Admin</h2>';
        html += '<p>Pure add, edit, and delete pages, and aw that.</p>';
        html += '<select id="form-select" onchange="adminManager.formChange()">';
        html += '<option value="post">Post</option>';
        html += '<option value="slideshow">Slideshow</option>';
        html += '<option value="quiz">Quiz</option>';
        html += '<option value="video">Video</option>';
        html += '</select>';
        html += '<hr>';
        html += '<p id="message"></p>';
        html += '<div id="form-content">';
        html += currentPage.form();
        html += '</div>';
        html += '<hr>';
        html += '<div>';
        html += '<input type="button" value="Save" onclick="adminManager.save()">';
        html += '</div>';
        html += '</form>';
        return html;
    }

    // Gets the current state based on the type string.
    var getState = function (type) {
        switch (type) {
            case 'post':
                return Post;
            case 'slideshow':
                return Slideshow;
            // case 'quiz':
            //     return { form: quizForm, save: quizSave };
            // case 'video':
            //     return { form: videoForm, save: videoSave };
        }
        return null;
    }

    // Called when the form select input changes, switches state to selected page type
    var formChange = function () {
        var pageType = document.getElementById('form-select').value;
        var page = getState(pageType);
        if (page == null) {
            throw 'Form type not found';
        } else {
            currentPage = page;
            var html = currentPage.form(); // Update this form.
            document.getElementById('form-content').innerHTML = html;
        }
    }

    // Shortcut for displaying status message.
    var message = function (msg) {
        document.getElementById('message').innerHTML = msg;
    }

    // Called to save the current page state.
    var save = function () {
        if (currentPage == null) {
            throw 'Current state not set';
        } else {
            // Save if page valid.
            if (currentPage.validate()) {
                currentPage.save();
                message('Page saved!');
                app.refreshMenu(); // Tell app to redraw main menu.
            } else {
                message('Problem on form :(');
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

    return {
        display: display,
        formChange: formChange,
        save: save,
        addSlide: addSlide,
        deleteSlide: deleteSlide
    };
})();
