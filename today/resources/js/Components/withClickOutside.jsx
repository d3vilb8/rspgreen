import React, { useEffect, useRef } from 'react';

// Higher-Order Component to handle clicks outside
const withClickOutside = (WrappedComponent) => {
    return (props) => {
        const wrapperRef = useRef(null);

        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                if (props.onClickOutside) {
                    props.onClickOutside(); // Call the onClickOutside prop passed to the component
                }
            }
        };

        useEffect(() => {
            document.addEventListener('click', handleClickOutside, true);

            return () => {
                document.removeEventListener('click', handleClickOutside, true);
            };
        }, []);

        return (
            <div ref={wrapperRef}>
                <WrappedComponent {...props} />
            </div>
        );
    };
};

export default withClickOutside;
