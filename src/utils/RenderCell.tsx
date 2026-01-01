import React from "react";

interface RenderCellProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties; // Explicitly adding for clarity
}

export const RenderCell = ({ children, className = "", style, ...props }: RenderCellProps) => {
    return (
        <div className={`cell ${className}`} style={style} {...props}>
            {children}
        </div>
    );
};
