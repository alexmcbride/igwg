//a menu manager module that allows the user to navigate around your spa

var heroesManager = (function () {
    var generateHtml = function (data) {
        var html = '<h2>' + data.title + '<h2>';
        html += '<ul>';
        data.heroes.forEach(hero => {
            html += '<li>';
            html += hero.title;
            html += '</li>';
        });
        html += '</ul>';
        return html;
    }

    var display = function (data) {
        var html = generateHtml(data);
        contentLoader.render(html);
    }

    return {
        display: display
    };
})();
