import React from 'react'

export default function MapLocation() {
  return (
    <div className='w-full'>
      <div>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d229169.65614506535!2d27.875213428121533!3d-26.171427670020726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c68f0406a51%3A0x238ac9d9b1d34041!2sJohannesburg!5e0!3m2!1sen!2sza!4v1740661505435!5m2!1sen!2sza'
          width='100%'
          height='600'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        ></iframe>
      </div>
    </div>
  )
}
