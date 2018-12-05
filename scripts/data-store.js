
var dataStore = (function () {
    var version = 33; // Increment this when schema changes to cause local storage to be overidden.

    var saveLocalStorage = function (pages) {
        // Remove old stuff.
        window.localStorage.clear();

        // Add each page to storage.
        var indexes = [];
        var ids = pages.map(function (page) {
            window.localStorage.setItem(page.id, JSON.stringify(page));
            indexes.push(createIndex(page.title.toLowerCase(), page.id));
            return page.id;
        });
        setIndexes(indexes);

        // To have a list of retrieveable pages we store the IDs as a comma-seperated list.
        window.localStorage.setItem('ids', ids.join(','));

        // Set the version so we know when it changes.
        window.localStorage.setItem('version', version.toString());
    }

    var initialize = function (callback, file) {
        // Check if the payload has changed
        var localVersion = parseInt(window.localStorage.getItem('version'));
        if (isNaN(localVersion) || version > localVersion) {
            // Load the json payload into local storage
            ajax.getJson(file, function (result) {
                if (result.success) {
                    var pages = JSON.parse(result.response);
                    saveLocalStorage(pages);
                }
                callback(result);
            });
        } else {
            // Payload already in storage so smile and go with it.
            callback({ success: true });
        }
    }

    var findPages = function () {
        return getPageIds().map(function (id) {
            return JSON.parse(window.localStorage.getItem(id));
        });
    }

    var findPage = function (postId) {
        return JSON.parse(window.localStorage.getItem(postId));
    }

    var getPageIds = function () {
        return window.localStorage.getItem('ids').split(',');
    }

    var setPageIds = function (ids) {
        window.localStorage.setItem('ids', ids.join(','));
    }

    var addToPageIds = function (id) {
        var ids = getPageIds();
        if (ids.indexOf(id) === -1) {
            ids.push(id);
        }
        setPageIds(ids);
    }

    var setPage = function (page) {
        var data = JSON.stringify(page);
        window.localStorage.setItem(page.id, data);
        addToPageIds(page.id);
        addIndex(page.title, page.id);
        return page;
    }

    var removePage = function (page) {
        window.localStorage.removeItem(page.id);
        var ids = getPageIds();
        var index = ids.indexOf(page.id);
        ids.splice(index, 1);
        setPageIds(ids);
    }

    var getIndexes = function () {
        var json = window.localStorage.getItem('indexes');
        if (json == null) {
            return [];
        }
        return JSON.parse(json);
    }

    var setIndexes = function (indexes) {
        window.localStorage.setItem('indexes', JSON.stringify(indexes));
    }

    var createIndex = function (text, id) {
        return { text: text.toLowerCase(), id: id };
    }

    var addIndex = function (text, id) {
        var indexes = getIndexes();
        indexes.push(createIndex(text, id));
        setIndexes(indexes);
    }

    var search = function (value) {
        var value = value.toLowerCase();
        var indexes = getIndexes();
        var results = [];
        for (var key in indexes) {
            var index = indexes[key];
            if (index.text.indexOf(value) > -1) {
                results.push(index.id);
            }
        }
        return results.map(function (id) {
            return findPage(id);
        });
    }

    return {
        findPage: findPage,
        findPages: findPages,
        initialize: initialize,
        setPage: setPage,
        search: search
    };
})();
