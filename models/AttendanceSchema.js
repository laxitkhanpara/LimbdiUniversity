const mongoose = require('mongoose');

//=============Authentication==================================================
const attendance = new mongoose.Schema(
    {
        date: { type: Date, default: Date.now },
        year: {
            type: String,
            required: true,
            index: true,
        },
        students: [
            {
                studentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'StudentDetails', // Reference to your Student model
                    required: true
                },
                status: {
                    type: String,
                    enum: ['present', 'absent'],
                    required: true
                }
            }
        ]
    }
)
const Attendance = new mongoose.model('Attendance', attendance);

module.exports = { Attendance }