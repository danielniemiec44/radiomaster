import React, { useState } from "react";
import {Button, TextField, Popover, Checkbox, InputAdornment} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';

const FloatingSearchButton = ({ type = "tex", onChange, value }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <Button onClick={handleClick} sx={{color: value !== undefined && String(value) !== "" ? "yellow" : undefined}}>
                <FilterAltIcon />
            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                { type === "text" && (
                    <TextField
                        autoFocus
                        size="small"
                        variant="outlined"
                        placeholder="Enter search..."
                        style={{ margin: 10 }}
                        InputProps={{
                            endAdornment: (
                                value && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => onChange({ target: { value: "" } })}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            ),
                        }}
                        onChange={onChange}
                        value={value}
                    />
                )}

                { type === "number" && (
                    <TextField
                        autoFocus
                        size="small"
                        variant="outlined"
                        placeholder="Enter search..."
                        style={{ margin: 10 }}
                        type={"number"}
                        onChange={onChange}
                        value={value}

                    />
                )}

                { type === "checkbox" && (
                    <Box sx={{ p: 1 }}>
                    <Checkbox
                        color="primary"
                        style={{ margin: 10 }}
                        onChange={onChange}
                        checked={Boolean(value)}
                    />
                        <Button onClick={() => onChange({ target: { value: "" } })}>Unselect</Button>
                    </Box>
                )}

            </Popover>
        </div>
    );
};

export default FloatingSearchButton;
