// Responsible for loading content. Watches for hash changes and loads the page.
var contentLoader = (function () {
    var mainContentEl = null;
    var pageMap = [];
    var defaultPageRoute = null;

    // Adds page to the map for particular route.
    var addPage = function (route, page) {
        pageMap[route] = page;
    }

    // Gets a handler for a specific route from the map.
    var getPageHandler = function (route) {
        if (pageMap[route] === undefined) {
            return page.notFound;
        } else {
            return pageMap[route];
        }
    }

    // Loads the specified route, and attempts to load the content from that route if present.
    var load = function (route, contentId) {
        var pageHandler = getPageHandler(route);
        if (contentId !== null) {
            var pageData = dataStore.findPage(contentId);
            if (pageData === null) {
                content.render('<p>Page data for ID "' + contentId + '" not found</p>');
            } else if (pageData.type != route) {
                content.render('<p>Page type "' + pageData.type + '" does not match route</p>');
            } else {
                pageHandler(pageData);
            }
        } else {
            pageHandler();
        }
    }

    // Called when the hash location changes, tries to parse the content out and calls load.
    var locationChanged = function () {
        var page = urlHelper.page();
        var contentId = urlHelper.pageId();
        load(page, contentId);
    }

    // Runs the content loader, which draws the main content, and watches for location changes.
    var run = function (defaultPage, contentEl) {
        defaultPageRoute = defaultPage;
        mainContentEl = contentEl;

        if (window.location.hash) {
            locationChanged(); // Hash already set when page loaded.
        } else {
            load(defaultPage); // Start with default.
        }

        window.onhashchange = locationChanged;
    }

    return {
        addPage: addPage,
        run: run,
        getData: getData,
        url: url
    };
})();
