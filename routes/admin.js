var router = require('express').Router();
var Category = require('../models/category');

router.get('/add-category',function(req,res,next){
  res.render('admin/add-category',{message:req.flash('success')});
});

router.get('/create-job-offer',function(req,res,next){
  res.render('admin/create-job-offer',{message:req.flash('success')});
});

router.get('/for-employers',function(req,res,next){
  res.render('admin/for-employers',{message:req.flash('success')});
});

router.post('/add-category', function(req, res, next) {
  var category = new Category();
  category.field = req.body.field;
  category.type=req.body.type;

  category.save(function(err) {
    if (err) return next(err);
    req.flash('success', 'Successfully added a category');
    return res.redirect('/add-category');
  });

  });



module.exports=router;