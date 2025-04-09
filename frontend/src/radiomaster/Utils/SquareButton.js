import React from "react";
import { Button } from "@mui/material";

const SquareButton = ({ children, size = "40px", ...props }) => {
    return (
        <Button
            sx={{
                height: size, // Explicit height
                width: size, // Match height
                minWidth: size, // Prevent material-ui shrinking width
                fontSize: `calc(${size} / 2)`, // Dynamically adjust font size
                display: "flex", // Flexbox for centering
                alignItems: "center", // Center content vertically
                justifyContent: "center", // Center content horizontally
                padding: 0, // Remove extra padding
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default SquareButton;
