export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isStrongPassword = (v) => v.length >= 6;
export const isRequired = (v) => !!v && v.toString().trim().length > 0;
export const isPositiveNumber = (v) => !isNaN(v) && Number(v) > 0;

export const validateLoginForm = ({ email, password }) => {
 const errors = {};
 if (!isEmail(email)) errors.email = 'Valid email required';
 if (!isStrongPassword(password)) errors.password = 'Password must be at least 6 characters';
 return errors;
};

export const validateRegisterForm = ({ name, email, password }) => {
 const errors = {};
 if (!isRequired(name)) errors.name = 'Name is required';
 if (!isEmail(email)) errors.email = 'Valid email required';
 if (!isStrongPassword(password)) errors.password = 'Password must be at least 6 characters';
 return errors;
};