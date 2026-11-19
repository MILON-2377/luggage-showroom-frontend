


"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Factory, Images, Pause, Play } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { CopyProps, ProductPhoto } from "../types/manufacturing.types";
import { getWorkshopTimeline, smoothStep } from "./workshop-timeline";

interface SpriteFrame {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  foot: number;
}
interface LoadedPhoto {
  photo: ProductPhoto;
  image: HTMLImageElement;
  crop: { x: number; y: number; width: number; height: number };
}
const ART_WIDTH = 1672,
  ART_HEIGHT = 941;
const ASSET_ROOT = "/";
const BOY_FRAMES: SpriteFrame[] = [
  { sx: 281, sy: 12, sw: 305, sh: 862, foot: 136.88417586674416 },
  { sx: 1126, sy: 49, sw: 459, sh: 825, foot: 110.96995216600419 },
];
const GIRL_FRAMES: SpriteFrame[] = [
  { sx: 163, sy: 28, sw: 384, sh: 692, foot: 273.5556465769456 },
  { sx: 964, sy: 8, sw: 247, sh: 712, foot: 131.8056628056628 },
  { sx: 1637, sy: 9, sw: 398, sh: 712, foot: 126.20915108582045 },
];
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image unavailable: " + src));
    image.src = src;
  });
}
function getPhotoCrop(image: HTMLImageElement) {
  const fallback = {
    x: 0,
    y: 0,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
  try {
    const scan = document.createElement("canvas");
    scan.width = 256;
    scan.height = Math.max(
      1,
      Math.round((256 * image.naturalHeight) / image.naturalWidth),
    );
    const context = scan.getContext("2d");
    if (!context) return fallback;
    context.drawImage(image, 0, 0, scan.width, scan.height);
    const data = context.getImageData(0, 0, scan.width, scan.height).data;
    let left = scan.width,
      right = 0,
      top = scan.height,
      bottom = 0;
    for (let y = 0; y < scan.height; y++)
      for (let x = 0; x < scan.width; x++) {
        if (data[(y * scan.width + x) * 4 + 3] > 24) {
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
      }
    if (right <= left || bottom <= top) return fallback;
    left = Math.max(0, left - 2);
    top = Math.max(0, top - 2);
    right = Math.min(scan.width - 1, right + 2);
    bottom = Math.min(scan.height - 1, bottom + 2);
    return {
      x: (left / scan.width) * image.naturalWidth,
      y: (top / scan.height) * image.naturalHeight,
      width: ((right - left + 1) / scan.width) * image.naturalWidth,
      height: ((bottom - top + 1) / scan.height) * image.naturalHeight,
    };
  } catch {
    return fallback;
  }
}

export default function ManufacturingHeroScene({
  copy,
  photos: suppliedPhotos,
}: CopyProps & { photos: ProductPhoto[] }) {
  const photos = useMemo(() => {
    const source = suppliedPhotos.filter(
      (photo) => photo.conveyor !== false && !photo.src.includes("product-hero-3d"),
    );
    const preferred = ["photo-7", "photo-3", "photo-1"];
    return [
      ...preferred
        .map((id) => source.find((photo) => photo.id === id))
        .filter((photo): photo is ProductPhoto => Boolean(photo)),
      ...source.filter((photo) => !preferred.includes(photo.id)),
    ];
  }, [suppliedPhotos]);
  const canvas = useRef<HTMLCanvasElement>(null),
    time = useRef(0),
    offset = useRef(0),
    playingRef = useRef(true);
  const [playing, setPlaying] = useState(true),
    [reduced, setReduced] = useState(false),
    [state, setState] = useState<"loading" | "ready" | "failed">("loading"),
    [current, setCurrent] = useState(0),
    [stored, setStored] = useState(0);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = canvas.current;
    if (!element || !photos.length) return;
    const context = element.getContext("2d");
    if (!context) {
      setState("failed");
      return;
    }
    let disposed = false,
      frame = 0,
      previous = 0,
      visible = true,
      draw: () => void = () => {};
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const resize = new ResizeObserver(() => {
      const bounds = element.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 1.5);
      element.width = Math.max(1, Math.round(bounds.width * dpr));
      element.height = Math.max(1, Math.round(bounds.height * dpr));
      draw();
    });
    resize.observe(element);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(element);

    Promise.all([
      loadImage(ASSET_ROOT + "workshop.png"),
      loadImage(ASSET_ROOT + "worker-left.png"),
      loadImage(ASSET_ROOT + "worker-right.png"),
      Promise.all(
        photos.map(async (photo) => {
          try {
            const source = photo.src.startsWith("/manufacturing/products/")
              ? "/" + photo.src.slice(24)
              : photo.src.startsWith("/manufacturing/workspaces/")
                ? "/" + photo.src.slice(26)
                : photo.src;
            const image = await loadImage(source);
            return { photo, image, crop: getPhotoCrop(image) };
          } catch {
            return null;
          }
        }),
      ),
    ])
      .then(([background, boy, girl, loaded]) => {
        if (disposed) return;
        const available = loaded.filter(
          (entry): entry is LoadedPhoto => entry !== null,
        );
        if (!available.length) {
          setState("failed");
          return;
        }
        setState("ready");
        function photoAt(index: number) {
          return available[
            ((index % available.length) + available.length) % available.length
          ];
        }
        function drawBag(
          index: number,
          x: number,
          bottom: number,
          scale = 1,
          angle = 0,
          shadow = false,
        ) {
          const entry = photoAt(index);
          const ratio = entry.crop.width / entry.crop.height;
          const width = Math.min(ART_WIDTH * 0.13, ART_HEIGHT * 0.36 * ratio) * scale,
            height = width / ratio;
          const px = x * ART_WIDTH,
            py = bottom * ART_HEIGHT;
          context!.save();
          if (shadow) {
            context!.fillStyle = "rgba(35,25,13,0.18)";
            context!.beginPath();
            context!.ellipse(px, py + 3, width * 0.42, 9 * scale, 0, 0, Math.PI * 2);
            context!.fill();
          }
          context!.translate(px, py);
          context!.rotate(angle);
          context!.drawImage(
            entry.image,
            entry.crop.x,
            entry.crop.y,
            entry.crop.width,
            entry.crop.height,
            -width / 2,
            -height,
            width,
            height,
          );
          context!.restore();
        }
        function drawPose(
          image: HTMLImageElement,
          frames: SpriteFrame[],
          pose: number,
          footX: number,
          bend = 0,
          alpha = 1,
        ) {
          if (alpha <= 0) return;
          const f = frames[pose];
          const maxHeight = Math.max(...frames.map((item) => item.sh));
          const scale = (ART_HEIGHT * 0.86) / maxHeight;
          const height = f.sh * scale,
            width = f.sw * scale,
            x = footX * ART_WIDTH - f.foot * scale,
            y = ART_HEIGHT * 0.95 - height;
          context!.save();
          context!.globalAlpha = alpha;
          if (bend !== 0) {
            const hipY = ART_HEIGHT * 0.58;
            context!.save();
            context!.beginPath();
            context!.rect(0, hipY, ART_WIDTH, ART_HEIGHT);
            context!.clip();
            context!.drawImage(image, f.sx, f.sy, f.sw, f.sh, x, y, width, height);
            context!.restore();
            context!.translate(footX * ART_WIDTH, hipY);
            context!.rotate(bend);
            context!.translate(-footX * ART_WIDTH, -hipY);
            context!.beginPath();
            context!.rect(-ART_WIDTH, -ART_HEIGHT, ART_WIDTH * 3, hipY + ART_HEIGHT);
            context!.clip();
          }
          context!.drawImage(image, f.sx, f.sy, f.sw, f.sh, x, y, width, height);
          context!.restore();
        }
        function blendPose(
          image: HTMLImageElement,
          frames: SpriteFrame[],
          from: number,
          to: number,
          t: number,
          footX: number,
          bend = 0,
        ) {
          // Pose keyframes remain opaque; no double-exposed character silhouettes.
          drawPose(image, frames, t < 0.5 ? from : to, footX, bend);
        }
        let lastCycle = -1,
          lastStored = -1;
        draw = () => {
          if (disposed) return;
          const t = getWorkshopTimeline(time.current, available.length, offset.current);
          const phase = t.phase;
          context!.setTransform(
            element.width / ART_WIDTH,
            0,
            0,
            element.height / ART_HEIGHT,
            0,
            0,
          );
          context!.clearRect(0, 0, ART_WIDTH, ART_HEIGHT);
          context!.drawImage(background, 0, 0, ART_WIDTH, ART_HEIGHT);
          // A subtle moving sheen across the photographed roller bed.
          context!.save();
          context!.beginPath();
          context!.moveTo(ART_WIDTH * 0.17, ART_HEIGHT * 0.594);
          context!.lineTo(ART_WIDTH * 0.81, ART_HEIGHT * 0.594);
          context!.lineTo(ART_WIDTH * 0.835, ART_HEIGHT * 0.671);
          context!.lineTo(ART_WIDTH * 0.14, ART_HEIGHT * 0.671);
          context!.closePath();
          context!.clip();
          context!.lineWidth = 4;
          context!.strokeStyle = "rgba(255,246,218,0.09)";
          const shift = (time.current * 42) % 42;
          for (let x = -40; x < ART_WIDTH; x += 42) {
            context!.beginPath();
            context!.moveTo(x + shift, ART_HEIGHT * 0.59);
            context!.lineTo(x + shift - 22, ART_HEIGHT * 0.68);
            context!.stroke();
          }
          context!.restore();

          // Stored products remain on the three shelf levels; the display holds the last nine.
          for (let n = Math.max(0, t.storedCount - 9); n < t.storedCount; n++) {
            const slot = n % 9,
              row = Math.floor(slot / 3),
              column = slot % 3;
            drawBag(
              n + offset.current,
              0.888 + column * 0.041,
              0.344 + row * 0.111,
              0.28,
              0,
              false,
            );
          }
          const travel = smoothStep(t.travel);
          drawBag(t.left, lerp(0.265, 0.505, travel), 0.659, 1, 0, true);
          drawBag(t.middle, lerp(0.505, 0.745, travel), 0.659, 1, 0, true);

          // The arriving bag follows the girl's hands, then moves onto the shelf.
          const shelfSlot = t.cycle % 9,
            shelfRow = Math.floor(shelfSlot / 3),
            shelfColumn = shelfSlot % 3;
          const shelfX = 0.888 + shelfColumn * 0.041,
            shelfY = 0.344 + shelfRow * 0.111;
          // Body pose transitions are timed to the actual pickup, loading and shelf phases.
          const boyReach =
            phase < 4.3
              ? 0
              : phase < 4.6
                ? (phase - 4.3) / 0.3
                : phase < 5.7
                  ? 1
                  : phase < 6.1
                    ? 1 - (phase - 5.7) / 0.4
                    : 0;
          blendPose(boy, BOY_FRAMES, 0, 1, boyReach, 0.088);
          const shelfFoot = 0.79 + (shelfColumn - 1) * 0.014;
          if (phase < 0.8) blendPose(girl, GIRL_FRAMES, 0, 1, t.pickup, 0.84);
          else if (phase < 1.3)
            blendPose(
              girl,
              GIRL_FRAMES,
              1,
              2,
              (phase - 0.8) / 0.5,
              lerp(0.84, shelfFoot, smoothStep((phase - 0.8) / 0.5)),
              shelfRow * 0.27 * smoothStep((phase - 0.8) / 0.5),
            );
          else if (phase < 1.95)
            drawPose(girl, GIRL_FRAMES, 2, shelfFoot, shelfRow * 0.27);
          else if (phase < 2.4)
            blendPose(
              girl,
              GIRL_FRAMES,
              2,
              0,
              (phase - 1.95) / 0.45,
              lerp(shelfFoot, 0.84, smoothStep((phase - 1.95) / 0.45)),
              shelfRow * 0.27 * (1 - smoothStep((phase - 1.95) / 0.45)),
            );
          else drawPose(girl, GIRL_FRAMES, 0, 0.84);

          if (phase < 0.8) {
            const p = smoothStep(t.pickup);
            drawBag(
              t.outgoing,
              lerp(0.745, 0.815, p),
              lerp(0.659, 0.585, p),
              lerp(1, 0.84, p),
              -0.08 * p,
              false,
            );
          } else if (phase < 1.9) {
            const p = smoothStep(t.store);
            drawBag(
              t.outgoing,
              lerp(0.815, shelfX, p),
              lerp(0.585, shelfY, p),
              lerp(0.84, 0.28, p),
              -0.08 * (1 - p),
              false,
            );
          }
          if (phase >= 2.5) {
            const p = smoothStep(t.load);
            drawBag(
              t.incoming,
              lerp(0.19, 0.265, p),
              lerp(0.555, 0.659, p),
              lerp(0.88, 1, p),
              -0.08 * (1 - p),
              p > 0.85,
            );
          }

          const activeCount = 2 + (phase < 1.9 || phase >= 2.5 ? 1 : 0);
          element.dataset.visibleCount = String(activeCount);
          element.dataset.phase =
            phase < 0.8
              ? "collecting"
              : phase < 1.3
                ? "carrying"
                : phase < 1.9
                  ? "storing"
                  : phase < 2.5
                    ? "returning"
                    : phase < 4.4
                      ? "preparing"
                      : phase < 5.7
                        ? "loading"
                        : "travelling";
          element.dataset.storedCount = String(t.storedCount);
          element.dataset.currentPhotoId = photoAt(t.outgoing).photo.id;
          if (lastCycle !== t.cycle) {
            lastCycle = t.cycle;
            setCurrent(t.outgoing);
          }
          if (lastStored !== t.storedCount) {
            lastStored = t.storedCount;
            setStored(t.storedCount);
          }
        };
        function animate(timestamp: number) {
          if (disposed) return;
          frame = requestAnimationFrame(animate);
          const dt = previous ? Math.min((timestamp - previous) / 1000, 0.05) : 0;
          previous = timestamp;
          if (!visible) return;
          if (playingRef.current && !media.matches) time.current += dt;
          draw();
        }
        draw();
        frame = requestAnimationFrame(animate);
      })
      .catch(() => {
        if (!disposed) setState("failed");
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
    };
  }, [photos]);

  function change(delta: number) {
    offset.current =
      (((offset.current + delta) % Math.max(1, photos.length)) +
        Math.max(1, photos.length)) %
      Math.max(1, photos.length);
    time.current = 0;
    setCurrent(offset.current);
    setStored(0);
  }
  const focused = photos[current % Math.max(1, photos.length)];
  return (
    <div className="relative isolate overflow-hidden rounded-[32px] border border-[#d3b986]/40 bg-[#26231e] shadow-[3px_4px_0_#dbc79d,9px_12px_0_#7b633e,0_35px_50px_-25px_black] sm:rounded-[48px]">
      <div className="relative aspect-[1672/941] w-full overflow-hidden">
        <canvas
          ref={canvas}
          width={ART_WIDTH}
          height={ART_HEIGHT}
          role="img"
          aria-label={copy.hero.sceneLabel}
          data-visible-count="0"
          className={
            "absolute inset-0 h-full w-full " +
            (state === "ready" ? "opacity-100" : "opacity-0")
          }
        />
        {state !== "ready" && (
          <div
            role="status"
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-[#e6cfa1]"
          >
            <Images className="size-12" strokeWidth={1} />
            <p className="max-w-lg text-sm leading-7">
              {state === "failed" ? copy.hero.fallback : copy.hero.loading}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#cdb07b]/20 px-5 py-5 sm:px-8">
        <div>
          <p className="text-xs tracking-wide text-[#cdb17c]">{copy.photos.render}</p>
          <p aria-live="polite" className="mt-2 text-sm text-[#f1e4cb]">
            {focused
              ? (copy.photos.names[focused.id] ?? focused.name)
              : copy.photos.photos}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-[#d3c5ab]">
          <Factory className="size-4" aria-hidden="true" />
          <span>
            {copy.photos.photos}: {stored}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={copy.photos.previous}
            disabled={state !== "ready"}
            onClick={() => change(-1)}
            className="text-[#e1c99a] hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={playing ? copy.hero.pause : copy.hero.play}
            aria-pressed={!playing}
            disabled={state !== "ready" || reduced}
            onClick={() => setPlaying((value) => !value)}
            className="text-[#e1c99a] hover:bg-white/10 hover:text-white"
          >
            {playing ? <Pause /> : <Play />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={copy.photos.next}
            disabled={state !== "ready"}
            onClick={() => change(1)}
            className="text-[#e1c99a] hover:bg-white/10 hover:text-white"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
