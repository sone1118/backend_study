export const trending = (req, res) => {
    //const videos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // const videos = [];
    const videos = [
        {
            title: "Video #1",
            rating: 5,
            comments: 2,
            createAt: "1 minutes ago",
            views: 200,
            id: 1
        },
        {
            title: "Video #2",
            rating: 5,
            comments: 2,
            createAt: "2 minutes ago",
            views: 200,
            id: 2
        },
        {
            title: "Video #3",
            rating: 5,
            comments: 2,
            createAt: "3 minutes ago",
            views: 200,
            id: 3
        },
    ];
    res.render("home", {pageTitle: "Home", videos });
};
export const see = (req, res) => res.render("watch", {pageTitle: "Watch"});
export const edit = (req, res) => res.render("edit", {pageTitle: "Edit"});
export const deleteVideo = (req, res) => res.send("Delete Video");
export const upload = (req, res) => res.send("Upload Video");