import React from 'react'

export default function 
() {
  return (
    <div>
       <footer className="border-t border-[#D5E3D5] bg-[#E8F0E8]">
        <div className="mx-auto flex max-w-7xl flex-col items-center
        justify-between gap-3 px-4 py-6 text-center sm:flex-row
        sm:px-6 sm:text-left lg:px-8">

          <Link to="/" className="text-lg font-bold">
            Wander<span className="text-emerald-700">Wise</span>
          </Link>

          <p className="text-sm text-gray-500">
            Discover more. Travel better.
          </p>

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} WanderWise
          </p>
        </div>
      </footer>
    </div>
  )
}
