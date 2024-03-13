const express = require("express")
const router = express.Router();

const path = require("path")
const multer = require("multer")
var bodyParser = require('body-parser');
// var img = multer({ dest: 'uploads/' });

// import entire SDK
var AWS = require('aws-sdk');
// import AWS object without services
var AWS = require('aws-sdk/global');
// import individual service
var S3 = require('aws-sdk/clients/s3');
const s3 = new AWS.S3({
    accessKeyId: 'AKIA5WXTYYQQSTO4IAGH',
    secretAccessKey: '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'
});
const fileRoutes = express.Router();
const dbo = require('../db/conn');

// View Engine Setup
var upload = multer({ dest: "uploads/" })
// If you do not want to use diskStorage then uncomment it

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {

//         // Uploads is the Upload_folder_name
//         cb(null, "uploads")
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + "-" + Date.now() + ".png")
//     }
// })

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;


async function upload(file) {// Load the AWS SDK for Node.js

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {

            // Uploads is the Upload_folder_name
            cb(null, "uploads")
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".png")
        }
    })

    res.send(file);
    var AWS = require('aws-sdk');
    // Set the region 
    AWS.config.update({ region: 'us-east-1' });
    var fs = require('fs');

    const fileContent = fs.readFileSync(file);

    // Create S3 service object
    var s3 = new AWS.S3({
        accessKeyId: 'AKIA5WXTYYQQSTO4IAGH',
        secretAccessKey: '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',
        apiVersion: '2006-03-01'

    });

    var uploadParams = { Bucket: 'uploadbucket1', Key: 'img.png', Body: '' };
    var file = file.fileuploading;
    console.log(file);

    var fileStream = fs.createReadStream("uploads/" + file);
    // fileStream.on('error', function (err) {
    //     console.log('File Error', err);
    // });
    uploadParams.Body = fileStream;
    var path = require('path');
    uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });
}

// var upload = multer({
//     storage: storage,
//     limits: { fileSize: maxSize },
//     fileFilter: function (req, file, cb) {

//         // Set the filetypes, it is optional
//         var filetypes = /jpeg|jpg|png/;
//         var mimetype = filetypes.test(file.mimetype);

//         var extname = filetypes.test(path.extname(
//             file.originalname).toLowerCase());

//         if (mimetype && extname) {
//             return cb(null, true);
//         }

//         cb("Error: File upload only supports the "
//             + "following filetypes - " + filetypes);
//     }

//     // mypic is the name of file attribute
// }).single("fileuploading");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    }
})

// const maxSize = 1 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {

        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

    // mypic is the name of file attribute
}).single("fileuploading")


// async function uploading(file) {
//     // res.send(file);
//     const fs = require("fs");
//     // const YAML = require("js-yaml");
//     const express = require("express");
//     const multer = require("multer");

//     // Setup express
//     // const app = express();
//     // const port = 3000;

//     // Setup Storage
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             // Set the destination where the files should be stored on disk
//             cb(null, "uploads");
//         },
//         filename: function (req, file, cb) {
//             // Set the file name on the file in the uploads folder
//             cb(null, file.fieldname + "-" + Date.now());
//         },
//         fileFilter: function (req, file, cb) {

//             if (file.mimetype !== "text/" || file.mimetype !== "png/" || file.mimetype !== "application/") {
//                 // To reject a file pass `false` or pass an error
//                 cb(new Error(`Forbidden file type`));
//             } else {
//                 // To accept the file pass `true`
//                 cb(null, true);
//                 console.log("uploaded file");
//             }

//         }
//     });

//     // Setup multer
//     const upload = multer({ storage: storage }); // { destination: "uploads/"}

//     // Setup the upload route

// }
fileRoutes.route("/").get(async function (req, res) {
    res.render("pages/upload");
})

fileRoutes.route("/uploaded").post(async function (req, res) {
    // res.send(_req.file);


    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req, res, function (err) {

        if (err) {

            // ERROR occured (here it can be occured due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {

            // SUCCESS, image successfully uploaded
            res.send("Success, Image uploaded!")
        }
    })
})

module.exports = fileRoutes;