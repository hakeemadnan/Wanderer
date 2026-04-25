const express = require('express');
const  mongoose = require('mongoose');
const app = express();
const Listing = require('./models/listing.js')
const path =require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js");
const { stat } = require('fs');


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connnected to DB");
})
.catch((err) =>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}


app.get("/",(req,res)=>{
    res.send("Hi , I am root");
});

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


//index route
app.get("/listings", wrapAsync(async(req,res) =>{
    // Listing.find({}).then((res) => {
    //     console.log(res);
    // });
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
//new route
app.get("/listings/new",(req,res) =>{
    res.render("listings/new.ejs");
});

//show route 
app.get("/listings/:id",wrapAsync( async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
}));
//create route
app.post("/listings",wrapAsync(async (req,res,next) =>{
    // let {title,description,image,price,country,location} = req.body;
    // let listing =req.body.listing;
    // console.log(listing);
    //    console.log(req.body);
        console.log("BODY:", req.body);
         console.log("HEADERS:", req.headers["content-type"]);
        if(!req.body.listing){
            throw new ExpressError(400,"Send valid data for listing");
        }
        const newList = new Listing(req.body.listing);
        await newList.save();
        res.redirect("/listings");
}));


//Edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res) =>{
    let {id} = req.params;
    const listing  = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id", wrapAsync(async(req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

 //DELETE route

 app.delete("/listings/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
 }));
//  app.all("*",(req,res,next) =>{
//     next(new ExpressError(404,"PAGE NOT FOUND"));
//  });
app.use((req,res,next) =>{
    next(new ExpressError(404,"PAGE NOT FOUND"));
 });
//error handling middleware
 app.use((err,req,res,next) =>{
    console.log(err);
    let {statusCode=500, message="ERROR"} = err;
    res.status(statusCode).send(message);
 });

 app.listen(8080,() =>{
    console.log("server is listening to port 8080");
});