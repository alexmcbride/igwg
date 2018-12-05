var urlHelper = (function () {
    var seperator = '/';

    var hash = function () {
        if (location.hash) {
            var segments = location.hash.substr(1).split(seperator);
            if (segments.length > 0) {
                return segments;
            }
        }
        return [];
    }

    var page = function() {
        var segments = hash();
        if (segments.length > 0) {
            return segments[0];
        }
        return null;
    }

    var pageId = function() {
        var segments = hash();
        if (segments.length > 1) {
            return segments[1];
        }
        return null;
    }

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
        url: url
    };
})();