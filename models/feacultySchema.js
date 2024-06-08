const mongoose = require('mongoose');

const FacultyDetail = new mongoose.Schema(
    {
        //Personal Information:
        Faculty_ID: {
            type: String,
            required: true,
            index: true,
        },
        FirstName: {
            type: String,
            required: true,
        },
        MiddelName: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        DOB: {
            type: Date,
            required: true,
        },
        Gender: {
            type: String,
            required: true,
        },
        Nationality: {
            type: String,
            required: true,
        },
        Address: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            required: true,
        },
        Mobile_Number: {
            type: String,
            required: true,
        },
        Faculty_Image: {
            type: String,
            required: true,
        },

        //Emergency  Information:
        Emergency_Cont_Name: {
            type: String,
            required: true,
        },
        Relationship_Faculty: {
            type: String,
            required: true,
        },
        Contact_Phone_Number: {
            type: String,
            required: true,
        },

        // Professional Information
        Subject_Area:{
            type:String,
            default:"NA"
        },
        Educational_Qualifications :{
            type:String,
            default:"NA"
        },
       


        //Medical Information
        Allergies: {
            type: String,
            required: true,
        },
        Chronic_Conditions: {
            type: String,
            required: true,
        },
        Medications: {
            type: String,
            required: true,
        },

        //Achievements
        Awards: {
            type: String,
            required: true,
        },
        Certifications: {
            type: String,
            required: true,
        },

        Additional_Notes: {
            type: String,
            required: true,
        },
            
    }
)

const FacultyDetails =new  mongoose.model('FacultyDetails', FacultyDetail);

/*=============Export the model==============*/

module.exports={FacultyDetails}