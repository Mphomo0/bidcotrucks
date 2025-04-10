'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Phone from '@/public/images/icons/7.png'
import BidcoLogo from '@/public/images/bidco_logo.png'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setScrolled(offset > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset'
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/inventory', label: 'Our Inventory' },
    { href: '/contact', label: 'Contact Us' },
  ]
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 py-2 lg:py-3 ${
        scrolled ? 'bg-[#24603a]' : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center'>
          {/* Logo and Phone Section */}
          <div className='flex items-center space-x-4 lg:space-x-8'>
            <Link href='/' className='flex items-center py-2'>
              {/* <span className='text-2xl lg:text-4xl font-bold text-white'>
                TruckDealer
              </span> */}
            </Link>
            <Image
              src={BidcoLogo}
              width={150}
              height={10}
              alt='Bidco Logo'
              className='mb-5'
            />

            {/* Phone Number - Hidden on mobile and small tablets */}
            <div className='hidden lg:flex items-center space-x-2 text-white'>
              <Image src={Phone} alt='phone icon' width={40} height={40} />
              <span className='border-l border-white h-10 border-2'></span>
              <div className='flex flex-col'>
                <span className='text-xs sm:text-sm text-white'>
                  Need help? Talk to an Expert
                </span>
                <span className='text-base sm:text-lg font-semibold'>
                  011-474-7070
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <div className='hidden lg:flex items-center space-x-4 xl:space-x-8'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-sm xl:text-base text-white hover:text-red-500 transition-colors whitespace-nowrap'
              >
                {link.label}
              </Link>
            ))}
            <Link
              href='/trade-in'
              className='border-2 border-white text-white hover:bg-white hover:text-black px-4 xl:px-6 py-4 rounded transition-colors duration-300 font-semibold text-sm xl:text-base whitespace-nowrap p-6'
            >
              SELL A TRUCK
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            onClick={toggleMobileMenu}
            className='lg:hidden text-white p-2 bg-red-500 hover:bg-red-500'
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className='lg:hidden fixed inset-0 top-[65px] bg-black bg-opacity-95 z-50 overflow-y-auto w-[80%]'>
            <div className='flex flex-col items-center pt-6 pb-8 space-y-6'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='text-white text-lg sm:text-xl hover:text-red-500 transition-colors'
                  onClick={toggleMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href='/trade-in'
                className='border-2 border-white text-white hover:bg-white hover:text-black px-6 py-2 rounded transition-colors duration-300 font-semibold w-auto sm:w-auto mx-4'
                onClick={toggleMobileMenu}
              >
                SELL A TRUCK
              </Link>
              <div className='flex items-center space-x-2 text-white pt-2'>
                {/* <Image src={Phone} alt='phone icon' width={50} height={50} /> */}
                <div className='flex flex-col'>
                  <span className='text-sm text-white'>
                    Need help? Talk to an Expert
                  </span>
                  <span className='text-2xl font-bold'>011-474-7070</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
