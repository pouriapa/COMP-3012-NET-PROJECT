import express from "express";
import passport from "../middleware/passport";
import {forwardAuthenticated } from "../middleware/checkAuth";
const router = express.Router();

router.get("/login", forwardAuthenticated,(req, res) => res.render("auth/login"));


router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.get('/github', passport.authenticate('github'));


router.get('/github/callback', 
  passport.authenticate('github',),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});


export default router;
