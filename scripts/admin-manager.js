var adminManager = (function () {
    var currentPage = null;

    // Class to represent adding post.
    var Post = {
        form: function () {
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
            var html = '<input type="text" placeholder="Title" class="slide-title" class="form-control"> - ';
            html += '<input type="text" placeholder="URL" class="slide-url" class="form-control"> ';
            html += '<button onclick="adminManager.deleteSlide(this)" class="btn btn-light btn-image" title="Remove Slide"><img src="images/icons/delete-button.png"></button>';
            html += '<span class="form-error slideshow-slide-error"></span>';
            return html;
        },
        form: function () {
            var html = '<div class="slideshow-form">';
            html += '<h3>Slideshow</h3>';
            html += '<div clas="form-group">';
            html += '<label for="slideshow-title">Title</label><br>';
            html += '<input type="text" id="slideshow-title" class="form-control">';
            html += '<span class="form-error" id="slideshow-title-error"></span>';
            html += '</div><br>'
            html += '<p>Add images to slideshow.</p>';
            html += '<ol id="slideshow-slides">';
            html += '<li>' + this.slideInputHtml() + '</li>';
            html += '</ol>';
            html += '<input type="button" value="Add Slide" onclick="adminManager.addSlide()" class="btn btn-secondary">';
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

    // Generates HTML to display the admin form
    var generateHtml = function () {
        var html = '<form id="admin-form">';
        html += '<h2>Admin</h2>';
        html += '<hr>';
        html += '<div class="form-group">';
        html += '<label for="form-select">Select the type of page</label><br>';
        html += '<select id="form-select" onchange="adminManager.formChange()" class="form-control">';
        html += '<option value="post">Post</option>';
        html += '<option value="slideshow">Slideshow</option>';
        html += '<option value="quiz">Quiz</option>';
        html += '<option value="video">Video</option>';
        html += '</select>';
        html += '</div>';
        html += '<hr>';
        html += '<p id="message"></p>';
        html += '<div id="form-content">';
        html += currentPage.form();
        html += '</div>';
        html += '<hr>';
        html += '<div>';
        html += '<input type="button" value="Save" onclick="adminManager.save()" class="btn btn-primary">';
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
            // case 'quiz':
            //     return { form: quizForm, save: quizSave };
            // case 'video':
            //     return { form: videoForm, save: videoSave };
        }
        return null;
    }

    // Called when the form select input changes, switches page to selected type
    var formChange = function () {
        var pageType = document.getElementById('form-select').value;
        var page = getPage(pageType);
        if (page == null) {
            throw 'Form type not found';
        } else {
            currentPage = page; // Set for whole module.
            var html = currentPage.form(); // Update this form.
            document.getElementById('form-content').innerHTML = html;
            message('');
        }
    }

    // Shortcut for displaying status message.
    var message = function (msg) {
        document.getElementById('message').innerHTML = msg;
    }

    var clearFormMessages = function() {
        var children = document.getElementsByClassName('form-error');
        for (var child in children) {
            children[child].innerHTML = '';
        }
    }

    // Called to save the current page state.
    var save = function () {
        if (currentPage == null) {
            throw 'Current state not set';
        } else {
            // Save if page valid.
            clearFormMessages();
            if (currentPage.validate()) {
                currentPage.save();
                message('Page saved!');
                app.refreshMenu(); // Tell app to redraw main menu.
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
