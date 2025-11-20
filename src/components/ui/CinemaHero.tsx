import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import anime from 'animejs';
import p5 from 'p5';

export const CinemaHero = () => {
  const p5ContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // P5 Animation
  useEffect(() => {
    if (!p5ContainerRef.current) return;

    const sketch = (p: p5) => {
      let particles: any[] = [];

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        // Make canvas position absolute to sit behind content
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        canvas.style('opacity', '0.1');
        
        // Create film strip particles
        for (let i = 0; i < 20; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            size: p.random(20, 40),
            speed: p.random(0.5, 2),
            opacity: p.random(0.1, 0.3)
          });
        }
      };

      p.draw = () => {
        p.clear();
        
        // Draw film strip elements
        for (let particle of particles) {
          p.fill(0, 0, 0, particle.opacity * 255);
          p.noStroke();
          
          // Draw film strip holes
          for (let i = 0; i < 5; i++) {
            let holeX = particle.x + i * 8;
            let holeY = particle.y;
            p.ellipse(holeX, holeY, 4, 4);
          }
          
          particle.x += particle.speed;
          if (particle.x > p.width + 50) {
            particle.x = -50;
            particle.y = p.random(p.height);
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const myP5 = new p5(sketch, p5ContainerRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  // Entrance Animation
  useEffect(() => {
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    timeline
      .add({
        targets: titleRef.current,
        opacity: [0, 1],
        translateY: [50, 0],
        delay: 300
      })
      .add({
        targets: subtitleRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        delay: 200
      }, '-=800')
      .add({
        targets: buttonsRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        delay: 100
      }, '-=600');
      
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div ref={p5ContainerRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-16">
          <h1 
            ref={titleRef}
            className="hero-title text-black mb-6 opacity-0"
          >
            My Favorite<br />
            <span className="text-gray-600">Movies</span>
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 opacity-0"
          >
            精心挑选的电影杰作集合，展现了我对故事叙述和视觉艺术的热爱。
          </p>
          
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-4 justify-center opacity-0"
          >
            <Link 
              to="/list"
              className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              浏览收藏
            </Link>
            <Link 
              to="/upload"
              className="border-2 border-black text-black px-8 py-3 rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300"
            >
              添加电影
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};



