const { status } = require("express/lib/response");
const jwt = require("jsonwebtoken");

const genrateTocken=(id,UserType)=>{
 return jwt.sign({ id,UserType }, process.env.JWT_SECRET, { expiresIn: '5d' });
};
module.exports ={genrateTocken};