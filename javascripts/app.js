/**
 * Coursework 1 - Interactive Great War Guide
 * Student: Alex McBride (S1715224)
 * Date: 07/11/2018
 * Module: Client Side Web Development
 * App module that starts the application.
 */

var app = (function () {
    var defaultPage = 'home';
    var jsonContentFile = 'data.json';
    var mainContentEl = 'main-content';
    var menuContentEl = 'menu-content';

    var getMenuPages = function () {
        var pages = dataStore.findPages();
        return pages.map(function (page) {
            return { route: contentLoader.url(page.type, page.id), title: page.title };
        });
    }

    var loadContentLoader = function(defaultPage, mainContentEl) {
        contentLoader.addPage('home', page.home);
        contentLoader.addPage('post', page.post);
        contentLoader.addPage('image', page.image);
        contentLoader.addPage('video', page.video);
        contentLoader.addPage('slideshow', page.slideshow);
        contentLoader.addPage('quiz', page.quiz);
        contentLoader.addPage('login', page.login);
        contentLoader.addPage('admin', page.admin);
        contentLoader.run(defaultPage, mainContentEl);
    }

    var loadMainMenu = function(getMenuPages, menuContentEl) {
        menu.addPage('home', 'Home');
        getMenuPages().forEach(function (page) {
            menu.addPage(page.route, page.title);
        });
        menu.addPage('login', 'Login');
        menu.addPage('admin', 'Admin');
        menu.display(menuContentEl);
    }

    var run = function () {
        // Initialize the data store
        dataStore.initialize(function (result) {
            if (result.success) {
                // Start app
                loadContentLoader(defaultPage, mainContentEl);
                loadMainMenu(getMenuPages, menuContentEl);
            } else {
                document.getElementById(mainContentEl).innerHTML = "Error: " + result.response;
            }
        }, jsonContentFile);
    }

    return {
        run: run
    };
})();

document.addEventListener("DOMContentLoaded", function () {
    app.run();
});
