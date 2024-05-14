const express = require('express');
const jwt = require("jsonwebtoken");


const { AdminUserauth } = require("../models/Auth")
const {StudentDetails}=require('../models/studentSchema')
const { FacultyDetails } = require('../models/feacultySchema')


const checkUserAuth = async (req, res, next) => {
    try {
        let user
        if (req.cookies.singIn) {
            const token = req.cookies.singIn; //for access jwt cookies of browser
            const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
            //get the user data of verfy user by the id of tocken
            if (verifyUser.UserType == 'Admin'){
                user = await AdminUserauth.findById(verifyUser.id)
            }else if(verifyUser.UserType == 'Faculty'){
                user = await FacultyDetails.findById(verifyUser.id)
            }else{
                user = await StudentDetails.findById(verifyUser.id)
            }
            req.token = token;
            req.user = user;
            req.UserType = verifyUser.UserType
            next();
        }else{
            res.redirect('/Login')
            next();
        }

    } catch (error) {
        console.log("autherror---------------------", error);
    }
}

module.exports = { checkUserAuth };