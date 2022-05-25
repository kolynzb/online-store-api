// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');

// const mongod = new MongoMemoryServer();
// class TestHelpers {
//   static async connectDb() {
//     const uri = await mongod.getUri();
//     const mongooseOpts = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       poolSize: 10,
//     };

//     await mongoose.connect(uri, mongooseOpts);
//   }

//   static async closeDb() {
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close();
//     await mongod.stop();
//   }

//   static async clearDb() {
//     const collections = mongoose.connection.collections;
//     for (let key in collections) {
//       let collection = collections[key];
//       await collection.deleteMany();
//     }
//   }

//   static startApp() {}
// }

// module.exports = TestHelpers;
