const express = require('express')
const app = express();
require('dotenv').config();
const router = express.Router();
const { checkUserAuth } = require("../middleware/authMiddleware")
const { AdminUserauth, Blogs, Events } = require("../models/Auth")
const { StudentDetails } = require('../models/studentSchema')
const { RsultDetails } = require('../models/ResultSchema')
const multer = require('multer');
const path = require('path');
const { log } = require('console');
const fs = require('fs');

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


router.get("/AddResult", checkUserAuth, async (req, res) => {
    try {
        // const PermRole = await Permissions.find({ Role: req.user.Role });
        const allStudent = await StudentDetails.find();
        const firstyear = await StudentDetails.find({ year: "1" })
        const secondyear = await StudentDetails.find({ year: "2" })
        const thirdyear = await StudentDetails.find({ year: "3" })
        const fourthyear = await StudentDetails.find({ year: "4" })
        const ResultStId = await RsultDetails.distinct('Student_ID');        
        const user=req.user
        const UserType=req.UserType
        const AllBatch = await StudentDetails.aggregate([
            {
                $match: {
                    passout_year: { $ne: null } // Filter out documents where passout_year is null
                }
            },
            {
                
                $group: {
                    _id: '$passout_year',
                    students: {
                        $push: {
                            Student_ID: '$Student_ID',
                            FirstName: '$FirstName',
                            MiddleName: '$MiddleName',
                            LastName: '$LastName',
                            DOB: '$DOB',
                            Gender: '$Gender',
                            year: '$year',
                            Nationality: '$Nationality',
                            Address: '$Address',
                            Email: '$Email',
                            Mobile_Number: '$Mobile_Number',
                            Student_Image: '$Student_Image',
                            Emergency_Cont_Name: '$Emergency_Cont_Name',
                            Relationship_Student: '$Relationship_Student',
                            Contact_Phone_Number: '$Contact_Phone_Number',
                            Allergies: '$Allergies',
                            Chronic_Conditions: '$Chronic_Conditions',
                            Medications: '$Medications',
                            Awards: '$Awards',
                            Certifications: '$Certifications',
                            Scholarships: '$Scholarships',
                            Guardian_Names: '$Guardian_Names',
                            Guardian_Contact: '$Guardian_Contact',
                            Additional_Notes: '$Additional_Notes'
                        }
                    }
                }
            }
        ]);
        console.log(AllBatch)

        res.render("Portal_Result", { allStudent, firstyear, secondyear, thirdyear,fourthyear, AllBatch,UserType,user,ResultStId })
    } catch (error) {
        console.log(error);
    }
})
router.get("/MyResult", checkUserAuth, async (req, res) => {
    try {
        
        const user=req.user
        const UserType=req.UserType
        const ResultStId = await RsultDetails.find({'Student_ID':user.Student_ID}); 
        console.log(ResultStId)       
        res.render("Portal_MyResult", {UserType,user,ResultStId })
    } catch (error) {
        console.log(error);
    }
})
router.post("/AddResult", upload.single('Result'), async (req, res) => {
    try {

        console.log(" req.body:-----------------", req.body);
        const StudentImage = req.file.filename
        const { Student_ID } = req.body
        const already = await RsultDetails.find({ Student_ID: Student_ID })
        if (already.length > 0) {
            fs.unlink(`./upload"${already[0].Result}`, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return;
                }
                console.log('File deleted successfully.');
            });
            await RsultDetails.deleteOne({ Student_ID: Student_ID })
        }

        const NewResult = new RsultDetails({ Student_ID,Result:StudentImage})
        console.log("NewStudent: ", NewResult);
        NewResult.save();
        res.redirect("/AddResult")
    } catch (error) {
        console.log(error);
    }
})

//===========export router=============
module.exports = router;