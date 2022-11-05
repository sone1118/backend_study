import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/webtube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log("DB Error", error);
//eventlistner같은 녀석 에러가 발생하면 계속 발생함 click이벤트 같은너낌
db.on("error", handleError);
//한번만 발생하는 녀석 connected 되면 한번 발생
db.once("open", handleOpen);