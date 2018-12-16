// Module to start the app up.
var app = (function () {
    // Starts the app, initializes the modules, and adds content handlers
    var start = function () {
        // Initialize main menu.
        initializeMainMenu();

        // Initialize modules 
        searchManager.initialize('search-content');
        loginManager.initialize('login-content');

        // Add content handlers for page types.
        contentLoader.addPage('home', page.home);
        contentLoader.addPage('post', page.post);
        contentLoader.addPage('image', page.image);
        contentLoader.addPage('video', page.video);
        contentLoader.addPage('slideshow', page.slideshow);
        contentLoader.addPage('quiz', page.quiz);
        contentLoader.addPage('login', page.login);
        contentLoader.addPage('logout', page.logout);
        contentLoader.addPage('admin', page.admin);
        contentLoader.addPage('search', page.search);
        contentLoader.addPage('heroes', page.heroes);

        // Initialize content loader, which takes over from here.
        contentLoader.initialize('home' /* defaultPage */);
    };

    // Loads the main menu.
    var initializeMainMenu = function () {
        menu.addPage('home', 'Home');
        dataStore.findPages().forEach(function (page) {
            var hash = urlHelper.generateHash(page.type, page.id);
            menu.addPage(hash, page.title);
        });
        menu.initialize('menu-content');
    };

    // Runs the app, tries to get the payload, then starts app.
    var run = function () {
        // Initialize the data store
        dataStore.initialize(function (result) {
            if (result.success) {
                start();
            } else {
                document.getElementById('main-content').innerHTML = "Error: " + result.response;
            }
        }, 'data.json');
    };

    // Refreshes the main menu to redraw it e.g. when a page is added or deleted by the admin manager.
    var refreshMenu = function () {
        menu.clear();
        initializeMainMenu();
    };

    // Renders HTML to the main content element.
    var render = function (html) {
        document.getElementById('main-content').innerHTML = html;
    };

    return {
        run: run,
        refreshMenu: refreshMenu,
        render: render
    };
})();

// DOMContentLoaded may fire before script has run, so check before adding a listener
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", app.run);
} else {
    app.run();
}
