const mongoose = require("mongoose");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");

// Get All Products -- /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 3;
  
  let buildQuery = () => {
    return new APIFeatures(Product.find(), req.query).search().filter();
  }
   
  const filteredProductsCount = await buildQuery().query.countDocuments();
  const totalProductsCount = await Product.countDocuments({});
  let productsCount = totalProductsCount

  if(filteredProductsCount !== totalProductsCount){
    productsCount = filteredProductsCount;
  }

  const products = await buildQuery().paginate(resPerPage).query;

  res.status(200).json({
    success: true,
    count: productsCount,
    resPerPage,
    products,
  });
});

// Create Product -- /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {

  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get Single Product -- /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- /api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product -- /api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted",
  });
});

//Create New Review   =>   /api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    rating,
    comment
  };

  const product = await Product.findById(productId);
  //finding user review exist
    const isReviewed = product.reviews.find(review =>{
    return review.user.toString() === req.user.id.toString()
  })
  if(isReviewed){
    //updating the review
    product.reviews.forEach(review =>{
      if(review.user.toString() === req.user.id.toString()){
        review.comment = comment;
        review.rating = rating;
      }
    });

  }else{
    //creating the review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  //find the average of the product reviews
  product.ratings = product.reviews.reduce((acc,review) => {
    return review.rating + acc;
  }, 0) / product.reviews.length;
  product.ratings = isNaN(product.ratings)?0:product.ratings;

  await product.save({validateBeforeSave: false});

  res.status(200).json({
    success: true
  })
  
});

//Get Reviews -api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async(req, res, next) =>{
  const product = await Product.findById(req.query.id)

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

//Delete Review - api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next)=>{
  const product = await Product.findById(req.query.productId);
  const reviews = product.reviews.filter(review => {
     review._id.toString() !== req.query.id.toString()
  })
  const numOfReviews = reviews.length;
  let ratings = reviews.reduce((acc, review)=>{
    return review.rating + acc;
  }, 0) / reviews.length;
  ratings = isNaN(ratings)?0:ratings;
  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    numOfReviews,
    ratings
  },
  {new:true}
)
  res.status(200).json({
    success: true
  })
})