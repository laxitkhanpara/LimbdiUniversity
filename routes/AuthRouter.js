const express = require('express')
const app = express();
require('dotenv').config();
const router = express.Router();

const { AdminUserauth, Blogs, Events } = require("../models/Auth")
const { FacultyDetails } = require('../models/feacultySchema')
const { StudentDetails } = require('../models/studentSchema')

const bcrypt = require('bcrypt');
const { checkUserAuth } = require("../middleware/authMiddleware")
const { genrateTocken } = require('../middleware/jwtToken');
const multer = require('multer');
const path = require('path');
const { log } = require('util');
const nodemailer = require("nodemailer");

//================Certificate upload===============================

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

//signin
router.get("/", async (req, res) => {
    try {
        res.render("index")
    } catch (error) {
        console.log(error);
    }
})
router.get("/LogIn", async (req, res) => {
    try {
        res.render("authentication-login")
    } catch (error) {
        console.log(error);
    }
})

router.post("/singIn", async (req, res) => {
    try {
        const { UserName, Password, UserType } = req.body;
        if (UserType == "Admin") {
            const findUser = await AdminUserauth.findOne({ UserName });
            if (!findUser) {
                res.json({
                    msg: "Not Granted"
                })
            } else {
                const hash = await bcrypt.compare(Password, findUser.Password);
                if (hash === true) {
                    //genrate the tocken and store in cookie
                    const token = genrateTocken(findUser.id, UserType);
                    res.cookie('singIn', token, process.env.JWT_SECRET, {
                        expires: new Date(Date.now() + 50000),
                        httpOnly: true,
                    })
                    res.redirect("/Dashboard")
                } else {
                    res.json({
                        msg: "UserName or Password may be wrong",
                    })
                }
            }
            
        } else if (UserType == "Student") {
            const findUser = await StudentDetails.findOne({ Student_ID: UserName, password: Password });
            if (findUser) {
                const token = genrateTocken(findUser.id, UserType);
                res.cookie('singIn', token, process.env.JWT_SECRET, {
                    expires: new Date(Date.now() + 50000),
                    httpOnly: true,
                })
                res.redirect("/Dashboard")
            } else {
                res.json({
                    msg: "Wrong Credantiol"
                })
            }
        } else {
            const findUser = await FacultyDetails.findOne({ Faculty_ID: UserName, password: Password });
            if (findUser) {
                const token = genrateTocken(findUser.id, UserType);
                res.cookie('singIn', token, process.env.JWT_SECRET, {
                    expires: new Date(Date.now() + 50000),
                    httpOnly: true,
                })
                res.redirect("/Dashboard")
            } else {
                res.json({
                    msg: "Wrong Credantiol"
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
})


//=========logOut=====================
router.get('/logOut', async (req, res) => {
    try {
        res.clearCookie("singIn");
        console.log("logout successfully");
        res.redirect("/LogIn")
    } catch (error) {
        res.status(500).send(error)
    }
})

/*---------------------------------------------------------------------------------------------------------------------
    Blog
---------------------------------------------------------------------------------------------------------------------*/
{
    router.get("/Blog", async (req, res) => {
        try {
            // const PermRole = await Permissions.find({ Role: req.user.Role });
            const allBlogs = await Blogs.find();
            
            console.log(98765432);
            res.render("blog-single", { allBlogs })
        } catch (error) {
            console.log(error);
        }
    })
    router.get("/AddBlog", checkUserAuth, async (req, res) => {
        try {
            // const PermRole = await Permissions.find({ Role: req.user.Role });
            const allBlogs = await Blogs.find();
            const allEvent = await Events.find();
            const user=req.user
            const UserType=req.UserType

            res.render("Portal_Blog", { allBlogs,UserType,user,allEvent })
        } catch (error) {
            console.log(error);
        }
    })

    //------------new 
    router.post("/Blog", upload.single('BlogImage'), async (req, res) => {
        try {
            console.log("filename:-------------", req.filr);
            const BlogImage = req.file.filename
            const { BlogTitle, BlogContent } = req.body

            const NewBlog = new Blogs({ BlogImage, BlogTitle, BlogContent })
            console.log("NewBlog: ", NewBlog);
            NewBlog.save();
            res.render("/blog-single")
        } catch (error) {
            console.log(error);
        }
    })

    router.post('/Blogdelete/:id', async (req, res) => {
        try {
            await Blogs.findByIdAndDelete(req.params.id)
            res.redirect('/AddBlog')
        } catch (error) {
            console.log(error);
        }
    })
    router.post('/eventdelete/:id', async (req, res) => {
        try {
            await Events.findByIdAndDelete(req.params.id)
            res.redirect('/AddBlog')
        } catch (error) {
            console.log(error);
        }
    })
}

/*---------------------------------------------------------------------------------------------------------------------
    event
---------------------------------------------------------------------------------------------------------------------*/
{
    router.get("/Event", async (req, res) => {
        try {
            // const PermRole = await Permissions.find({ Role: req.user.Role });
            const allEvents = await Events.find();
            res.render("events", { allEvents })
        } catch (error) {
            console.log(error);
        }
    })

    //------------new 
    router.post("/Event", upload.single('EventImage'), async (req, res) => {
        try {
            console.log("filename:-------------", req.filr);
            const EventImage = req.file.filename
            const { EventTitle, EventContent, EventDate } = req.body


            const NewEvent = new Events({ EventImage, EventTitle, EventContent, EventDate })
            console.log("NewEvent:- ", NewEvent);
            NewEvent.save();
            res.render("/events")
        } catch (error) {
            console.log(error);
        }
    })
}

router.get("/about", async (req, res) => {
    try {
        res.render("about")
    } catch (error) {
        console.log(error);
    }
})

//-------contact
router.get("/Contact", async (req, res) => {
    try {
        res.render("contact")
    } catch (error) {
        console.log(error);
    }
})
router.post("/sendMail", upload.single('EventImage'), async (req, res) => {
    try {
        console.log(1234567890000987654321);
        const { message, subject, email, name } = req.body
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.UserEmail,
                pass: process.env.UserPass
            }
        });
        const mailoptions = {
            from: {
                address: email,
                name: name
            }, // sender address
            to: process.env.UserEmail, // list of receivers
            subject: subject, // Subject line
            text: message, // plain text body
        };
        transporter.sendMail(mailoptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("email sent: ", info.res);
            }
        })


    } catch (error) {
        console.log(error);
    }
})

// all get pages
router.get("/CM", async (req, res) => {
    try {
        res.render("CM")
    } catch (error) {
        console.log(error);
    }
})
router.get("/event", async (req, res) => {
    try {
        res.render("event")
    } catch (error) {
        console.log(error);
    }
})

router.get("/gallery", async (req, res) => {
    try {
        res.render("gallery")
    } catch (error) {
        console.log(error);
    }
})

router.get("/course-details", async (req, res) => {
    try {
        res.render("course-details")
    } catch (error) {
        console.log(error);
    }
})
router.get("/courses", async (req, res) => {
    try {
        res.render("courses")
    } catch (error) {
        console.log(error);
    }
})
router.get("/FMT", async (req, res) => {
    try {
        res.render("FMT")
    } catch (error) {
        console.log(error);
    }
})
router.get("/HOMOEOPATHIC MATERIA MEDICA", async (req, res) => {
    try {
        res.render("HOMOEOPATHIC MATERIA MEDICA")
    } catch (error) {
        console.log(error);
    }
})
router.get("/HOMOEOPATHIC PHARMACY", async (req, res) => {
    try {
        res.render("HOMOEOPATHIC PHARMACY")
    } catch (error) {
        console.log(error);
    }
})
router.get("/hospital", async (req, res) => {
    try {
        res.render("hospital")
    } catch (error) {
        console.log(error);
    }
})
router.get("/Human-Anatomy", async (req, res) => {
    try {
        res.render("Human-Anatomy")
    } catch (error) {
        console.log(error);
    }
})
router.get("/OBGYN", async (req, res) => {
    try {
        res.render("OBGYN")
    } catch (error) {
        console.log(error);
    }
})
router.get("/Organon", async (req, res) => {
    try {
        res.render("Organon")
    } catch (error) {
        console.log(error);
    }
})
router.get("/Pathology", async (req, res) => {
    try {
        res.render("Pathology")
    } catch (error) {
        console.log(error);
    }
})
router.get("/Physiology", async (req, res) => {
    try {
        res.render("Physiology")
    } catch (error) {
        console.log(error);
    }
})
router.get("/Practice of Medicine", async (req, res) => {
    try {
        res.render("Practice of Medicine")
    } catch (error) {
        console.log(error);
    }
})
router.get("/Repertory", async (req, res) => {
    try {
        res.render("Repertory")
    } catch (error) {
        console.log(error);
    }
})
router.get("/Surgery", async (req, res) => {
    try {
        res.render("Surgery")
    } catch (error) {
        console.log(error);
    }
})

router.get('/nontech',async(req,res)=>{
    try{
        res.render('nontech')
    }catch (error) {
        console.log(error);
    }
}),
router.get('/Ayur',async(req,res)=>{
    try{
        res.render('LimbdiAyurvedicCollege')
    }catch (error) {
        console.log(error);
    }
}),
router.get('/nurse',async(req,res)=>{
    try{
        res.render('LimbdiNursingCollege')
    }catch (error) {
        console.log(error);
    }
}),

//===========export router=============
module.exports = router;