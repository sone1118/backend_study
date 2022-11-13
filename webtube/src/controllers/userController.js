import User from "../models/Username";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
    const {
        session: { user },
        body: { name, email, nickname, location },
    } = req;

    //username을 변경했을때
    if (user.nickname !== nickname) {
        //username이 이미 있는지 확인한다
        const exists = await User.exists(nickname);
        if (exists) {
            //이미 있는 username이라 변경 불가능
        } else {
            //변경가능
        }
    }

    //email을 변경했을때
    if (user.email !== email) {
        //email이 이미 있는지 확인한다.
    }
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            email,
            nickname,
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
    const { name, nickname, email, password, password2, location } = req.body;
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: "Password confirmation does not match.",
        });
    }

    const exists = await User.exists({
        $or: [{ nickname }, { email }],
    });
    if (exists) {
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: "This nickname/email is already taken.",
        });
    }

    try {
        await User.create({
            name,
            email,
            nickname,
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
    const { email, password } = req.body;
    const user = await User.findOne({ email, socialOnly: false });
    const pageTitle = "Login";

    if (!user) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "An account with this email does not exists",
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
            return res.status(400).render("login", {
                pageTitle,
                errorMessage: "Github에 확인된 이메일이 없습니다! 회원가입을 진행하세요!",
            });
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
                nickname: userData.login,
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
