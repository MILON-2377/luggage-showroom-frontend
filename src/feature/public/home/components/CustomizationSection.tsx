"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowUpRight,
  ChevronRight,
  PencilRuler,
  Tag,
  Layers3,
  Palette,
  Package,
  RotateCcw,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Check,
  ImageOff,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

type Finish = "original" | "burgundy" | "black" | "beige" | "olive" | "silver";
type ModelName = "camo" | "wristlet" | "pink";
export interface CustomizationBag {
  id: string;
  src: string;
  /** Optional localized name supplied by your API. */
  name?: string;
  /** Otherwise use one of the dictionary-backed model labels. */
  labelKey?: ModelName;
}
export interface CustomizationSectionProps {
  bags?: readonly CustomizationBag[];
  /** Plays each bag once when the section enters view; it does not loop forever. */
  autoPlay?: boolean;
  artworkSrc?: string;
}
export const defaultCustomizationBags: readonly CustomizationBag[] = [
  { id: "camo", src: "/7.png", labelKey: "camo" },
  { id: "wristlet", src: "/3.png", labelKey: "wristlet" },
  { id: "pink", src: "/bag-closed-pink.png", labelKey: "pink" },
];
const finishes: { id: Finish; hex: string }[] = [
  { id: "original", hex: "#244bba" },
  { id: "burgundy", hex: "#792a3e" },
  { id: "beige", hex: "#d4bd91" },
  { id: "olive", hex: "#788477" },
  { id: "black", hex: "#313235" },
  { id: "silver", hex: "#a7a9ac" },
];
const featureIcons = [PencilRuler, Tag, Layers3, Palette, Package];
const SETTLED = 1.6;
type Surface = {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  w: number;
  h: number;
};
type Model = {
  original: Surface;
  tinted: Map<Finish, Surface>;
  readable: boolean;
};
type Sound = { context: AudioContext; nodes: AudioScheduledSourceNode[] };

function loadModel(src: string): Promise<Model> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    if (/^https?:\/\//i.test(src)) image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(
        1,
        1000 / Math.max(image.naturalWidth, image.naturalHeight),
      );
      canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      let x = 0,
        y = 0,
        w = canvas.width,
        h = canvas.height,
        readable = true;
      try {
        const data = ctx.getImageData(0, 0, w, h).data;
        const rows = new Int32Array(h),
          cols = new Int32Array(w);
        for (let py = 0; py < h; py++)
          for (let px = 0; px < w; px++) {
            if (data[(py * w + px) * 4 + 3] > 160) {
              rows[py]++;
              cols[px]++;
            }
          }
        const rowThreshold = Math.max(2, Math.floor(w * 0.025));
        const colThreshold = Math.max(2, Math.floor(h * 0.025));
        const top = rows.findIndex((value) => value > rowThreshold);
        const left = cols.findIndex((value) => value > colThreshold);
        let bottom = h - 1,
          right = w - 1;
        while (bottom > top && rows[bottom] <= rowThreshold) bottom--;
        while (right > left && cols[right] <= colThreshold) right--;
        if (top >= 0 && left >= 0) {
          x = left;
          y = top;
          w = right - left + 1;
          h = bottom - top + 1;
        }
      } catch {
        readable = false;
      }
      resolve({
        original: { canvas, x, y, w, h },
        tinted: new Map(),
        readable,
      });
    };
    image.onerror = () => reject(new Error("Photo could not be loaded"));
    image.src = src;
  });
}

function finishSurface(model: Model, finish: Finish): Surface {
  if (finish === "original" || !model.readable) return model.original;
  const cached = model.tinted.get(finish);
  if (cached) return cached;
  const original = model.original,
    canvas = document.createElement("canvas");
  canvas.width = original.canvas.width;
  canvas.height = original.canvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;
  ctx.drawImage(original.canvas, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height),
    data = pixels.data;
  const hex = finishes.find((item) => item.id === finish)!.hex;
  const rgb = [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));
  for (let i = 0; i < data.length; i += 4) {
    if (!data[i + 3]) continue;
    const high = Math.max(data[i], data[i + 1], data[i + 2]),
      low = Math.min(data[i], data[i + 1], data[i + 2]);
    // Preserve very dark hardware while recoloring the visible body and fabric.
    if (high < 42 || (high - low < 15 && high < 90)) continue;
    const lum =
      (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    const shade = Math.min(1.3, 0.43 + lum * 0.92),
      highlight = Math.max(0, lum - 0.66) * 0.65;
    for (let channel = 0; channel < 3; channel++)
      data[i + channel] = Math.min(
        255,
        rgb[channel] * shade + (255 - rgb[channel]) * highlight,
      );
  }
  ctx.putImageData(pixels, 0, 0);
  const surface = { ...original, canvas };
  model.tinted.set(finish, surface);
  return surface;
}

function arrival(age: number) {
  if (age < 0.12) return { y: -1.15, rotation: -0.14, opacity: 0, scale: 1.85 };
  if (age < 0.78) {
    const p = (age - 0.12) / 0.66;
    return {
      y: -1.15 * (1 - p * p),
      rotation: -0.14 * (1 - p),
      opacity: Math.min(1, p * 4),
      scale: 1.85 - 0.85 * Math.pow(p, 2.6),
    };
  }
  if (age < SETTLED) {
    const p = (age - 0.78) / 0.82;
    return {
      y: Math.sin(p * Math.PI * 3) * 0.035 * Math.pow(1 - p, 2),
      rotation: Math.sin(p * Math.PI * 2) * 0.025 * (1 - p),
      opacity: 1,
      scale: 1 + Math.sin(p * Math.PI * 3) * 0.07 * Math.pow(1 - p, 2),
    };
  }
  return { y: 0, rotation: 0, opacity: 1, scale: 1 };
}

function drawWeather(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  age: number,
) {
  ctx.clearRect(0, 0, width, height);
  if (age < 0.12 || age >= SETTLED) return;
  ctx.save();
  ctx.scale(width / 1280, height / 800);
  const descent = Math.min(1, (age - 0.12) / 0.5),
    impact = Math.max(0, 1 - Math.abs(age - 0.8) / 0.15),
    release = age < 1.05 ? 1 : Math.max(0, (SETTLED - age) / 0.55);
  const energy = Math.max(descent * 0.7, impact) * release;
  ctx.fillStyle = `rgba(26,27,46,${energy * 0.48})`;
  ctx.fillRect(0, 0, 1280, 800);
  ctx.strokeStyle = `rgba(241,222,179,${energy * 0.65})`;
  ctx.lineWidth = 1.7;
  for (let i = 0; i < 140; i++) {
    const x = ((((i * 137.6 - age * 330) % 1500) + 1500) % 1500) - 110,
      y = ((i * 71.3 + age * 1100) % 1020) - 110;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 24, y + 67);
    ctx.stroke();
  }
  function bolt(points: number[][], opacity: number) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = "#fff2ce";
    ctx.lineWidth = 4.2;
    ctx.shadowColor = "#f9dc99";
    ctx.shadowBlur = 28;
    ctx.beginPath();
    points.forEach((p, i) =>
      i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]),
    );
    ctx.stroke();
    ctx.lineWidth = 1.7;
    ctx.stroke();
    ctx.restore();
  }
  const first = Math.max(0, 1 - Math.abs(age - 0.44) / 0.13),
    second = Math.max(0, 1 - Math.abs(age - 0.82) / 0.2);
  bolt(
    [
      [1080, -25],
      [1015, 80],
      [1052, 90],
      [959, 225],
      [1000, 202],
      [952, 331],
    ],
    first * 0.95,
  );
  bolt(
    [
      [748, -20],
      [699, 101],
      [743, 92],
      [685, 224],
      [724, 203],
      [688, 342],
    ],
    second,
  );
  bolt(
    [
      [1239, 46],
      [1195, 128],
      [1210, 153],
      [1159, 231],
    ],
    second * 0.65,
  );
  bolt(
    [
      [1002, 195],
      [1070, 231],
      [1027, 247],
      [1089, 295],
    ],
    first * 0.9,
  );
  if (age > 0.78) {
    const p = (age - 0.78) / 0.82;
    ctx.globalAlpha = (1 - p) * 0.9;
    ctx.strokeStyle = "#fff0c0";
    ctx.lineWidth = 5 * (1 - p) + 1;
    ctx.beginPath();
    ctx.ellipse(900, 530, 95 + p * 280, 13 + p * 48, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

export default function CustomizationSection({
  bags = defaultCustomizationBags,
  autoPlay = true,
  artworkSrc = "/backgrounds.webp",
}: CustomizationSectionProps) {
  const { t } = useLanguage();
  const copy = t.customization,
    motion = copy.motion;
  const headline = copy.title.match(/^(.+?[.。，,])\s*(.+)$/u);
  const router = useRouter(),
    id = useId();
  const list = bags.length ? bags : defaultCustomizationBags;
  const [selected, setSelected] = useState(0),
    [finish, setFinish] = useState<Finish>("original"),
    [feature, setFeature] = useState(2);
  const [visible, setVisible] = useState(false),
    [reduced, setReduced] = useState(false),
    [paused, setPaused] = useState(false),
    [soundOn, setSoundOn] = useState(false);
  const [model, setModel] = useState<Model | null>(null),
    [failed, setFailed] = useState(false),
    [run, setRun] = useState(0);
  const root = useRef<HTMLElement>(null),
    frame = useRef<HTMLDivElement>(null),
    stage = useRef<HTMLDivElement>(null);
  const product = useRef<HTMLCanvasElement>(null),
    weather = useRef<HTMLCanvasElement>(null);
  const cache = useRef(new Map<string, Promise<Model>>()),
    audio = useRef<Sound | null>(null),
    enabledSound = useRef(false);
  const time = useRef(0),
    automatic = useRef(autoPlay),
    finishRef = useRef<Finish>("original"),
    soundPlayed = useRef(false);
  const colorBlend = useRef({ previous: "original" as Finish, started: 0 });
  const currentIndex = Math.min(selected, list.length - 1),
    bag = list[currentIndex];
  const bagName = (item: CustomizationBag) =>
    item.name || motion.models[item.labelKey || "camo"];
  const finishName = (value: Finish) =>
    value === "original"
      ? motion.original
      : value === "burgundy"
        ? motion.burgundy
        : copy.colors[value];

  const stopSound = useCallback(() => {
    audio.current?.nodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        /* Already stopped. */
      }
    });
    if (audio.current) audio.current.nodes = [];
  }, []);
  function enableAudio() {
    if (!audio.current)
      audio.current = { context: new AudioContext(), nodes: [] };
    void audio.current.context.resume();
  }
  const thunder = useCallback(
    (remaining: number) => {
      const sound = audio.current;
      if (
        !enabledSound.current ||
        !sound ||
        sound.context.state !== "running" ||
        remaining <= 0.05
      )
        return;
      stopSound();
      const context = sound.context,
        now = context.currentTime,
        duration = Math.min(1.5, remaining);
      const buffer = context.createBuffer(
          1,
          Math.ceil(context.sampleRate * duration),
          context.sampleRate,
        ),
        data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = context.createBufferSource(),
        low = context.createBiquadFilter(),
        gain = context.createGain();
      noise.buffer = buffer;
      low.type = "lowpass";
      low.frequency.value = 470;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(
        0.64,
        now + Math.min(0.15, duration / 3),
      );
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      gain.gain.setValueAtTime(0, now + duration);
      noise.connect(low).connect(gain).connect(context.destination);
      noise.start(now);
      noise.stop(now + duration);
      sound.nodes.push(noise);
    },
    [stopSound],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let live = true;
    setModel(null);
    setFailed(false);
    stopSound();
    let promise = cache.current.get(bag.src);
    if (!promise) {
      promise = loadModel(bag.src);
      cache.current.set(bag.src, promise);
    }
    promise
      .then((value) => {
        if (live) {
          setModel(value);
          time.current = 0;
          soundPlayed.current = false;
        }
      })
      .catch(() => {
        cache.current.delete(bag.src);
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [bag.src, stopSound]);
  useEffect(() => {
    colorBlend.current = {
      previous: finishRef.current,
      started: performance.now(),
    };
    finishRef.current = finish;
  }, [finish]);
  useEffect(() => {
    time.current = 0;
    soundPlayed.current = false;
    stopSound();
  }, [run, stopSound]);
  useEffect(
    () => () => {
      stopSound();
      void audio.current?.context.close();
    },
    [stopSound],
  );

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) return;
      stopSound();
      if (frame.current) frame.current.style.transform = "none";
      const canvas = weather.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [stopSound]);

  useEffect(() => {
    const holder = stage.current,
      main = product.current,
      overlay = weather.current,
      wrapper = frame.current;
    if (!holder || !main || !overlay || !wrapper) return;
    const ctx = main.getContext("2d"),
      storm = overlay.getContext("2d");
    if (!ctx || !storm) return;
    let width = 1,
      height = 1,
      fullWidth = 1,
      fullHeight = 1,
      dpr = 1,
      raf = 0,
      last = performance.now(),
      rendered = "",
      hadStorm = false,
      wasMoving = false;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = holder.clientWidth;
      height = holder.clientHeight;
      fullWidth = wrapper.clientWidth;
      fullHeight = wrapper.clientHeight;
      main.width = Math.round(width * dpr);
      main.height = Math.round(height * dpr);
      overlay.width = Math.round(fullWidth * dpr);
      overlay.height = Math.round(fullHeight * dpr);
      rendered = "";
    };
    const observer = new ResizeObserver(resize);
    observer.observe(holder);
    observer.observe(wrapper);
    resize();
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (model && visible && !paused && !reduced && !document.hidden)
        time.current += dt;
      const age = reduced || paused || !visible || document.hidden ? SETTLED : time.current,
        pose = arrival(age),
        shaking = age >= 0.12 && age < SETTLED;
      const mix = reduced
        ? 1
        : Math.min(1, (now - colorBlend.current.started) / 450);
      const key = `${finishRef.current}/${width}/${height}/${model ? 1 : 0}`;
      if (age < SETTLED || wasMoving || mix < 1 || rendered !== key) {
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx!.clearRect(0, 0, width, height);
        if (model) {
          const current = finishSurface(model, finishRef.current);
          const objectHeight =
            Math.min(height * 0.72, (width * 0.9 * current.h) / current.w) *
            pose.scale;
          const objectWidth = (objectHeight * current.w) / current.h,
            bottom =
              height * (fullWidth >= 1024 ? 0.94 : 0.64) + pose.y * height;
          function draw(surface: Surface, opacity: number) {
            ctx!.save();
            ctx!.globalAlpha = pose.opacity * opacity;
            ctx!.translate(width * 0.53, bottom - objectHeight / 2);
            ctx!.rotate(pose.rotation);
            ctx!.shadowColor = "#281a1555";
            ctx!.shadowBlur = 15;
            ctx!.shadowOffsetY = 12;
            ctx!.drawImage(
              surface.canvas,
              surface.x,
              surface.y,
              surface.w,
              surface.h,
              -objectWidth / 2,
              -objectHeight / 2,
              objectWidth,
              objectHeight,
            );
            ctx!.restore();
          }
          if (mix < 1 && colorBlend.current.previous !== finishRef.current) {
            draw(finishSurface(model, colorBlend.current.previous), 1);
            draw(current, 1 - Math.pow(1 - mix, 3));
          } else draw(current, 1);
        }
        rendered = key;
      }
      wasMoving = age < SETTLED;
      if (shaking || hadStorm) {
        storm!.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawWeather(storm!, fullWidth, fullHeight, age);
      }
      hadStorm = shaking;
      if (shaking && model) {
        const impact = Math.max(0, 1 - Math.abs(age - 0.8) / 0.2),
          decay = age < 1 ? 1 : Math.max(0, (SETTLED - age) / 0.6),
          power = (19 + impact * 33) * decay;
        const factor = Math.min(1, fullWidth / 1280),
          x = (Math.sin(age * 93) + Math.sin(age * 147) * 0.4) * power * factor,
          y =
            (Math.cos(age * 117) + Math.sin(age * 79) * 0.3) *
            power *
            0.65 *
            factor;
        wrapper!.style.transform = `translate3d(${x}px,${y}px,0) rotate(${Math.sin(age * 87) * power * 0.00045}rad) scale(1.15)`;
        if (!soundPlayed.current && age >= 0.68) {
          thunder(SETTLED - age);
          soundPlayed.current = true;
        }
      } else {
        wrapper!.style.transform = "none";
        stopSound();
      }
      wrapper!.dataset.storm = String(shaking && Boolean(model));
      wrapper!.dataset.settled = String(age >= SETTLED);
      wrapper!.dataset.scale = pose.scale.toFixed(3);
      if (
        model &&
        visible &&
        !paused &&
        !reduced &&
        autoPlay &&
        automatic.current &&
        time.current >= 7 &&
        currentIndex < list.length - 1
      ) {
        time.current = 0;
        setFinish("original");
        setSelected(currentIndex + 1);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      wrapper.style.transform = "none";
      storm.clearRect(0, 0, overlay.width, overlay.height);
      stopSound();
    };
  }, [
    model,
    visible,
    paused,
    reduced,
    autoPlay,
    currentIndex,
    list.length,
    stopSound,
    thunder,
  ]);

  function chooseBag(index: number) {
    automatic.current = false;
    setPaused(false);
    setSelected(index);
    setFinish("original");
    setRun((value) => value + 1);
  }
  function replay() {
    automatic.current = false;
    setPaused(false);
    setRun((value) => value + 1);
  }

  return (
    <section
      ref={root}
      aria-labelledby={`${id}-title`}
      className="relative isolate overflow-hidden bg-background text-[#2b211b]"
    >
      <div
        ref={frame}
        className="relative origin-center will-change-transform"
        data-storm="false"
      >
        <Image
          src={artworkSrc}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="pointer-events-none -z-10 hidden object-fill lg:block"
        />
        <div className="mx-auto grid max-w-[1480px] items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.25fr] lg:gap-8 lg:px-12 lg:py-20 xl:gap-14">
          <div className="relative z-10">
            <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[.22em] text-[#743d32] sm:text-sm">
              <span className="h-px w-10 bg-[#ad8851]" aria-hidden="true" />
              {copy.eyebrow}
            </p>
            <h2
              id={`${id}-title`}
              className="mt-6 max-w-xl text-balance font-serif text-4xl font-normal leading-[1.06] tracking-tight sm:text-5xl xl:text-[58px]"
            >
              {headline ? (
                <>
                  <em className="block font-normal text-[#70232e]">
                    {headline[1]}
                  </em>
                  {headline[2]}
                </>
              ) : (
                copy.title
              )}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#756454]">
              {copy.description}
            </p>
            <div className="mt-7 space-y-1">
              {copy.features.map((item, index) => {
                const Icon = featureIcons[index % featureIcons.length],
                  active = feature === index;
                return (
                  <div
                    key={item.number}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setFeature(index);
                    }}
                    className={
                      "relative rounded-2xl border transition-[background-color,box-shadow,border-color] duration-300 motion-reduce:transition-none " +
                      (active
                        ? "border-[#d4b789] bg-[#f8ecdb]/90 shadow-[0_5px_0_#c5a37855,0_10px_18px_#60442220,inset_0_1px_0_#fffdf5]"
                        : "border-transparent border-b-[#bca582]/40")
                    }
                  >
                    <h3>
                      <Button
                        variant="ghost"
                        aria-expanded={active}
                        aria-controls={`${id}-feature-${index}`}
                        onFocus={() => setFeature(index)}
                        onClick={() => setFeature(index)}
                        className="h-auto w-full justify-start gap-4 whitespace-normal rounded-2xl px-4 py-4 text-left font-serif text-xl font-normal text-[#38271d] hover:bg-transparent hover:text-[#702a31] sm:text-[23px]"
                      >
                        <span
                          className={
                            "flex size-11 shrink-0 items-center justify-center rounded-xl border " +
                            (active
                              ? "border-[#d7b66d] bg-[linear-gradient(145deg,#8b2838,#49111e)] text-[#efd5a1] shadow-[0_3px_5px_#52202240,inset_0_1px_0_#ffffff40]"
                              : "border-transparent text-[#986737]")
                          }
                        >
                          <Icon
                            aria-hidden="true"
                            className="size-6"
                            strokeWidth={1.3}
                          />
                        </span>
                        <span className="flex-1">{item.title}</span>
                        <ChevronRight
                          aria-hidden="true"
                          className={
                            "size-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none " +
                            (active ? "rotate-90" : "")
                          }
                        />
                      </Button>
                    </h3>
                    <div
                      id={`${id}-feature-${index}`}
                      aria-hidden={!active}
                      className={
                        "grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none " +
                        (active
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0")
                      }
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="pb-4 pl-[76px] pr-5 text-sm leading-7 text-[#756454]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              onClick={() => router.push("/oem-odm")}
              className="group mt-8 h-auto max-w-full gap-5 whitespace-normal rounded-full border border-[#e9c58a] bg-[linear-gradient(180deg,#922e3d,#49131f)] py-2 pl-7 pr-2 text-left font-serif text-lg font-normal text-[#fff0d5] shadow-[0_3px_0_#9c713e,0_8px_16px_#623b2b35,inset_0_1px_0_#ffe8b199] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:bg-[#60202c] hover:shadow-[0_4px_0_#9c713e,0_12px_18px_#623b2b45] motion-reduce:transform-none motion-reduce:transition-none"
            >
              {copy.cta}
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#ffe9bd] bg-[linear-gradient(130deg,#fff0c7,#c59c59)] text-[#57331f]">
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                />
              </span>
            </Button>
            <p className="mt-5 text-sm leading-7 text-[#756454]">{copy.note}</p>
          </div>

          <div className="relative min-w-0">
            <p className="relative z-10 text-right text-xs font-medium uppercase tracking-[.24em] text-[#804d3b]">
              {motion.atelier}
            </p>
            <div
              ref={stage}
              className="relative isolate mt-4 aspect-[1.15/1] min-h-[330px] sm:min-h-[440px] lg:min-h-[520px]"
            >
              <Image
                src={artworkSrc}
                alt=""
                fill
                unoptimized
                sizes="100vw"
                className="pointer-events-none -z-10 rounded-[30px] object-cover object-right lg:hidden"
              />
              {!model && !failed && (
                <Image
                  src={bag.src}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width:1024px) 650px, 90vw"
                  className="object-contain px-12 pb-20"
                />
              )}
              <canvas
                ref={product}
                role="img"
                aria-label={`${bagName(bag)} — ${finishName(finish)}`}
                className="absolute inset-0 h-full w-full"
              />
              {failed && (
                <div
                  role="status"
                  className="absolute inset-8 flex flex-col items-center justify-center gap-4 rounded-3xl bg-[#f5ebda]/90 p-7 text-center text-[#755846]"
                >
                  <ImageOff aria-hidden="true" className="size-9" />
                  <p className="max-w-xs text-base leading-7">
                    {motion.failed}
                  </p>
                </div>
              )}
              <span role="status" className="sr-only">
                {!model && !failed ? motion.loading : bagName(bag)}
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1 top-[15%] hidden sm:block"
              >
                <div className="size-16 rounded-xl border border-[#c5a46f] bg-[repeating-linear-gradient(35deg,#d2b888_0px,#d2b888_2px,#ede1c4_2px,#ede1c4_4px)] shadow-[3px_5px_8px_#70502a33]" />
                <span className="mt-3 block text-xs text-[#855d40]">
                  {motion.material}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-[40%] hidden sm:block"
              >
                <div className="ml-auto size-14 rounded-xl border border-[#caad7a] bg-[repeating-linear-gradient(140deg,#6c2533_0px,#6c2533_2px,#8f4651_2px,#8f4651_3px)] shadow-[3px_5px_8px_#70502a33]" />
                <span className="mt-3 block text-xs text-[#855d40]">
                  {motion.finish}
                </span>
              </div>
            </div>

            <div className="relative z-10 rounded-[26px] border border-[#d9c3a0] bg-[#f7ecdc]/95 p-5 shadow-[0_5px_0_#baa07a55,0_14px_25px_#60442222,inset_0_1px_0_#fffefa] backdrop-blur-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-[.17em] text-[#75463a]">
                  {motion.chooseBag}
                </h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={replay}
                    aria-label={motion.replay}
                    title={motion.replay}
                    className="size-9 rounded-full text-[#83582e] hover:bg-[#e6d3b2]"
                  >
                    <RotateCcw aria-hidden="true" className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={paused ? motion.resume : motion.pause}
                    title={paused ? motion.resume : motion.pause}
                    aria-pressed={paused}
                    onClick={() => {
                      setPaused((value) => !value);
                      stopSound();
                    }}
                    className="size-9 rounded-full text-[#83582e] hover:bg-[#e6d3b2]"
                  >
                    {paused ? (
                      <Play aria-hidden="true" className="size-4" />
                    ) : (
                      <Pause aria-hidden="true" className="size-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={soundOn ? motion.soundOff : motion.soundOn}
                    title={soundOn ? motion.soundOff : motion.soundOn}
                    aria-pressed={soundOn}
                    onClick={() => {
                      const next = !soundOn;
                      enabledSound.current = next;
                      setSoundOn(next);
                      if (next) enableAudio();
                      else stopSound();
                    }}
                    className="size-9 rounded-full text-[#83582e] hover:bg-[#e6d3b2]"
                  >
                    {soundOn ? (
                      <Volume2 aria-hidden="true" className="size-4" />
                    ) : (
                      <VolumeX aria-hidden="true" className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div
                className="mt-3 flex gap-3 overflow-x-auto pb-2"
                role="group"
                aria-label={motion.chooseBag}
              >
                {list.map((item, index) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    aria-label={bagName(item)}
                    aria-pressed={currentIndex === index}
                    onClick={() => chooseBag(index)}
                    className={
                      "relative h-[82px] min-w-[90px] flex-1 rounded-2xl border p-2 transition-[background-color,transform] hover:-translate-y-1 motion-reduce:transform-none " +
                      (currentIndex === index
                        ? "border-[#812f39] bg-[#e8d6bc] shadow-[inset_0_0_0_1px_#812f39]"
                        : "border-[#cdb792] bg-[#f1e5d1] hover:bg-[#e8d6bc]")
                    }
                  >
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      unoptimized
                      sizes="120px"
                      className="object-contain p-3"
                    />
                  </Button>
                ))}
              </div>
              <div className="mt-5 border-t border-[#c9af85]/50 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[.17em] text-[#75463a]">
                  {copy.colorLabel}
                </p>
                <div
                  role="group"
                  aria-label={copy.colorLabel}
                  className="mt-3 flex flex-wrap gap-3"
                >
                  {finishes.map((option) => (
                    <Button
                      key={option.id}
                      variant="ghost"
                      size="icon"
                      aria-label={finishName(option.id)}
                      title={finishName(option.id)}
                      aria-pressed={finish === option.id}
                      disabled={Boolean(
                        model && !model.readable && option.id !== "original",
                      )}
                      onClick={() => setFinish(option.id)}
                      className={
                        "size-11 rounded-full border p-1 transition-transform hover:scale-110 motion-reduce:transform-none " +
                        (finish === option.id
                          ? "border-[#7b2b36] shadow-[0_0_0_1px_#7b2b36]"
                          : "border-[#c5ab80]")
                      }
                    >
                      <span
                        className="flex size-full items-center justify-center rounded-full border border-black/10 shadow-[inset_0_2px_4px_#ffffff35,0_2px_4px_#38271930]"
                        style={{ backgroundColor: option.hex } as CSSProperties}
                      >
                        {finish === option.id && (
                          <Check
                            aria-hidden="true"
                            className="size-4 text-white drop-shadow"
                          />
                        )}
                      </span>
                    </Button>
                  ))}
                </div>
                <p
                  className="mt-3 text-sm font-medium text-[#663d31]"
                  aria-live="polite"
                >
                  {finishName(finish)}
                </p>
                <p className="mt-2 text-xs leading-6 text-[#806c58]">
                  {motion.colorNote}
                </p>
              </div>
            </div>
          </div>
        </div>
        <canvas
          ref={weather}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 h-full w-full"
        />
      </div>
    </section>
  );
}
