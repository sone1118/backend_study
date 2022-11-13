import bcrypt from "bcrypt";
import mongoose from "mongoose";

//username 없애 id=> email로  email=> 인증받기
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl: String,
    nickname: { type: String, default: null },
    socialOnly: { type: Boolean, default: false },
    password: { type: String },
    name: { type: String, required: true },
    location: { type: String },
});

userSchema.pre("save", async function () {
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, 5);
    console.log(this.password);
});

const User = mongoose.model("User", userSchema);
export default User;
