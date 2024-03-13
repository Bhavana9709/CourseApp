var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012 },
    { name: 'Tux', organization: "Linux", birth_year: 1996 },
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013 }
  ];
  var tagline = "No programming concept is complete without a cute animal mascot.";

  res.render('pages/index', {
    mascots: mascots,
    tagline: tagline
  });
  // res.render('index', { title: 'Express' });

  const { MongoClient } = require('mongodb');
  // or as an es module:
  // import { MongoClient } from 'mongodb'

  // Connection URL
  const url = 'mongodb://localhost:27017';
  const client = new MongoClient(url);

  // Database Name
  const dbName = 'test';

  async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('users');

    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);
    // the following code examples can be pasted here...

    return 'done.';
  }

  main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
});

router.get('/about', function (req, res, next) {
  res.render('pages/about');
});

router.get('/create', function (req, res, next) {
  res.render('pages/create');
});

router.get('/delete', function (req, res, next) {
  res.render('pages/delete');
});

router.get('/update', function (req, res, next) {
  res.render('pages/update');
});

module.exports = router;
