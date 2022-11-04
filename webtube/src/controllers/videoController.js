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
    res.render("watch", {pageTitle: `Watching ${video.title}`, video});
}
export const edit = (req, res) => res.render("edit", {pageTitle: "Edit"});
export const deleteVideo = (req, res) => res.send("Delete Video");
export const upload = (req, res) => res.send("Upload Video");