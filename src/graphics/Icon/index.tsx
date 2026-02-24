import React from 'react'
import Image from 'next/image'

export const Icon = () => {
  return (
    <div className="custom-icon">
      <Image 
        src="/icon.png" 
        alt="My Custom Icon" 
        width={50} 
        height={50} 
        priority
      />
    </div>
  )
}
