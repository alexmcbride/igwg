// Represents a page of the app, which either outputs some HTML, or delegates it to a manager 
// module for that page type.
var page = (function () {
    // The home page.
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

    // The single post page.
    var post = function (data) {
        var html = '<div class="post">' +
            '<h3>' + data.title + '</h3>' +
            '<p>' + data.content + '</p>' +
            '</div>';
        content.render(html);
    }

    // The single image page.
    var image = function (data) {
        var html = '<div class="image">' +
            '<h3>' + data.title + '</h3>' +
            '<p><img src="' + data.src + '" alt="' + data.title + '"></p>' +
            '</div>';
        content.render(html);
    }

    // The single video page.
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

    // The slideshow page.
    var slideshow = function (data) {
        slideshowManager.display(data);
    }

    // The quiz page.
    var quiz = function (data) {
        quizManager.display(data);
    }

    // A special page for when another page is not found.
    var notFound = function () {
        var html = '<h3>Not found</h3>';
        html += "<p>Aww, we couldn't find that page. :(</p>";
        content.render(html);
    }

    // The login or logout pages.
    var login = function () {
        loginManager.display();
    }

    // The manage page pages.
    var admin = function () {
        adminManager.display();
    }

    // The search results page.
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
