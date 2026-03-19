import { useState, useCallback } from 'react';

const useForm = (initialValues, validationRules = {}) => {
 const [values, setValues] = useState(initialValues);
 const [errors, setErrors] = useState({});
 const [touched, setTouched] = useState({});

 const validate = useCallback((fieldValues = values) => {
 const newErrors = {};
 Object.keys(validationRules).forEach(field => {
 const rules = validationRules[field];
 const value = fieldValues[field];

 if (rules.required && (!value || value.toString().trim() === '')) {
 newErrors[field] = rules.required === true ? `${field} is required` : rules.required;
 } else if (rules.minLength && value?.length < rules.minLength) {
 newErrors[field] = `Must be at least ${rules.minLength} characters`;
 } else if (rules.maxLength && value?.length > rules.maxLength) {
 newErrors[field] = `Must be no more than ${rules.maxLength} characters`;
 } else if (rules.pattern && !rules.pattern.value.test(value)) {
 newErrors[field] = rules.pattern.message;
 } else if (rules.validate) {
 const result = rules.validate(value, fieldValues);
 if (result !== true) newErrors[field] = result;
 }
 });
 return newErrors;
 }, [values, validationRules]);

 const handleChange = (e) => {
 const { name, value, type, checked } = e.target;
 const newValues = { ...values, [name]: type === 'checkbox' ? checked : value };
 setValues(newValues);
 // Live validation after field is touched
 if (touched[name]) {
 const fieldErrors = validate(newValues);
 setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
 }
 };

 const handleBlur = (e) => {
 const { name } = e.target;
 setTouched(prev => ({ ...prev, [name]: true }));
 const fieldErrors = validate();
 setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
 };

 const handleSubmit = (onSubmit) => async (e) => {
 e.preventDefault();
 const allTouched = Object.keys(validationRules).reduce((acc, k) => ({ ...acc, [k]: true }), {});
 setTouched(allTouched);
 const validationErrors = validate();
 setErrors(validationErrors);
 if (Object.keys(validationErrors).length > 0) return;
 await onSubmit(values);
 };

 const reset = () => { setValues(initialValues); setErrors({}); setTouched({}); };

 return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset, setValues };
};

export default useForm;