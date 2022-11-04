import express from "express";
import { edit, see, deleteVideo, upload } from "../controllers/videoController"

const videoRouter = express.Router();

//:id를 먼저 쓰면 upload라는 글자도 id로 생각해서 express가 넘겨버림 
//그래서 /upload를 먼저 써줘야 하는데 그렇게 하면 불편하니까
// videoRouter.get("/:id(\\d+)", see);
// 정규 표현식이 들어와서 걸러줄 수도 있다.
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/upload", upload);
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/delete", deleteVideo);

export default videoRouter;