const products = require('../data/products.json');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const connectDatabse = require('../config/database');

dotenv.config({path: 'backend/config/config.env'});
connectDatabse();

const seedProducts = async () =>{
    try{
    await Product.deleteMany();
    console.log('Products deleted Successfully');

    await Product.insertMany(products);
    console.log('Products added Successfully');
} catch (error) {
    console.log(error.message);
    }
    process.exit();
}

seedProducts();