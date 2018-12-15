/* Provides an interface for the data stored in local storage.*/
var dataStore = (function () {
    var version = 76; // Increment this when schema changes to cause local storage to be overridden.

    // Saves array of pages to storage.
    var saveLocalStorage = function (pages) {
        // Remove old stuff.
        window.localStorage.clear();

        // Add each page to storage and create search index.
        var indexes = [];
        var ids = pages.map(function (page) {
            window.localStorage.setItem(page.id, JSON.stringify(page));
            indexes.push(createIndex(page.title, page.id));
            return page.id;
        });
        setIndexes(indexes);

        // To have a list of retrievable pages we store the IDs as a comma-separated list.
        window.localStorage.setItem('ids', ids.join(','));

        // Set the version so we know when it changes.
        window.localStorage.setItem('version', version.toString());
    };

    // Initializes the data and loads the json payload if necessary.
    var initialize = function (callback, file) {
        // Check if the payload has changed
        var localVersion = parseInt(window.localStorage.getItem('version'));
        if (isNaN(localVersion) || version > localVersion) {
            // Load the json payload into local storage
            ajax.getJson(file, function (result) {
                if (result.success) {
                    saveLocalStorage(result.response);
                }
                callback(result);
            });
        } else {
            // Payload already in storage so smile and go with it.
            callback({ success: true });
        }
    };

    // Gets an array of all pages.
    var findPages = function () {
        return getPageIds().map(function (id) {
            return JSON.parse(window.localStorage.getItem(id));
        });
    };

    // Gets a page with a specific id.
    var findPage = function (postId) {
        return JSON.parse(window.localStorage.getItem(postId));
    };

    // Gets an array of all page ids.
    var getPageIds = function () {
        return window.localStorage.getItem('ids').split(',');
    };

    // Sets the array of page ids into local storage
    var setPageIds = function (ids) {
        window.localStorage.setItem('ids', ids.join(','));
    };

    // Adds a single id to the list.
    var addToPageIds = function (id) {
        var ids = getPageIds();
        if (ids.indexOf(id) === -1) {
            ids.push(id);
        }
        setPageIds(ids);
    };

    // Adds a page to local storage, updates list of ids and indexes.
    var setPage = function (page) {
        var data = JSON.stringify(page);
        window.localStorage.setItem(page.id, data);
        addToPageIds(page.id);
        addIndex(page.title, page.id);
        return page;
    };

    // Removes a page from local storage.
    var removePage = function (pageId) {
        window.localStorage.removeItem(pageId);

        // Remove from IDs
        var ids = getPageIds();
        ids.splice(ids.indexOf(pageId), 1);
        setPageIds(ids);

        // Remove from index.
        var indexes = getIndexes();
        var index;
        for (var key in indexes) {
            if (indexes.hasOwnProperty(key) && indexes[key].id === pageId) {
                index = key;
                break;
            }
        }
        indexes.splice(index, 1);
        setIndexes(indexes);
    };

    // Gets list of indexes from storage or returns empty array.
    var getIndexes = function () {
        var json = window.localStorage.getItem('indexes');
        if (json == null) {
            return [];
        }
        return JSON.parse(json);
    };

    // Converts the indexes list to string and stores in storage.
    var setIndexes = function (indexes) {
        window.localStorage.setItem('indexes', JSON.stringify(indexes));
    };

    // Creates an index object.
    var createIndex = function (text, id) {
        return { text: text.toLowerCase(), id: id };
    };

    // Checks if an index with that id exists.
    var indexExists = function (indexes, id) {
        for (var key in indexes) {
            if (indexes.hasOwnProperty(key) && indexes[key].id === id) {
                return true;
            }
        }
        return false;
    };

    // Adds an index to the list.
    var addIndex = function (text, id) {
        var indexes = getIndexes();
        if (!indexExists(indexes, id)) {
            indexes.push(createIndex(text, id));
            setIndexes(indexes);
        }
    };

    // Search indexes for occurrences of value, returns list of pages.
    var search = function (value) {
        value = value.toLowerCase();
        var indexes = getIndexes();
        return indexes.filter(function (index) {
            return index.text.indexOf(value) > -1;
        }).map(function (index) {
            return findPage(index.id);
        });
    };

    return {
        findPage: findPage,
        findPages: findPages,
        initialize: initialize,
        setPage: setPage,
        removePage: removePage,
        search: search
    };
})();
