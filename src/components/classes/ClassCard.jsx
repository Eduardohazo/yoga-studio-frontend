import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatPrice } from '../../utils/formatDate';

const levelColor = { beginner: 'green', intermediate: 'yellow', advanced: 'red', all: 'blue' };

const ClassCard = ({ cls }) => (
 <div className="card hover:shadow-md transition-shadow group">
 {cls.image && (
 <div className="h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden">
 <img src={cls.image} alt={cls.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
 </div>
 )}
 <div className="flex items-start justify-between mb-2">
 <h3 className="font-serif text-lg font-semibold text-gray-800">{cls.title}</h3>
 <span className="text-primary font-semibold ml-2 shrink-0">{formatPrice(cls.price)}</span>
 </div>
 <p className="text-sm text-gray-500 mb-3 line-clamp-2">{cls.description}</p>
 <div className="flex items-center gap-2 flex-wrap">
 <Badge label={cls.type} variant="gray" />
 <Badge label={cls.level} variant={levelColor[cls.level]} />
 <span className="text-xs text-gray-400 ml-auto">{cls.duration} min</span>
 </div>
 </div>
);

export default ClassCard;