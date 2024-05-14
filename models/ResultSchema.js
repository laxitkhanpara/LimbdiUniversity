const mongoose = require('mongoose');




const RsultDetail = new mongoose.Schema(
    //{ Student_ID, FirstName, MiddelName,year, LastName, DOB, Gender, Nationality, Address, Email, Mobile_Number, Student_Image, Emergency_Cont_Name, Relationship_Student, Contact_Phone_Number, Allergies, Chronic_Conditions, Medications, Awards, Certifications, Scholarships,Guardian_Names, Guardian_Contact, Additional_Notes } 
    {
        //Personal Information:
        Student_ID: {
            type: String,
            required: true,
            index: true,
        },
        Result: {
            type: String,
            required: true,
            index: true,
        },
     
            
    }
)

const RsultDetails =new  mongoose.model('RsultDetails', RsultDetail);

/*=============Export the model==============*/

module.exports={RsultDetails}