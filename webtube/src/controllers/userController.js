import User from "../models/user";
import bcrypt from "bcrypt";

export const edit = (req, res) => res.send("User Edit!");
export const getJoin = (req, res) => {
  return res.render("join", {pageTitle: "Join"});
};
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location} = req.body;
  if(password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join", 
      errorMessage: "Password confirmation does not match."
    });
  }

  const exists = await User.exists({$or: [{username}, {email}]});
  if(exists) {
    return res.status(400).render("join", {
      pageTitle: "Join", 
      errorMessage: "This username/email is already taken."
    });
  }

  try {
    await User.create({
        name, 
        email, 
        username, 
        password, 
        location
      });
    return res.redirect("/login");
  }catch(error) {
    return res.status(400).render("join", {
      pageTitle: "Join", 
      errorMessage: error._message});
  }
};
export const remove = (req, res) => res.send("Remove User");
export const getLogin = (req, res) => res.render("login", {pageTitle: "Login"});
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const pageTitle = "Login";

  if(!user) {
    return res.status(400).render("login", {
      pageTitle, 
      errorMessage: "An account with this username does not exists"
    });
  }
  const correct = await bcrypt.compare(password, user.password);

  if(!correct) {
    return res.status(400).render("login", { 
      pageTitle, 
      errorMessage: "Wrong password" });
  }

  req.session.logged = true;
  req.session.user = user;

  console.log("Log user in!!!");
  return res.redirect("/");
};
export const deleteUser = (req, res) => res.send("Delete User");
export const see = (req, res) => res.send("See Profile");
export const logout = (req, res) => res.send("Logout");