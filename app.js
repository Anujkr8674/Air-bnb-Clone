if(process.env.NODE_ENV !="production") {
    require("dotenv").config();
}

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("../MAJOR PROJECT/models/listing.js");
const path = require("path");
// const Listing = require("./models/listing.js");     not used
// const listing = require("../MAJOR PROJECT/models/listing.js");
const methodOverride = require("method-override");
    // ejs mate use in Project - phase2(part b) for styleing
const ejsMate = require("ejs-mate");
//     // for custom wrapAsync
// const wrapAsync = require("./utils/wrapAsync.js");
    // for express error
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");

const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
//const { error } = require("console");


//  for passport

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//     // for validation of schema (joi using)
// const {listingSchema, reviewSchema} = require("./schema.js");


//     // for reviews
// const Review = require("./models/review.js");




    // for routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const { register } = require("module");


// for dbs


const dbUrl = process.env.ATLASDB_URL;

main()
    .then(()=>{
        console.log("connected to db");
    })

    .catch((err)=>{
        console.log(err);
    });


    async function main() {
        await mongoose.connect(dbUrl);
    }


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
    // for show route(Read)  use for id
app.use(express.urlencoded({extended:true}));   
    // for method override use for edit
app.use(methodOverride("_method"));
    // ejs mate
app.engine("ejs", ejsMate);
    // for css style
app.use(express.static(path.join(__dirname, "public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret : process.env.SECRET,
    },
    touchAfter: 24*3600,

});

store.on("error",()=>{
    console.log(" ERROR IN MONGO SESSION STORE", err)
})

// for session
const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
        
    },
    

};



// for create route
// app.get("/",(req,res)=>{
//     res.send("hii I'm Root");
// });


   
app.use(session(sessionOption));
app.use(flash());


// for passport(middleware)

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
   
    next();
});


// for demo user

// app.get("/demouser", async (req,res)=>{
//     let fakeUser = new User({
//         email : "anuj852@gmail.com",
//         username: "delta-student",

//     });
//     let registeredUser = await User.register(fakeUser, "helloworld ");
//     res.send(registeredUser);
// });

    // use for routes folder
    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews",reviewRouter);
    app.use("/", userRouter);
   

        
   

// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         title : "villa",
//         description : "by the beach",
//         price : 1500,
//         location : "Ranchi",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//         res.send("successful testing");
    

// });


    // use for that type of route which is not exist

app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "page not found"));
});



//  for error handling

app.use((err, req, res, next) =>{
    // res.send("something went wrong")
        // if error and message has't contain any value it is assign these value
    let {statusCode = 500, message = "Something went wrong"} = err;
        // for error.ejs
    res.status(statusCode).render("listings/error.ejs",{message});
    // res.status(statusCode).send(message);
})

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});