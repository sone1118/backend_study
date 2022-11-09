import User from "../models/Username";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { name, email, username, location },
    } = req;
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            email,
            username,
            name,
            location,
        },
        { new: true },
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};
export const getJoin = (req, res) => {
    return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: "Password confirmation does not match.",
        });
    }

    const exists = await User.exists({
        $or: [{ username }, { email }],
    });
    if (exists) {
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: "This username/email is already taken.",
        });
    }

    try {
        await User.create({
            name,
            email,
            username,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error._message,
        });
    }
};
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, socialOnly: false });
    const pageTitle = "Login";

    if (!user) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "An account with this username does not exists",
        });
    }
    const correct = await bcrypt.compare(password, user.password);

    if (!correct) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "Wrong password",
        });
    }

    req.session.logged = true;
    req.session.user = user;

    console.log("Log user in!!!");
    return res.redirect("/");
};

//https://github.com/login/oauth/authorize?client_id=1cfcf357c56667ec1f5f
export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();

    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();

        console.log(userData);
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();

        const emailObj = emailData.find((email) => email.primary && email.verified);

        if (!emailObj) {
            //확인된 이메일이 없음
            return res.status(400).redirect("/login");
        }

        let user = await User.findOne({
            email: emailObj.email,
        });
        if (!user) {
            //새 계정만들기
            user = await User.create({
                name: userData.name,
                avatarUrl: userData.avatar_url,
                email: emailObj.email,
                username: userData.login,
                socialOnly: true,
                password: "",
                location: userData.location,
            });
        }
        req.session.logged = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        //no token?
        return res.status(400).redirect("/login");
    }
};
export const see = (req, res) => res.send("See Profile");

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};
