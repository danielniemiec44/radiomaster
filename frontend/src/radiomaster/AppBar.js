import React, { useState } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { Link, useLocation } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const navigationMap = [
    { name: "Kolejka", path: "/main" },
    { name: "Biblioteka", path: "/library" },
];

function AppBar() {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isLoggedIn = true; // replace with actual auth logic

    const getLinkClass = (path) =>
        `text-sm transition-colors font-medium ${
            location.pathname === path
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-500"
        }`;

    return (
        <Navbar className="bg-white shadow-md py-4 h-20 sticky top-0 z-50 px-2">
            <div className="w-full flex items-center justify-between">
                {/* Left: Brand */}
                <div className="flex items-center">
                <div className="flex items-center">
                    <NavbarBrand className="text-2xl font-extrabold text-blue-600 flex items-center pr-6">
                        <span className="text-3xl mr-2">🚀</span>RadioMaster
                    </NavbarBrand>
                </div>

                {/* Center: Navigation */}
                <div className="hidden sm:flex gap-8 h-full items-center">
                    {navigationMap.map((item) => (
                        <div key={item.path} className="flex items-center h-full">
                            <Link
                                to={item.path}
                                className={`${getLinkClass(item.path)} leading-tight flex items-center h-full`}
                            >
                                {item.name}
                            </Link>
                        </div>
                    ))}
                </div>
                </div>

                {/* Right: Profile or Auth buttons */}
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Button isIconOnly variant="light" radius="full" className="hover:bg-gray-100">
                                    <UserCircleIcon className="w-6 h-6 text-gray-600"/>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="User menu"
                                className="w-48 bg-white shadow-lg rounded-lg p-1 flex flex-col"
                            >
                                <DropdownItem
                                    key="profile"
                                    as={Link}
                                    to="/profile"
                                    className="text-sm text-gray-700 hover:bg-gray-100 rounded px-3 py-2 w-full block"
                                >
                                    Mój profil
                                </DropdownItem>
                                <DropdownItem
                                    key="settings"
                                    as={Link}
                                    to="/settings"
                                    className="text-sm text-gray-700 hover:bg-gray-100 rounded px-3 py-2 w-full block"
                                >
                                    Ustawienia
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    className="text-sm text-red-600 hover:bg-red-100 rounded px-3 py-2 w-full block"
                                >
                                    Wyloguj
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">
                                Login
                            </Link>
                            <Button
                                component={Link}
                                to="/signup"
                                variant="shadow"
                                size="md"
                                className="bg-blue-600 text-white hover:bg-blue-700 transition-all px-5 py-2 rounded-lg"
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Navbar>

    );
}

export default AppBar;
