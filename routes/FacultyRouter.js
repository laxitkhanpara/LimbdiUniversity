const express = require('express')
const app = express();
require('dotenv').config();
const router = express.Router();
const { checkUserAuth } = require("../middleware/authMiddleware")
const { AdminUserauth, Blogs, Events } = require("../models/Auth")
const { FacultyDetails } = require('../models/feacultySchema')
const { StudentDetails } = require('../models/studentSchema')
const multer = require('multer');
const path = require('path');
const { log } = require('console');



//================photo upload===============================

//const upload =multer({dest:"uploads/"});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/upload")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage });


/*---------------------------------------------------------------------------------------------------------------------
    Faculty Details
---------------------------------------------------------------------------------------------------------------------*/
{
    router.get("/FacultyDetails", checkUserAuth, async (req, res) => {
        try {
            const user=req.user
            const UserType=req.UserType
            if (UserType !=='Admin'){
                res.render("Forbihidden")
            }
            // const PermRole = await Permissions.find({ Role: req.user.Role });
            const allFaculty = await FacultyDetails.find();        
            console.log("allFaculty:-",allFaculty)
            res.render("Portal_Faculty", { allFaculty,UserType,user})
        } catch (error) {
            console.log(error);
        }
    })
    router.get("/AddFaculty", checkUserAuth, async (req, res) => {
        try {
            const user=req.user
            const UserType=req.UserType
            if (UserType !=='Admin'){
                res.render("Forbihidden")
            }
            res.render("Portal_AddFaculty",{UserType,user})
        } catch (error) {
            console.log(error);
        }
    })
    //------------new Faculty 
    router.post("/NewFaculty", upload.single('Faculty_Image'), async (req, res) => {
        try {

            console.log(" req.body:-----------------", req.body);
            const FacultyImage = req.file.filename
            const { Faculty_ID, password, FirstName, MiddelName, LastName, DOB, Gender, Nationality, Address, Email, Mobile_Number, Emergency_Cont_Name, Relationship_Faculty, Contact_Phone_Number,Subject_Area,Educational_Qualifications, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Additional_Notes } = req.body

            const NewFaculty = new FacultyDetails({Faculty_Image:FacultyImage, Faculty_ID, password, FirstName, MiddelName, LastName, DOB, Gender, Nationality, Address, Email, Mobile_Number, Emergency_Cont_Name, Relationship_Faculty, Contact_Phone_Number,Subject_Area,Educational_Qualifications, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Additional_Notes })
            console.log("NewFaculty: ", NewFaculty);
            NewFaculty.save();
            res.redirect("/FacultyDetails")
        } catch (error) {
            console.log(error);
        }
    })

    //-----------get Faculty id for edit
    router.get("/Facultyedit/:id",checkUserAuth, upload.single('Faculty_Image'), async (req, res) => {
        try {
            const faculty=await FacultyDetails.find({_id:req.params.id})
            console.log("Faculty----------------->",faculty);
            res.render("Portal_EditFaculty",{faculty})
        } catch (error) {
            console.log(error);
        }
    })

    //-----------edit worFaculty
    router.post("/Faculty/edit/", upload.single('Faculty_Image'), async (req, res) => {
        try {
            const { Faculty_ID, password, FirstName, MiddelName, LastName, DOB, Gender, Nationality, Address, Email, Mobile_Number, Emergency_Cont_Name, Relationship_Faculty, Contact_Phone_Number,Subject_Area,Educational_Qualifications, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Additional_Notes } = req.body
            if (req.file){
                await FacultyDetails.findByIdAndUpdate(req.body._id, { Faculty_Image: req.file.filename,Faculty_ID, password, FirstName, MiddelName, LastName, DOB, Gender, Nationality, Address, Email, Mobile_Number, Emergency_Cont_Name, Relationship_Faculty, Contact_Phone_Number,Subject_Area,Educational_Qualifications, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Additional_Notes});
            }else{
                await FacultyDetails.findByIdAndUpdate(req.body._id, { Faculty_ID, password, FirstName, MiddelName, LastName, DOB, Gender, Nationality, Address, Email, Mobile_Number, Emergency_Cont_Name, Relationship_Faculty, Contact_Phone_Number,Subject_Area,Educational_Qualifications, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Additional_Notes});
            }
            res.redirect("/FacultyDetails")
        } catch (error) {
            console.log(error);
        }
    })

    //Delete Faculty
    router.get('/Facultydelete/:id',async (req,res)=>{
        try{
            await FacultyDetails.findByIdAndDelete(req.params.id)
            res.redirect('/FacultyDetails')
        }catch(error){
            console.log(error);
        }
    })



}

//===========export router=============
module.exports = router;