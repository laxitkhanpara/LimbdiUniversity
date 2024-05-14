const mongoose = require('mongoose');




const TimeTableFaculty = new mongoose.Schema(

    {

        Faculty_ID: {
            type: String,
            required: true,
            index: true,
        },
        TimeTable: {
            type: String,
            required: true,
            index: true,
        },       
    }
)

const TimeTableFacultys =new  mongoose.model('TimeTableFacultys', TimeTableFaculty);

const YearTimeTable = new mongoose.Schema(

    {

        year: {
            type: String,
            required: true,
            index: true,
        },
        TimeTable: {
            type: String,
            required: true,
            index: true,
        },       
    }
)

const YearTimeTables =new  mongoose.model('YearTimeTables', YearTimeTable);

const Essentials = new mongoose.Schema(

    {

        Essentialsname: {
            type: String,
            required: true,
        },
        filenames: {
            type: String,
            required: true,
        },
        
    }
)

const Essential =new  mongoose.model('Essential', Essentials);

/*=============Export the model==============*/

module.exports={TimeTableFacultys,YearTimeTables,Essential}