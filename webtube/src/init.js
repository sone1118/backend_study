import "dotenv/config"
import "./db";
import "./models/Video"; //이게 db임포트 후에 나와야함!
import "./models/Username";
import app from "./server";

const PORT = 4000;

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT} ♬`);

app.listen(PORT, handleListening);
