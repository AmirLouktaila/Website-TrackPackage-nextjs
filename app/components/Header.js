'use client'
import { Truck } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="w-full py-6 px-6">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link href={'/'}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Truck className="text-white w-5 h-5" />
                        </div>
                        <span className="text-white text-2xl font-bold">TrackFlow</span>
                    </div></Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="https://github.com/AmirLouktaila" className="text-white/80 hover:text-white transition-colors">GitHub</a>

                </nav>
            </div>
        </header>
    );
}
