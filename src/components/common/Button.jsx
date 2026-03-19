import React from 'react';
import Spinner from './Spinner';

const variants = {
 primary: 'bg-primary hover:bg-primary-dark text-white',
 secondary:'border border-primary text-primary hover:bg-primary hover:text-white',
 danger: 'bg-red-500 hover:bg-red-600 text-white',
 ghost: 'text-gray-600 hover:bg-gray-100',
};
const sizes = {
 sm: 'px-3 py-1.5 text-sm',
 md: 'px-5 py-2 text-sm',
 lg: 'px-7 py-3 text-base',
};

const Button = ({ children, variant = 'primary', size = 'md', loading = false, className = '', disabled, ...props }) => (
 <button
 className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
 disabled={disabled || loading}
 {...props}
 >
 {loading && <Spinner size="sm" />}
 {children}
 </button>
);

export default Button;