// src/admin/components/Icon/index.tsx
import React from 'react'

const Icon: React.FC = () => (
  <img
    src="/assets/icon.png"  // path relative to public folder
    alt="Icon"
    style={{
      width: 24,             // adjust size as needed
      height: 24,
      objectFit: 'contain',
    }}
  />
)

export default Icon
