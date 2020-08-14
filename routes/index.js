var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User.js');


function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	return res.redirect('/');
}

router.get('/', function(req, res, next) {
  res.render('login_form', { title: 'Log In', message: req.flash('message') });
});

router.get('/register', function(req, res, next) {
  res.render('register_form', { title: 'Register', message: req.flash('message') });
});

router.get('/home', function(req, res, next) {
  res.send('logged in!');
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
	if(!req.user) {
		res.redirect('/');
	}
  res.redirect('/home');
});







router.post('/register', function(req, res, next) {
	User.register(new User({
		username:req.body.username,
		email:req.body.email}),
		req.body.password,

		function(err, user) {
		if (err) {
			res.render('register_form',{title: 'Register',user:user});
		}
//automatically logs in any new user
		passport.authenticate('local')(req, res, function() {
			res.redirect('/home');
		});
	});
});







router.get('/protected', isLoggedIn, function(req, res, next){
	console.log(req.user.username);
	res.render('protected',{title:'profile page', name:req.user.username});
});

module.exports = router;
