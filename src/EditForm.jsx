import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { timeParts } from "./times";
import { getAuth } from "firebase/auth";
import { setData } from "./utilities/firebase.js";

const isValidMeets = (meets) => {
    const parts = timeParts(meets);
    return (meets === '' || (parts.days && !isNaN(parts.hours?.start) && !isNaN(parts.hours?.end)));
};

const validateCourseData = (key, val) => {
    switch (key) {
        case 'title': return /(^$|\w\w)/.test(val) ? '' : 'must be at least two characters';
        case 'meets': return isValidMeets(val) ? '' : 'must be days hh:mm-hh:mm';
        default: return '';
    }
};

const submit = async (values) => {
    console.log(values);
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to submit.");
        return;
    }

    if (window.confirm(`Change ${values.id} to ${values.title}: ${values.meets}`)) {
        try {
            setData(`/courses/${values.id}/`, values);
        } catch (error) {
            alert(error);
        }
    }
};

const EditForm = () => {
    const { state: course } = useLocation();
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        id: course.title,
        title: course.title,
        meets: course.meets,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const validationErrors = {};
        for (const key in values) {
            const error = validateCourseData(key, values[key]);
            if (error) {
                validationErrors[key] = error;
            }
        }
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            submit(values);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} noValidate className={errors ? 'was-validated' : null}>
            <input type="hidden" name="id" value={course.number} />
            <div className="mb-4">
                <label htmlFor="title" className="form-label">Course title</label>
                <input className="form-control" name="title" id="title" required defaultValue={course.title} onChange={handleChange} />
                <div className="invalid-feedback">{errors?.title}</div>
            </div>
            <div className="mb-4">
                <label htmlFor="meets" className="form-label">Meeting time</label>
                <input className="form-control" name="meets" id="meets" required defaultValue={course.meets} onChange={handleChange} />
                <div className="invalid-feedback">{errors?.meets}</div>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
};

export default EditForm;