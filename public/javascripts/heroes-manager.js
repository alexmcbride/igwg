//a menu manager module that allows the user to navigate around your spa

var herosManager = (function () {
    var generateHtml = function (data) {
        return '<h2>' + data.title + '<h2>';
        // pagination of heroes
    }

    var display = function (data) {
        var html = generateHtml(data);
        contentLoader.render(html);
    }

    return {
        display: display
    };
})();
