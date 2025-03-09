const fs = require("fs");
const path = require("path");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        try {
            // Use absolute paths for both local and serverless environments
            const coursePath = path.join(process.cwd(), 'data', 'courses.json');
            const studentPath = path.join(process.cwd(), 'data', 'students.json');

            console.log('Attempting to read from:', { coursePath, studentPath });

            // First check if files exist
            if (!fs.existsSync(coursePath)) {
                console.error('courses.json not found at:', coursePath);
                reject("courses.json does not exist");
                return;
            }
            if (!fs.existsSync(studentPath)) {
                console.error('students.json not found at:', studentPath);
                reject("students.json does not exist");
                return;
            }

            // Read courses file
            fs.readFile(coursePath, 'utf8', (err, courseData) => {
                if (err) {
                    console.error("Error reading courses.json:", err);
                    reject("unable to load courses");
                    return;
                }

                // Read students file
                fs.readFile(studentPath, 'utf8', (err, studentData) => {
                    if (err) {
                        console.error("Error reading students.json:", err);
                        reject("unable to load students");
                        return;
                    }

                    try {
                        // Parse JSON data
                        const courses = JSON.parse(courseData);
                        const students = JSON.parse(studentData);
                        
                        // Create data collection
                        dataCollection = new Data(students, courses);
                        console.log('Successfully initialized data collection');
                        resolve();
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                        reject("invalid JSON data");
                    }
                });
            });
        } catch (err) {
            console.error("Unexpected error:", err);
            reject(err.message);
        }
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        const student = dataCollection.students.find(s => s.studentNum == num);
        if (student) {
            resolve(student);
        } else {
            reject(new Error("Student not found"));
        }
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        // Set TA to false if undefined, true otherwise
        studentData.TA = (studentData.TA) ? true : false;
        
        // Set the student number
        studentData.studentNum = dataCollection.students.length + 1;
        
        // Add the student to the array
        dataCollection.students.push(studentData);
        resolve();
    });
}

module.exports = {
    initialize: module.exports.initialize,
    getAllStudents: module.exports.getAllStudents,
    getTAs: module.exports.getTAs,
    getCourses: module.exports.getCourses,
    getStudentsByCourse: module.exports.getStudentsByCourse,
    getStudentByNum: module.exports.getStudentByNum,
    addStudent
};


