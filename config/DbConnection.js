const mongoose = require("mongoose");
const dbconnect = async () => {
    try {
        await mongoose.connect("mongodb+srv://fenamavani:fena1403@cluster0.v2tedkq.mongodb.net/Adminnpanel");
        console.log(" Database connected successfully...");
    } catch (err) {
        console.error(" Database Connection Error:", err.message);
    }
};
module.exports = dbconnect();
