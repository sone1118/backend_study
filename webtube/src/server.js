import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const PORT = 4000;

const logger = morgan("dev");

//res할때 변수를 전달한 html파일을 전해주고 싶다
//pug라는플랫폼을 사용해서 pug가 우리가작성한 파일을  html로 변환
//그것을 render해서 return 해 주는 것
//그때 html로 변환해주는 것을 pug로 설정할 것이고
//그때 변환할 파일을 찾을 때 경로를 설정해주는것
// process.cwd()는 현재 작동하고 있는 디렉토리 => node가 돌아가는 곳 package.json 이 있는곳
// cwd를 기준으로 경로를 지정해주면 그곳으로 찾아가서 찾게 됨
app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views");
app.use(logger);
//미들웨어녀석 form에서 전송되는 것을 받아준다
//여러 모드가 있는데 extended: true 이것은 object 형태로 줌
app.use(express.urlencoded({ extended: true}));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.listen(PORT, () => {console.log(`Server listening on port http://localhost:${PORT} ♬`)});