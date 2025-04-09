import React from 'react';

const MenuIcon = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            fill="currentColor"
            {...props}
        >
            <path d="M1.5 3h9v1H1.5V3zm0 2.5h9v1h-9v-1zm0 2.5h9v1h-9v-1z" />
        </svg>
    );
};

export default MenuIcon;