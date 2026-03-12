import React from 'react'

export const GalleryItem = ({ data }: { data: string }) => {
  const handleClick = () => {
    console.log(data)
  }

  return (
    <div
      className="cursor-pointer rounded-lg border border-transparent transition-all duration-300 hover:translate-y-[-2px] hover:scale-101"
      onClick={handleClick}
    >
      <img
        src={data}
        alt={`${decodeURIComponent(data.split('photograph/')[1].split('.JPG')[0])}`}
        style={{ width: '100%', borderRadius: '8px' }}
      />
    </div>
  )
}
