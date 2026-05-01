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
        default:"https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?q=80&w=688&auto=format&fit=crop",
        set: (v) => v ==="" ? "https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?q=80&w=688&auto=format&fit=crop" : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }]
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports =Listing;