import React from 'react';

const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-xl' };

const Avatar = ({ src, name = '', size = 'md', className = '' }) => {
 const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
 return src ? (
 <img src={src} alt={name} className={`rounded-full object-cover ${sizes[size]} ${className}`} />
 ) : (
 <div className={`rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center ${sizes[size]} ${className}`}>
 {initials || '?'}
 </div>
 );
};

export default Avatar;