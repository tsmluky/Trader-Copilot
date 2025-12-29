import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { LiveTicker } from '../components/landing/LiveTicker';
import { Features } from '../components/landing/Features';
import { TechProof } from '../components/landing/TechProof';
import { Pricing } from '../components/landing/Pricing';
import { Footer } from '../components/landing/Footer';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-slate-50 font-sans selection:bg-brand-500/30">
            <Navbar />
            <main>
                <Hero />
                <LiveTicker />
                <Features />
                <TechProof />
                <Pricing />
            </main>
            <Footer />
        </div>
    );
}
