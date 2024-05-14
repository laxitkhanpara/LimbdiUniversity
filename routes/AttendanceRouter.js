const mongoose = require('mongoose');
const express = require('express')
const app = express();
require('dotenv').config();
const router = express.Router();
const { checkUserAuth } = require("../middleware/authMiddleware")
const { AdminUserauth, Students, Events } = require("../models/Auth")
const { StudentDetails } = require('../models/studentSchema')
const { Attendance } = require("../models/AttendanceSchema")


router.get("/MarkAttendance", checkUserAuth, async (req, res) => {
    try {
        const user = req.user
        const UserType = req.UserType
        if (UserType === 'Student') {
            res.render("Forbihidden")
        }
        const Attendances = await Attendance.find();
        const firstyear = await StudentDetails.find({ year: "1" })
        const secondyear = await StudentDetails.find({ year: "2" })
        const thirdyear = await StudentDetails.find({ year: "3" })
        const Fouryear = await StudentDetails.find({ year: "4" })

        // console.log("Attendance:-",Attendance)

        res.render("Portal_MarkAttendance", { firstyear, secondyear, thirdyear, Fouryear, UserType, user })
    } catch (error) {
        console.log(error);
    }
})

router.get("/AttendanceDetail", checkUserAuth, async (req, res) => {
    try {
        // const PermRole = await Permissions.find({ Role: req.user.Role });
        const user = req.user
        const UserType = req.UserType
        const allAttendance = await Attendance.find()
        const firstyear = await Attendance.find({ year: "1" })
        const secondyear = await Attendance.find({ year: "2" })
        const thirdyear = await Attendance.find({ year: "3" })
        const Fouryear = await Attendance.find({ year: "4" })

        const presentStudentsCount = await Attendance.aggregate([
            {
                $unwind: '$students' // Unwind the students array
            },
            {
                $match: {
                    'students.status': 'present' // Match only the students with 'present' status
                }
            },
            {
                $group: {
                    _id: '$students.studentId', // Group by studentId
                    count: { $sum: 1 } // Count the occurrences of each studentId
                }
            },
            {
                $group: {
                    _id: null, // Group all results together
                    totalPresentStudents: { $sum: 1 } // Sum the counts of all students
                }
            }
        ]);
        const totalAttendanceCount = await Attendance.aggregate([
            {
                $unwind: '$students' // Unwind the students array
            },
            {
                $group: {
                    _id: null, // Group all documents together
                    totalAttendance: { $sum: 1 } // Count the total number of attendance records
                }
            }
        ]);

        const totalAttendanceCounts = totalAttendanceCount.length > 0 ? totalAttendanceCount[0].totalAttendance : 0
        console.log("totalAttendanceCounts:", totalAttendanceCounts);
        const totalAttendanceByStudent = await Attendance.aggregate([
            {
                $unwind: '$students' // Unwind the students array
            },
            {
                $group: {
                    _id: '$students.studentId', // Group by studentId
                    totalAttendance: { $sum: 1 } // Count the occurrences of each studentId
                }
            }
        ]);

        console.log("Total attendance marked for each student:", totalAttendanceByStudent);

        const totalPresent = presentStudentsCount.length > 0 ? presentStudentsCount[0].totalPresentStudents : 0
        yearpresent = (totalPresent / totalAttendanceCounts) * 100

        //for perticuler day
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set hours to beginning of the day

        const todaypresent1 = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }, // Match today's date
                    year: '1' // Match year 1
                }
            },
            {
                $unwind: "$students" // Unwind the students array
            },
            {
                $match: {
                    "students.status": "present" // Match students with status present
                }
            },
            {
                $group: {
                    _id: null, // Group all documents
                    count: { $sum: 1 } // Count the number of documents
                }
            }
        ]);
        const todaypresent2 = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }, // Match today's date
                    year: '2' // Match year 1
                }
            },
            {
                $unwind: "$students" // Unwind the students array
            },
            {
                $match: {
                    "students.status": "present" // Match students with status present
                }
            },
            {
                $group: {
                    _id: null, // Group all documents
                    count: { $sum: 1 } // Count the number of documents
                }
            }
        ]);
        const todaypresent3 = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }, // Match today's date
                    year: '3' // Match year 1
                }
            },
            {
                $unwind: "$students" // Unwind the students array
            },
            {
                $match: {
                    "students.status": "present" // Match students with status present
                }
            },
            {
                $group: {
                    _id: null, // Group all documents
                    count: { $sum: 1 } // Count the number of documents
                }
            }
        ]);
        const todaypresent4 = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }, // Match today's date
                    year: '4' // Match year 1
                }
            },
            {
                $unwind: "$students" // Unwind the students array
            },
            {
                $match: {
                    "students.status": "present" // Match students with status present
                }
            },
            {
                $group: {
                    _id: null, // Group all documents
                    count: { $sum: 1 } // Count the number of documents
                }
            }
        ]);

        console.log("today:", today);
        console.log("todaypresent1:", todaypresent2);
        const pipeline = [
            {
              $unwind: '$students'
            },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                presentCount: {
                  $sum: {
                    $cond: [{ $eq: ['$students.status', 'present'] }, 1, 0]
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                presentPercentage: {
                  $multiply: [{ $divide: ['$presentCount', '$total'] }, 100]
                }
              }
            }
          ];
      
          const result = await Attendance.aggregate(pipeline);
          console.log('Present Percentage:', result[0].presentPercentage);
        if (UserType === 'Admin' || UserType === 'Faculty') {
            res.render("Portal_AttendanceDetail", { firstyear, secondyear, thirdyear, Fouryear, UserType, user, yearpresent, totalPresent, totalAttendanceByStudent, todaypresent1, todaypresent2, todaypresent3, todaypresent4,result })
        } else {
            res.render("Forbihidden")
        }
    } catch (error) {
        console.log(error);
    }
})



router.get("/MyAttendanceDetail", checkUserAuth, async (req, res) => {
    try {
        if (UserType === "Admin") {

            res.render('Forbihidden')
        }
        // const PermRole = await Permissions.find({ Role: req.user.Role });
        const user = req.user
        const UserType = req.UserType
        const userid = new mongoose.Types.ObjectId(user.id);
        const currentDate = new Date(); // Get current date
        const attendanceCountByStatus = await Attendance.aggregate([
            {
                $unwind: '$students' // Unwind the students array
            },
            {
                $match: {
                    'students.studentId': userid // Match the specific studentId
                }
            },
            {
                $group: {
                    _id: '$students.status', // Group by status
                    count: { $sum: 1 } // Count the occurrences of each status
                }
            }
        ]);

        let presentCount = 0;
        let absentCount = 0;

        attendanceCountByStatus.forEach(statusCount => {
            if (statusCount._id === 'present') {
                presentCount = statusCount.count;
            } else if (statusCount._id === 'absent') {
                absentCount = statusCount.count;
            }
        });

        console.log("Present count for student with ID", userid, ":", presentCount);
        console.log("Absent count for student with ID", userid, ":", absentCount);

        const attendanceDetails = await Attendance.aggregate([
            {
                $unwind: '$students' // Unwind the students array
            },
            {
                $match: {
                    'students.studentId': userid, // Match the specific studentId
                    'year': user.year
                }
            },
            {
                $project: {
                    _id: 0,
                    date: 1,
                    status: '$students.status'
                }
            }
        ]);

        const presentDates = [];
        const absentDates = [];

        attendanceDetails.forEach(attendance => {
            if (attendance.status === 'present') {
                presentDates.push({ date: attendance.date, status: attendance.status });
            } else if (attendance.status === 'absent') {
                absentDates.push({ date: attendance.date, status: attendance.status });
            }
        });
        console.log("attendanceDetails:--", attendanceDetails);
        console.log("Present dates for student with ID", userid, ":", presentDates);
        console.log("Absent dates for student with ID", userid, ":", absentDates);

        res.render("Portal_MyAttendanceDetail", { presentDates, absentDates, absentCount, presentCount, UserType, user })
    } catch (error) {
        console.log(error);
    }
})



// Add Attendance------------------------------------------------------------------------------
router.post('/addattendance', async (req, res) => {
    try {
        console.log(req.body);
        const { year, student_id } = req.body;
        const statusFields = Object.keys(req.body).filter(key => key.startsWith('status_'));

        const currentDate = new Date();
        const currentDateOnly = new Date(currentDate.toISOString().split('T')[0]);

        const attendanceData = await Attendance.aggregate([
            {
                $match: {
                    date: {
                        $gte: currentDateOnly,
                        $lt: new Date(currentDateOnly.getTime() + 24 * 60 * 60 * 1000)
                    },
                    year: year
                }
            }
        ]);

        console.log("attendanceData:--", attendanceData.length);

        if (attendanceData.length < 1) {
            const studentsAttendance = student_id.map(id => {
                const statusKey = `status_${id}`;
                return {
                    studentId: id,
                    status: req.body[statusKey].includes('on') ? 'present' : 'absent'
                };
            });

            const attendance = new Attendance({
                year,
                date: currentDateOnly,
                students: studentsAttendance
            });

            console.log("*****", attendance, "*******");
            await attendance.save();
            res.redirect('/AttendanceDetail');
        } else {
            res.json({ Message: 'Today attendance is done' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// Get the attendance of prticuler day ------------------------------------------------------------------------------
router.post('/GetDayAttendance', async (req, res) => {
    try {
        console.log(req.body);
        const { year, date } = req.body;
        const daydate = new Date(date);
        const user = req.user
        const UserType = req.UserType

        // Find all attendance data for the specified date and year
        const attendanceData = await Attendance.aggregate([
            {
                $match: {
                    date: {
                        $gte: daydate, // Greater than or equal to the start of the specified date
                        $lt: new Date(daydate.getTime() + 24 * 60 * 60 * 1000) // Less than the start of the next date
                    },
                    year: year
                }
            },
            {
                $unwind: '$students' // Unwind the students array
            },
            {
                $lookup: {
                    from: 'studentdetails', // Name of the StudentDetails collection
                    localField: 'students.studentId',
                    foreignField: '_id',
                    as: 'studentDetails'
                }
            },
            {
                $unwind: '$studentDetails' // Unwind the studentDetails array
            },
            {
                $project: {
                    _id: '$studentDetails._id',
                    Student_ID: '$studentDetails.Student_ID',
                    FirstName: '$studentDetails.FirstName',
                    MiddelName: '$studentDetails.MiddelName',
                    LastName: '$studentDetails.LastName',
                    Email: '$studentDetails.Email',
                    Mobile_Number: '$studentDetails.Mobile_Number',
                    Gender: '$studentDetails.Gender',
                    Student_Image: '$studentDetails.Student_Image',
                    status: '$students.status' // Include the status from Attendance
                }
            }
        ]);

        console.log("attendanceData:--", attendanceData);

        if (attendanceData.length > 0) {
            // Assuming you have a view named 'Portal_DateAttendance.ejs'
            res.render('Portal_DateAttendance.ejs', { attendanceData, daydate, year, UserType, user });
        } else {
            res.json({ Message: `${date} Attendance not marked` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/DeleteAttendance', async (req, res) => {
    try {
        const { year } = req.query
        console.log("year:",req.query);
        const yeardelete = await Attendance.deleteMany({ year: year })
        console.log("yeardelete:",yeardelete);
        res.redirect('/AttendanceDetail')
    } catch (error) {
        console.log(error);
    }
})


//===========export router=============
module.exports = router;