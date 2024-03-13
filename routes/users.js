
var fetch = require('node-fetch');
var express = require('express');
var userrouter = express.Router();

/* GET users listing. */
const path = require("path")
const multer = require("multer");
const userdetails = require('../model/userdetails');
const countries = require('../model/countries');


userrouter.route('/newuser').get(async function (req, res) {
  const user = new userdetails(req.body);
  // console.log(req.body);

  // const save = await user.save();
  // console.log(save);

  let error = user.validateSync();
  if (error) {
    res.status(500).send(error.errors);
  }
  user.save({}, (err, data) => {
    console.log(err, data);

    if (err) {
      res.status(500).send(err);
    }
    else {
      res.status(200).send("successfully registered!!");
    }

  });
  console.log("before save");

});

userrouter.route('/deleteuser').get(async function (req, res) {
  const user = new userdetails(req.body);
  // console.log(await userdetails.langauge.find({ name: user.langauge.name }));
  // if (error) {
  //   res.status(500).send(error.errors);
  // }
  console.log(await userdetails.find({ username: user.username }));

  const data = await userdetails.find({ username: user.username })
  if (data.length) {
    console.log(data);
    userdetails.find({ username: user.username }).deleteOne().exec();
    res.status(200).send("successfully deleted!!");
  }
  else {
    res.status(404).send("No user found!!");
  }
  // user.remove({ "username": req.body.username }, (err, data) => {
  //   // console.log(err, data);

  //   if (err) {
  //     res.status(500).send(err);
  //   }
  //   else {
  //     res.status(200).send("successfully deleted!!");
  //   }

  // });
})

userrouter.route('/updateuser').get(async function (req, res) {
  const user = new userdetails(req.body);

  // userdetails.find({ username: user.username }).updateOne().exec();
  const data = await userdetails.find({ username: user.username })
  if (data.length) {
    // console.log(data);
    await userdetails.updateOne({ username: user.username }, req.body);
    console.log(await userdetails.find({ username: user.username }));
    res.status(200).send("successfully updated!!");
  }
  else {
    res.status(404).send("No user found!!");
  }

})

userrouter.route('/getcountries').get(async function (req, res) {
  fetch('http://localhost:5000/users/getcountries')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      res.send({ data });
    })
    .catch(err => {
      res.send(err);
    });

  // fetch('http://localhost:5000/users/getcountries', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     id: '<%= country_id%>',
  //     name: '<%= name %>'
  //   })
  //     .then(res => res.json())
  // });
  // const ct = new countries(req.body);
  // console.log(await countries.find({ country_id: req.body.country_id }));
});
module.exports = userrouter;