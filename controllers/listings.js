const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");

module.exports.index= async (req, res) => {
    // Listing.find({}).then((res) => {
    //     console.log(res);
    // });
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

  module.exports.renderNewform = (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
  }

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }

  module.exports.createNewListing = async (req, res, next) => {
    // let {title,description,image,price,country,location} = req.body;
    // let listing =req.body.listing;
    // console.log(listing);
    //    console.log(req.body);
    // console.log("BODY:", req.body);
    //  console.log("HEADERS:", req.headers["content-type"]);
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }
    const newList = new Listing(req.body.listing);
    console.log(req.user);
    newList.owner = req.user._id;
    await newList.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  }

  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }

  module.exports.updateListing= async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }