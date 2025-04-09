import React, { useState } from "react";
import { Button, ButtonProps, Menu, MenuItem } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";

interface MenuItemType {
    label: string;
    onClick: () => void;
}

interface ExtendableMenuButtonProps extends ButtonProps {
    title: string;
    items: MenuItemType[];
}

export default function ExtendableMenuButton({ title, items, ...props }: ExtendableMenuButtonProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={handleClick}
                endIcon={<ArrowDropDown />}
                {...props}
            >
                {title}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {items.map((item) => (
                    <MenuItem
                        key={item.label}
                        onClick={() => {
                            handleClose();
                            item.onClick();
                        }}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}