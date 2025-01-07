const express = require("express");
const router = express.Router();
    // for custom wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");


const Listing = require("../models/listing.js");

const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { index } = require("../controllers/listings.js");


const multer = require('multer')
const{storage} = require("../cloudConfig.js");
const upload = multer({storage});



router
  .route("/")
//   index route
  .get(wrapAsync(listingController.index))
//   create oute
  .post(
      isLoggedIn, 
      upload.single('listing[image]'), 
      validateListing,
      wrapAsync(listingController.createListing)
   );


    
// new route

router.get("/new", isLoggedIn, listingController.renderNewForm)


router.route("/:id")
// show route
.get(wrapAsync(listingController.showListing))
// update route
.put( isLoggedIn, isOwner, upload.single('listing[image]'),  validateListing, wrapAsync(listingController.updateListing))
// delete route
.delete( isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



        // Edit Route
    
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditFrom));
    
    

    

    module.exports = router;