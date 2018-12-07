// Draws the main menu.
var menu = (function () {
    var pageMap = [];

    // Clears any previous menu options added.
    var clear = function() {
        pageMap = [];
    }

    // Adds page to menu.
    var addPage = function (pageName, linkText) {
        pageMap[pageName] = linkText;
    }

    // Generates HTML for the pages.
    var generateHtml = function () {
        var html = '<ul>';
        for (var pageName in pageMap) {
            if (pageMap.hasOwnProperty(pageName)) {
                html += '<li><a href="#' + pageName + '">' + pageMap[pageName] + '</a></li>';
            }
        }
        return html + '</ul>';
    }

    // Displays menu on HTML element specified.
    var initialize = function (menuElementId) {
        var html = generateHtml();
        document.getElementById(menuElementId).innerHTML = html;
        menuElement = menuElementId;
    }

    return {
        clear: clear,
        initialize: initialize,
        addPage: addPage
    };
})();
