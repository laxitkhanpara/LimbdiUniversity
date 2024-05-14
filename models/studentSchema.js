const mongoose = require('mongoose');




const StudentDetail = new mongoose.Schema(
    //{ Student_ID, FirstName, MiddelName,year, LastName, DOB, Gender, Nationality, Address, Email, Mobile_Number, Student_Image, Emergency_Cont_Name, Relationship_Student, Contact_Phone_Number, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Scholarships,Guardian_Names, Guardian_Contact, Additional_Notes } 
    {
        //Personal Information:
        Student_ID: {
            type: String,
            required: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
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
        DOB: {
            type: Date,
            required: true,
        },
        Gender: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        passout_year: {
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
        Student_Image: {
            type: String,
            required: true,
        },

        //Emergency  Information:
        Emergency_Cont_Name: {
            type: String,
            default:"NA"
            
        },
        Relationship_Student: {
            type: String,
            default:"NA"
        },
        Contact_Phone_Number: {
            type: String,
            default:"NA"
        },

        //Medical Information
        Allergies: {
            type: String,
            default:"NA"
        },
        Chronic_Conditions: {
            type: String,
            default:"NA"
        },
        Medications: {
            type: String,
            default:"NA"
        },

        //Achievements
        Awards: {
            type: String,
             default:"NA"
        },
        Certifications: {
            type: String,
            default:"NA"
        },
        Scholarships: {
            type: String,
            default:"NA"
        },

        //Family Information
        Guardian_Names: {
            type: String,
            required: true,
        },
        Guardian_Contact: {
            type: String,
            required: true,
        },

        Additional_Notes: {
            type: String,
            default:"NA"
        },
            
    }
)

const StudentDetails =new  mongoose.model('StudentDetails', StudentDetail);

/*=============Export the model==============*/

module.exports={StudentDetails}