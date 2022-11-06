import Video from "../models/Video";

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
    try{
        const videos = await Video.find({});
        return res.render("home", { pageTitle: "home", videos });
    }catch(error) {
        return res.render("server-error");
    }
    //res.render에 return을 안해줘도 render는 된다
    //return 은 함수의 끝을 내주는 것이기때문에 해주면 좋다.
};

//error를 먼저 처리하자
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.render("404", {pageTitle: "Video is not exist"});
    }
    return res.render("watch", {pageTitle: video.title, video});
}
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.render("404", {pageTitle: "Video is not exist"});        
    }
    return res.render("edit", {pageTitle: `Edit: ${video.title}`, video});
}
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id: id});

    if(!video) {
        return res.render("404", {pageTitle: "Video is not exist"});   
    }
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags: hashtags.split(",").map((word) => word.startsWith("#") ? word : `#${word}`)
    });
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;

    //video.save()로 실행하는 방법
    // const video = new Video({    
    //     title,
    //     description,
    //     createAt: Date.now(),
    //     hashtags: hashtags.split(",").map((word) => `#${word}`),
    //     meta: {
    //         views: 0,
    //         rating: 0,
    //     }
    // }); 
    // try {
    //     await video.save();
    //     return res.redirect("/");
    // }catch(error) {
    //     return res.render("upload", {
    //         pageTitle: "Upload Video", 
    //         errorMessage: error._message});
    // }

// try catch 로 error 처리
//error 종류 => type에 맞지 않은 데이터, 값이 없음
    try{
        await Video.create({
            title,
            description,
            hashtags: hashtags.split(",").map((word) => word.startsWith("#") ? word : `#${word}`)
        });        
        return res.redirect("/");
    } catch(error) {
        return res.render("upload", {
            pageTitle: "Upload Video", 
            errorMessage: error._message});
    }
}