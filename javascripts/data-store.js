
var dataStore = (function () {
    var version = 27; // Increment this when schema changes to cause local storage to be overidden.

    var uuid = function () {
        return crypto.getRandomValues(new Uint32Array(4)).join('-');
    }

    var saveLocally = function (pages) {
        // Remove old stuff.
        window.localStorage.clear();

        var ids = [];
        pages.forEach(page => {
            window.localStorage.setItem(page.id, JSON.stringify(page));
            ids.push(page.id);
        });

        // So we have a list of retrieveable pages we store the IDs as a comma-seperated list
        window.localStorage.setItem('ids', ids.join(','));

        // Set the version so we know when it changes.
        window.localStorage.setItem('version', version.toString());
    }

    var initialize = function (callback, file) {
        var localVersion = parseInt(window.localStorage.getItem('version'));
        if (isNaN(localVersion) || version > localVersion) {
            // Load the initial json payload into local storage
            ajax.getJson(file, function (result) {
                if (result.success) {
                    var pages = JSON.parse(result.response);
                    saveLocally(pages);
                }
                callback(result);
            });
        } else {
            // Payload already in local storage so just callback success
            callback({ success: true });
        }
    }

    var findPages = function () {
        var ids = getPageIds();
        var pages = [];
        ids.forEach(function (id) {
            var page = JSON.parse(window.localStorage.getItem(id));
            pages.push(page);
        });
        return pages;
    }

    var findPage = function (postId) {
        var json = window.localStorage.getItem(postId);
        return JSON.parse(json);
    }

    var getPageIds = function () {
        return window.localStorage.getItem('ids').split(',');
    }

    var setPageIds = function (ids) {
        window.localStorage.setItem('ids', ids.join(','));
    }

    var addToPageIds = function (id) {
        var ids = getPageIds();
        if (ids.indexOf(id) == -1) {
            ids.push(id);
        }
        setPageIds(ids);
    }

    var setPage = function (page) {
        window.localStorage.setItem(page.id, JSON.stringify(page));
        addToPageIds(page.id);
    }

    var removePage = function (page) {
        window.localStorage.removeItem(page.id);
        var ids = getPageIds();
        var index = ids.indexOf(page.id);
        ids.splice(index, 1);
        setPageIds(ids);
    }

    return {
        findPage: findPage,
        findPages: findPages,
        initialize: initialize,
        setPage: setPage
    };
})();
