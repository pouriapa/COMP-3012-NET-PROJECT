import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github";
import userController from '../controllers/userController'



//---------------Github Strategy------------
const githubLogin = new GitHubStrategy(
  {
    clientID: `${process.env.clientId}`,
    clientSecret: `${process.env.clientSecret}`,
    callbackURL: "http://localhost:8000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {  
  let user = await userController.findOrCreate(profile);
  
  return done(null, user);
})


//----------------Local strategy--------------------
const localLogin = new LocalStrategy( 
  {
    usernameField: "email", // does this have to be the same as the name field in login.ejs file??
    passwordField: "password", 
  },
  async (email:string, password:string, done) => {
    const user = await userController.getUser(email, password);
    return user
      ? done(null, user) // this calls internal login which calls serializeUser
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);
// creates a session for the user and attache the currently loged in user to req.user
// 1: req.session.passport.user
// 2: req.user = {id: 1, name: "Jimmy Smith", email: "jimmy123@gmail.com", password: "jimmy123!",}}
passport.serializeUser(function (user:any, done) {     
  done(null, user.id);
});

// if we have the user then : 
// 1: set the isAuthenticated to true 
// 2: req.user = {id: 1, name: "Jimmy Smith", email: "jimmy123@gmail.com", password: "jimmy123!",}}
passport.deserializeUser(async function (id:string, done) {
      let user = await userController.getUserById(id);
      if (user) {
        done(null, user);
    }else{      
      done({ message: "User not found" }, null);
    }
});

passport.use(localLogin).use(githubLogin); 
export default passport