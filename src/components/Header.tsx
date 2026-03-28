"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-card-border">
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-lg">
              SA
            </div>
            <span className="font-bold text-xl">Sam Atlas</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/products" className="btn-primary">
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-card-border">
            <div className="flex flex-col gap-4">
              <Link href="/products" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link href="/blog" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Blog
              </Link>
              <Link href="/products" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
