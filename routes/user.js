var router= require('express').Router();
var User= require('../models/user');
var passport=require('passport');
var passportConf=require('../config/passport');


router.get('/login',function(req,res){
	if(req.user) return res.redirect('/');
	res.render('accounts/login',{message:req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/profile',
	failureRedirect: '/login',
	failureFlash: true
}));


router.get('/profile',function(req,res,next){
	User.findOne({_id:req.user._id},function(err,user){
		if(err) return next(err);
		res.render('accounts/profile',{user:user});
	});

});

router.post('/signup',function(req,res,next){
	var user=new User();
	user.profile.name=req.body.name;
	user.password=req.body.password;
	user.email=req.body.email;
	User.findOne({email:req.body.email},function(err,existingUser){

		if(existingUser){
			req.flash('errors','Account with that email address already exists');

			return res.redirect('/signup');
		} else {
			user.save(function(err,user){
				if(err) return next (err);

				req.logIn(user,function(err){
					if(err) return next(err);
					res.redirect('/profile');
				});

			});
		}
	});

});
router.get('/signup', function(req, res, next) {
	res.render('accounts/signup',{
		errors: req.flash('errors')
	});

});

router.get('/logout',function(req,res,next){
	req.logout();
	res.redirect('/');
});


router.get('/editProfile',function(req,res,next){
	res.render('accounts/editProfile.ejs',{message: req.flash('success')});


});

//edit profile feature, might be modified according to user attributes and needs

router.post('/editProfile',function(req,res,next){
	User.findOne({_id:req.user._id},function(err,user){
		if (err) return next(err);
		if(req.body.name) user.profile.name=req.body.name;
		if(req.body.address) user.address=req.body.address;

		user.save(function(err){
			req.flash('success','successfully edited your profile');
			return res.redirect('/editProfile');
		});
	});
});

module.exports= router;