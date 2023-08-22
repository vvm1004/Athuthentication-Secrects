require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
console.log(process.env.API_KEY)
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(
    express.urlencoded({
        extended: true,
    }),
); 
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render('home')
})
app.get("/login", (req, res) => {
    res.render('login')
})
app.get("/register", (req, res) => {
    res.render('register')
})

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    })

    newUser.save()
        .then(() => {
            res.render('secrets')
        })
        .catch(err =>{
            console.log(err);
        }) 
})

app.post("/login", (req, res) => {
   const username = req.body.username;
   const password = req.body.password;

    User.findOne({ email: username})
        .then((foundUser) => {
            if(foundUser.password === password){
                res.render('secrets')
            }
        })  
        .catch((err) => {
            console.log(err);
        });
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});