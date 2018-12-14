// Module to encapsulate heroes master/detail list.
var heroesManager = (function () {
    var generateHtml = function (data, hero) {
        var html = '';
        html += '<h2>' + data.title + '</h2>';
        html += '<p>Select a hero from the list to learn more about them</p>';
        html += '<div class="row">';
        html += '<div class="col-5" id="master">';
        html += '<ul>';
        data.heroes.forEach(function (hero, index) {
            var hash = urlHelper.generateHash(data.type, data.id, index);
            html += '<li><a href="#' + hash + '">' + hero.title + '</a></li>';
        });
        html += '</ul>';
        html += '</div>';
        html += '<div class="col" id="detail">';
        html += '<h3>' + hero.title + '</h3>';
        html += '<ul>';
        html += '<li>Date: ' + hero.publDate + '</li>';
        html += '<li>Descript: ' + hero.descript + '</li>';
        html += '<li>History: ' + hero.history + '</li>';
        html += '<li>Subject: ' + hero.subject + '</li>';
        html += '<li>Source: ' + hero.source + '</li>';         
        html += '</ul>';
        html += '</div>';
        html += '</div>';
        return html;
    };

    var display = function (data) {
        var index = urlHelper.index();
        var hero = data.heroes[index];
        var html = generateHtml(data, hero);
        content.render(html);
    };

    return {
        display: display
    };
})();