const express = require("express");
const router = express.Router({mergeParams:true});

    // for custom wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");
    // for express error
const ExpressError = require("../utils/ExpressError.js");

    // for reviews
const Review = require("../models/review.js");

const Listing = require("../models/listing.js");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

 // for reviews
    // Post review Route

    router.post("/", isLoggedIn, validateReview,wrapAsync(reviewController.createReview));
    

        // remove common part from both routes the common part is = /listings/:id/reviews
    
        // post Review Delete Route
    
    router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));
    

    module.exports = router;