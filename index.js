const express = require('express') // This is our router and server. This is primary.
const app = express();
const port = 3000

const ejs = require('ejs'); // For rendering .ejs pages  [ https://ejs.co/ ]
const mongoose = require('mongoose'); // For use mongodb  [ https://mongoosejs.com/ ]
const bodyParser = require('body-parser'); // For controlling POST datas
const cookieParser = require('cookie-parser'); // For controlling cookies
require('dotenv').config() // For use '.env' file
const User = require('./models/user_model'); // User Model
const crypto = require('crypto'); // For encrypting
const jwt = require('jsonwebtoken'); // For encoding JWT
const jwt_decode = require('jwt-decode'); // For decoding JWT




// process.env.DB_URL  =  This is mongodb atlas's url from .env file.
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true}); // Connecting to mongodb atlas.

//app.use(express.static('public')) // This is our static folder. Everyfile can be receivable in this folder. 
app.set('views', __dirname + '/views') // Defining page's folder
app.set('view engine', 'ejs') // Setting view engine (renderer)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('api_secret_key', process.env.API_SEC_KEY); // Setting API SECRET KEY



app.get('/', (req, res) => {
    if(req.cookies.access_token){  // If cookie has a token

        const decodedUser = jwt_decode(req.cookies.access_token);
        /* User.findOne({ 'email': decodedUser.email, 'passwd': decodedUser.passwd }).then(function (doc){ // Searching user
            if(!doc){
                res.send("Error while trying find any user. !");
            } else {
                res.render('index', { 'userdata': doc })
            }
        })*/ // This is for just finding one user! If you wanna list everydata, it is that =
        User.find({}).then(function (doc){ // Searching user
            if(!doc){
                res.send("Null Database");
            } else {
                res.render('list_everybody_index', { 'userdata': doc }) //render list_everybody_index.ejs with user datas
            }
        })

    } else {
        res.redirect('/login'); // redirect to login
    }
})

app.post('/api/register', (req, res) => {
    if(req.cookies.access_token){
        res.redirect('/');
    } else {
        const xmail = req.body.email; // Getting email from login page
        const encryptedPasswd = crypto.createHash('md5').update(req.body.password).digest("hex"); // Getting password and ecrypting with MD5

        User.findOne({'correo': xmail, 'contraseña': encryptedPasswd }).then(function (doc){ // Searching user
            if(!doc){ // If user dont exist, create new user
               
                const userData = new User({
                    nombre: req.body.nombre,
                    
                    email: req.body.email,
                    passwd: encryptedPasswd
                  }); // Create user scheme with datas
          
                  userData.save(function(err, doc) {
                    if (err) return res.send("Error Desconocido!");
                    const payloadx = {
                        name: req.body.name,
                        email: req.body.email,
                        passwd: encryptedPasswd
                    }; // Create a json for saving on JWT in cookie.
                    const accessToken = jwt.sign(payloadx, process.env.API_SEC_KEY, { expiresIn: '720d' }); // Created JSON WEB TOKEN 
                    res.cookie('access_token', accessToken, { maxAge: 900000, httpOnly: true }) // Creating cookie
                    res.redirect('/');
                  });


            } else {
               res.send('This user already registered. Please login.')
            }
        })
    }
})

app.post('/api/login', (req, res) => {
    if(req.cookies.access_token){ // If cookie has a token
        res.redirect('/'); // redirect to homepage
    } else {
        const xmail = req.body.email; // Getting email from login page
        const encryptedPasswd = crypto.createHash('md5').update(req.body.password).digest("hex"); // Getting password and ecrypting with MD5

        User.findOne({ 'email': xmail, 'passwd': encryptedPasswd }).then(function (doc){ // Searching user
            if(!doc){ // If user dont exist
                res.send("This user cannot find. Please enter correct info or try regiser. </br> <a href='javascript:history.back()'>Go Back</a>");
            } else {
                const payload = {
                    'pmail': xmail,
                    'enpasswd': encryptedPasswd
                } // create a json for JWT for saving on cookie
                const accessToken = jwt.sign(payload, process.env.API_SEC_KEY, { expiresIn: '720d' }); // Created JSON WEB TOKEN 
                res.cookie('access_token', accessToken, { maxAge: 900000, httpOnly: true }) // create cookie
                res.redirect('/'); // redirect to homepage
            }
        })
    }
})


app.get('/register', (req, res) => {
    if(req.cookies.access_token){ // If cookie has a token
        res.redirect('/'); // redirect to homepage
    } else { 
        res.render('register') // render register page
    }
})

app.get('/login', (req, res) => {
    if(req.cookies.access_token){ // If cookie has a token
        res.redirect('/'); // redirect to homepage
    } else {
        res.render('login') // render login page
    }
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
