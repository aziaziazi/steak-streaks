#! /usr/bin/env node

console.log('This script populates some test users to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var User = require('./models/user')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function userCreate(name, steaks, cb) {
  var user = new User({name, steaks});

  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    cb(null, user)
  }  );
}

const users = [
  {name: 'cam', steak_dates: [
    new Date(),
    ]},
  {name:'kim', steak_dates: [
    new Date(),
    ]}
]

function createUsers(cb) {
  async.series(
    users.map(user => callback => userCreate(user.name, user.steak_dates, callback)),
    cb
  );
}

async.series([
    createUsers,
  ],
  () => mongoose.connection.close()
);


