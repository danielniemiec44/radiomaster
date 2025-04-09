import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const SquareTextField = ({ size = "40px", min = 0, max = 100, defaultValue = "", onChange, ...props }) => {
    const [value, setValue] = useState(defaultValue);

    const handleInputChange = (event) => {
        const rawValue = event.target.value;

        // Allow only numeric input
        if (rawValue === "" || /^[0-9]*$/.test(rawValue)) {
            let numericValue = rawValue === "" ? "" : parseInt(rawValue, 10);

            // Enforce min and max range
            if (numericValue !== "" && !isNaN(numericValue)) {
                if (min !== undefined && numericValue < min) {
                    numericValue = min;
                }
                if (max !== undefined && numericValue > max) {
                    numericValue = max;
                }
            }

            setValue(numericValue);
            // Trigger the external `onChange` if provided
            if (onChange) {
                onChange({ ...event, target: { ...event.target, value: numericValue } });
            }
        }
    };

    return (
        <TextField
            value={value}
            onChange={handleInputChange}
            inputProps={{
                inputMode: "numeric", // Enable numeric keyboard
                style: { textAlign: "center", height: "100%", boxSizing: "border-box" }, // Styling for input
            }}
            InputProps={{
                sx: {
                    height: "100%", // Match parent height
                    padding: 0, // Remove padding
                },
            }}
            sx={{
                height: size, // Explicit height
                width: size, // Explicit width
                minWidth: size, // Prevent shrinking
                display: "inline-flex", // Inline-flex ensures correct alignment
                alignItems: "center", // Vertically center content
                justifyContent: "center", // Horizontally center content
                padding: 0, // Remove padding
                boxSizing: "border-box", // Include border in size calculations
                "& .MuiInputBase-root": {
                    height: "100%", // Match parent height
                    width: "100%", // Match parent width
                },
                "& input": {
                    height: "100%", // Ensure input field matches container
                    margin: 0, // Remove default margins
                    textAlign: "center", // Center text
                    boxSizing: "border-box", // Prevent size issues
                },
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                    display: "none", // Remove spin buttons for WebKit browsers
                },
                "& input[type=number]": {
                    MozAppearance: "textfield", // Remove spin buttons for Firefox
                },
            }}
            {...props}
        />
    );
};

export default SquareTextField;
