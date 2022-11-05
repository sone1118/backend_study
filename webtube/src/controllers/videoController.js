const videos = [
    {
        title: "Watch First Video",
        rating: 5,
        comments: 2,
        createAt: "1 minutes ago",
        views: 1,
        id: 1
    },
    {
        title: "Watch Seconde Video",
        rating: 5,
        comments: 2,
        createAt: "2 minutes ago",
        views: 200,
        id: 2
    },
    {
        title: "Watch Third Video",
        rating: 5,
        comments: 2,
        createAt: "3 minutes ago",
        views: 200,
        id: 3
    },
];
export const trending = (req, res) => {
    //const videos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // const videos = [];
    res.render("home", {pageTitle: "Home", videos });
};
export const watch = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    res.render("watch", {pageTitle: `Watch: ${video.title}`, video});
}
export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render("edit", {pageTitle: `Edit: ${video.title}`, video});
}
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    videos[id - 1]. title = title;
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = (req, res) => {
    const { title }  = req.body;
    const newVideo = {
        title, 
        rating: 0,
        comments: 0,
        createAt: "0 minutes ago",
        views: 0,
        id: videos.length + 1
    };
    videos.push(newVideo);
    return res.redirect("/");
}