const express = require('express')
const app = express();
require('dotenv').config();
const router = express.Router();
const { checkUserAuth } = require("../middleware/authMiddleware")
const { AdminUserauth, Students, Events } = require("../models/Auth")
const { StudentDetails } = require('../models/studentSchema')
const { FacultyDetails } = require('../models/feacultySchema')
const { TimeTableFacultys, YearTimeTables } = require('../models/TimeTableSchema')




router.get("/Dashboard", checkUserAuth, async (req, res) => {
    try {
        const user = req.user
        const UserType = req.UserType
        console.log(user);
        let timetable
        if (UserType === "Student") {
            timetable = await YearTimeTables.find({ year: user.year });
        } else if (UserType === "Faculty") {
            timetable = await TimeTableFacultys.find({ Faculty_ID: user.Faculty_ID })
        }
        
        if (timetable.length == 0 ) {
            timetable.push({ TimeTable: 0 }); // Add a new object with the presentPercentage property
        }
        console.log("timetable:",timetable);
        const totalfaculty = await FacultyDetails.find()
        const totalstudent = await StudentDetails.find()
        res.render("Portal_Dashboard", { UserType, user, timetable,totalfaculty,totalstudent })
    } catch (error) {
        console.log(error);
    }
})

router.get("/Attendance", checkUserAuth, async (req, res) => {
    try {
        const UserType = req.user
        console.log("UserType:", UserType);
        res.render("Portal_Attendance")
    } catch (error) {
        console.log(error);
    }
})

router.get("/Result", checkUserAuth, async (req, res) => {
    try {
        res.render("Portal_Result")
    } catch (error) {
        console.log(error);
    }
})

//===========export router=============
module.exports = router;