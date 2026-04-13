const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/golden-sunset-over-a-dark-calm-ocean-Sc3Wmw43Z8E",
        set: (v) => v ==="" ? "https://unsplash.com/photos/golden-sunset-over-a-dark-calm-ocean-Sc3Wmw43Z8E" : v,
    },
    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports =Listing;