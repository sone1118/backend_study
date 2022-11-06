import mongoose from "mongoose";

// title: String == title: {type: String}
const videoSchema = new mongoose.Schema({
    title: {type: String, trim: true, required: true, maxlength: 40},
    description: {type: String, trim: true, required: true, maxlength: 140},
    createAt: {type: Date, default: Date.now, required: true},
    hashtags: [{type: String, trim: true}],
    meta: {
        views: {type: Number, default: 0, required: true},
        rating: {type: Number, default: 0, required: true},
    }
});

// videoSchema.pre("save", async function() {
//     this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((word) => word.startsWith("#") ? word : `#${word}`);
//     console.log(this.hashtags);
// });

// export const formatHashtags = (hashtags) => {
//     return hashtags.split(",").map((word) => word.startsWith("#") ? word : `#${word}`);
// };

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.split(",").map((word) => word.startsWith("#") ? word : `#${word}`);
});

const Video = mongoose.model("Video", videoSchema);
export default Video;