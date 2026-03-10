import React, { useRef, useState } from 'react';
import { Masonry } from 'antd';
import anime from 'animejs';
import { useEffect } from 'react';
import { getGalleryImages } from '../services/gallery';
import { NoPhoto } from '../components/ui/NoPhoto';

export const Gallery = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('imageList:::::', imageList);

  useEffect(() => {
    getGalleryImages().then(urls => {
      setImageList(urls);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    timeline
      .add({
        targets: galleryRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        delay: 300
      });
  }, [loading]);

  if (loading) return null;

  return <div ref={galleryRef} className='max-w-full px-8 pt-24 pb-12 opacity-0'>
    {imageList.length === 0 ? <NoPhoto /> : (
      <Masonry
        columns={5}
        gutter={16}
        items={imageList.map((img, index) => ({
          key: `item-${index}`,
          data: img,
        }))}
        itemRender={({ data }) => (
          <img src={data} alt={`${decodeURIComponent(data.split('photograph/')[1].split('.JPG')[0])}`} style={{ width: '100%', borderRadius: '10px' }} />
        )}
      />
    )}
  </div>
};