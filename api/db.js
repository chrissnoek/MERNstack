const { MongoClient } = require("mongodb");
require("dotenv").config();

let db;


// for MongoDB Atlas: UUU with user, PPP with password and XXX wit hhost
// mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true


const connectToDb = async () => {
    const url = process.env.DB_URL || "mongodb://localhost/issuetracker";
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    await client.connect();
    console.log("Connected to MongoDB at", url);
    db = client.db();
};


// get the next id available in the database
const getNextSequence = async name => {
    const result = await db
        .collection("counters")
        .findOneAndUpdate(
            { _id: name },
            { $inc: { current: 1 } },
            { returnOriginal: false }
        );
    return result.value.current;
};

function getDb() {
    return db;
}

module.exports = { connectToDb, getNextSequence, getDb }