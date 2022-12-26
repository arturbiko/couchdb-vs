import React, { PropsWithoutRef, ReactNode } from 'react';
 

const Button: React.FC<{ children: ReactNode, onClick: Function, disabled: boolean }> = ({ children, onClick, disabled}) => {


    return (
        <button onClick={() => onClick()} disabled={disabled}>
            {children}
        </button>
    )
}

export default Button;