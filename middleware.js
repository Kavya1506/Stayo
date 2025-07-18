const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login Required!!!");
       return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl = (req,res, next )=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
     let {id} = req.params;
    let listing = await Listing.findById(id);
     if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "You don't have permission to do this function! ");
       return res.redirect(`/listings/${id}`);    
    }
    next();
};
module.exports.isReviewAuthor = async (req,res,next)=>{
     let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId);
     if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error", "You don't have permission to do this function! ");
       return res.redirect(`/listings/${id}`);    
    }
    next();
};