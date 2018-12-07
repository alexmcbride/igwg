// Responsible for loading content. Watches for hash changes and loads the page.
var contentLoader = (function () {
    var pageMap = [];

    // Adds page to the map for particular route.
    var addPage = function (pageName, pageHandler) {
        pageMap[pageName] = pageHandler;
    }

    // Gets a handler for a specific route from the map.
    var getPageHandler = function (pageName) {
        if (pageMap[pageName] === undefined) {
            return page.notFound;
        } else {
            return pageMap[pageName];
        }
    }

    // Loads the specified route, and attempts to load the content from that route if present.
    var load = function (pageName, pageId) {
        var pageHandler = getPageHandler(pageName);
        if (pageId !== undefined && pageId !== null) {
            var pageData = dataStore.findPage(pageId);
            if (pageData === null) {
                content.render('<h3>Not Found</h3><p>Page data for ID "' + pageId + '" not found</p>');
            } else if (pageData.type !== pageName) {
                content.render('<h3>Not Found</h3><p>Page type "' + pageData.type + '" does not match route "' + pageName + '"</p>');
            } else {
                pageHandler(pageData);
            }
        } else {
            pageHandler();
        }
    }

    // Called when the hash location changes.
    var locationChanged = function () {
        var pageName = urlHelper.page();
        var pageId = urlHelper.pageId();
        load(pageName, pageId);
    }

    // Runs the content loader, which draws the main content, and watches for location changes.
    var initialize = function (defaultPage) {
        if (window.location.hash) {
            locationChanged(); // Hash already set when page loaded.
        } else {
            load(defaultPage); // Start with default.
        }

        window.onhashchange = locationChanged;
    }

    return {
        addPage: addPage,
        initialize: initialize
    };
})();
