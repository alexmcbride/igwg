// Represents a page of the app, which either outputs some HTML, or delegates it to a manager 
// module for that page type.
var page = (function () {
    // The home page.
    var home = function () {
        var html = '<div class="jumbotron home-bg">';
        html += '<h1 class="display-4">Welcome</h1>';
        html += '<p class="lead">Welcome to the interactive guide to the first world war. It is the centenary of the great war and this web site has been created to commemorate it.</p>';
        html += '<hr class="my-4">';
        html += '<p>Here you will find information about the war, slide shows, videos, and quizzes. All designed to help you understand what happened and why.</p>';
        html += '<a class="btn btn-primary btn-lg" href="#post/580559509" role="button">Start your journey!</a>';
        html += '</div>';
        app.render(html);
    };

    var replaceNewlines = function (str) {
        return str.split('\n').join('<br>');
    };

    // The single post page.
    var post = function (data) {
        var html = '<div class="post">' +
            '<h3>' + data.title + '</h3>' +
            '<p>' + replaceNewlines(data.content) + '</p>' +
            '</div>';
        app.render(html);
    };

    // The single image page.
    var image = function (data) {
        var html = '<div class="image">' +
            '<h3>' + data.title + '</h3>' +
            '<p>' + data.description + '</p>' +
            '<p><img src="' + data.src + '" alt="' + data.title + '" width="800px"></p>' +
            '</div>';
        app.render(html);
    };

    // The single video page.
    var video = function (data) {
        var html = '<div class="video">' +
            '<h3>' + data.title + '</h3>' +
            '<p>' + data.description + '</p>' +
            '<video width="640" height="480" controls>' +
            '<source src="' + data.src + '" type="' + data.contentType + '">' +
            'Your browser does not support this video' +
            '</video>' +
            '</div>';
        app.render(html);
    };

    // A special page for when another page is not found. Aww.
    var notFound = function () {
        var html = '<h3>Not found</h3>';
        html += "<p>Aww, that page wasn't found. :(</p>";
        app.render(html);
    };

    // The slideshow page.
    var slideshow = function (data) {
        slideshowManager.display(data);
    };

    // The quiz page.
    var quiz = function (data) {
        quizManager.display(data);
    };

    // The login page.
    var login = function () {
        loginManager.display();
    };

    // The logout page.
    var logout = function () {
        loginManager.display();
    };

    // The manage page pages.
    var admin = function () {
        adminManager.display();
    };

    // The search results page.
    var search = function () {
        searchManager.display();
    };

    // The heroes page.
    var heroes = function (pageData) {
        var index = urlHelper.index();
        var hero = pageData.heroes[index];
        var html = '<h2>' + pageData.title + '</h2>';
        html += '<p>Select a hero from the list to learn more about them:</p>';
        html += '<div class="row">';
        html += '<div class="col-5" id="master">';
        html += '<ul>';
        pageData.heroes.forEach(function (hero, index) {
            var hash = urlHelper.generateHash(pageData.type, pageData.id, index);
            html += '<li><a href="#' + hash + '">' + hero.title.slice(1, -1) + '</a></li>';
        });
        html += '</ul>';
        html += '</div>';
        html += '<div class="col" id="detail">';
        html += '<h3>' + hero.title.slice(1, -1) + '</h3>';
        html += '<ul class="list-unstyled">';
        html += '<li>Date: ' + hero.publDate + '</li>';
        html += '<li>Descript: ' + hero.descript + '</li>';
        html += '<li>History: ' + hero.history + '</li>';
        html += '<li>Subject: ' + hero.subject + '</li>';
        html += '<li>Source: ' + hero.source + '</li>';
        html += '</ul>';
        html += '</div>';
        html += '</div>';
        app.render(html);
    };

    return {
        home: home,
        post: post,
        image: image,
        video: video,
        slideshow: slideshow,
        quiz: quiz,
        notFound: notFound,
        login: login,
        logout: logout,
        admin: admin,
        search: search,
        heroes: heroes,
    }
})();
