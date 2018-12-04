//a content loader module that loads the appropriate content and passes control over
// to the appropriate display routine eg the slide manager; the page updater etc

var contentLoader = (function () {
    var seperator = '/';
    var mainContentEl = null;
    var pageMap = [];

    var addPage = function (route, page) {
        pageMap[route] = page;
    }

    var getPageHandler = function (route) {
        if (pageMap[route] === undefined) {
            return page.notFound; // :(
        } else {
            return pageMap[route];
        }
    }

    var load = function (route, contentId) {
        var pageHandler = getPageHandler(route);
        if (contentId !== undefined && contentId !== 0) {
            var pageData = dataStore.findPage(contentId);
            if (pageData === null) {
                render('<p>Page data for ID "' + contentId + '" not found</p>');
            } else if (pageData.type != route) {
                render('<p>Page type "' + pageData.type + '" does not match route</p>');
            } else {
                pageHandler(pageData);
            }
        } else {
            pageHandler();
        }
    }

    var render = function (html) {
        document.getElementById(mainContentEl).innerHTML = html;
    }

    var locationChanged = function () {
        var page = window.location.hash.substring(1);
        if (page.indexOf(seperator) > -1) {
            page = page.split(seperator)[0];
        }
        var contentId = getContentId();
        load(page, contentId);
    }

    var getContentId = function () {
        if (window.location.hash) {
            var hash = window.location.hash.substring(1);
            if (hash.indexOf(seperator) > -1) {
                return hash.split(seperator)[1];
            }
        }
        return 0;
    }

    var countSeperators = function (str) {
        var count = 0;
        for (var i = 0; i < str.length; i++) {
            if (str[i] === seperator) {
                count++;
            }
        }
        return count;
    }

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

    var run = function (defaultPage, contentEl) {
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
        render: render,
        run: run,
        getData: getData,
        url: url
    };
})();
