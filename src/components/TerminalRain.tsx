'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import './TerminalRain.css';

export interface TerminalRainProps {
  colors?: [string, string]; // [trailColor, headColor]
  backgroundColor?: string;
  mode?: 'auto' | 'glow' | 'ink';
  glyphs?: string;
  fontFamily?: string;
  glyphSize?: number;
  spacing?: number;
  density?: number;
  trail?: number;
  speed?: number;
  variance?: number;
  angle?: number;
  shuffle?: number;
  mirror?: boolean;
  depth?: number;
  glow?: number;
  intensity?: number;
  interactive?: boolean;
  bulletTime?: boolean;
  slowRadius?: number;
  slowStrength?: number;
  clickBurst?: boolean;
  burstSize?: number;
  paused?: boolean;
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface TerminalRainHandle {
  burst: (x?: number, y?: number) => void;
}

// Glyph sets matching React Bits Pro
export const GLYPH_PRESETS = {
  katakana: 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF',
  binary: '01',
  hex: '0123456789ABCDEF',
  latin: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  symbols: '+-*/=<>[]{}()#$%&@!?;:',
};

interface DropColumn {
  x: number;
  y: number;
  speed: number;
  length: number;
  characters: string[];
  lastUpdate: number;
  isBackground: boolean;
  opacity: number;
}

export const TerminalRain = forwardRef<TerminalRainHandle, TerminalRainProps>(
  (
    {
      colors = ['#00f0ff', '#ffffff'],
      backgroundColor = '#060a13',
      mode = 'glow',
      glyphs = GLYPH_PRESETS.katakana,
      fontFamily = 'ui-monospace, "SF Mono", Menlo, Consolas, "JetBrains Mono", monospace',
      glyphSize = 16,
      spacing = 1,
      density = 0.5,
      trail = 18,
      speed = 1,
      variance = 0.5,
      angle = 0,
      shuffle = 0.35,
      mirror = false,
      depth = 0.6,
      glow = 0.4,
      intensity = 1.2,
      interactive = true,
      bulletTime = true,
      slowRadius = 170,
      slowStrength = 0.65,
      clickBurst = true,
      burstSize = 1.2,
      paused = false,
      quality = 1,
      className = '',
      style,
      children,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
      x: -1000,
      y: -1000,
      active: false,
    });
    const burstQueueRef = useRef<Array<{ x: number; y: number; radius: number; progress: number }>>([]);

    useImperativeHandle(ref, () => ({
      burst: (x = 0.5, y = 0.3) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        burstQueueRef.current.push({
          x: x * rect.width,
          y: y * rect.height,
          radius: 0,
          progress: 0,
        });
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      let animationFrameId: number;
      let lastTime = performance.now();
      let width = 0;
      let height = 0;
      let dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;

      const charArray = glyphs.split('');
      const getRandomChar = () => charArray[Math.floor(Math.random() * charArray.length)] || '0';

      let columns: DropColumn[] = [];

      const initColumns = () => {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const colWidth = glyphSize * spacing;
        const numCols = Math.max(1, Math.floor(width / colWidth));
        columns = [];

        for (let i = 0; i < numCols; i++) {
          // Foreground layer
          if (Math.random() < density) {
            const colSpeed = (speed * (1 + (Math.random() - 0.5) * variance) * 350) / 60;
            const colLength = Math.max(8, Math.round(trail * (0.8 + Math.random() * 0.5)));
            const chars = Array.from({ length: colLength }, () => getRandomChar());
            columns.push({
              x: i * colWidth + (colWidth - glyphSize) / 2,
              y: Math.random() * -height * 1.5,
              speed: colSpeed,
              length: colLength,
              characters: chars,
              lastUpdate: 0,
              isBackground: false,
              opacity: 1,
            });
          }

          // Depth layer (smaller, slower, more transparent behind)
          if (depth > 0 && Math.random() < density * depth) {
            const colSpeed = (speed * 0.6 * (1 + (Math.random() - 0.5) * variance) * 250) / 60;
            const colLength = Math.max(6, Math.round(trail * 0.7));
            const chars = Array.from({ length: colLength }, () => getRandomChar());
            columns.push({
              x: i * colWidth + Math.random() * (colWidth * 0.5),
              y: Math.random() * -height * 1.5,
              speed: colSpeed,
              length: colLength,
              characters: chars,
              lastUpdate: 0,
              isBackground: true,
              opacity: 0.45 * depth,
            });
          }
        }
      };

      initColumns();

      const resizeObserver = new ResizeObserver(() => {
        initColumns();
      });
      resizeObserver.observe(container);

      // Mouse interactive listeners
      const handleMouseMove = (e: MouseEvent) => {
        if (!interactive) return;
        const rect = canvas.getBoundingClientRect();
        mousePosRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      };

      const handleMouseLeave = () => {
        mousePosRef.current.active = false;
      };

      const handleClick = (e: MouseEvent) => {
        if (!clickBurst) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        burstQueueRef.current.push({
          x: clickX,
          y: clickY,
          radius: 0,
          progress: 0,
        });

        // Spawn a burst of rain streams radiating outward
        const colWidth = glyphSize * spacing;
        const centerCol = Math.floor(clickX / colWidth);
        const spread = Math.round(8 * burstSize);

        for (let offset = -spread; offset <= spread; offset++) {
          const colIndex = centerCol + offset;
          const delayDist = Math.abs(offset) * 40;
          const colSpeed = speed * (1.4 + Math.random() * 0.8) * 6;

          columns.push({
            x: colIndex * colWidth,
            y: clickY - Math.abs(offset) * 15 - Math.random() * 30,
            speed: colSpeed,
            length: Math.round(trail * (1 + Math.random() * 0.4)),
            characters: Array.from({ length: trail }, () => getRandomChar()),
            lastUpdate: 0,
            isBackground: false,
            opacity: 1,
          });
        }
      };

      if (interactive) {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('click', handleClick, { passive: true });
      }

      // Main render loop
      const render = (time: number) => {
        const delta = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        if (!paused) {
          ctx.save();
          ctx.scale(dpr, dpr);

          // Trail fade background
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, width, height);

          // Apply angle transformation if set
          if (angle !== 0) {
            ctx.translate(width / 2, height / 2);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.translate(-width / 2, -height / 2);
          }

          const mouse = mousePosRef.current;
          const trailColor = colors[0];
          const headColor = colors[1];

          // Draw columns
          for (let i = 0; i < columns.length; i++) {
            const col = columns[i];

            // Bullet Time slow-down calculation around pointer
            let effectiveSpeed = col.speed;
            if (bulletTime && mouse.active) {
              const dx = col.x - mouse.x;
              const dy = col.y - mouse.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < slowRadius) {
                const slowFactor = 1 - Math.exp(-dist / (slowRadius * 0.5)) * slowStrength;
                effectiveSpeed *= Math.max(0.1, slowFactor);
              }
            }

            // Move stream down
            col.y += effectiveSpeed;

            // Character shuffling
            col.lastUpdate += delta;
            if (col.lastUpdate > 0.08) {
              col.lastUpdate = 0;
              for (let k = 0; k < col.characters.length; k++) {
                if (Math.random() < shuffle * 0.4) {
                  col.characters[k] = getRandomChar();
                }
              }
            }

            // Recycle column once fallen off screen
            const colHeight = col.length * glyphSize;
            if (col.y - colHeight > height + 50) {
              col.y = -colHeight - Math.random() * 200;
              col.characters = Array.from({ length: col.length }, () => getRandomChar());
            }

            // Render stream characters
            const fontSize = col.isBackground ? glyphSize * 0.8 : glyphSize;
            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.textAlign = 'center';

            for (let j = 0; j < col.length; j++) {
              const charY = col.y - j * fontSize;
              if (charY < -fontSize || charY > height + fontSize) continue;

              const isHead = j === 0;
              const fadeRatio = 1 - j / col.length; // 1 at head, 0 at tail end
              const char = col.characters[j] || '0';

              ctx.save();
              ctx.translate(col.x, charY);

              if (mirror) {
                ctx.scale(-1, 1);
              }

              if (isHead) {
                // Leading head glyph (brightest, glowing)
                ctx.fillStyle = headColor;
                if (glow > 0 && !col.isBackground) {
                  ctx.shadowColor = headColor;
                  ctx.shadowBlur = 12 * glow;
                }
                ctx.globalAlpha = col.opacity * intensity;
              } else {
                // Falling phosphor trail
                ctx.fillStyle = trailColor;
                if (glow > 0 && j < 3 && !col.isBackground) {
                  ctx.shadowColor = trailColor;
                  ctx.shadowBlur = 8 * glow * fadeRatio;
                }
                ctx.globalAlpha = Math.max(0.04, fadeRatio * col.opacity * intensity * 0.9);
              }

              ctx.fillText(char, 0, 0);
              ctx.restore();
            }
          }

          // Process click burst wave ripples
          if (burstQueueRef.current.length > 0) {
            for (let bIdx = burstQueueRef.current.length - 1; bIdx >= 0; bIdx--) {
              const b = burstQueueRef.current[bIdx];
              b.radius += 240 * delta;
              b.progress += delta * 1.5;

              ctx.save();
              ctx.beginPath();
              ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
              ctx.strokeStyle = headColor;
              ctx.lineWidth = Math.max(1, 4 * (1 - b.progress));
              ctx.globalAlpha = Math.max(0, (1 - b.progress) * 0.5 * intensity);
              ctx.stroke();
              ctx.restore();

              if (b.progress >= 1) {
                burstQueueRef.current.splice(bIdx, 1);
              }
            }
          }

          ctx.restore();
        }

        animationFrameId = requestAnimationFrame(render);
      };

      animationFrameId = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
        if (interactive) {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseleave', handleMouseLeave);
          window.removeEventListener('click', handleClick);
        }
      };
    }, [
      colors,
      backgroundColor,
      mode,
      glyphs,
      fontFamily,
      glyphSize,
      spacing,
      density,
      trail,
      speed,
      variance,
      angle,
      shuffle,
      mirror,
      depth,
      glow,
      intensity,
      interactive,
      bulletTime,
      slowRadius,
      slowStrength,
      clickBurst,
      burstSize,
      paused,
      quality,
    ]);

    return (
      <div
        ref={containerRef}
        className={`terminal-rain-container ${className}`.trim()}
        style={{ backgroundColor, ...style }}
      >
        <canvas ref={canvasRef} className="terminal-rain-canvas" />
        {children && <div className="terminal-rain-content">{children}</div>}
      </div>
    );
  }
);

TerminalRain.displayName = 'TerminalRain';

export default TerminalRain;
