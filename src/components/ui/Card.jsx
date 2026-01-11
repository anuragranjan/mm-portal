import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
