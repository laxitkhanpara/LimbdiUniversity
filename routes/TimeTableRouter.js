const express = require('express')
const app = express();
require('dotenv').config();
const router = express.Router();
const { checkUserAuth } = require("../middleware/authMiddleware")
const { AdminUserauth, Blogs, Events } = require("../models/Auth")
const { FacultyDetails } = require('../models/feacultySchema')
const { TimeTableFacultys, YearTimeTables, Essential } = require('../models/TimeTableSchema')
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

router.get("/AddTimetable", checkUserAuth, async (req, res) => {
    try {
        const user = req.user
        const UserType = req.UserType
        const TimeTableFaculty = await TimeTableFacultys.distinct('Faculty_ID');
        const YearTimeTable = await YearTimeTables.distinct('Faculty_ID');

        if (UserType !== 'Admin') {
            res.render("Forbihidden")
        }
        const allFaculty = await FacultyDetails.find();
        res.render("Portal_AddTimeTable", { allFaculty, UserType, user, TimeTableFaculty, YearTimeTable })
    } catch (error) {
        console.log(error);
    }
})

router.post("/AddTimeTable", upload.single('TimeTable'), async (req, res) => {
    try {
        let timeT
        console.log(" req.body:-----------------", req.body);
        const Timetable = req.file.filename
        const { Faculty_ID } = req.body
        if (['1', '2', '3', '4'].includes(Faculty_ID)) {

            const already = await YearTimeTables.find({ "year": Faculty_ID })
            console.log(already[0].TimeTable);
            if (already.length > 0) {
                fs.unlink(`./upload"${already[0].TimeTable}`, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        return;
                    }
                    console.log('File deleted successfully.');
                });
                await YearTimeTables.deleteOne({ year: Faculty_ID })
            }
            timeT = new YearTimeTables({ year: Faculty_ID, TimeTable: Timetable })
        } else {
            const already = await TimeTableFacultys.find({ "Faculty_ID": Faculty_ID })
            if (already.length > 0) {
                fs.unlink(`./upload"${already[0].TimeTable}`, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        return;
                    }
                    console.log('File deleted successfully.');
                });
                await Faculty_ID.deleteOne({ year: Faculty_ID })
            }
            timeT = new TimeTableFacultys({ Faculty_ID: Faculty_ID, TimeTable: Timetable })
        }
        console.log("NewStudent:", timeT);
        timeT.save();
        res.redirect("/AddTimetable")
    } catch (error) {
        console.log(error);
    }
})


router.get("/Essentials", checkUserAuth, async (req, res) => {
    try {
        const user = req.user
        const UserType = req.UserType
        const TimeTableFaculty = await TimeTableFacultys.distinct('Faculty_ID');
        const YearTimeTable = await YearTimeTables.distinct('Faculty_ID');

        if (UserType !== 'Admin') {
            res.render("Forbihidden")
        }
        const allFaculty = await FacultyDetails.find();
        res.render("Portal_Essentials", { allFaculty, UserType, user, TimeTableFaculty, YearTimeTable })
    } catch (error) {
        console.log(error);
    }
})

router.get("/getEssentials", checkUserAuth, async (req, res) => {
    try {
        const user = req.user
        const UserType = req.UserType
        const Essentials = await Essential.find();
console.log("essentials:",Essentials);
        res.render("essentials", { Essentials})
    } catch (error) {
        console.log(error);
    }
})
router.post("/AddEssentials", upload.single('EssentialFile'), async (req, res) => {
    try {
        console.log(" req.body:-----------------", req.body);
        const EssentialFile = req.file.filename

        const { Essentialsname } = req.body

        const already = await Essential.find({ Essentialsname: Essentialsname })
        if (already.length > 0) {
            fs.unlink(`./upload"${already[0].filenames}`, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return;
                }
                console.log('File deleted successfully.');
            });
            await Essential.deleteOne({ Essentialsname: Essentialsname })
        }
        const finalEssentials = new Essential({ Essentialsname: Essentialsname, filenames: EssentialFile })
        console.log(finalEssentials);
        finalEssentials.save();
        res.redirect("/Essentials")
    } catch (error) {
        console.log(error);
    }
})




//===========export router=============
module.exports = router;