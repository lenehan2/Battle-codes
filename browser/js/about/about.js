app.config(function ($stateProvider) {
    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutCtrl',
        templateUrl: 'js/about/about.html'
    });

});

app.config(function ($stateProvider){
	$stateProvider.state('loading',{
		url: '/loading',
		controller: 'AboutCtrl',
		templateUrl: 'js/about/loading.html'
	})
})

app.controller('AboutCtrl', function ($scope,LoginFactory,$firebaseObject,$state) {
            
	var ref = new Firebase("https://battle-codes.firebaseio.com/Game1");
	var user = $firebaseObject(ref);
	$scope.login = function(username){
		LoginFactory.login(username)
		$state.go('loading')
	}
	ref.on('value',function(snapshot){
		var data=snapshot.val()
		console.log('data: ',data)
		if(Object.keys(data).length>1){
			$state.go('home')
		}
	})	
});