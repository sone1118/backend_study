import User from "../models/user";
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
  await User.create({
      name, 
      email, 
      username, 
      password, 
      location
    });
  return res.redirect("/login");
};
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const deleteUser = (req, res) => res.send("Delete User");
export const see = (req, res) => res.send("See Profile");
export const logout = (req, res) => res.send("Logout");