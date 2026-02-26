'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="野草莓社区" 
                width={36} 
                height={36}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">野草莓社区</span>
                <span className="text-xs text-pink-500 -mt-1">资本美学 · 限时觉醒</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-pink-600 font-medium transition-colors"
            >
              首页
            </Link>
            <Link 
              href="/hot" 
              className="text-gray-600 hover:text-pink-600 font-medium transition-colors"
            >
              热门
            </Link>
            <Link 
              href="/tags" 
              className="text-gray-600 hover:text-pink-600 font-medium transition-colors"
            >
              标签
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              登录
            </Link>
            <Link 
              href="/register"
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              注册
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-pink-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                href="/hot" 
                className="text-gray-600 hover:text-pink-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                热门
              </Link>
              <Link 
                href="/tags" 
                className="text-gray-600 hover:text-pink-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                标签
              </Link>
              <hr className="border-gray-200" />
              <Link 
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                登录
              </Link>
              <Link 
                href="/register"
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                注册
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
