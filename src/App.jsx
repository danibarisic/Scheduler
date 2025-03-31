import React, { useState } from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { hasConflict, days, daysOverlap, hoursOverlap, timeConflict, courseConflict, meetsPat, timeParts, addCourseTimes, mapValues, addScheduleTimes } from './utilities/times.js';

// Fetching data from API.
const fetchSchedule = async () => {
  const url = "https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php";
  const response = await fetch(url);
  if (!response.ok) throw response;
  return addScheduleTimes(await response.json());
};

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

const CourseList = ({ courses }) => {
  const [term, setTerm] = useState('Fall');
  const [selected, setSelected] = useState([]);
  const termCourses = Object.values(courses).filter(course => term === getCourseTerm(course));

  return (
    <>
      <TermSelector term={term} setTerm={setTerm} />
      <div className="course-list">
        {termCourses.map(course => <Course course={course} key={course.id} selected={selected} setSelected={setSelected} />)}
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

// Gets the course term based on the first letter ie: F (Fall).
const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

// Slice the course ID number.
const getCourseNumber = course => (
  course.id.slice(1, 4)
);

const Course = ({ course, selected, setSelected }) => {
  const isSelected = selected.includes(course);
  const isDisabled = !isSelected && hasConflict(course, selected);
  const style = { backgroundColor: isDisabled ? 'lightgrey' : isSelected ? 'lightgreen' : 'white' };

  return (
    <div className="card m-1 p-2"
      style={style}
      onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}>
      <div className="card-body">
        <div className="card-title fs-4">{getCourseTerm(course)} CS {getCourseNumber(course)}</div>
        <div className="card-text">{course.title}</div>
        <hr></hr>
        <div className="card-text">{course.meets}</div>
      </div>
    </div>
  );
}

const Main = () => {
  const { schedule: data, isLoading, error } = useQuery({
    queryKey: ['schedule'],
    queryFn: fetchSchedule
  });

  if (error) return <h1>{error}</h1>;
  if (isLoading) return <h1>Loading the schedule...</h1>

  return (
    <div className="container">
      <Banner title={schedule.title} />
      <CourseList courses={schedule.courses} />
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