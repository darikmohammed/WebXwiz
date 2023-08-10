const mongoose = require('mongoose');

const connectDb = async () => {
  const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  }
  try {
    console.log('Connecting MongooDB ...');
    const connect = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`Mongoose Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
    
  }
};

export default connectDb;