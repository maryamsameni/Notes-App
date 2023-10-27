const mongoose = require("mongoose");
const DB_URL = "mongodb://0.0.0.0:27017/noteApp";
mongoose.set("strictQuery", false)

const mongodbConnect = async () => {
    try {
        await mongoose.connect(DB_URL)
    } catch (error) {
        console.log(error);
    }
};

module.exports = mongodbConnect