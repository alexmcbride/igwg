// Module to help with handling URLs.
var urlHelper = (function () {
    var seperator = '/';

    // Gets the hash as an array.
    var hash = function () {
        if (location.hash) {
            var segments = location.hash.substr(1).split(seperator);
            if (segments.length > 0) {
                return segments;
            }
        }
        return [];
    }

    // Gets the page part of the hash.
    var page = function() {
        var segments = hash();
        if (segments.length > 0) {
            var segment = segments[0];
            if (segment.indexOf('?') > -1) {
                return segment.split('?')[0];
            }
            return segment;
        }
        return null;
    }

    // Gets the page ID from the hash.
    var pageId = function() {
        var segments = hash();
        if (segments.length > 1) {
            return segments[1];
        }
        return null;
    }

    // Gets the slide from the hash.
    var slide = function() {
        var segments = hash();
        if (segments.length > 2) {
            var slide = parseInt(segments[2]);
            if (slide === undefined) {
                return 0;
            }
            return slide;
        }
        return 0;
    }

    var search = function() {
        var segments = hash();
        if (segments.length > 0) {
            segments = segments[0].split('?');
            if (segments.length > 0) {
                var query = segments[1];
                if (query.indexOf('=') > -1) {
                    return query.split('=')[1];
                }
            }
        }
        return null;
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

    return {
        hash: hash,
        page: page,
        pageId: pageId,
        slide: slide,
        url: url,
        search: search
    };
})();