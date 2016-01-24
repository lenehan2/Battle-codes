var router = require('express').Router();
var app = require('express')();
var path = require('path');
var iframePath = path.join(__dirname,'../../views/iframe.html');

var Firebase = require('firebase')
var myFirebaseRef = new Firebase('https://battle-codes.firebaseio.com/');

//:user/:questionId
router.get('/',function(req,res,next){
	var testNames = ['Add','Not Add']
	var currentTest = myFirebaseRef.once("value",function(snapshot){
		var user = snapshot.val().Game1.John.name.toString();
		var currentProblem = snapshot.val().Game1.John.currentProblem;
		var tests = snapshot.val().Problems[testNames[currentProblem]].tests;
		console.log("TESTS:",tests)
		console.log(currentProblem)
		res.render('iframe.html', {Tests: tests, user: "var user = "+"'"+user+"'",currentProblem: currentProblem})
	})
})

module.exports = router