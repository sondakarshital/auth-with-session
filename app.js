const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session")
const mongoDbStore = require("connect-mongodb-session")(session);
const User = require("./model/user");
const bcryptjs = require("bcryptjs");
const auth = require("./middleware/is-auth")

require("./db/mongoose");

const store = new mongoDbStore({
    uri: "mongodb://localhost/node_test",
    collection: "userSession"
})


app.use(bodyParser.json());
app.use(session({
    secret: "my secret", resave: false, saveUninitialized: false,
    store: store
}));

app.post("/login", (req, res) => {
const email = req.body.email;
const password = req.body.password;
User.findOne({email : email})
.then((user)=>{
    bcryptjs.compare(password,user.password)
    .then((matched)=>{
        if(matched){
            req.session.user = user;
            req.session.isLoggedIn = true;
            res.send({mesaage:"logged in"})
        }else{
            res.send({message : "error in logging"})
        }

    })
}).catch((e)=>{
    console.log("error in logging",e);
    res.send({message : "error in logging"})
})



})
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.send({ message: "Logged out" });
    })
});

app.post("/sinup", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    bcryptjs.hash(password, 12).then((hashPassword) => {

        const user = new User({
            email,
            password :hashPassword
        });
        user.save().then((user) => {
            console.log("user saved", user);
            res.send(user);
        })
        .catch(err => console.log("error in saving user", err))
    })
});

app.get("/home",auth,(req,res)=>{
    res.send({message:"routed to home"})
})
app.listen(8080, () => {
    console.log("app is listening on 8080")
});
