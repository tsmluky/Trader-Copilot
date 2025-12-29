import React, { useState, useEffect } from 'react';
import { Menu, X, Bot, ChevronRight, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = ['Engine', 'Proof', 'Pricing'];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-white/5 py-2' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-12">
                    {/* Logo Area */}
                    <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                            <div className="relative bg-surface border border-white/10 p-2 rounded-xl">
                                <Bot className="h-5 w-5 text-brand-400" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight text-white leading-none">TraderCopilot</span>
                            <span className="text-[10px] text-brand-400 font-mono tracking-widest uppercase opacity-80">Quantitative</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-1">
                            {navItems.map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-200 font-medium"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-wide">
                            Log In
                        </Link>
                        <Link to="/register" className="group relative px-6 py-2 bg-white text-background rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-1">
                                Get Started
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 z-0"></div>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass border-b border-white/10 animate-in slide-in-from-top-5 duration-200">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navItems.map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-white/10 mt-4 flex flex-col gap-3">
                            <Link to="/login" className="w-full text-center py-3 text-gray-400 font-medium block">Log In</Link>
                            <Link to="/register" className="w-full text-center py-3 bg-white text-background font-bold rounded-lg block">Get Started</Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
