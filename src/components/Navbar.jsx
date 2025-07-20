"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/createDebate", label: "Debate Creation" },
        { href: "/allDebates", label: "Debate List" },
        { href: "/joinedDebate", label: "Joined Debate" },
    ];

    const getLinkClasses = (href) => {
        const isActive = pathname === href;
        return `px-3 py-2 rounded-md text-sm font-medium transition ${isActive
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`;
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            DebateArena
                        </Link>
                    </div>

                    <div className="hidden sm:flex sm:space-x-8 sm:items-center">
                        {navLinks.map(({ href, label }) => (
                            <Link key={href} href={href} className={getLinkClasses(href)}>
                                {label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden sm:flex sm:items-center space-x-4">
                        {session?.user ? (
                            <>
                                {session.user.image && (
                                    <img
                                        src={session.user.image}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                )}
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Hello, {session.user.name.split(" ")[0]}
                                </p>
                                <button
                                    onClick={() => signOut()}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => signIn("google")}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile menu toggle button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className={`block ${getLinkClasses(href)} text-base`}
                            >
                                {label}
                            </Link>
                        ))}
                        {session?.user ? (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    signOut();
                                }}
                                className="w-full text-left bg-red-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    signIn("google");
                                }}
                                className="w-full text-left bg-indigo-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
