const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/courses.json", "utf8", (err, courseData) => {
            if (err) {
                reject("unable to load courses");
                return;
            }

            fs.readFile("./data/students.json", "utf8", (err, studentData) => {
                if (err) {
                    reject("unable to load students");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(dataCollection.students);
    });
};

module.exports.getTAs = function () {
    return new Promise((resolve, reject) => {
        let filteredStudents = dataCollection.students.filter(student => student.TA === true);

        if (filteredStudents.length == 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length == 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(dataCollection.courses);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        let student = dataCollection.students.find(student => student.studentNum == num);

        if (!student) {
            reject("query returned 0 results");
            return;
        }

        resolve(student);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        let filteredStudents = dataCollection.students.filter(student => student.course == course);

        if (filteredStudents.length == 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

// Step 6: Implement addStudent
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        try {
            // Ensure TA is a boolean
            studentData.TA = studentData.TA === "true"; // If "true", convert to boolean

            // Assign a unique student number
            studentData.studentNum = dataCollection.students.length + 1;

            // Add student to the array
            dataCollection.students.push(studentData);

            resolve();
        } catch (error) {
            reject("Unable to add student.");
        }
    });
};
