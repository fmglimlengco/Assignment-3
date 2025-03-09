const fs = require("fs");
const path = require("path");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

// Initialize data by reading files
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, "data/courses.json"), "utf8", (err, courseData) => {
            if (err) return reject("unable to load courses");

            fs.readFile(path.join(__dirname, "data/students.json"), "utf8", (err, studentData) => {
                if (err) return reject("unable to load students");

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

// Get all students
module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || dataCollection.students.length === 0) {
            return reject("query returned 0 results");
        }
        resolve(dataCollection.students);
    });
};

// Get all Teaching Assistants
module.exports.getTAs = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection) return reject("data not initialized");

        let filteredStudents = dataCollection.students.filter(student => student.TA === true);
        if (filteredStudents.length === 0) return reject("query returned 0 results");

        resolve(filteredStudents);
    });
};

// Get all courses
module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || dataCollection.courses.length === 0) {
            return reject("query returned 0 results");
        }
        resolve(dataCollection.courses);
    });
};

// Get a student by student number
module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        if (!dataCollection) return reject("data not initialized");

        let student = dataCollection.students.find(student => student.studentNum == num);
        if (!student) return reject("query returned 0 results");

        resolve(student);
    });
};

// Get students by course
module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        if (!dataCollection) return reject("data not initialized");

        let filteredStudents = dataCollection.students.filter(student => student.course == course);
        if (filteredStudents.length === 0) return reject("query returned 0 results");

        resolve(filteredStudents);
    });
};

// Add a student and save to file 
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        if (!dataCollection) return reject("data not initialized");

        try {
            // Ensure TA is a boolean
            studentData.TA = studentData.TA === "true";

            // Assign a unique student number
            studentData.studentNum = dataCollection.students.length + 1;

            // Add student to the array
            dataCollection.students.push(studentData);

            // Save updated students array to students.json
            fs.writeFile(
                path.join(__dirname, "data/students.json"),
                JSON.stringify(dataCollection.students, null, 4),
                (err) => {
                    if (err) return reject("Unable to save student data.");
                    resolve();
                }
            );
        } catch (error) {
            reject("Unable to add student.");
        }
    });
};