import { useEffect, useRef } from 'react';
import pokermonMap from '@/assets/pokermon_outside.png';
import pokerCenter from '@/assets/poker_center.png';
import cozyShack from '@/assets/bedroom.png';
import laboratory from '@/assets/laboratory.png';
import pokerMart from '@/assets/poker_mart.png';
import useScreenStore from '@/stores/screenStore';
import { Screen } from '@/types/gameConsole';
import { Box, ClickableRegion, RegionsByScreen } from './zones';

const mouseClick = {
  x: 0,
  y: 0,
};

const inBox = (x: number, y: number, box: Box): boolean => {
  return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
};

function draw(
  ctx: CanvasRenderingContext2D,
  screen: Screen,
  regions: ClickableRegion[]
) {
  const img = new Image();
  img.src = pokermonMap;
  ctx.canvas.width = 1280;
  ctx.canvas.height = 720;
  if (screen === 'PokerCenter') {
    img.src = pokerCenter;
    ctx.canvas.width = 1024;
    ctx.canvas.height = 640;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      ctx.fill();
    };
    return;
  }
  if (screen === 'Bedroom') {
    img.src = cozyShack;
    ctx.canvas.width = 1024;
    ctx.canvas.height = 640;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = `rgba(255, 0,0,0.4)`;
      regions.forEach((region) => {
        const { x, y, w, h } = region.box;
        ctx.fillRect(x, y, w, h);
      });
      ctx.fill();
    };
    return;
  }
  if (screen === 'Laboratory') {
    img.src = laboratory;
    ctx.canvas.width = 1024;
    ctx.canvas.height = 640;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      ctx.fill();
    };
    return;
  }
  if (screen === 'PokerMart') {
    img.src = pokerMart;
    ctx.canvas.width = 1024;
    ctx.canvas.height = 640;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      ctx.fill();
    };
    return;
  }
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    ctx.fillStyle = `rgba(255, 0,0,0.4)`;
    regions.forEach((region) => {
      const { x, y, w, h } = region.box;
      ctx.fillRect(x, y, w, h);
    });
    ctx.fillStyle = `rgba(0,0,255,1)`;
    ctx.beginPath();
    ctx.arc(mouseClick.x, mouseClick.y, 20, 0, Math.PI * 2);
    ctx.fill();
  };
}

function getHitRegion(
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  regions: ClickableRegion[]
): ClickableRegion | undefined {
  const rect = canvas.getBoundingClientRect();
  mouseClick.x = e.clientX - rect.left;
  mouseClick.y = e.clientY - rect.top;

  const hit = regions.find((region) =>
    inBox(mouseClick.x, mouseClick.y, region.box)
  );

  return hit;
}

export default function Canvas({ ...props }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { updateScreen, updateMenu, screen } = useScreenStore();
  const regions = RegionsByScreen[screen];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const region = getHitRegion(e, canvasRef.current!, regions);
      if (!region) return;
      switch (region.type) {
        case 'SCREEN':
          updateScreen(region.screen);
          updateMenu(region.defaultMenu);
          if (region.screen !== screen) {
            const ctx = canvasRef.current!.getContext('2d')!;
            draw(ctx, region.screen, RegionsByScreen[region.screen]);
          }
          break;
        case 'INFO':
          updateMenu(region.menu);
          break;
        default:
          break;
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [screen, regions, updateScreen, updateMenu]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    const context = canvas.getContext('2d');
    if (context) {
      draw(context, screen, regions);
    }

    function handleCanvasCursor(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      if (regions.some((region) => inBox(mouseX, mouseY, region.box))) {
        canvas!.style.cursor = 'pointer';
      } else {
        canvas!.style.cursor = 'default';
      }
    }

    function handleExitCanvasCursor() {
      canvas!.style.cursor = 'default';
    }

    canvas.addEventListener('mousemove', handleCanvasCursor);
    canvas.addEventListener('mouseout', handleExitCanvasCursor);

    return () => {
      canvas.removeEventListener('mousemove', handleCanvasCursor);
      canvas.removeEventListener('mouseout', handleExitCanvasCursor);
    };
  }, [regions, screen]);

  return <canvas ref={canvasRef} {...props} />;
}
