app.config(function ($stateProvider) {
    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutCtrl',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutCtrl', function ($scope,LoginFactory,$firebaseObject) {
            
	var ref = new Firebase("https://battle-codes.firebaseio.com/Game1");
	var user = $firebaseObject(ref);
	$scope.login = LoginFactory.login;

});