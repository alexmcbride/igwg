var AdminManager = (function () {
    var currentState = null;
    var loggedIn = false;
    var users = []
    users['Alex'] = { id: 'Alex', username: 'Alex', password: 'password1' };

    var loginState = function (error) {
        var html = '<h2>Login</h2>';
        html += '<form>';

        if (error !== undefined) {
            html += '<div class="error">';
            html += error;
            html += '</div>';
        }

        html += '<div class="form-control">';
        html += '<label for="username">Username</label><br>';
        html += '<input type="text" id="username">';
        html += '</div>';
        html += '<div class="form-control">';
        html += '<label for="password">Password</label><br>';
        html += '<input type="password" id="password">';
        html += '</div>';
        html += '<input type="button" value="Login" onclick="AdminManager.login()">';
        html += '</form>';
        return html;
    }

    var login = function () {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var user = users[username];
        if (user === undefined) {
            update("User not found");
        } else {
            if (password === user.password) {
                loggedIn = true;
            } else {
                update("Password not correct");
            }
        }
    }

    var update = function (error) {
        var html = currentState(error);
        ContentLoader.render(html);
    }

    var display = function () {
        if (currentState == null) {
            currentState = loginState;
        }

        update();
    }

    var isLoggedIn = function () {
        return loggedIn;
    }

    return {
        display: display,
        login: login,
        isLoggedIn: isLoggedIn
    };
})();
