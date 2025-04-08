import React, { useState } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { hasConflict, addScheduleTimes } from "./times.js";
import { useData, useUserState, signInWithGoogle, firebaseSignOut } from "./utilities/firebase.js";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import EditForm from "./EditForm.jsx"

const Banner = ({ title }) => (
  <h1>{title}</h1>
);

const CourseList = ({ courses }) => {
  const [term, setTerm] = useState('Fall');
  const [selected, setSelected] = useState([]);
  const termCourses = Object.values(courses).filter(course => term === course.term);

  // if (selected.some(course => course !== courses[course.number])) {
  //   setSelected([]);
  // };

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
    <input type="radio" id={term} className="btn-check btn-m" autoComplete="off" onChange={() => setTerm(term)} checked={checked} />
    <label className="btn-m btn-success m-2 p-3" htmlFor={term}>
      {term}
    </label>
  </>
);

const SignInButton = () => (
  <button className="btn btn-secondary btn-m" onClick={() => signInWithGoogle()}>Sign In</button>
);

const SignOutButton = () => (
  <button className="btn btn-secondary btn-m " onClick={() => firebaseSignOut()}>
    Sign Out
  </button>
);

const TermSelector = ({ term, setTerm }) => {
  const [user] = useUserState();
  return (
    <div className="btn-toolbar justify-content-between">
      <div className="btn-group">
        {
          Object.values(terms).map(value => (
            <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />
          ))
        }
      </div>
      {user ? <SignOutButton /> : <SignInButton />};
    </div>
  )
};

const terms = { F: 'Fall', W: 'Winter', S: 'Spring' };

const Course = ({ course, selected, setSelected }) => {
  const isSelected = selected.includes(course);
  const isDisabled = !isSelected && hasConflict(course, selected);
  const style = { backgroundColor: isDisabled ? 'lightgrey' : isSelected ? 'lightgreen' : 'white' };
  const navigate = useNavigate();
  const [user] = useUserState();

  return (
    <div className="card m-1 p-2"
      style={style}
      onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}
      onDoubleClick={!user ? null : () => navigate('/edit', { state: course })}>
      <div className="card-body">
        <div className="card-title fs-4">{course.term} CS {course.number}</div>
        <div className="card-text">{course.title}</div>
        <hr></hr>
        <div className="card-text">{course.meets}</div>
      </div>
    </div>
  );
};

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