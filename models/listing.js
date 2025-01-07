const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");



const listingSchema = new Schema ({
    title : {
        type : String,
        required : true,
    },

      description : String,

    // image : {
    //     type : String,
    //     default :
    //     "https://media.istockphoto.com/id/1213840216/photo/luxury-travel-romantic-couple-in-beach-hotel.jpg?s=170667a&w=0&k=20&c=Rbw4S6oiCW5HrsToetdoNElKyYV4x7uvpWrQ_4JqFLg=",
        
        
    //     set : (v) =>
    //         v === ""
    //     ? "https://media.istockphoto.com/id/1213840216/photo/luxury-travel-romantic-couple-in-beach-hotel.jpg?s=170667a&w=0&k=20&c=Rbw4S6oiCW5HrsToetdoNElKyYV4x7uvpWrQ_4JqFLg=" : v,


    // },

    image: {
        url : String,
        filename : String,
    },

    price : Number,
    location : String,
    country : String,

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],

    owner : {
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});


//  middle ware for delete when ever i delete any listing it will delete it's related all reviews

listingSchema.post("findOneAndDelete", async(listing)=>{
    if (listing)    {
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

// const listing = mongoose.model("listing", listingSchema);
// module.exports = listing;

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;