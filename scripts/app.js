// Module to start the app up.
var app = (function () {
    // Starts the app, initializes the modules, and adds content handlers
    var start = function () { 
        // Initialzie main menu.
        loadMainMenu();

        // Initialize modules
        var mainContentEl = 'main-content';     
        content.initialize(mainContentEl);
        searchManager.initialize('search-content');
        loginManager.initialize('login-content');

        // Initialize content loader.
        contentLoader.addPage('home', page.home);
        contentLoader.addPage('post', page.post);
        contentLoader.addPage('image', page.image);
        contentLoader.addPage('video', page.video);
        contentLoader.addPage('slideshow', page.slideshow);
        contentLoader.addPage('quiz', page.quiz);
        contentLoader.addPage('login', page.login);
        contentLoader.addPage('admin', page.admin);
        contentLoader.addPage('search', page.search);
        contentLoader.initialize('home', mainContentEl);
    }

    // Loads the main menu.
    var loadMainMenu = function () {
        menu.addPage('home', 'Home');
        getMenuPages().forEach(function (page) {
            menu.addPage(page.route, page.title);
        });
        menu.display('menu-content');
    }

    // Gets list of main menu pages from data store.
    var getMenuPages = function () {
        var pages = dataStore.findPages();
        return pages.map(function (page) {
            return { route: urlHelper.url(page.type, page.id), title: page.title };
        });
    }

    // Runs the app, tries to get the payload, then starts app.
    var run = function () {
        // Initialize the data store
        dataStore.initialize(function (result) {
            if (result.success) {
                start();
            } else {
                document.getElementById(mainContentEl).innerHTML = "Error: " + result.response;
            }
        }, 'data.json');
    }

    // Refreshes the main menu to redraw it e.g. when a page is added or deleted by the admin manager.
    var refreshMenu = function () {
        menu.clear();
        loadMainMenu();
    }

    return {
        run: run,
        refreshMenu
    };
})();

// DOMContentLoaded may fire before script has run, so check before adding a listener
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", app.run);
} else {
    app.run();
}
