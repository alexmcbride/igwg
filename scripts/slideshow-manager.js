// Module to control a slideshow.
var slideshowManager = (function () {
    var pageData = null;

    // Gets next slide index or -1 if none
    var getNextIndex = function (currentIndex) {
        var len = pageData.images.length;
        if (len > 0 && currentIndex < (len - 1)) {
            return currentIndex + 1;
        }
        return -1;
    };

    // Gets previous slide index or -1 if none
    var getPreviousIndex = function (currentIndex) {
        if (pageData.images.length > 0 && currentIndex > 0) {
            return currentIndex - 1;
        }
        return -1;
    };

    // Get the index of the first slide or -1
    var getStartIndex = function (currentIndex) {
        if (pageData.images.length > 0 && currentIndex > 0) {
            return 0;
        }
        return -1;
    };

    // Get the index of the last slide or -1
    var getEndIndex = function (currentIndex) {
        if (pageData.images.length > 0 && currentIndex < (pageData.images.length - 1)) {
            return pageData.images.length - 1;
        }
        return -1;
    };

    // Go to the slide number in text input or show an error if not possible.
    var goToSlide = function () {
        var value = document.getElementById('gotoslide').value;
        var input = parseInt(value);
        if (isNaN(input)) {
            alert("'" + value + "' is not a number");
        } else if (input < 1 || input > pageData.images.length) {
            alert("'" + value + "' is outside of the slideshow range");
        } else {
            document.location.hash = '#' + urlHelper.generateHash(pageData.type, pageData.id, input - 1);
        }
    };

    // Get HTML for a single link
    var generateLink = function (index, cls, text) {
        if (index > -1) {
            return '<a class="' + cls + '" href="#' + urlHelper.generateHash(pageData.type, pageData.id, index) + '">' + text + '</a>';
        }
        return '';
    };

    // Get HTML for the go to slide input
    var generateGoToSlide = function (currentIndex) {
        var html = '';
        if (pageData.images.length > 0) {
            html += '<label for="gotoslide">Go to slide:</label> ';
            html += '<input type="text" id="gotoslide" onchange="slideshowManager.goToSlide()" value="' + (currentIndex + 1) + '" style="width: 80px;">';
        }
        return html;
    };

    // Get HTML for the slide controls
    var generateControlsHtml = function (currentIndex) {
        var html = '<div class="row">';
        html += '<div class="col-4">';
        html += generateLink(getStartIndex(currentIndex), 'start', '&laquo; Start') + '&nbsp;&nbsp;';
        html += generateLink(getPreviousIndex(currentIndex), 'previous', '&laquo; Previous') + '&nbsp;&nbsp;';
        html += '</div>';
        html += '<div class="col-4">';
        html += generateGoToSlide(currentIndex) + ' ';
        html += '</div>';
        html += '<div class="col-4 text-right">';
        html += generateLink(getNextIndex(currentIndex), 'next', 'Next &raquo;') + '&nbsp;&nbsp;';
        html += generateLink(getEndIndex(currentIndex), 'end', 'End &raquo;');
        html += '</div>';
        html += '</div>';
        return html;
    };

    // Get HTML for the page.
    var generateHtml = function () {
        var currentIndex = urlHelper.slide();
        var slide = pageData.images[currentIndex];
        if (slide === undefined) {
            return '<p>Slide not found :(</p>';
        } else {
            var html = '<div class="slideshow">' +
                '<h3>' + pageData.title + '</h3>' +
                '<p>' + slide.title + '</p>' +
                '<div class="text-center">' + 
                '<img src="' + slide.src + '" alt="' + slide.title + '" height="350px">' + 
                '</div><br>';
            html += generateControlsHtml(currentIndex);
            return html + '</div>';
        }
    };

    var display = function (data) {
        pageData = data;
        var html = generateHtml();
        content.render(html);
    };

    return {
        display: display,
        goToSlide: goToSlide
    }
})();
