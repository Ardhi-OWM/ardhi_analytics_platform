"use client";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { headerLinks } from "@/components/constants";
import { useEffect, useState } from "react";

export default function NavBar() {
    const [currentPath, setCurrentPath] = useState("");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentPath(window.location.pathname);
        }
    }, []);

    function classNames(...classes: (string | boolean | undefined | null)[]): string {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <Disclosure as="nav">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Mobile Menu Button */}
                    <div className="flex sm:hidden">
                        <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-inset">
                            {({ open }) => (
                                <>
                                    <span className="sr-only">Open main menu</span>
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        {open ? (
                                            <XMarkIcon className="h-full w-full" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="h-full w-full" aria-hidden="true" />
                                        )}
                                    </div>
                                </>
                            )}
                        </DisclosureButton>
                    </div>

                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {headerLinks.map((item) => (
                                    <div
                                        key={item.name}
                                        className="relative"
                                        onMouseEnter={() => item.subLinks && setOpenDropdown(item.id)}
                                        onMouseLeave={() => setTimeout(() => setOpenDropdown(null), 5000)} // Delay closing
                                    >
                                        {/* Main Navigation Link */}
                                        <a
                                            href={item.href}
                                            aria-current={currentPath === item.href ? "page" : undefined}
                                            className={classNames(
                                                "border-b-2",
                                                currentPath === item.href
                                                    ? "border-green-500"
                                                    : "border-transparent hover:border-gray-300",
                                                "rounded px-3 py-1 text-sm font-medium transition-colors duration-300"
                                            )}
                                        >
                                            {item.name}
                                        </a>

                                        {/* Dropdown for sub-links */}
                                        {item.subLinks && openDropdown === item.id && (
                                            <div
                                                className="absolute left-0 mt-2 w-48 bg-white dark:bg-[hsl(279,100%,3.9%)] shadow-lg rounded-md z-50"
                                                onMouseEnter={() => setOpenDropdown(item.id)} // Keep open when hovering over sub-links
                                                onMouseLeave={() => setTimeout(() => setOpenDropdown(null), 5000)}
                                                onClick={() => setOpenDropdown(null)} // Close dropdown when clicking a sub-item
                                            >
                                                {item.subLinks.map((subItem) => (
                                                    <a
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className="block px-4 py-2 text-sm hover:bg-gray-100  dark:hover:bg-gray-800"
                                                    >
                                                        {subItem.name}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <DisclosurePanel className="sm:hidden bg-white dark:bg-[hsl(279,100%,3.9%)] absolute top-16 left-0 h-screen w-full shadow-lg">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {headerLinks.map((item) => (
                        <div key={item.name}>
                            <a
                                href={item.href}
                                aria-current={currentPath === item.href ? "page" : undefined}
                                className={classNames(
                                    currentPath === item.href
                                        ? "border-l-4 border-green-500"
                                        : "text-gray-500 hover:border-l-4 hover:border-gray-500",
                                    "block px-3 py-2 text-base font-medium transition duration-200"
                                )}
                            >
                                {item.name}
                            </a>

                            {/* Mobile Dropdown */}
                            {item.subLinks && (
                                <div className="ml-4 space-y-1">
                                    {item.subLinks.map((subItem) => (
                                        <a
                                            key={subItem.name}
                                            href={subItem.href}
                                            className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            {subItem.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
