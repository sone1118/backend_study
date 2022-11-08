export const localMiddleward = (req, res, next) => {
   res.locals.loggedIn = Boolean( req.session.logged);
   res.locals.siteName = "Webtube";
   res.locals.loggedInUser = req.session.user;
    next();
};