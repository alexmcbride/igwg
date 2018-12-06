//a page updating module that puts the actual content on to the page

var page = (function () {
    var home = function () {
        var html = '<h2>Home</h2><p>Intro to web site and stuff...</p>';
        content.render(html);
    }

    var post = function (data) {
        var html = '<div class="post">' +
            '<h3>' + data.title + '</h3>' +
            '<p>' + data.content + '</p>' +
            '<p>Posted on ' + data.created + '</p>' +
            '</div>';
        content.render(html);
    }

    var image = function (data) {
        var html = '<div class="image">' +
            '<h3>' + data.title + '</h3>' +
            '<p><img src="' + data.src + '" alt="' + data.title + '"></p>' +
            '</div>';
        content.render(html);
    }

    var video = function (data) {
        var html = '<div class="video">' +
            '<h3>' + data.title + '</h3>' +
            '<video width="640" height="480" controls>' +
            '<source src="' + data.src + '" type="' + data.contentType + '">' +
            'Your browser does not support this video' +
            '</video>' +
            '</div>';
        content.render(html);
    }

    var slideshow = function (data) {
        slideshowManager.display(data);
    }

    var quiz = function (data) {
        quizManager.display(data);
    }

    var notFound = function () {
        var html = '<h3>Not found</h3>';
        html += "<p>Aww, we couldn't find that page. :(</p>";
        content.render(html);
    }

    var login = function () {
        loginManager.display();
    }

    var loginConfirm = function() {
        var html = '<h3>Login Confirm</h3>';
        html += "<p>You are now logged in!</p>";
        content.render(html);
    }

    var logoutConfirm = function() {
        var html = '<h3>Logout Confirm</h3>';
        html += "<p>You are now logged out!</p>";
        content.render(html);
    }

    var admin = function () {
        adminManager.display();
    }

    var search = function () {
        searchManager.display();
    }

    return {
        home: home,
        post: post,
        image: image,
        video: video,
        slideshow: slideshow,
        quiz: quiz,
        notFound: notFound,
        login: login,
        loginConfirm: loginConfirm,
        logoutConfirm: logoutConfirm,
        admin: admin,
        search: search
    }
})();
