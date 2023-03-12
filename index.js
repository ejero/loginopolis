const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt'); 

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
app.post('/register', async (req, res) => {
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
const {username, password} = req.body;
try{
    const hashedpw = await bcrypt.hash(password, 10);
    const createdUser = await User.create({username, password: hashedpw});
    const userCreatedMessage = `successfully created user ${createdUser.username}`
    res.status(200).send(userCreatedMessage);
  } catch(err){
    console.log(err);
    res.status(500).json({ message: 'incorrect username or password' });
  }
})

// POST /login
app.post("/login", async(req, res, Next) => {
  // TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
  try{
    const { username, password } = req.body;
    const foundUser = await User.findOne({where: {username}});
    if(!foundUser){
      res.status(400).send("incorrect username or password");
      return;
    }
    const loginMessage = `successfully logged in user ${foundUser.username}`
    const isMatch = await bcrypt.compare(password, foundUser.password);

    if(isMatch){
      res.status(200).send(loginMessage);
    }
    if(!isMatch){
      const notMatched = `incorrect username or password`
      res.status(401).send(notMatched);
    }
    
  } catch(err){
    const msg = `incorrect username or password`
    res.status(401).send(msg);
  }
})

// we export the app, not listening in here, so that we can run tests
module.exports = app;
