const connectDB = require('./config/connectDB');
require('dotenv').config();
const app = require('app');

const PORT = process.env.PORT || 8000;
 
const startServer = async () =>{
    await connectDB()
    return app.listen(PORT,()=>console.log(`listening on port: ${PORT}`));
}

startServer();