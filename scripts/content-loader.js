// Responsible for loading content. Watches for hash changes and loads the page.
var contentLoader = (function () {
    var seperator = '/';
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
        if (contentId !== undefined && contentId !== 0 && contentId !== '') {
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
        var page = window.location.hash.substring(1);
        if (page.indexOf(seperator) > -1) {
            page = page.split(seperator)[0];
        }
        if (page == '') {
            page = defaultPageRoute;
        }
        var contentId = getContentId();
        load(page, contentId);
    }

    // Gets the content ID portion of a hash or blank string.
    var getContentId = function () {
        if (window.location.hash) {
            var hash = window.location.hash.substring(1);
            if (hash.indexOf(seperator) > -1) {
                return hash.split(seperator)[1];
            }
        }
        return '';
    }

    // Counts the number of seperators in the specified string.
    var countSeperators = function (str) {
        var count = 0;
        for (var i = 0; i < str.length; i++) {
            if (str[i] === seperator) {
                count++;
            }
        }
        return count;
    }

    // Gets the data portion of a hash, which is bit after the last seperator.
    var getData = function () {
        var hash = window.location.hash;
        if (hash) {
            var count = countSeperators(hash);
            if (count > 1) {
                var index = hash.lastIndexOf(seperator);
                if (index > -1) {
                    var lastHash = hash.substr(index + 1);
                    var id = parseInt(lastHash);
                    if (!isNaN(id)) {
                        return id;
                    }
                }
            }
        }
        return 0;
    }

    // Creates a URL for the specified page.
    var url = function (page, pageId, dataId) {
        var url = page;
        if (pageId) {
            url += seperator + pageId;
            if (dataId) {
                url += seperator + dataId;
            }
        }
        return url;
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
