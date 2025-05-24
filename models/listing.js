const mongoose = require("mongoose");
const { set } = require("mongoose");
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image:{
       url: String,
        filename: String,
    },
    price: {
        type: Number,
    },
    category:{
        type: String,
        enum: ["Luxury", "Budget-Friendly", "Family-Friendly", "Romantic Getaways", "Pet-Friendly", "Nature & Adventure", "Hill station", "Beachfront Stays"]
    },
    location:{
        type: String,
    },
    country: {
        type: String,
    },
        geometry: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates:{
            type: [Number],
            required: true,
        },
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const  Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;