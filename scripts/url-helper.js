// Module to help with handling URLs.
var urlHelper = (function () {
    var separator = '/';

    // Gets the hash as an array.
    var hash = function () {
        if (location.hash) {
            return location.hash.substr(1).split(separator);
        }
        return [];
    };

    // Gets the page part of the hash.
    var page = function() {
        var segments = hash();
        if (segments.length > 0) {
            var index = segments[0].indexOf('?');
            if (index > -1) {
                return segments[0].substr(0, index);
            }
            return segments[0];
        }
        return null;
    };

    // Gets the page ID from the hash.
    var pageId = function() {
        var segments = hash();
        if (segments.length > 1) {
            return segments[1];
        }
        return null;
    };

    // Gets an index from the hash.
    var index = function() {
        var segments = hash();
        if (segments.length > 2) {
            var slide = parseInt(segments[2]);
            if (slide === undefined) {
                return 0;
            }
            return slide;
        }
        return 0;
    };

    // Gets the search term from the hash.
    var search = function() {
        var segments = hash();
        if (segments.length > 0) {
            segments = segments[0].split('?');
            if (segments.length > 0) {
                var query = segments[1];
                var index = query.indexOf('=');
                if (index > -1) {
                    return query.substring(index + 1);
                }
            }
        }
        return null;
    };

    // Creates a hash for the specified page.
    var generateHash = function (page, pageId, dataId) {
        var url = page;
        if (pageId) {
            url += separator + pageId;
            if (dataId) {
                url += separator + dataId;
            }
        }
        return url;
    };

    return {
        hash: hash,
        page: page,
        pageId: pageId,
        index: index,
        generateHash: generateHash,
        search: search
    };
})();