import React, { useState, useEffect } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { hasConflict, days, daysOverlap, hoursOverlap, timeConflict, courseConflict, meetsPat, timeParts, addCourseTimes, mapValues, addScheduleTimes } from "./utilities/times.js";
import { useData } from "./utilities/firebase.js";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import EditForm from "./EditForm.jsx"
import { useLocation } from "react-router-dom";


// // Fetching data from API.
// const fetchSchedule = async () => {
//   const url = "https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php";
//   const response = await fetch(url);
//   if (!response.ok) throw response;
//   return addScheduleTimes(await response.json());
// };

// Create an object with title and course inforation.
// const schedule = {
//   "title": "CS Courses for 2018-2019",
//   "courses": {
//     "F101": {
//       "id": "F101",
//       "meets": "MWF 11:00-11:50",
//       "title": "Computer Science: Concepts, Philosophy, and Connections"
//     },
//     "F110": {
//       "id": "F110",
//       "meets": "MWF 10:00-10:50",
//       "title": "Intro Programming for non-majors"
//     },
//     "S313": {
//       "id": "S313",
//       "meets": "TuTh 15:30-16:50",
//       "title": "Tangible Interaction Design and Learning"
//     },
//     "S314": {
//       "id": "S314",
//       "meets": "TuTh 9:30-10:50",
//       "title": "Tech & Human Interaction"
//     }
//   }
// };

const Banner = ({ title }) => (
  <h1>{title}</h1>
);

const CourseList = ({ courses }) => {
  const [term, setTerm] = useState('Fall');
  const [selected, setSelected] = useState([]);
  const termCourses = Object.values(courses).filter(course => term === course.term);

  return (
    <>
      <TermSelector term={term} setTerm={setTerm} />
      <div className="course-list">
        {termCourses.map(course => <Course course={course} key={course.number} selected={selected} setSelected={setSelected} />)}
      </div>
    </>
  )
};

const toggle = (x, lst) => (
  lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

const TermButton = ({ term, setTerm, checked }) => (
  <>
    <input type="radio" id={term} className="btn-check" autoComplete="off" onChange={() => setTerm(term)} checked={checked} />
    <label className="btn btn-success m-1 p-2" htmlFor={term}>
      {term}
    </label>
  </>
);

const TermSelector = ({ term, setTerm }) => (
  <div className="btn-group">
    {
      Object.values(terms).map(value => (
        <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />
      ))
    }
  </div>
);

const terms = { F: 'Fall', W: 'Winter', S: 'Spring' };

const Course = ({ course, selected, setSelected }) => {
  const isSelected = selected.includes(course);
  const isDisabled = !isSelected && hasConflict(course, selected);
  const style = { backgroundColor: isDisabled ? 'lightgrey' : isSelected ? 'lightgreen' : 'white' };
  const navigate = useNavigate();

  return (
    <div className="card m-1 p-2"
      style={style}
      onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}
      onDoubleClick={() => navigate('/edit', { state: course })}>
      <div className="card-body">
        <div className="card-title fs-4">{course.term} CS {course.number}</div>
        <div className="card-text">{course.title}</div>
        <hr></hr>
        <div className="card-text">{course.meets}</div>
      </div>
    </div>
  );
}

const Main = () => {
  const [courses, loading, error] = useData('/', addScheduleTimes);

  if (error) return <h1>{error}</h1>;
  if (loading) return <h1>Loading the schedule...</h1>

  return (
    <div className="container">
      <Banner title={courses.title} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CourseList courses={courses.courses} />} />
          <Route path="/edit" element={<EditForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Main />
  </QueryClientProvider>
);

export default App;