const mongoose = require('mongoose');

const uri = 'mongodb://inghadge4_db_user:q2nQXEISLcE0SZIZ@ac-4xyhiir-shard-00-00.qubdgij.mongodb.net:27017,ac-4xyhiir-shard-00-01.qubdgij.mongodb.net:27017,ac-4xyhiir-shard-00-02.qubdgij.mongodb.net:27017/debales?ssl=true&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Failed:', err.message);
    process.exit(1);
  });