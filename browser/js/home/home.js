app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl',
        resolve: {
            username: function(LoginFactory) {
                return LoginFactory.getUser()
            }
        }
    });
});

/*
Left to do:

    -Add problems

*/

app.controller('homeCtrl', function($scope, $firebaseObject, $state, username) {
    var editor;
    $scope.username = username;
    $scope.iframeSrc = '/api/test/' + username;
    var problems = ["Add", "Not Add", "Add", "Not Add", "Add", "Not Add", "Add"]
    $scope.game;
    $scope.powerUps = ["rave", "messyText", "spacedOut", "textEditorMode", "hide"]
    $scope.powerUpsLeft = ["rave", "messyText", "spacedOut", "textEditorMode", "hide"]

    $scope.currentProblem = 0;
    var ref = new Firebase("https://battle-codes.firebaseio.com/");
    var handicapRef = new Firebase("https://battle-codes.firebaseio.com/Game1/" + username + "/handicaps");
    $scope.yourPowerUps = [];
    
    ref.on('value', function(snapshot) {
        var data = snapshot.val();
        $scope.opponent;
        var players = Object.keys(data.Game1);

        var opponentName = players.find(function(user) {
            return user !== $scope.username;
        })
        var newCurrentProblem = data.Game1[$scope.username].currentProblem;
        if (newCurrentProblem % 2 === 0 && newCurrentProblem > $scope.currentProblem) {
            var randIdx = Math.floor(Math.random() * $scope.powerUpsLeft.length)
            $scope.yourPowerUps.push($scope.powerUpsLeft[randIdx])
            $scope.powerUpsLeft.splice(randIdx, 1)
        }

        $scope.opponent = data.Game1[opponentName];
        $scope.game = data.Game1;
        if (data.Game1 && data.Game1[$scope.username]) {
            if (data.Game1[$scope.username].currentProblem > 9) {
                ref.child('Game1/Winner').set($scope.username)
                $state.go('winner')
            } else if (data.Game1.Winner) {
                $state.go('loser')
                $scope.gameOver = true;
            } else {
                console.log("BOOL:", !editor.getValue())
                document.getElementById('Iframe').src = "/api/test/" + $scope.username;
                if ($scope.currentProblem !== data.Game1[$scope.username].currentProblem || !editor.getValue()) {
                    $scope.currentProblem = data.Game1[$scope.username].currentProblem;
                    editor.setValue(data.Problems[$scope.currentProblem].startingText);
                    $scope.problem = data.Problems[$scope.currentProblem]
                    $scope.currentProblem = data.Game1[$scope.username].currentProblem;
                }
            }
        }

    })

    handicapRef.on('value', function(snapshot) {
        var data = snapshot.val();
        var tempText = editor.getValue();
        if (data.hide) {
            $scope.hide = true;
            $scope.error = "Your opponent has hidden your screen for 40 seconds! Go digging in your console to get it back!"
            setTimeout(function() {
                $scope.hide = false;
                $scope.error = ""
                console.log("times up")
            }, 4000)
        }
        if (data.textEditorMode) {
            editor.getSession().setMode("ace/mode/xml")
            editor.setValue(tempText)
            $scope.error = "Your opponent has taken away your error alert privileges for 30 seconds!"
            setTimeout(function() {
                editor.getSession().setMode("ace/mode/javascript")
            }, 30000)

        }
        if (data.messyText) {
            $scope.error = "Your opponent has replaced all of your open parens with shrugging guy! Oh noes!"
            editor.find('(');
            editor.replaceAll("¯\\_(ツ)_/¯")
            setTimeout(function() {
                $scope.error = null
            }, 8000)
        }
        if (data.spacedOut) {
            $scope.error = "Your opponent has taken away all of your spaces! What a jerk!"
            editor.find(' ');
            editor.replaceAll('');
            editor.find('\n');
            editor.replaceAll('');
            setTimeout(function() {
                $scope.error = null
            }, 8000)
        }
        if (data.rave) {
            $scope.error = "Your opponent has forced you to code during a Rave for 30 seconds."
            var themes = ["twilight", 'ambiance', 'clouds', 'cobalt', 'eclipse', 'iplastic', 'monokai', 'solarized_dark', 'solarized_light'];

            var interval = setInterval(function() {
                var randIdx = Math.floor(Math.random() * themes.length)
                editor.setTheme("ace/theme/" + themes[randIdx]);
            }, 1000)

            setTimeout(function() {
                clearInterval(interval);
                editor.setTheme("ace/theme/twilight");
                $scope.error = null
            }, 30000)

        }
    })

    var myRefForDemo = new Firebase("https://battle-codes.firebaseio.com/Game1/" + $scope.username + "/");


    $scope.nextQuestion = function() {
        myRefForDemo.update({
            "currentProblem": $scope.currentProblem + 1
        })
    }

    $scope.hideOpponent = function() {
        ref.child('Game1/' + $scope.opponent.name + '/handicaps').set({
            hide: true
        })
    }

    $scope.textEditorMode = function() {
        ref.child('Game1/' + $scope.opponent.name + '/handicaps').set({
            textEditorMode: true
        })
    }

    $scope.messyText = function() {
        ref.child('Game1/' + $scope.opponent.name + '/handicaps').set({
            messyText: true
        })
    }
    $scope.click = function() {
        $scope.text = editor.getValue();
        document.getElementById('Iframe').src = "/api/test/" + $scope.username
    }

    $scope.spacedOut = function() {
        ref.child('Game1/' + $scope.opponent.name + '/handicaps').set({
            spacedOut: true
        })
    }

    $scope.rave = function() {
        ref.child('Game1/' + $scope.opponent.name + '/handicaps').set({
            rave: true
        })
    }

    $scope.usePowerUp = function(powerUp) {
        var idx = $scope.yourPowerUps.indexOf(powerUp);
        $scope.yourPowerUps.splice(idx, 1);
        var power = {};
        power[powerUp] = true;
        ref.child('Game1/' + $scope.opponent.name + '/handicaps').set(power)
    }

    $scope.aceLoaded = function(_editor) {
        editor = _editor;

        // _editor.setValue("TESTING")

        var _session = _editor.getSession();
        if (_editor) {
            $scope.text = _editor.getValue()
        }

        _editor.setFontSize(20)

        _editor.on("change", function() {
            $scope.text = _editor.getValue()
        })
    };


});
