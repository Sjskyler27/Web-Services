const database = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId; // this helps with getting the id

const getAll = async (req, res) => {
  const db = await database.connectDatabase();
  const result = await db.collection('contacts').find().toArray();
  console.log(result);
  res.send(result);
};

const get = async (req, res) => {
  const db = await database.connectDatabase();
  const id = req.params.id;
  const isValidId = /^[0-9a-fA-F]{24}$/.test(id); // check if id is a valid 24-character hex string
  if (!isValidId) {
    res.status(400).send('Invalid contact ID');
    return;
  }
  else{
    console.log('valid ID');
  }

  // const query = { _id: id};
  //const result = await db.collection('contacts').findOne(query);
  const result = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
  console.log(result);
  res.send(result);
};

module.exports = {
    get,
    getAll
};