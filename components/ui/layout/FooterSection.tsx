import Image from 'next/image'
import Link from 'next/link'
import {
  FaFacebookF,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
} from 'react-icons/fa6'
import Wesbank from '@/public/images/icons/wesbank.png'
import BidcoLogo from '@/public/images/bidco_logo.png'

const FooterSection = () => {
  const currentYear = new Date().getFullYear() // Get the current year
  return (
    <footer className="bg-black">
      <div className="max-w-7xl px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center py-2">
              <Image
                src={BidcoLogo}
                width={150}
                height={10}
                alt="Bidco Logo"
                className="mb-5"
              />
            </Link>

            <p className="text-white">
              Bidco Trucks (Pty) Ltd, established in 2007, specializes in buying
              and selling quality second-hand trucks, trailers, and plant
              equipment. Based in Pretoria, South Africa, we have expanded our
              reach to various African countries, including Zambia, Zimbabwe,
              Mozambique, and Ghana. Our commitment is to provide clean,
              reliable vehicles and machinery to meet the diverse needs of our
              clients across the continent.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white">Quick Links</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <Link
                href="/"
                className="text-white transition-colors duration-300 hover:underline hover:cursor-pointer hover:text-green-500"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-white transition-colors duration-300 hover:underline hover:cursor-pointer hover:text-green-500"
              >
                About Us
              </Link>
              <Link
                href="/inventory"
                className="text-white transition-colors duration-300 hover:underline hover:cursor-pointer hover:text-green-500"
              >
                Our Inventory
              </Link>
              <Link
                href="/contact"
                className="text-white transition-colors duration-300 hover:underline hover:cursor-pointer hover:text-green-500"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <p className="font-semibold text-white">Our Address</p>

            <ul className="flex flex-col items-start mt-5 space-y-2">
              <li className="flex items-center gap-2">
                <FaPhone size={15} fill="white" />
                <span className="text-white transition-colors duration-300 dark:text-gray-300 hover:underline hover:cursor-pointer hover:text-green-500">
                  012 808 9903/4/5
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope size={15} fill="white" />
                <span className="text-white transition-colors duration-300 dark:text-gray-300 hover:underline hover:cursor-pointer hover:text-green-500">
                  admin@bidco.co.za
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FaLocationDot size={15} fill="white" />
                <span className="text-white transition-colors duration-300 dark:text-gray-300 hover:underline hover:cursor-pointer hover:text-green-500">
                  Plot 28, Wolmaranspoort, Pretoria
                </span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-6 border-gray-200 md:my-8 dark:border-gray-700 h-2" />

        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex hover:cursor-pointer gap-2 mb-8">
            <Image
              src={Wesbank}
              width={100}
              height={100}
              alt="Wesbank Logo"
              className="w-20 h-10"
            />
            <p className="text-white text-start md:text-center md:text-lg md:p-4 pr-4">
              Approved Dealership
            </p>
          </div>

          <div className="flex gap-4 hover:cursor-pointer">
            <a
              href="https://www.facebook.com/BidcoTrucks"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF
                size={40}
                fill="blue"
                className="bg-white rounded-full p-2"
              />
            </a>
          </div>
        </div>
        <p className="text-white text-start md:text-center md:text-lg md:p-4 mt-8">
          © {currentYear} TruckDealer Inc. All rights reserved. Designed by{' '}
          <a
            href="https://www.nostalgic-studio.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:underline"
          >
            with ❤️ by Nostalgic Studio.
          </a>
        </p>
      </div>
    </footer>
  )
}

export default FooterSection
