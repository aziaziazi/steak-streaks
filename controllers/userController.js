const {body, validationResult} = require("express-validator");
var User = require('../models/user');

exports.index = function(req, res, next) {
  console.log("index")
  User
    .find()
    .sort([['name', 'ascending']])
    .exec((err, usersList) => {
      console.log('usersList =>', usersList)
      return err
        ? next(err)
        : res.render('users_list', {usersList})
    })
}

exports.user_create_get = function(req, res, next) {
  res.render('user_form');
}

exports.user_create_post = [
  body('name', 'name required')
    .trim()
    .isLength({min: 1, max: 100})
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render('user_form', {errors: errors.array()});
      return;
    } else {

      const newUser = new User({name: req.body.name})
      newUser.save(err => {
        if (err) return next(err);
        res.redirect(newUser.url)
      })
    }
  }
]

exports.user_delete_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: user_delete_post');
}

exports.user_eatNow_post = function(req, res, next) {
  const userID = req.params.id;
  const now = new Date()

  User
    .updateOne(
      { _id: userID },
      { $push: { steak_dates: {date: now} } })
    .exec((err) => {
    if (err) {return next(err)}

    res.redirect('/users/' + userID)
  })
}

exports.user_puke_post = function(req, res, next) {
  const userID = req.params.id;
  const pukeId = req.params.pukeId;

  User
    .updateOne(
      { _id: userID },
      { $pull: { steak_dates: {_id: pukeId} } })
    .exec((err) => {
      if (err) {return next(err)}

      res.redirect('/users/' + userID)
    })
}

exports.user_detail_get = function(req, res, next) {
  const userID = req.params.id;

  User
    .findById(userID)
    .exec((err, user) => {
      if (err) {return next(err)}
      if (user==null) {
        var err = new Error('User not found')
        err.status = 404;
        return next(err)
      }

      res.render('user_detail', {user})
    })
}
