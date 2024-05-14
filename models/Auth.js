const mongoose = require('mongoose');

//=============Authentication==================================================
const AdminUser = new mongoose.Schema(
    {
        UserName: {
            type: String,
            required: true,
            index: true,
        },
        Password: {
            type: String,
            required: true,
            index: true,
        },     
    }
)
const AdminUserauth =new  mongoose.model('AdminUserauth', AdminUser);


const Blog = new mongoose.Schema(
    {
        BlogImage: {
            type: String,
            required: true,
            index: true,
        },
        BlogTitle: {
            type: String,
            required: true,
            index: true,
        },  
        BlogContent: {
            type: String,
            required: true,
            index: true,
        },    
    }
)
const Blogs =new  mongoose.model('Blogs', Blog);

const Event = new mongoose.Schema(
    {
        EventImage: {
            type: String,
            required: true,
            index: true,
        },
        EventTitle: {
            type: String,
            required: true,
            index: true,
        },
        EventContent: {
            type: String,
            required: true,
            index: true,
        }, 
        EventDate: {
            type: String,
            required: true,
            index: true,
        },    
    }
)
const Events =new  mongoose.model('Events', Event);

/*=============Export the model==============*/

module.exports={AdminUserauth,Blogs,Events}