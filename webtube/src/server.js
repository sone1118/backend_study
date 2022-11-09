import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import { localMiddleward } from './middlewares';

const app = express();

const logger = morgan('dev');

//res할때 변수를 전달한 html파일을 전해주고 싶다
//pug라는플랫폼을 사용해서 pug가 우리가작성한 파일을  html로 변환
//그것을 render해서 return 해 주는 것
//그때 html로 변환해주는 것을 pug로 설정할 것이고
//그때 변환할 파일을 찾을 때 경로를 설정해주는것
// process.cwd()는 현재 작동하고 있는 디렉토리 => node가 돌아가는 곳 package.json 이 있는곳
// cwd를 기준으로 경로를 지정해주면 그곳으로 찾아가서 찾게 됨
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(logger);

//express는 url에 있는 것은 바로 확인 할 수가 있는데 ex) /:id(//d+)/watch -> req.param
//form을 post 보내면 알수가 없으니 이것을 알아도록 설정해줘야한다.
//미들웨어녀석 form에서 전송되는 것을 받아준다
//여러 모드가 있는데 extended: true 이것은 object 형태로 줌
app.use(express.urlencoded({ extended: true }));

//쿠키와 세션을 이용하기 위해서 사용하는 미들웨어!
//서버는 클라이언트의 요청이 있으면 그 세션 아이디라는 것을 같이 전달해준다
//클라이언트는 받은 세션 id를 매번 request 할때마다 같이 보낸다
//서버는 그id를 보고 req.session에 클라이언트 정보를 불러오고 우리는 그것을 middleware로 처리를 해줄 수 있다
//res.locals라는 부분은 pug도 전체로 접근할 수 있는 부분임
//session에도 설정을 할 수 있는데 => ex) 모든 사람을 다 저장하지말고 loggin한 user만 저장하자
//== resave: false, saveUninitialized: false,
//기존에 있던 session값의 변경이 없어도 저장한다 => resave: true,
//새로생성된 session값의 변겨이 없어도 저장된다 => saveUninitialized: true,
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  }),
);

app.use(localMiddleward);
app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

export default app;
