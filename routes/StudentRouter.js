const express = require('express')
const app = express();
require('dotenv').config();
const router = express.Router();
const { checkUserAuth } = require("../middleware/authMiddleware")
const { AdminUserauth, Blogs, Events } = require("../models/Auth")
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
    Student Details
---------------------------------------------------------------------------------------------------------------------*/
{
    router.get("/StudentDetails", checkUserAuth, async (req, res) => {
        try {
            // const PermRole = await Permissions.find({ Role: req.user.Role });
            const allStudent = await StudentDetails.find();
            const firstyear = await StudentDetails.find({ year: "1" })
            const secondyear = await StudentDetails.find({ year: "2" })
            const thirdyear = await StudentDetails.find({ year: "3" })
            const fouryear = await StudentDetails.find({ year: "4" })
            const user = req.user
            const UserType = req.UserType
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

            res.render("Portal_Studants", { allStudent, firstyear, secondyear, thirdyear, AllBatch, UserType, user })
        } catch (error) {
            console.log(error);
        }
    })
    router.get("/AddStudent", checkUserAuth, async (req, res) => {
        try {
            const user = req.user
            const UserType = req.UserType
            if (UserType !== 'Admin') {
                res.render("Forbihidden")
            }

            res.render("Portal_AddStudants", { UserType, user })
        } catch (error) {
            console.log(error);
        }
    })
    //------------new student 
    router.post("/NewStudent", upload.single('Student_Image'), async (req, res) => {
        try {

            console.log(" req.body:-----------------", req.body);
            const StudentImage = req.file.filename
            const { Student_ID, passout_year, password, FirstName, MiddelName, LastName, year, DOB, Gender, Nationality, Address, Email, Mobile_Number, Emergency_Cont_Name, Relationship_Student, Contact_Phone_Number, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Scholarships, Guardian_Names, Guardian_Contact, Additional_Notes } = req.body

            const NewStudent = new StudentDetails({ Student_ID, passout_year, password, FirstName, MiddelName, LastName, year, DOB, Gender, Nationality, Address, Email, Mobile_Number, Student_Image: StudentImage, Emergency_Cont_Name, Relationship_Student, Contact_Phone_Number, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Scholarships, Guardian_Names, Guardian_Contact, Additional_Notes })
            console.log("NewStudent: ", NewStudent);
            NewStudent.save();
            res.redirect("/StudentDetails")
        } catch (error) {
            console.log(error);
        }
    })

    //-----------get student id for edit
    router.get("/studentedit/:id", checkUserAuth, upload.single('Student_Image'), async (req, res) => {
        try {
            const student = await StudentDetails.find({ _id: req.params.id })
            console.log(student);
            res.render("Portal_EditStudent", { student })
        } catch (error) {
            console.log(error);
        }
    })

    //-----------edit worstudent
    router.post("/student/edit/", upload.single('Student_Image'), async (req, res) => {
        try {
            const { Student_ID, passout_year, password, FirstName, MiddelName, LastName, year, DOB, Gender, Nationality, Address, Email, Mobile_Number, Emergency_Cont_Name, Relationship_Student, Contact_Phone_Number, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Scholarships, Guardian_Names, Guardian_Contact, Additional_Notes } = req.body
            if (req.file) {
                await StudentDetails.findByIdAndUpdate(req.body._id, { Student_ID, passout_year, password, FirstName, MiddelName, LastName, year, DOB, Gender, Nationality, Address, Email, Mobile_Number, Student_Image: req.file.filename, Emergency_Cont_Name, Relationship_Student, Contact_Phone_Number, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Scholarships, Guardian_Names, Guardian_Contact, Additional_Notes });
            } else {
                await StudentDetails.findByIdAndUpdate(req.body._id, { Student_ID, passout_year, password, FirstName, MiddelName, LastName, year, DOB, Gender, Nationality, Address, Email, Mobile_Number, Emergency_Cont_Name, Relationship_Student, Contact_Phone_Number, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Scholarships, Guardian_Names, Guardian_Contact, Additional_Notes });
            }
            res.redirect("/StudentDetails")
        } catch (error) {
            console.log(error);
        }
    })

    //Delete student
    router.get('/studentdelete/:id', async (req, res) => {
        try {
            await StudentDetails.findByIdAndDelete(req.params.id)
            res.redirect('/StudentDetails')
        } catch (error) {
            console.log(error);
        }
    })


    router.get('/MyProfile', checkUserAuth, async (req, res) => {
        const user = req.user
        const UserType = req.UserType
        console.log("user:", user);
        res.render('MyProfile', { user, UserType })
    })
    router.get('/MyProfileFaculty', checkUserAuth, async (req, res) => {
        const user = req.user
        const UserType = req.UserType
        console.log("user:", user);
        res.render('MyProfileFaculty', { user, UserType })
    })

    router.get('/changeyear', checkUserAuth, async (req, res) => {
        try {
            const user = req.user
            const UserType = req.UserType
            const { year } = req.body
            if (year == "1") {
                await StudentDetails.findManyAndUpdate({ year: year }, { year: "2" })
            }
            res.render('Portal_ChangeYear', { user, UserType })
        } catch (error) {
            res.send.json({ error })
        }
    })

    router.post('/changeyear',async (req,res)=>{
        try{
            const user = req.user
            const UserType = req.UserType
            const { year } = req.body
            if (year == "1") {
                await StudentDetails.updateMany({ year: year }, { year: "2" })
            }else if(year == "2"){
                await StudentDetails.updateMany({ year: year }, { year: "2" })
            }else if(year == "3"){
                await StudentDetails.updateMany({ year: year }, { year: "2" })
            }else if(year == "3"){
                await StudentDetails.updateMany({ year: year }, { year: "Passout" })
            }
            res.redirect('/changeyear')
        }catch (error) {
            console.log(error);
            res.send(error)
        }
    })
}

//===========export router=============
module.exports = router;