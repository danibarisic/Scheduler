import React from 'react';
import './App.css';

// Create an object with title and course inforation.
const schedule = {
  "title": "CS Courses for 2018-2019",
  "courses": {
    "F101": {
      "id": "F101",
      "meets": "MWF 11:00-11:50",
      "title": "Computer Science: Concepts, Philosophy, and Connections"
    },
    "F110": {
      "id": "F110",
      "meets": "MWF 10:00-10:50",
      "title": "Intro Programming for non-majors"
    },
    "S313": {
      "id": "S313",
      "meets": "TuTh 15:30-16:50",
      "title": "Tangible Interaction Design and Learning"
    },
    "S314": {
      "id": "S314",
      "meets": "TuTh 9:30-10:50",
      "title": "Tech & Human Interaction"
    }
  }
};

// Creates an h1 banner using the title.
const Banner = ({ title }) => (
  <h1>{title}</h1>
);

const CourseList = ({ courses }) => (
  <div className="course-list">
    {Object.values(courses).map(course => <Course course={course} />)}
  </div>
);

const terms = { F: 'Fall', W: 'Winter', S: 'Spring' };

// Gets the course term based on the first letter ie: F (Fall).
const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

// Slice the course ID number.
const getCourseNumber = course => (
  course.id.slice(1, 4)
);

const Course = ({ course }) => (
  <div className="card m-1 p-2">
    <div className="card-body">
      <div className="card-title fs-4">{getCourseTerm(course)} CS {getCourseNumber(course)}</div>
      <div className="card-text">{course.title}</div>
      <hr></hr>
      <div className="card-text">{course.meets}</div>
    </div>
  </div>
);

// Constructs the app.
const App = () => (
  <div className="container">
    <Banner title={schedule.title} />
    <CourseList courses={schedule.courses} />
  </div>
);

export default App;