app.config(function ($stateProvider){
	$stateProvider.state('winner',{
		url: '/YouWin',
		templateUrl: 'js/gameover/win.html'
	})
})

app.config(function ($stateProvider){
	$stateProvider.state('loser',{
		url: '/YouLose',
		templateUrl: 'js/gameover/loss.html'
	})
})