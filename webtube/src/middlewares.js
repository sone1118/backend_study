export const localMiddleward = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.logged);
    res.locals.siteName = "Webtube";
    res.locals.loggedInUser = req.session.user;
    return next();
};

export const protectorMiddleware = (req, res, next) => {
    if (req.session.logged) {
        return next();
    } else {
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.logged) {
        return next();
    } else {
        return res.redirect("/");
    }
};
