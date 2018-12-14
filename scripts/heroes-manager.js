// Module to encapsulate heroes master/detail list.
var heroesManager = (function () {
    var generateHtml = function (data, person) {
        var html = '';
        html += '<h2>' + data.title + '</h2>';
        html += '<p>Select a hero from the list to learn more about them</p>';
        html += '<div class="row">';
        html += '<div class="col" id="master">';
        html += '<ul>';
        data.persons.forEach(function (person, index) {
            var hash = urlHelper.generateHash(data.type, data.id, index);
            html += '<li><a href="#' + hash + '">' + person.title + '</a></li>';
        });
        html += '</ul>';
        html += '</div>';
        html += '<div class="col" id="detail">';
        html += '<h3>' + person.title + '</h3>';
        html += '<ul>';
        html += '<li>Date: ' + person.publDate + '</li>';
        html += '<li>Descript: ' + person.descript + '</li>';
        html += '<li>History: ' + person.history + '</li>';
        html += '<li>Subject: ' + person.subject + '</li>';
        html += '<li>Source: ' + person.source + '</li>';         
        html += '</ul>';
        html += '</div>';
        html += '</div>';
        return html;
    };

    var display = function (data) {
        var index = urlHelper.index();
        var person = data.persons[index];
        var html = generateHtml(data, person);
        content.render(html);
    };

    return {
        display: display
    };
})();