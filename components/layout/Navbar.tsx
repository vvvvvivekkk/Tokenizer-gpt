'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Tokenizer
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            <Link href="/tokenize" className="hover:text-blue-600 transition">
              Tokenize
            </Link>
            <Link href="/compare" className="hover:text-blue-600 transition">
              Compare
            </Link>
            <Link href="/train" className="hover:text-blue-600 transition">
              Train
            </Link>
            <Link href="/chat" className="hover:text-blue-600 transition">
              Chat
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/tokenize" className="hover:text-blue-600 transition">
              Tokenize
            </Link>
            <Link href="/compare" className="hover:text-blue-600 transition">
              Compare
            </Link>
            <Link href="/train" className="hover:text-blue-600 transition">
              Train
            </Link>
            <Link href="/chat" className="hover:text-blue-600 transition">
              Chat
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
