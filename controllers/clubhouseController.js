var Message = require('../models/message');
var User = require('../models/user');
var {body,validationResult} = require("express-validator");
var async = require('async');
var bcrypt = require('bcryptjs');
var passport = require('passport');

var index_get = function(req,res,next){
    Message.find()
           .sort({createdAt: -1})
           .populate('user')
           .exec((err, messages) => {
               if(err){return next(err);}
               res.render('index', {title: 'Clubhouse', messages: messages, user: res.locals.currentUser})
           });
}

var sign_up_get = function(req,res,next){
    res.render("signup_form", {title: 'Sign Up', user:res.locals.currentUser})
}

var sign_up_post = [
    body('firstname', 'First Name required').trim().isLength({min: 1}).escape(),
    body('lastname', 'Last Name is required').trim().isLength({min: 1}).escape(),
    body('email', 'Email is required').trim().isLength({min:1}).escape(),
    body('password', 'Password is required').trim().isLength({min: 8}).escape(),
    body('password2', 'Password is required').trim().isLength({min: 8}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render("signup_form", {title: "Sign up", errors: errors.array()})
        } else if(req.body.password != req.body.password2){
            res.render("signup_form", {title: "Sign up", errors: ['passwords not matching']})
        } else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if(err){
                    return next(err);
                }
                const user = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hashedPassword
                });
                
                User.findOne({'email': req.body.email})
                    .exec(function(err, found_user){
                        if(err) {return next(err);}
                        if(found_user){
                            res.render('signup_form', {title: 'Sign up', errors: ['User with same email found']})
                        } else {
                            user.save(
                                function(err) {
                                    if(err) {return next(err);}
                                    res.redirect('/log-in');
                                })
                        }
                    })

            })
        }


    }

]

var log_in_get = function(req,res,next){
    res.render("login_form", {title: 'Clubhouse Login', user: res.locals.currentUser})
}

var log_in_post = function(req,res,next){
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in"
    })(req, res, next);
}

var log_out_get = function(req,res,next){
    req.logout();
    res.redirect("/");
}

var create_message_get = function(req,res,next){
    res.render('create_message', {title: 'Create Message', user: res.locals.currentUser});
}

var create_message_post = [
    body('title', 'Title required').trim().isLength({min: 1}).escape(),
    body('body', 'Body required').trim().isLength({min: 1}).escape(),
    (req,res,next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){

        } else {
            var message = new Message({
                title: req.body.title,
                body: req.body.body,
                user: res.locals.currentUser._id
            });

            message.save(err => {
                if(err){return next(err);}
                res.redirect('/');
            })
        }
    }
]

var delete_message_post = function(req,res,next){
    Message.findByIdAndDelete(req.body.messageid, function deleteMessage(err){
        if(err) {return next(err);}
        res.redirect('/');
    });
}

var join_club_get = function(req,res,next){
    res.render("join_club", {title: 'Join Clubhouse', user: res.locals.currentUser})
}

var join_club_post = function(req,res,next){
    if(req.body.passcode == process.env.CLUB_PASSCODE){

        User.findByIdAndUpdate(res.locals.currentUser._id, {ismember: true}, {}, function(err){
            if(err){return next(err);}
            res.redirect('/');
        })
    } else {
        res.render('join_club', {title: "Join Club", message: 'Wrong Passcode', user: res.locals.currentUser });
    }
}

var leave_club_get = function(req,res,next){
    User.findByIdAndUpdate(res.locals.currentUser._id, {ismember: false}, {}, err => {
        if(err){return next(err);}
        res.redirect('/');
    })
}

var become_admin_get = function(req,res,next){
    res.render("become_admin", {title: 'Become Admin', user: res.locals.currentUser});
}

var become_admin_post = function(req,res,next){
    if(req.body.password == process.env.ADMIN_PASSWORD){
        User.findByIdAndUpdate(res.locals.currentUser._id, {admin: true}, {}, function(err){
            if(err){return next(err);}
            res.redirect('/');
        })
    } else {
        res.render('become_admin', {title: "Become Admin", message: 'Wrong Password', user: res.locals.currentUser });
    }
}

var remove_admin_get = function(req,res,next){
    User.findByIdAndUpdate(res.locals.currentUser._id, {admin: false}, {}, err => {
        if(err){return next(err);}
        res.redirect('/');
    })
}




module.exports = {
    index_get,
    sign_up_get,
    sign_up_post,
    log_in_get,
    log_in_post,
    log_out_get,
    create_message_get,
    create_message_post,
    delete_message_post,
    join_club_get,
    join_club_post,
    leave_club_get,
    become_admin_get,
    become_admin_post,
    remove_admin_get,
    
}