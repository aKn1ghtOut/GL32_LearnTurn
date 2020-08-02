import { Mongo } from "meteor/mongo";

const Products = new Mongo.Collection("Products");

console.log({Products});

export default Products;