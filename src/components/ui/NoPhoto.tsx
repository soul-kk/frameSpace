import React from 'react'

export const NoPhoto = () => {
  return (
    <div className='flex flex-col items-center justify-center' style={{ minHeight: '60vh', gap: '20px' }}>
      <svg
        width="48" height="48" viewBox="0 0 48 48" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.25 }}
      >
        <path d="M6 36V16a2 2 0 0 1 2-2h4l3-4h18l3 4h4a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z" stroke="#9ca3af" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="24" cy="26" r="7" stroke="#9ca3af" strokeWidth="2" />
        <circle cx="24" cy="26" r="3" stroke="#9ca3af" strokeWidth="1.5" />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '1rem', letterSpacing: '0.15em', margin: 0 }}>暂无图片</p>
        <p style={{ color: '#4b5563', fontSize: '0.75rem', letterSpacing: '0.1em', marginTop: '8px' }}>图库尚未添加照片</p>
      </div>
    </div>
  )
}