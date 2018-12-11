// Draws the main menu.
var menu = (function () {
    var pageMap = [];

    // Clears any previous menu options added.
    var clear = function() {
        pageMap = [];
    };

    // Adds page to menu.
    var addPage = function (pageName, linkText) {
        pageMap[pageName] = linkText;
    };

    // Generates HTML for the pages.
    var generateHtml = function () {
        var html = '<div class="list-group">';
        for (var pageName in pageMap) {
            if (pageMap.hasOwnProperty(pageName)) {
                html += '<a class="list-group-item" href="#' + pageName + '">' + pageMap[pageName] + '</a>';
            }
        }
        return html + '</div>';
    };

    // Displays menu on HTML element specified.
    var initialize = function (menuElementId) {
        document.getElementById(menuElementId).innerHTML = generateHtml();
    };

    return {
        clear: clear,
        initialize: initialize,
        addPage: addPage
    };
})();
