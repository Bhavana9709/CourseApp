const express = require('express');
const multer = require("multer");
const path = require("path");
const maxSize = 1 * 1000 * 1000;
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var bcrypt = require("bcrypt");
var fetch = require('node-fetch');
var jquery = require('jquery');
const { send_email_message } = require('../middleware/email_controller');
const { verify_token } = require('../middleware/verifytoken');
const { send_sms } = require('../middleware/send_sms');

const accountSid = "ACfbd3fba62e9032f19ba8e7cc4ea91cad";
const authToken = "e881b289b6022af98f77f08b42d6c2be";
const client = require('twilio')(accountSid, authToken);


let alert = require('alert');

var img = multer({ dest: 'uploads/' });
const mykey = "AKIA5WXTYYQQSTO4IAGH";
const mysecretkey = "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";
// import entire SDK
var AWS = require('aws-sdk');
// import AWS object without services
var AWS = require('aws-sdk/global');
// import individual service
var S3 = require('aws-sdk/clients/s3');

var jwt = require('jsonwebtoken');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname + "-" + Date.now() + ".jpg")
        cb(null, file.originalname)

    }
})

var async = require('async');
async function upload(file, res, req) {// Load the AWS SDK for Node.js
    var AWS = require('aws-sdk');
    // Set the region 
    AWS.config.update({ region: 'us-east-1' });

    // Create S3 service object
    var s3 = new AWS.S3({
        accessKeyId: 'AKIA5WXTYYQQSTO4IAGH',
        secretAccessKey: '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',
        apiVersion: '2006-03-01'

    });

    var uploadParams = { Bucket: 'uploadbucket1', Key: 'img.jpg', Body: '' };
    var file = file.originalname;
    console.log(file);

    var fs = require('fs');
    var fileStream = fs.createReadStream("uploads/" + file);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    var path = require('path');
    uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            res.send("upload success");
        }
    });

}

var img = multer({
    storage: storage
    // limits: { fileSize: maxSize },
    // fileFilter: function (req, file, cb) {

    //     // Set the filetypes, it is optional
    //     var filetypes = /jpeg|jpg|pdf|png/;
    //     var mimetype = filetypes.test(file.mimetype);

    //     var extname = filetypes.test(path.extname(
    //         file.originalname).toLowerCase());

    //     if (mimetype && extname) {
    //         return cb(null, true);
    //     }

    //     cb("Error: File upload only supports the "
    //         + "following filetypes - " + filetypes);
    // }
})
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');
const userdetails = require('../model/userdetails');
const courses = require('../model/courses');
const questionsmodel = require('../model/questions');

const { Console } = require('console');
const { record } = require('npmlog');


recordRoutes.route('/').get(async function (req, res) {
    res.render('pages/loginopt');
});

recordRoutes.route('/getfilesbutton').get(async function (req, res) {
    res.render('pages/getfilesbutton');
});

recordRoutes.route('/upload').get(async function (_req, res) {
    res.render('pages/upload', { message: _req.flash('message') });
});

recordRoutes.route('/uploaded').post(img.single("fileuploading"), async function (_req, res) {
    await upload(_req.file, res, _req);
});


async function getfiles(res) {
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3({
        accessKeyId: 'AKIA5WXTYYQQSTO4IAGH',
        secretAccessKey: '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',
        apiVersion: '2006-03-01'

    });

    var params = {
        Bucket: 'uploadbucket1',
        Delimiter: '/',
    }
    s3.listObjects(params, function (err, data) {
        if (err) {
            return 'There was an error viewing your album: ' + err.message
        } else {
            arr = Array();
            data.Contents.forEach(function (obj, index) {
                arr.push(arr, obj.Key);
                console.log(obj.Key)
            })
            res.render('pages/getallfiles', { data: arr })

        }
    });
}
recordRoutes.route('/getallfiles').get(async function (req, res) {
    await getfiles(res);

});

recordRoutes.route('/viewfile/filename/:file').get(async function (req, res) {
    // res.send(req.params.file);
    var fs = require('fs');
    var s1 = "uploads/";
    var s2 = "'";
    var name = s1.concat(req.params.file);
    // var name = name.concat(s2);

    console.log(name);
    fs.readFile(name, function (err, data) {
        if (err) throw err; // Fail if the file can't be read.
        // res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(data); // Send the file data to the browser.
    });

});

recordRoutes.route('/deletefile/filename/:folder/:file').get(async function (req, res) {
    var AWS = require('aws-sdk');
    AWS.config.update({ region: 'us-east-1' });

    var name = "'" + req.params.file + "'";
    // console.log(name);
    var s3 = new AWS.S3({
        accessKeyId: 'AKIA5WXTYYQQSTO4IAGH',
        secretAccessKey: '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',
        apiVersion: '2006-03-01'

    });

    var deleteparams = {
        Bucket: 'uploadbucket1' + '/' + req.params.folder,
        Key: req.params.file
    }
    // res.attachment(req.params.file);
    s3.deleteObject(deleteparams, function (err, data) {
        if (err) console.log(err, err.stack);  // error
        else {
            console.log("deleted");
            var c = 1;
        }               // deleted
    });
    const fs = require('fs')

    const path = 'uploads/' + req.params.file;

    try {
        fs.unlinkSync(path)
        //file removed
    } catch (err) {
        console.error(err)
    }
    alert("Deleted successfully!!");
    res.redirect('http://localhost:3000/record/addcoursecontent/' + req.params.folder);
});


recordRoutes.route('/downloadfile/filename/:file').get(async function (req, res) {
    const http = require('http'); // or 'https' for https:// URLs
    const fs = require('fs');
    // console.log(file);
    // res.attachment(req.params.file);
    // const file = fs.createWriteStream(req.params.file);
    // console.log(file);

    // const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function (response) {
    //     response.pipe(file);

    //     // after download completed close filestream
    //     file.on("finish", () => {
    //         file.close();
    //         console.log("Download Completed");
    //     });
    // var params = { Bucket: 'uploadbucket1', Key: 'key' };
    // var url = s3.getSignedUrl('getObject', params);
    // console.log('The URL is', url);
    // var AWS = require('aws-sdk');

    var key = "'" + req.params.file + "'";
    var s3 = new AWS.S3({
        accessKeyId: 'AKIA5WXTYYQQSTO4IAGH',
        secretAccessKey: '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',
        apiVersion: '2006-03-01'

    });

    var params = {
        Bucket: 'uploadbucket1',
        Key: req.params.file
    }
    const fileStream = s3.getObject(params).createReadStream();
    fileStream.pipe(res);
});

recordRoutes.route('/').get(async function (_req, res) {
    res.render('pages/login');
});


recordRoutes.route('/auth').post(async function (_req, res) {
    var token = jwt.sign({ username: 'admin', password: '123' }, 'secret_key');
    // console.log(token);
    // res.json({ "token": token, "username": _req.body.username });
    jwt.verify(_req.headers.token, 'secret_key', function (err, decoded) {
        if (decoded.username == _req.body.username && decoded.password == _req.body.password) {
            res.json({ "message": "login successfull!!", "token": _req.headers });
        }
        else {
            res.json({ "message": "unauthorised user!!" })
        }
    });
});



// This funtion is middleware. 
function verifyToken(req, res, next) {
    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;
            next();
        }
        else {
            res.send("Not logged-in")
        }
    }
    catch {
        res.send("something went wrong")
    }
}
// This section will help you get a list of all the records.
recordRoutes.route('/listings').get(async function (_req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('users')
        .find({})
        .limit(50)
        .toArray(function (err, result) {
            if (err) {
            } else {
                res.render('pages/index', { result });
            }
        });
});

recordRoutes.route('/create').get(async function (_req, res) {
    const dbConnect = dbo.getDb();
    fetch('http://localhost:5000/users/getcountries')
        .then(res => res.json())
        .then(data => {
            // res.json(data.length);
            arr = Array();
            for (var i = 0; i < data.length; i++) {
                data[i] = data[i]['name'];
            }

            console.log(data);
            res.render('pages/create', { data: data });
            //   res.send({ data });
        })
        .catch(err => {
            // res.send(err);
        });
});


recordRoutes.route('/states').get(async function (req, res) {
    res.send(req.body);
});

recordRoutes.route('/created').post(async function (_req, res) {
    const dbConnect = dbo.getDb();
    _req.body.password = bcrypt.hashSync(_req.body.password, 8);
    dbConnect
        .collection('users')
        .insertOne(_req.body, function (err, res) {
            if (err) throw err;
            else {
                // res.render("pages/create", { message: "created successfully" })
            }
            console.log("user added successfully!!");
        });
});

recordRoutes.route('/delete').get(async function (_req, res) {
    res.render('pages/delete');

});

recordRoutes.route('/deleted').post(async function (_req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('users')
        .deleteOne(_req.body, function (err, res) {
            if (err) throw err;
            else {
            }
            _req.flash('message', 'User deleted Succesfully!!');
            console.log("user deleted successfully!!");

        });

});

recordRoutes.route('/update').get(async function (_req, res) {
    res.render('pages/update');
});

recordRoutes.route('/updated').post(async function (_req, res) {
    var details = { username: _req.body.username, email: _req.body.email, password: _req.body.password }
    console.log(details);
    const dbConnect = dbo.getDb();
    let cnt = await dbConnect.collection('users').countDocuments({ username: _req.body.name });
    console.log(cnt);
    if (cnt > 0) {
        let result = await dbConnect.collection("users").updateOne({ username: _req.body.name }, { $set: { username: details.username, email: details.email, password: details.password } })
        console.log(result);
        console.log("user updated successfully!!");
        res.redirect('/record/update');
    }
    else {
        console.log("No user exist!!");
        res.redirect('/record/update');

    }


});

recordRoutes.route("/getdetails").get(async function (_req, res) {
    const myprop = new userdetails({ username: _req.query.username });
    console.log(myprop);
    const save = await myprop.save();
    // console.log(JSON.parse(_req.query.username));
    // const users = await userdetails.find({ "username": _req.query.username });
    // const users = await userdetails.find();
    // res.json(users);
    // res.status(200).send(JSON.parse(users));
    // res.render("record/index", await getData(_req.query.name));
});

recordRoutes.route('/add').get(async function (_req, res) {

    res.render('pages/add');

});

recordRoutes.route('/added').post(async function (_req, res) {
    const dbConnect = dbo.getDb();
    const myprop = new userdetails({ username: _req.body.username, email: _req.body.email, password: _req.body.password });
    console.log(myprop);
    await myprop.save();
    res.send("added successfully!");

});
function getData(req) {
    return new Promise((resolve, reject) => {
        const dbConnect = dbo.getDb();
        console.log(dbo);
        console.log(JSON.parse(req));
        console.log("testingg");

        dbConnect
            .collection('users')
            .find({ "username": JSON.parse(req) })
            .limit(50)
            .toArray(function (err, result) {
                if (err) {
                    reject(err);

                } else {
                    console.log(result);
                    resolve({ result });
                }
            });
    })
}


recordRoutes.route('/view').get(async function (_req, res) {
    const dbconn = dbo.getDb();
    let result = await dbconn.collection("users").find({}).toArray();
    res.render('pages/view', { data: result });

});

recordRoutes.route('/courses').get(async function (req, res) {
    if (req.session.userid) {
        console.log(req.session);
        res.render('pages/courses');
    }
    else {
        res.redirect('loginopt');
    }
});

recordRoutes.route('/registercourse').post(async function (req, res) {
    if (req.session.userid) {
        const user = new userdetails({ username: req.session.userid });
        const data = await userdetails.find({ username: user.username });
        console.log(data);
        var course = Array();
        if (data[0].course.length) {
            data[0].course.forEach(function (name) {
                course.push(name);
            });
        }
        course.push(Object.keys(req.body)[0]);

        if (data.length) {
            var f = 0;
            for (var i = 0; i < data[0].course.length; i++) {
                if (data[0].course[i] == Object.keys(req.body)[0]) {
                    var f = 1;
                    alert("you have already regitered for this course!!");
                    break;
                }
            }
            if (f == 0) {
                var newdata = {
                    "firstname": data[0].firstname,
                    "lastname": data[0].lastname,
                    "username": data[0].username,
                    "password": data[0].password,
                    "email": data[0].email,
                    "mobile": data[0].mobile,
                    "course": course,
                    "created_at": data[0].created_at
                }
                const coursedt = new courses({ name: Object.keys(req.body)[0] });
                console.log("course"+coursedt.name);
                const coursedata = await courses.find({ name: coursedt.name });
                console.log(coursedata);
                var new_coursedata = {
                    "course_id": coursedata[0].course_id,
                    "name": coursedata[0].name,
                    "students": coursedata[0].students + 1
                };
                await courses.updateOne({ name: Object.keys(req.body)[0] }, new_coursedata);
                await userdetails.updateOne({ username: user.username }, newdata);
                client.messages
                    .create({
                        body: "Hi " + newdata.firstname + "\nYou have successfully registered for " + Object.keys(req.body)[0] + " .\n\nGo check out the course and master your skill!!",
                        from: '+19794014861',
                        to: "+91" + newdata.mobile
                    })
                    .then(message => console.log(message));
                send_email_message(newdata.email, "Course registered", "Hi " + newdata.firstname + ",\n" + "You have successfully registered for " + Object.keys(req.body)[0] + " .\n\nGo check out the course and master your skill!!");
                alert("registerd!!");
            }
        }
    }

});

recordRoutes.route('/registered').post(async function (req, res) {
    var data = req.body;
    const user = new userdetails(req.body);
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
});

recordRoutes.route('/displaymsg').get(async function (req, res) {
    res.send(req.flash('message'));
})

recordRoutes.route('/studentlogin').get(async function (req, res) {
    res.render('course/studentlogin');
});

recordRoutes.route('/studentsignup').get(async function (req, res) {
    res.render('course/signup');
});

recordRoutes.route('/stuauth').post(async function (req, res) {
    const user = new userdetails(req.body);
    const data = await userdetails.find({ username: user.username })
    if (data.length) {
        console.log(data);
        console.log(user);
        const dt = await userdetails.find({ username: user.username, password: user.password });
        if (dt.length) {
            session = req.session;
            session.userid = req.body.username;
            console.log(req.session)
            // res.render('course/studenthome', { data: req.body });
            url = "studenthome/" + user.username;
            res.redirect(url);
        }
        else {
            alert("wrong password");
        }
    }
    else {
        alert("No user found!");
    }

});

recordRoutes.route('/studentprofile/:username').get(async function (req, res) {
    console.log(req.params.username);
    const user = new userdetails({ username: req.params.username });
    const data = await userdetails.find({ username: user.username })
    console.log(data[0].questions);
    res.render('course/studentprofile', { data: data[0] });
});

recordRoutes.route('/logout/:username').get(async function (req, res) {
    console.log("logged out");
    req.session.destroy();
    console.log(req.session);

    res.render("pages/loginopt");

});

recordRoutes.route('/studenthome/:username').get(async function (req, res) {
    console.log(req.params.username);
    var data = { "username": req.params.username };
    res.render('course/studenthome', { data: data });
})
recordRoutes.route('/stuedit/:username').get(async function (req, res) {
    console.log(req.params.username);
    const user = new userdetails({ username: req.params.username });
    const data = await userdetails.find({ username: user.username })
    console.log(typeof (JSON.parse(JSON.stringify(data[0]))));
    res.render('course/stuedit', { data: data[0] });
});

recordRoutes.route('/savechanges').post(async function (req, res) {
    const user = new userdetails(req.body);

    console.log(req);
    const data = await userdetails.find({ firstname: req.body.firstname })
    if (data.length) {
        await userdetails.updateOne({ firstname: user.firstname }, req.body);
        console.log(await userdetails.find({ username: user.username }));
        alert("Successfully Updated!  ");
        res.render('course/studenthome', { data: user });

    }
    else {
        res.status(404).send("No user found!!");
    }
});

recordRoutes.route('/adminlogin').get(async function (req, res) {
    res.render('course/adminlogin');
});

recordRoutes.route('/adminauth').post(async function (_req, res) {
    var token = jwt.sign({ username: 'admin', password: '123' }, 'secret_key');
    console.log(_req.body.username);
    // res.json({ "token": token, "username": _req.body.username });
    jwt.verify(token, 'secret_key', function (err, decoded) {
        if (_req.body.username == decoded.username && _req.body.password == decoded.password) {
            // res.json({ "message": "login successfull!!", "token": _req.headers });
            session = _req.session;
            session.userid = "admin";
            console.log(_req.session)
            // res.render('admin/home');
            url = "adminhome";
            res.redirect(url);
        }
        else {
            alert("Unauthorised user!!");
        }
    });
});



recordRoutes.route('/adminhome').get(async function (req, res) {
    res.render('admin/home');
})
recordRoutes.route('/studentcourses/:username').get(async function (req, res) {
    const user = new userdetails({ "username": req.params.username });
    const data = await userdetails.find({ username: user.username })
    console.log(typeof (JSON.parse(JSON.stringify(data[0]))));

    res.render('course/studentcourses', { data: data[0] });
});


async function getcontent(res, course, username) {
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3({
        accessKeyId: 'AKIA5WXTYYQQSTO4IAGH',
        secretAccessKey: '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',
        apiVersion: '2006-03-01'

    });
    const courses_questions = await courses.find({ name: course })
    const questions = await questionsmodel.find({ course: course });
    var params = {
        Bucket: 'uploadbucket1',
        Delimiter: '/',
        Prefix: course + '/'
    }
    s3.listObjects(params, function (err, data) {
        if (err) {
            return 'There was an error viewing your album: ' + err.message
        } else {
            arr = Array();
            arr.push(arr, username);
            console.log(course);
            data.Contents.forEach(function (obj, index) {
                // var myArray = obj.Key.split("/");
                arr.push(arr, obj.Key);
                console.log(obj.Key)
            })
            const coursedetails = { "name": course };
            console.log(coursedetails);
            console.log(arr);
            res.render('course/coursecontent', { data: arr, det: coursedetails, articles: questions })

        }
    });

}
recordRoutes.route('/viewcourse/:course/:username').get(async function (req, res) {
    if (req.session.userid) {
        console.log(req.session);
        await getcontent(res, req.params.course, req.params.username);
    }
    else {
        res.render('course/studentlogin');
    }
});

recordRoutes.route('/allstudents').get(async function (req, res) {
    if (req.session.userid == "admin") {
        console.log(req.session);
        userdetails.find({}, function (err, users) {
            var userMap = {};
            // res.send(users);
            users.forEach(function (user) {

                userMap[user._id] = user;
            });
            // res.send(userMap[0]['username']);
            res.render('admin/allstudents', { data: users });
        });
    }
    else {
        res.redirect('adminlogin');
    }

});


recordRoutes.route('/allcourses').get(async function (req, res) {
    if (req.session.userid == "admin") {
        console.log(req.session);
        courses.find({}, function (err, names) {
            var userMap = {};
            names.forEach(function (user) {
                userMap[user._id] = user;
            });
            console.log(names[0]['students']);
            res.render('admin/allcourses', { data: names });
        });
    }
    else {
        res.redirect('adminlogin');
    }

});

recordRoutes.route('/adminlogout').get(async function (req, res) {
    console.log("logged out");
    req.session.destroy();
    console.log(req.session);

    res.render("pages/loginopt");

});

recordRoutes.route('/loginopt').get(async function (req, res) {
    res.render('pages/loginopt');
})

recordRoutes.route('/sturegister').post(async function (req, res) {
    var data = req.body;
    const user = new userdetails(req.body);
    let error = user.validateSync();
    if (error) {
        res.status(500).send(error.errors);
    }
    user.save({}, (err, data) => {
        console.log(err, data);

        if (err) {
            // res.send(err.keyValue);
            alert(Object.keys(err.keyValue) + " already exists!!");
            // res.status(500).send(err);
        }
        else {
            // alert("successfully registered!!");
            send_email_message(user.email, "Signed up", "Hi " + user.firstname + " You have successfully registered!  Go check out the courses and start your journey");
            client.messages
                .create({
                    body: "Hi " + user.firstname + "\nYou have successfully registered!  Go check out the courses and start your journey",
                    from: '+19794014861',
                    to: "+91" + user.mobile
                })
                .then(message => console.log(message));

            // send_sms("+91" + user.mobile, "Hi " + user.firstname + "You have successfully registered!  Go check out the courses and start your journey")
            res.render('course/studentlogin');
        }

    });
});

async function getcoursecontent(res, course) {
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3({
        accessKeyId: 'AKIA5WXTYYQQSTO4IAGH',
        secretAccessKey: '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',
        apiVersion: '2006-03-01'

    });

    var params = {
        Bucket: 'uploadbucket1',
        Delimiter: '/',
        Prefix: course + '/'
    }
    s3.listObjects(params, function (err, data) {
        if (err) {
            return 'There was an error viewing your album: ' + err.message
        } else {
            arr = Array();
            data.Contents.forEach(function (obj, index) {
                arr.push(arr, obj.Key);
                console.log(obj.Key)
            })
            res.render('admin/addfiles', { data: arr });
        }
    });
}


async function adminupload(file, folder, res, req) {// Load the AWS SDK for Node.js
    var AWS = require('aws-sdk');
    // Set the region 
    AWS.config.update({ region: 'us-east-1' });

    // Create S3 service object
    var s3 = new AWS.S3({
        accessKeyId: 'AKIA5WXTYYQQSTO4IAGH',
        secretAccessKey: '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',
        apiVersion: '2006-03-01'

    });
    var filepath = folder + "/" + file.originalname;
    var uploadParams = { Bucket: 'uploadbucket1' + '/' + folder, Key: 'img.jpg', Body: '' };
    var file = file.originalname;
    console.log(file);

    var fs = require('fs');
    var fileStream = fs.createReadStream("uploads/" + file);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    var path = require('path');
    uploadParams.Key = path.basename(file);
    console.log(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            // res.send("upload success");
            // alert("File added successfully!!");
            res.redirect('http://localhost:3000/record/addcoursecontent/' + folder);

        }
    });

}


recordRoutes.route('/addcoursecontent/:name').get(async function (req, res) {
    console.log(req.params.name);
    await getcoursecontent(res, req.params.name);
});



recordRoutes.route('/adminuploaded/:name').post(img.single("fileuploading"), async function (req, res) {
    console.log(req.file);
    req.file.path
    await adminupload(req.file, req.params.name, res, req);

});

recordRoutes.route('/postquestion/:username').post(async function (req, res) {
    console.log(req.body);
    console.log(req.session.userid);
    const user = new userdetails({ questions: req.body.content });

    // console.log(req);

    const data = await userdetails.find({ username: req.session.userid })
    console.log(data);
    var usrcourse = Array();
    data[0].questions.forEach(function (name) {
        usrcourse.push(name);
    });

    usrcourse.push(req.body.question);


    var newdata = {
        "firstname": data[0].firstname,
        "lastname": data[0].lastname,
        "username": data[0].username,
        "password": data[0].password,
        "email": data[0].email,
        "mobile": data[0].mobile,
        "course": data[0].course,
        "questions": usrcourse,
        "created_at": data[0].created_at
    }
    console.log(newdata);
    await userdetails.updateOne({ username: req.session.userid }, newdata);
    // const data = await courses.find({ name: data[0] })
    console.log(req.body);

    const course = await courses.find({ name: req.body.course });
    console.log(course);
    var course_arr = Array();
    if (course[0].questions.length) {
        course[0].questions.forEach(function (name) {
            course_arr.push(name);
        });
    }

    course_arr.push(req.body.question);
    console.log(course_arr);
    var new_coursedata = {
        "course_id": course[0].course_id,
        "name": course[0].name,
        "students": course[0].students,
        "questions": course_arr
    }
    console.log(new_coursedata);
    await courses.updateOne({ name: req.body.course }, new_coursedata);

    const qsn = new questionsmodel({ question: req.body.question, course: course[0].name });

    qsn.save();
    res.redirect('http://localhost:3000/record/viewcourse/' + course[0].name + '/' + data[0].username);

    const elementToPush = { a: 1, b: 2 };
    const body = { $push: { questions: req.body.content } };

    // userdetails.findOneAndUpdate({ username: req.session.userid }, { $push: { questions: "whatt" } });
    // await userdetails.updateOne({ username: data.username }, user);
});


recordRoutes.route('/addanswer/:course/:username/:question').post(async function (req, res) {
    console.log(req.params.question);
    const data = await questionsmodel.find({ question: req.params.question + '?' });
    console.log(data);
    var qsnarr = Array();
    if (data) {
        if (data[0].answers.length) {
            data[0].answers.forEach(function (name) {
                qsnarr.push(name);
            });
        }
    }

    qsnarr.push(req.body.answer);

    var newdata = {
        "question": req.params.question + '?',
        "course": data.course,
        "answers": qsnarr
    };
    // console.log(rq.params.question);
    await questionsmodel.updateOne({ question: req.params.question + '?' }, newdata);

    console.log(req.url);
    res.redirect('http://localhost:3000/record/viewcourse/' + req.params.course + '/' + req.params.username);


});

recordRoutes.route('/getstat').get(async function (req, res) {
    res.render('admin/stat');
});

recordRoutes.route('/getstatdata').get(async function (req, res) {
    // let course = await courses.find();
    // course.sort();
    // courses.aggregate.lookup({ from: 'courses', localField: 'name', foreignField: '_id', as: 'users' });
    let course = await courses.aggregate([
        {
            $project: {
                "_id": 0,
                "name": 1,
                "students": 1
            }
        }
    ])

    res.json({ course });
});

recordRoutes.route('/images/:image').get(async function (req, res) {
    var fs = require('fs');
    var fileStream = fs.createReadStream("images/" + req.params.image);
    res.send(fileStream);
})
// recordRoutes.route('/getstates').post(async function (req, res) {
//     const dbConnect = dbo.getDb();

//     dbConnect
//         .collection('cities')
//         .find({ "country_id": req.body.country_id })
//         .limit(50)
//         .toArray(function (err, rows, fields) {
//             if (err) {
//                 res.json({
//                     msg: 'error'
//                 });
//             } else {
//                 res.json({
//                     msg: 'success',
//                     states: rows
//                 });
//             }
//         });
// });
// This section will help you create a new record.
recordRoutes.route('/listings/recordSwipe').post(function (req, res) {
    const dbConnect = dbo.getDb();
    const matchDocument = {
        listing_id: req.body.id,
        last_modified: new Date(),
        session_id: req.body.session_id,
        direction: req.body.direction,
    };

    dbConnect
        .collection('matches')
        .insertOne(matchDocument, function (err, result) {
            if (err) {
                res.status(400).send('Error inserting matches!');
            } else {
                console.log(`Added a new match with id ${result.insertedId}`);
                res.status(204).send();
            }
        });
});

// This section will help you update a record by id.
recordRoutes.route('/listings/updateLike').post(function (req, res) {
    const dbConnect = dbo.getDb();
    const listingQuery = { _id: req.body.id };
    const updates = {
        $inc: {
            likes: 1,
        },
    };

    dbConnect
        .collection('users')
        .updateOne(listingQuery, updates, function (err, _result) {
            if (err) {
                res
                    .status(400)
                    .send(`Error updating likes on listing with id ${listingQuery.id}!`);
            } else {
                console.log('1 document updated');
            }
        });
});

// This section will help you delete a record.
recordRoutes.route('/listings/delete/:id').delete((req, res) => {
    const dbConnect = dbo.getDb();
    const listingQuery = { listing_id: req.body.id };

    dbConnect
        .collection('listingsAndReviews')
        .deleteOne(listingQuery, function (err, _result) {
            if (err) {
                res
                    .status(400)
                    .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
            } else {
                console.log('1 document deleted');
            }
        });
});

module.exports = recordRoutes;