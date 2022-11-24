const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Product = require('../models/product.models');


const userSchmea = new mongoose.Schema(
    {
        "name" : {type: String},
        "email" : {type: String, required: true},
        "password" : {type: String, required: true},
    },
    {
        versionKey: false
    }
)


const Schema = mongoose.Schema;



const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }],
        totalPrice: Number
    }
});




userSchema.methods.addToCart = async function(productId) {
    const product = await Product.findById(productId);
    if (product) {
        const cart = this.cart;
        const isExisting = cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(product._id).trim());
        
        
        
        
        if (isExisting >= 0) {
            cart.items[isExisting].qty += 1;
        } else 
        
        
        
        {
            cart.items.push({ productId: product._id, qty: 1 });
        }


        
        if (!cart.totalPrice) {
            cart.totalPrice = 0;
        }
        cart.totalPrice += product.price;
        return this.save();
    }

};


userSchema.methods.removeFromCart = function(productId) {
    const cart = this.cart;
    const isExisting = cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(productId).trim());
    if (isExisting >= 0) {
        cart.items.splice(isExisting, 1);
        return this.save();
    }
}

//'User' => users
module.exports = mongoose.model('User', userSchema);

// userSchmea.pre('save', function (next) {
//     if (!this.isModified("password")) return next();
//     let hash = bcrypt.hashSync(this.password, 8);
//     this.password = hash;
//     return next();
// })


// userSchmea.methods.checkPassword = function (password) {
//     return bcrypt.compareSync(password, this.password);
// }



const User = mongoose.model('user', userSchmea);

module.exports = User;