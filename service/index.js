const makeUser = require('./makeUser');
const User = require('../models/voter');



const userService = makeUser({
  User,
  
});

module.exports = {
  user: userService,
};
