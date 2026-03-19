import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
 <div className="flex flex-col gap-1">
 {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
 <input
 ref={ref}
 className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'} ${className}`}
 {...props}
 />
 {error && <p className="text-xs text-red-500">{error}</p>}
 </div>
));

Input.displayName = 'Input';
export default Input;