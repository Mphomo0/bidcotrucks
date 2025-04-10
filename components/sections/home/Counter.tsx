'use client'

import React from 'react'
import CountUp from 'react-countup'

const Counter = () => {
  return (
    <div className='w-full bg-[url("/images/counterBg.jpg")] bg-cover bg-center flex flex-col justify-center'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
        <div className='mx-auto text-center mt-16'>
          <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl text-white'>
            Trusted by companies around the world
          </h2>

          <p className='mt-4 text-white sm:text-xl mb-16'>
            Truck Dealer is committed to providing high-quality trucks and
            exceptional service to dealerships nationwide.
          </p>
        </div>

        <dl className='mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4 mb-32 mt-6'>
          <div className='flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center'>
            <CountUp start={0} end={25} duration={20}>
              {(props) => (
                <div className='text-center mb-4 mt-4'>
                  <span
                    className='font-bold text-5xl text-[#24603a]'
                    ref={props.countUpRef}
                  />
                  <p className='text-md'>Years of Eexperience</p>
                </div>
              )}
            </CountUp>
          </div>

          <div className='flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center'>
            <CountUp start={0} end={2500} duration={5}>
              {(props) => (
                <div className='text-center mb-4 mt-4'>
                  <span
                    className='font-bold text-5xl text-[#24603a]'
                    ref={props.countUpRef}
                  />
                  <p className='text-md'>Happy Customers</p>
                </div>
              )}
            </CountUp>
          </div>

          <div className='flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center'>
            <CountUp start={0} end={8} duration={5}>
              {(props) => (
                <div className='text-center mb-4 mt-4'>
                  <span
                    className='font-bold text-5xl text-[#24603a]'
                    ref={props.countUpRef}
                  />
                  <p className='text-md'>Sales Team</p>
                </div>
              )}
            </CountUp>
          </div>

          <div className='flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center'>
            <CountUp start={0} end={5000} duration={5}>
              {(props) => (
                <div className='text-center mb-4 mt-4'>
                  <span
                    className='font-bold text-5xl text-[#24603a]'
                    ref={props.countUpRef}
                  />
                  <p className='text-md'>Trucks Sold</p>
                </div>
              )}
            </CountUp>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default Counter
