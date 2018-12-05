// Module to control a slideshow.
var slideshowManager = (function () {
    var pageData = null;

    // Gets next slide index or -1 if none
    var getNextIndex = function (currentIndex) {
        var len = pageData.images.length
        if (len > 0 && currentIndex < (len - 1)) {
            return currentIndex + 1;
        }
        return -1;
    }

    // Gets previous slide index or -1 if none
    var getPreviousIndex = function (currentIndex) {
        if (pageData.images.length > 0 && currentIndex > 0) {
            return currentIndex - 1;
        }
        return -1;
    }

    // Get the index of the first slide or -1
    var getStartIndex = function (currentIndex) {
        if (pageData.images.length > 0 && currentIndex > 0) {
            return 0;
        }
        return -1;
    }

    // Get the index of the last slide or -1
    var getEndIndex = function (currentIndex) {
        if (pageData.images.length > 0 && currentIndex < (pageData.images.length - 1)) {
            return pageData.images.length - 1;
        }
        return -1;
    }

    // Go to the slide number in text input or show an error if not possible.
    var goToSlide = function () {
        var value = document.getElementById('gotoslide').value;
        var input = parseInt(value);
        if (isNaN(input)) {
            alert("'" + value + "' is not a number");
        } else if (input < 1 || input > pageData.images.length) {
            alert("'" + value + "' is outside of the slideshow range");
        } else {
            document.location.hash = '#' + contentLoader.url(pageData.type, pageData.id, input - 1);
        }
    }

    // Get HTML for a single link
    var generateLink = function (index, cls, text) {
        if (index > -1) {
            return '<a class="' + cls + '" href="#' + contentLoader.url(pageData.type, pageData.id, index) + '">' + text + '</a>';
        }
        return '';
    }

    // Get HTML for the go to slide input
    var generateGoToSlide = function (currentIndex) {
        var output = '';
        if (pageData.images.length > 0) {
            output += '<div class="gotoslide">';
            output += '<label for="gotoslide">Go to slide:</label>';
            output += '<input type="text" id="gotoslide" onchange="slideshowManager.goToSlide()" value="' + (currentIndex + 1) + '">';
            output += '</div>';
        }
        return output;
    }

    // Get HTML for the slide controls
    var generateControlsHtml = function (currentIndex) {
        var output = '<div class="controls">';
        output += generateLink(getStartIndex(currentIndex), 'start', 'Start');
        output += generateLink(getPreviousIndex(currentIndex), 'previous', 'Previous');
        output += generateGoToSlide(currentIndex);
        output += generateLink(getNextIndex(currentIndex), 'next', 'Next');
        output += generateLink(getEndIndex(currentIndex), 'end', 'End');
        output += '</div>';
        return output;
    }

    // Get HTML for the page.
    var generateHtml = function () {
        var currentIndex = contentLoader.getData();
        var slide = pageData.images[currentIndex];
        if (slide === undefined) {
            return '<p>Slide not found :(</p>';
        } else {
            var output = '<div class="slideshow">' +
                '<h3>' + pageData.title + '</h3>' +
                '<h4>' + slide.title + '</h4>' +
                '<img src="' + slide.src + '" alt="' + slide.title + '" height="350px">';
            output += generateControlsHtml(currentIndex);
            return output + '</div>';
        }
    }

    var display = function (data) {
        pageData = data;
        var html = generateHtml();
        content.render(html);
    }

    return {
        display: display,
        goToSlide: goToSlide
    }
})();
