import Video from "../models/Video";

// const videos = [
//     {
//         title: "Watch First Video",
//         rating: 5,
//         comments: 2,
//         createAt: "1 minutes ago",
//         views: 1,
//         id: 1
//     },
//     {
//         title: "Watch Seconde Video",
//         rating: 5,
//         comments: 2,
//         createAt: "2 minutes ago",
//         views: 200,
//         id: 2
//     },
//     {
//         title: "Watch Third Video",
//         rating: 5,
//         comments: 2,
//         createAt: "3 minutes ago",
//         views: 200,
//         id: 3
//     },
// ];
//파일을 읽어 온 다음에 render을 실행해야 한다 => callback 사용 async await 사용

//callback 사용시
//함수(콜백) => 함수가 실행된 다음에 콜백이 실행되야 한다 순서
// export const home = (req, res) => {
//     
//     Video.find({}, (error, videos) => {
//         if(error){
//             return res.render("server-error");
//         }
//         return res.render("home",{pageTitle: "Home", videos});
//     });
//     res.render("home", {pageTitle: "Home", videos: [] });
// };

//async await 사용시
//await 함수 -> 함수가 될때까지 다음 줄은 실행 하지 않는다
//순차적으로 보기 좋음
export const home = async (req, res) => {
    console.log("1");
    try{
        console.log("2");
        const videos = await Video.find({});
        console.log("3");
        return res.render("home", { pageTitle: "home", videos });
    }catch(error) {
        console.log(error);
        return res.render("server-error");
    }
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