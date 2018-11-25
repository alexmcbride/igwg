//a page updating module that puts the actual content on to the page

var Page = (function () {
    var home = function () {
        var html = '<h2>Home</h2><p>Intro to web site and stuff...</p>';
        ContentLoader.render(html);
    }

    var post = function (data) {
        var html = '<div class="post">' +
            '<h3>' + data.title + '</h3>' +
            '<p>' + data.content + '</p>' +
            '<p>Posted by ' + data.author + ' on ' + data.created + '</p>' +
            '</div>';
        ContentLoader.render(html);
    }

    var image = function (data) {
        var html = '<div class="image">' +
            '<h3>' + data.title + '</h3>' +
            '<p><img src="' + data.src + '"></p>' +
            '</div>';
        ContentLoader.render(html);
    }

    var video = function (data) {
        var html = '<div class="video">' +
            '<h3>' + data.title + '</h3>' +
            '<video width="640" height="480" controls>' +
            '<source src="' + data.src + '" type="' + data.contentType + '">' +
            'Your browser does not support this video' +
            '</video>' +
            '</div>';
        ContentLoader.render(html);
    }

    var slideshow = function (data) {
        SlideshowManager.display(data);
    }

    var quiz = function (data) {
        QuizManager.display(data);
    }

    var notFound = function () {
        var html = '<h3>Not found</h3>';
        html += "<p>Aww, we couldn't find that page. :(</p>";
        ContentLoader.render(html);
    }

    var login = function() {
        AdminManager.display();
    }

    return {
        home: home,
        post: post,
        image: image,
        video: video,
        slideshow: slideshow,
        quiz: quiz,
        notFound: notFound,
        login: login
    }
})();
