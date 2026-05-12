if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}
// console.log(process.env.SECRET)
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
// const { stat } = require('fs');
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js")
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");
const { setupPrimary } = require("cluster");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connnected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpsOnly: true, //for security
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser =req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "students@gmail.com",
//     username: "newstudennt",
//   });
//   const registeredUser = await User.register(fakeUser, "helloWorld");
//   res.send(registeredUser);
// });
app.get("/", (req, res) => {
  res.send("Hi , I am root");
});
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);
// app.get("/testListing",async (req,res)=>{
//     let SampleListing =new Listing({
//         title:"My Villa",
//         description :"By the beach",
//         price : 1200,
//         location:"Delhi",
//         country:"India"
//     })
//     await SampleListing.save();
//     console.log("sample was saved");
//     res.send("Testing successful")
// });

//  app.all("*",(req,res,next) =>{
//     next(new ExpressError(404,"PAGE NOT FOUND"));
//  });

app.use((req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND"));
});
//error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  let { statusCode = 500, message = "ERROR" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
