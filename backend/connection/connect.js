const mongoose=require('mongoose');
require('dotenv').config();
exports.mongoDBConnection=(db_name)=>{

   const url=`mongodb+srv://deep242jashan:root@jashandeep.ezr14.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Jashandeep`
    console.log(url)
    mongoose.connect(url).then(()=>{
        console.log("Connection succesfully")
    })
    .catch((err) => {
        console.log("Error connecting to mongoDB",err)
    })
}