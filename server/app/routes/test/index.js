var router = require('express').Router();
var app = require('express')();
var path = require('path');
var iframePath = path.join(__dirname,'../../views/iframe.html');

var Firebase = require('firebase')
var myFirebaseRef = new Firebase('https://battle-codes.firebaseio.com/');

//:user/:questionId
router.get('/:username',function(req,res,next){
	var username = req.params.username;
	var testNames = ['Add','Not Add','Add','Not Add','Add','Not Add',"Add"]
	var currentTest = myFirebaseRef.once("value",function(snapshot){
		var user = snapshot.val().Game1[username].name.toString();
		var currentProblem = snapshot.val().Game1[username].currentProblem;
		var tests = snapshot.val().Problems[currentProblem].tests;
		console.log("TESTS:",tests)
		console.log(currentProblem)
		res.render('iframe.html', {Tests: tests, user: "var user = "+"'"+user+"'",currentProblem: currentProblem})
	})
})

module.exports = router