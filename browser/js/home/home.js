app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl'
    });
});

app.controller('homeCtrl',function($scope,$firebaseObject){
	$scope.text = "Test";
	var editor;
	$scope.username = 'John';
	$scope.iframeSrc = '/api/test';
	var problems = ["Add","Not Add"]

    var ref = new Firebase("https://battle-codes.firebaseio.com/");

    ref.on('value',function(snapshot){
    	var data = snapshot.val();
    	$scope.$apply(function(){
    		if(data.Game1 && data.Game1[$scope.username]){
				
				document.getElementById('Iframe').src = "/api/test";
    			$scope.currentProblem = data.Game1[$scope.username].currentProblem
    			editor.setValue(data.Problems[problems[$scope.currentProblem]].startingText);
    			console.log(data.Problems[problems[$scope.currentProblem]])
    		}
    	})
    })
    $scope.game = $firebaseObject(ref);
  //   if($scope.game.Game1){
		// $scope.currentProblem = $scope.game.Game1[$scope.username].currentProblem;
  //   }




	$scope.click = function(){
		$scope.text = editor.getValue();
		document.getElementById('Iframe').src = "/api/test"
	}

	$scope.aceLoaded = function(_editor){
		editor =_editor;
		
		// _editor.setValue("TESTING")

		var _session = _editor.getSession();
		if(_editor){
			$scope.text=_editor.getValue()
		}
		_editor.on("change",function(){
			$scope.text = _editor.getValue()
		})
	};

	$scope.aceChanged = function(e){

	};

});