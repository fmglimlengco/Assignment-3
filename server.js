/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Frances Limlengco Student ID: 180927238 Date: 03/08/2025
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var collegeData = require("./modules/collegeData");

// Middleware to serve static files (CSS, images, etc.)
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // Middleware for form data

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/home.html"));
});

// About Route
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views/about.html"));
});

// HTML Demo Route
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "views/htmlDemo.html"));
});

// Get all students or filter by course
app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then((data) => res.json(data))
            .catch((err) => res.json({ message: err }));
    } else {
        collegeData.getAllStudents()
            .then((data) => res.json(data))
            .catch((err) => res.json({ message: err }));
    }
});

// Get all TAs
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Get all courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Get a single student by student number
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// GET Route: Display "Add Student" Form (Step 4)
app.get("/students/add", (req, res) => {
    res.sendFile(__dirname + "/views/addStudent.html");
});

// POST Route: Handle "Add Student" Form Submission (Step 5)
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.redirect("/students")) // Redirect to students list
        .catch(err => res.status(500).send("Error adding student: " + err));
});

// 404 Error Page for Unmatched Routes
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Start the server after initializing data
collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on port: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(`Error: ${err}`);
});
