import mongoose from "mongoose";

// title: String == title: {type: String}
const videoSchema = {
    title: {type: String, trim: true, required: true, maxlength: 40},
    description: {type: String, trim: true, required: true, maxlength: 140},
    createAt: {type: Date, default: Date.now, required: true},
    hashtags: [{type: String, trim: true}],
    meta: {
        views: {type: Number, default: 0, required: true},
        rating: {type: Number, default: 0, required: true},
    }
};

const Video = mongoose.model("Video", videoSchema);
export default Video;