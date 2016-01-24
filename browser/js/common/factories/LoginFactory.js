app.factory('LoginFactory', function() {
    var ref = new Firebase("https://battle-codes.firebaseio.com/Game1");
    var user;

    return {

        login: function(username) {
            var userInfo = {}
            user = username;
            ref.child(username).set({
                name: username,
                currentProblem: 0
            })
        },
        getUser: function() {
            return user;
        }


    }
})
