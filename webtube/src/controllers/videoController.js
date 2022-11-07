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
        return res.status(503).render("server-error");
    }
    //res.render에 return을 안해줘도 render는 된다
    //return 은 함수의 끝을 내주는 것이기때문에 해주면 좋다.
};

//error를 먼저 처리하자
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video is not exist"});
    }
    return res.render("watch", {pageTitle: video.title, video});
}
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video is not exist"});        
    }
    return res.render("edit", {pageTitle: `Edit: ${video.title}`, video});
}
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id: id});

    if(!video) {
        return res.statue(404).render("404", {pageTitle: "Video is not exist"});   
    }
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags: Video.formatHashtags(hashtags)
    });
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try{
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags)
        });        
        return res.redirect("/");
    } catch(error) {
        return res.status(400).render("upload", {
            pageTitle: "Upload Video", 
            errorMessage: error._message});
    }
}

export const getDelete = async (req, res) => {
    //FindOneAndUpdate 같은 One이 들어가는 애들은 where 너낌이다 _id: id  이걸 찾는것
    //FindIdAndUpdate -> FindOneAndUpdate({id_: id}, {}) 이거와 똑같은 거임.
    const { id } = req.params;
    try {
        await Video.findByIdAndDelete(id);
    }catch(error){
        console.log(error);
        return res.redirect("/");
    }
    return res.redirect("/");
};

export const search = async (req, res) => {
    //get으로 오는 ?keyword=~~~ 는 req.query에 들어 있다
    const { keyword } = req.query;
    let videos = [];
    if(keyword) {
        //search
        //find의 옵션에는 여러 가지가 있다 (mongodb가 제공하는 것)
        //$gt: 3 -> 3보다 큰것
        //$regex: new RegExp("정규표현식", "i"); => 정규표현식 && 대소문자 구별 안함
        //ex) `^${keyword}` : keyword가 맨앞에 있는거 `${keyword}$` keyword가 맨 뒤에 있는거
        //new RegExp("찾을문장", "i"); => 찾을 문장을 포함한 모들걸 찾음
        //등으로 찾아 줄수 있다.
        videos = await Video.find({
           title: {
            $regex: new RegExp(keyword, "i")
        },
        });
    }
    return res.render("search", {pageTitle: "Search Video", videos});
};