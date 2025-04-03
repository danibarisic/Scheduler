import { useState } from 'react';

export const useForm = (validate, submit) => {
    const [errors, setErrors] = useState(null)

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const form = evt.target;
        const entries = Array.from(new FormData(form).entries());
        const errors = entries.map(([key, val]) => [key, validate(key, val)]);;
        errors.forEach(([key, val]) => { form[key].setCustomValidity(val) });

        if (errors.some(([key, val]) => val !== '')) {
            setErrors(Object.fromEntries(errors));
        } else {
            setErrors(null);
            submit(Object.fromEntries(entries));
        }
    }
    return [errors, handleSubmit];
};

export const submit = (values) => alert(JSON.stringify(values));
const isValidMeets = (meets) => {
    const parts = timeParts(meets);
    return (meets === '' || (parts.days && !isNaN(parts.hours?.start) && !isNaN(parts.hours?.end)));
};

export const validateCourseData = (key, val) => {
    switch (key) {
        case 'title': return /(^$|\w\w)/.test(val) ? '' : 'must be at least two characters';
        case 'meet': return isValidMeets(val) ? '' : 'must be days hh:mm-hh:mm';
        default: return '';
    }
}
