const db = require('./db');
const { Sequelize } = db;
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Tag = require('./Tag');
const LineItem = require('./LineItem');
//what are the models for an ecommerce website?
//users products orders tag

//line item is the product and the amount of said product

User.hasMany(Order);
// Tag.hasMany(Product);
Product.hasMany(Tag);
LineItem.belongsTo(Product)
Order.belongsTo(User);
Order.hasMany(LineItem);




module.exports = {
    db,
    User,
    Product,
    Order,
    Tag,
    LineItem
};
