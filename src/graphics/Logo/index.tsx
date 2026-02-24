import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <div className="custom-logo">
      <Image 
        src="/logo.png" 
        alt="My Custom Logo" 
        width={150} 
        height={50} 
        priority // Ensures the logo loads immediately
      />
    </div>
  )
}
