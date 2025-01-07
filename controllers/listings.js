const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings});
    
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
}


module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    // console.log(id);
    // use populate to show the review content in the show(webpage) section
    const listing = await Listing.findById(req.params.id)
    .populate({
        path: "reviews",
        populate:   {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing)    {
        req.flash("error","Listing you requested for does't exist!");
        res.redirect("/listings");

    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
}


// create listing

module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");


}



// edit route


    module.exports.renderEditFrom = async(req, res) => {
        let {id} = req.params;
        
        const listing = await Listing.findById(req.params.id);
        if(!listing)    {
            req.flash("error","Listing you requested for does't exist!");
            res.redirect("/listings");
    
        }

        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")

        // res.render("listings/edit.ejs",{listing});
        res.render("listings/edit.ejs",{listing, originalImageUrl});
    }


    // upadet route 

module.exports.updateListing = async(req, res)=>{
       
    
    let {id} = req.params;

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !=="undefined")  {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success","Listings Updated!");
    res.redirect(`/listings/${id}`);

};


        // for delete

module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");

}