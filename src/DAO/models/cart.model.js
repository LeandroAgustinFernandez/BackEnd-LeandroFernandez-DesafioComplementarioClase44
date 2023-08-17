import { Schema, model } from "mongoose";

const cartsCollection = "carts";

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number
      },
    ],
    default: [],
    require: true,
  },
});

cartSchema.pre('find',function(){
  this.populate('products.product');
})

cartSchema.pre('findOne',function(){
  this.populate('products.product');
})

export const cartModel = model(cartsCollection, cartSchema);
