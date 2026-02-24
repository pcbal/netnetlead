// src/admin/components/Logo/index.tsx
import React from 'react'

const Logo: React.FC = () => (
  <img
    src="/assets/logo.png"   // path relative to public folder
    alt="Logo"
    style={{
      height: 40,            // adjust as needed
      objectFit: 'contain',
    }}
  />
)

export default Logo
