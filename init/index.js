const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { init } = require("../models/review.js");
// const listing = require("../models/listing");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connected to db");
    })

    .catch((err)=>{
        console.log(err);
    });


    async function main() {
        await mongoose.connect(MONGO_URL);
    }

    const initDB = async()=>{
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner : "675abf6f52b20f64227d8240",
        })),
        await Listing.insertMany(initData.data);

        console.log("data was initlize");
 
    };

    initDB();