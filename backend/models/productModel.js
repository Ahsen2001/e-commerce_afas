const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: true,
        default: 0.0,
    },
    description:{
        type: String,required: [true, 'Please Enter Product description'],
    },
    ratings:{
        type: String,
        default: 0
    },
    images:[
         
            {
                image:{
                    type: String,
                    required: true
                }
            }
    ],
    category:{

        type: String,
        required: [true, 'Please Enter Product Category'],
        enum:{
            values:[
            'Mobile Phones',
            'Clothes/Shoes',
            'Headphones',
            'Books',
            'Accessories',
            'Laptops'
            ],
            message: 'Please select correct category for product'
        }
    },
    seller:{
        type: String,
        required: [true, 'Please Enter Product Seller'],
    },
    stock:{
        type: Number,
        required: [true, 'Please Enter Product Stock'],
        maxLength: [20, 'Product name cannot exceed 20 characters'],
    },
    numOfReviews:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            user: mongoose.Schema.Types.ObjectId,
            rating:{
                type: String,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }                 
});

let Schema = mongoose.model('Product', productSchema)
module.exports = Schema;