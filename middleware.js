const Listing = require("./models/listing");
// const review = require("./models/review");
const Review = require("./models/review.js");

    // for validation of schema (joi using)
const {listingSchema, reviewSchema} = require("./schema.js");
    // for express error
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    if (!req.isAuthenticated())  {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create a listings!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if (req.session.redirectUrl)    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async(req,res, next) => {
    let {id} = req.params;

        let listing = await Listing.findById(id);
        if (!listing.owner._id.equals(res.locals.currUser._id))    {
            req.flash("error", "you are not the owner of this listing");
           return res.redirect(`/listings/${id}`);
        }
        next();
}



module.exports.validateListing = (req, res, next) => {
    
    // let error = listingSchema.validate(req.body);
    const {error} = listingSchema.validate(req.body);
    
    
    if(error)    {
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


 // passing validation for review middleware

 module.exports.validateReview = (req, res, next) => {
    
    // let error = listingSchema.validate(req.body);
    const {error} = reviewSchema.validate(req.body);
    if(error)    {
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



// for review delete


module.exports.isReviewAuthor = async(req,res, next) => {
    let {id, reviewId} = req.params;

        let review = await Review.findById(reviewId);
        if (!review.author.equals(res.locals.currUser._id))    {
            req.flash("error", "you are not author of  this review");
           return res.redirect(`/listings/${id}`);
        }
        next();
};