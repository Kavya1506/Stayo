require('dotenv').config();
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = (async (req,res) =>{
   let { q, category } = req.query;

let query = {};  // Base query object

// If there's a search keyword
if (q) {
  query.$or = [
    { location: { $regex: q, $options: "i" } },
    { country: { $regex: q, $options: "i" } }
  ];
}

// If there's a category filter
if (category) {
  query.category = category;
}

let allListings = await Listing.find(query);
    res.render("listings/index.ejs",{allListings});
  });

  module.exports.new = (req,res)=>{
    res.render("listings/new.ejs");
  };

  module.exports.show = ( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
      path: "reviews",
    populate: {
      path: "author",
    },
  }).populate("owner");
    if(!listing){
      req.flash("error", "Listings not found!!!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
  });

  module.exports.create = async (req,res,next)=>{
    let response =await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
      .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}; 
    console.log(newListing);
    newListing.geometry = response.body.features[0].geometry;

    let new_listing = await newListing.save();
    console.log(new_listing);
    req.flash("success", "New listing created");
    res.redirect("/listings");
    console.log(req.body);
  };

  module.exports.edit = async (req,res)=>{
      let {id} = req.params;
      const listing = await Listing.findById(id);
      if(!listing){
        req.flash("error", "Listings not found!!!");
      }
      let original_img = listing.image.url;
       original_img = original_img.replace("/upload", "/upload/h_300,w_250");
      res.render("listings/edit.ejs", {listing, original_img});
    };

module.exports.update = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url);
    console.log(filename);
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "listing updated!");
    res.redirect(`/listings/${id}`);
  }

module.exports.delete = async (req,res)=>{
    let {id} = req.params;
   let deletedList= await Listing.findByIdAndDelete(id);
   console.log(deletedList);
   req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  };