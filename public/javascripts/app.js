/**
 * Coursework 1 - Interactive Great War Guide
 * Student: Alex McBride (S1715224)
 * Date: 07/11/2018
 * Module: Client Side Web Development
 * App module that starts the application.
 */

var App = (function () {
    var defaultPage = 'home';
    var jsonContentFile = 'data.json';
    var mainContentEl = 'main-content';
    var menuContentEl = 'menu-content';

    var getMenuPages = function () {
        var pages = DataStore.findPages();
        return pages.map(function (page) {
            return { route: ContentLoader.url(page.type, page.id), title: page.title };
        });
    }

    var loadContentLoader = function(defaultPage, mainContentEl) {
        ContentLoader.addPage('home', Page.home);
        ContentLoader.addPage('post', Page.post);
        ContentLoader.addPage('image', Page.image);
        ContentLoader.addPage('video', Page.video);
        ContentLoader.addPage('slideshow', Page.slideshow);
        ContentLoader.addPage('quiz', Page.quiz);
        ContentLoader.addPage('login', Page.login);
        ContentLoader.run(defaultPage, mainContentEl);
    }

    var loadMainMenu = function(getMenuPages, menuContentEl) {
        Menu.addPage('home', 'Home');
        getMenuPages().forEach(function (page) {
            Menu.addPage(page.route, page.title);
        });
        Menu.addPage('login', 'Login');
        Menu.display(menuContentEl);
    }

    var run = function () {
        // Initialize the data store
        DataStore.initialize(function (result) {
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
    App.run();
});
