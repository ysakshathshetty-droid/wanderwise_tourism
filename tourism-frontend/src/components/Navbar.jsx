import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
     <nav className="sticky top-0 z-50 border-b border-gray-100 bg-[#E8F0E8] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-xl text-white">
              <img className="h-5 w-5" src="./star.png"></img>
            </div>

            <div>
              <h1 className="text-lg font-extrabold">
                Wander<span className="text-emerald-700">Wise</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[2px] text-gray-500">
                Tourism Recommendation System
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <a href="#home" className="text-sm font-semibold text-gray-600 hover:text-emerald-700">
              Home
            </a>
            <a href="#about" className="text-sm font-semibold text-gray-600 hover:text-emerald-700">
              About
            </a>
            <a href="#features" className="text-sm font-semibold text-gray-600 hover:text-emerald-700">
              Features
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden px-3 py-2 text-sm font-semibold px-4 py-2.5 sm:block bg-white rounded-lg hover:bg-gray-300"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              SignUp
            </Link>
          </div>
        </div>
      </nav>
  )
}
