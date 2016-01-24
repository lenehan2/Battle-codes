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

app.controller('homeCtrl', function($scope, $firebaseObject, $state, username) {
    $scope.text = "Test";
    var editor;
    $scope.username = username;
    $scope.iframeSrc = '/api/test/' + username;
    var problems = ["Add", "Not Add", "Add", "Not Add", "Add", "Not Add", "Add"]
    $scope.game;
    var ref = new Firebase("https://battle-codes.firebaseio.com/");
    var handicapRef = new Firebase("https://battle-codes.firebaseio.com/Game1/" + username + "/handicaps");

    ref.on('value', function(snapshot) {
        var data = snapshot.val();
        $scope.opponent;

        var players = Object.keys(data.Game1);

        var opponentName = players.find(function(user) {
            console.log("user: ", user)
            console.log("username: ", $scope.username)
            return user !== $scope.username;
        })

        $scope.opponent = data.Game1[opponentName];
        console.log("OPP NAME: ", $scope.opponent);
        $scope.game = data.Game1;
        $scope.$apply(function() {
            if (data.Game1 && data.Game1[$scope.username]) {
                if (data.Game1[$scope.username].currentProblem > 2) {
                    console.log("USERNAME: ", $scope.username)
                    ref.child('Game1/Winner').set($scope.username)
                    $state.go('about')
                } else if (data.Game1.Winner) {
                    $state.go('about')
                    $scope.gameOver = true;
                } else {
                    document.getElementById('Iframe').src = "/api/test/" + $scope.username;
                    $scope.currentProblem = data.Game1[$scope.username].currentProblem;
                    $scope.problem = data.Problems[$scope.currentProblem]
                    editor.setValue(data.Problems[$scope.currentProblem].startingText);
                    console.log(data.Problems[$scope.currentProblem])
                }
            }

        })
    })

    handicapRef.on('value', function(snapshot) {
        var data = snapshot.val();

        if (data.hide) {
            $scope.hide = true;
        }
        if (data.textEditorMode) {
            editor.getSession().setMode("ace/mode/xml")
            setTimeout(function() {
                editor.getSession().setMode("ace/mode/javascript")
            }, 10000)
        }
        if (data.messyText) {
            // editor.getSession().find('function');
            // editor.getSession().replaceAll("Test") //¯\_(ツ)_/¯
        }
    })

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

    $scope.messyText = function(){
    	ref.child('Game1/' + $scope.opponent.name + '/handicaps').set({
            messyText: true
        })	
    }
    $scope.click = function() {
        $scope.text = editor.getValue();
        document.getElementById('Iframe').src = "/api/test/" + $scope.username
    }

    $scope.aceLoaded = function(_editor) {
        editor = _editor;

        // _editor.setValue("TESTING")

        var _session = _editor.getSession();
        if (_editor) {
            $scope.text = _editor.getValue()
        }
        _editor.on("change", function() {
            $scope.text = _editor.getValue()
        })
    };

    $scope.aceChanged = function(e) {

    };

});
