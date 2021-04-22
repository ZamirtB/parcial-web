const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: 'string',
    apellido: 'string',
    documento: 'string',
    usuario: 'string',
    email: 'string',
    passwd: 'string'
});
const User = mongoose.model('User', userSchema, "users");


module.exports = User;