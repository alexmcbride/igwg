//a page updating module that puts the actual content on to the page

var page = (function () {
    var home = function () {
        var html = '<div class="jumbotron">';
        html += '<h1 class="display-4">Welcome</h1>';
        html += '<p class="lead">Welcome to the interactive guide to the first world war. It is the centenary of the great war and this web site has been created to commemorate it.</p>';
        html += '<hr class="my-4">';
        html += '<p>Here you will find information about the war, slideshows, videos, and quizes. All designed to help you understand what happened and why.</p>';
        html += '<a class="btn btn-primary btn-lg" href="#post/580559509" role="button">Start your journey!</a>';
        html += '</div>';

        content.render(html);
    }

    var post = function (data) {
        var html = '<div class="post">' +
            '<h3>' + data.title + '</h3>' +
            '<p>' + data.content + '</p>' +
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
        admin: admin,
        search: search
    }
})();
