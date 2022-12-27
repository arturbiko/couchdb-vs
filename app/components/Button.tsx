import React, { PropsWithoutRef, ReactNode } from 'react';
 

interface IProps {
    children: ReactNode; 
    onClick?: Function; 
    disabled?: boolean;
}

const Button: React.FC<IProps> = ({ children, onClick, disabled}) => {
    return (
        <button 
            onClick={() => {
                if (!onClick) {
                    return;
                }

                onClick();
                }} 
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button;