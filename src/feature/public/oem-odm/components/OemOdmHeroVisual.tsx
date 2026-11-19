// "use client";

// import { useEffect, useRef, useState } from "react";
// import type * as Three from "three";
// import { Hand, Pause, Play, ShoppingBag } from "lucide-react";
// import { Button } from "@/src/components/ui/button";
// import type { OemOdmCopy, MaterialId } from "../types/oem-odm.types";

// export default function OemOdmHeroVisual({
//   copy,
//   color,
//   material = "pu",
//   compact = false,
// }: {
//   copy: OemOdmCopy;
//   color: string;
//   material?: MaterialId;
//   compact?: boolean;
// }) {
//   const host = useRef<HTMLDivElement>(null);
//   const modelRef = useRef<Three.Group | null>(null);
//   const surfaceRef = useRef<Three.MeshPhongMaterial | null>(null);
//   const playingRef = useRef(true);
//   const [playing, setPlaying] = useState(true);
//   const [status, setStatus] = useState<"loading" | "ready" | "failed">(
//     "loading"
//   );

//   useEffect(() => {
//     playingRef.current = playing;
//   }, [playing]);

//   useEffect(() => {
//     surfaceRef.current?.color.set(color);
//   }, [color]);

//   useEffect(() => {
//     if (surfaceRef.current)
//       surfaceRef.current.shininess =
//         material === "pu" ? 65 : material === "eva" ? 18 : 4;
//   }, [material]);

//   useEffect(() => {
//     const mount = host.current;
//     if (!mount) return;
//     let disposed = false,
//       frame = 0,
//       cleanup = () => {};

//     import("three")
//       .then((T) => {
//         if (disposed) return;
//         let renderer: Three.WebGLRenderer;
//         try {
//           renderer = new T.WebGLRenderer({
//             alpha: true,
//             antialias: true,
//             powerPreference: "low-power",
//           });
//         } catch {
//           setStatus("failed");
//           return;
//         }

//         const scene = new T.Scene();
//         const camera = new T.PerspectiveCamera(33, 1, 0.1, 100);
//         camera.position.set(0, 0.6, 6.8);
//         camera.lookAt(0, 0.2, 0);

//         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//         renderer.outputColorSpace = T.SRGBColorSpace;
//         renderer.domElement.style.cssText =
//           "display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab;";
//         renderer.domElement.setAttribute("aria-hidden", "true");
//         mount.appendChild(renderer.domElement);

//         scene.add(new T.HemisphereLight(0xfff5df, 0x655444, 3));

//         const light = new T.DirectionalLight(0xffffff, 3.2);
//         light.position.set(-3, 5, 4);
//         scene.add(light);

//         const rim = new T.DirectionalLight(0xffd9b3, 2);
//         rim.position.set(4, 2, -2);
//         scene.add(rim);

//         const model = new T.Group();
//         model.rotation.set(-0.12, -0.42, -0.06);
//         scene.add(model);
//         modelRef.current = model;

//         const surface = new T.MeshPhongMaterial({
//           color,
//           shininess: material === "pu" ? 65 : material === "eva" ? 18 : 4,
//         });
//         surfaceRef.current = surface;

//         const gold = new T.MeshPhongMaterial({ color: 0xc6a66d, shininess: 100 });
//         const seam = new T.MeshPhongMaterial({ color: 0x695142, shininess: 15 });

//         function rounded(
//           w: number,
//           h: number,
//           d: number,
//           r: number,
//           mat: Three.Material
//         ) {
//           const s = new T.Shape();
//           const x = -w / 2,
//             y = -h / 2;
//           s.moveTo(x + r, y);
//           s.lineTo(x + w - r, y);
//           s.quadraticCurveTo(x + w, y, x + w, y + r);
//           s.lineTo(x + w, y + h - r);
//           s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
//           s.lineTo(x + r, y + h);
//           s.quadraticCurveTo(x, y + h, x, y + h - r);
//           s.lineTo(x, y + r);
//           s.quadraticCurveTo(x, y, x + r, y);
//           const g = new T.ExtrudeGeometry(s, {
//             depth: d,
//             bevelEnabled: true,
//             bevelSize: 0.045,
//             bevelThickness: 0.045,
//             bevelSegments: 3,
//             steps: 1,
//             curveSegments: 16,
//           });
//           g.translate(0, 0, -d / 2);
//           return new T.Mesh(g, mat);
//         }

//         const body = rounded(2.1, 1.55, 0.65, 0.24, surface);
//         model.add(body);

//         const front = rounded(1.92, 1.1, 0.035, 0.18, surface);
//         front.position.set(0, 0.13, 0.38);
//         model.add(front);

//         const edging = rounded(1.98, 1.15, 0.02, 0.19, seam);
//         edging.position.set(0, 0.13, 0.348);
//         model.add(edging);

//         const handle = new T.Mesh(
//           new T.TorusGeometry(0.43, 0.075, 14, 64, Math.PI),
//           surface
//         );
//         handle.position.set(0, 0.82, 0);
//         model.add(handle);

//         for (const x of [-0.43, 0.43]) {
//           const anchor = rounded(0.16, 0.28, 0.075, 0.05, gold);
//           anchor.position.set(x, 0.69, 0.18);
//           model.add(anchor);
//         }

//         const clasp = rounded(0.22, 0.28, 0.07, 0.035, gold);
//         clasp.position.set(0, -0.05, 0.45);
//         model.add(clasp);

//         const lock = rounded(0.075, 0.15, 0.02, 0.015, seam);
//         lock.position.set(0, -0.05, 0.5);
//         model.add(lock);

//         const pedestal = new T.Mesh(
//           new T.CylinderGeometry(1.55, 1.58, 0.13, 80),
//           new T.MeshPhongMaterial({ color: 0x34312b, shininess: 85 })
//         );
//         pedestal.position.y = -1.28;
//         scene.add(pedestal);

//         const ring = new T.Mesh(
//           new T.TorusGeometry(1.53, 0.018, 10, 100),
//           gold
//         );
//         ring.rotation.x = Math.PI / 2;
//         ring.position.y = -1.205;
//         scene.add(ring);

//         const shadow = new T.Mesh(
//           new T.CircleGeometry(0.95, 48),
//           new T.MeshBasicMaterial({
//             color: 0x000000,
//             transparent: true,
//             opacity: 0.24,
//             depthWrite: false,
//           })
//         );
//         shadow.rotation.x = -Math.PI / 2;
//         shadow.position.set(0, -1.204, 0);
//         scene.add(shadow);

//         const media = window.matchMedia("(prefers-reduced-motion: reduce)");
//         let visible = true,
//           dragging = false,
//           lastX = 0,
//           lastY = 0,
//           previous = 0,
//           shaderFailed = false;

//         renderer.debug.onShaderError = () => {
//           shaderFailed = true;
//         };

//         const resize = new ResizeObserver(() => {
//           if (!mount.clientWidth || !mount.clientHeight) return;
//           camera.aspect = mount.clientWidth / mount.clientHeight;
//           camera.updateProjectionMatrix();
//           renderer.setSize(mount.clientWidth, mount.clientHeight, false);
//         });
//         resize.observe(mount);

//         const intersection = new IntersectionObserver((entries) => {
//           visible = entries[0].isIntersecting;
//         });
//         intersection.observe(mount);

//         function down(e: PointerEvent) {
//           dragging = true;
//           lastX = e.clientX;
//           lastY = e.clientY;
//           renderer.domElement.setPointerCapture(e.pointerId);
//         }

//         function move(e: PointerEvent) {
//           if (!dragging) return;
//           model.rotation.y += (e.clientX - lastX) * 0.009;
//           model.rotation.x = Math.max(
//             -0.55,
//             Math.min(0.4, model.rotation.x + (e.clientY - lastY) * 0.006)
//           );
//           lastX = e.clientX;
//           lastY = e.clientY;
//         }

//         function up() {
//           dragging = false;
//         }

//         function lost(e: Event) {
//           e.preventDefault();
//           setStatus("failed");
//           cancelAnimationFrame(frame);
//         }

//         renderer.domElement.addEventListener("pointerdown", down);
//         renderer.domElement.addEventListener("pointermove", move);
//         renderer.domElement.addEventListener("pointerup", up);
//         renderer.domElement.addEventListener("lostpointercapture", up);
//         renderer.domElement.addEventListener("webglcontextlost", lost);

//         function animate(time: number) {
//           if (disposed) return;
//           frame = requestAnimationFrame(animate);
//           const delta = Math.min((time - previous) / 1000, 0.05);
//           previous = time;
//           if (!visible) return;
//           if (!media.matches && playingRef.current && !dragging)
//             model.rotation.y += delta * 0.3;
//           try {
//             renderer.render(scene, camera);
//             if (shaderFailed) {
//               setStatus("failed");
//               cancelAnimationFrame(frame);
//               return;
//             }
//             setStatus((s) => (s === "ready" ? s : "ready"));
//           } catch {
//             setStatus("failed");
//             cancelAnimationFrame(frame);
//           }
//         }
//         frame = requestAnimationFrame(animate);

//         cleanup = () => {
//           cancelAnimationFrame(frame);
//           resize.disconnect();
//           intersection.disconnect();
//           renderer.domElement.removeEventListener("pointerdown", down);
//           renderer.domElement.removeEventListener("pointermove", move);
//           renderer.domElement.removeEventListener("pointerup", up);
//           renderer.domElement.removeEventListener("lostpointercapture", up);
//           renderer.domElement.removeEventListener("webglcontextlost", lost);
//           const geometries = new Set<Three.BufferGeometry>(),
//             materials = new Set<Three.Material>();
//           scene.traverse((o) => {
//             if (o instanceof T.Mesh) {
//               geometries.add(o.geometry);
//               (Array.isArray(o.material) ? o.material : [o.material]).forEach(
//                 (m) => materials.add(m)
//               );
//             }
//           });
//           geometries.forEach((g) => g.dispose());
//           materials.forEach((m) => m.dispose());
//           renderer.dispose();
//           renderer.domElement.remove();
//           modelRef.current = null;
//           surfaceRef.current = null;
//         };
//       })
//       .catch(() => {
//         if (!disposed) setStatus("failed");
//       });

//     return () => {
//       disposed = true;
//       cleanup();
//     };
//     // Model resources are created once; color and material updates use the refs above.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="relative isolate overflow-hidden rounded-t-[160px] rounded-b-[32px] border border-[#b49a6b]/30 bg-[#1b1a17] shadow-[10px_12px_0_#d9cfba,0_32px_55px_-25px_#0007]">
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(205,174,111,0.2),transparent_65%)]"
//       />
//       <div
//         className={
//           "relative " + (compact ? "h-[280px]" : "h-[340px] sm:h-[440px]")
//         }
//       >
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute inset-[15%] rounded-full border border-[#c3a875]/20 [transform:rotate(-25deg)]"
//         />
//         <div
//           ref={host}
//           className={
//             "absolute inset-0 " + (status === "ready" ? "opacity-100" : "opacity-0")
//           }
//         />
//         {status !== "ready" && (
//           <div
//             role="status"
//             className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center text-[#ddc697]"
//           >
//             <ShoppingBag className="size-20" strokeWidth={0.8} />
//             <p className="max-w-xs text-sm leading-6">
//               {status === "loading" ? copy.hero.loading : copy.hero.fallback}
//             </p>
//           </div>
//         )}
//       </div>
//       <div className="relative mx-6 border-t border-white/10 py-5 text-[#eee7d8]">
//         {!compact && (
//           <>
//             <p className="text-sm text-[#d4b982]">{copy.hero.concept}</p>
//             <h3 className="mt-2 font-serif text-2xl">{copy.hero.visualTitle}</h3>
//             <p className="mt-3 text-sm leading-7 text-[#c6c1b7]">
//               {copy.hero.visualDescription}
//             </p>
//           </>
//         )}
//         <div className="mt-3 flex items-center justify-between gap-3">
//           <span className="flex items-center gap-2 text-xs text-[#c6c1b7]">
//             <Hand className="size-4" aria-hidden="true" />
//             {copy.hero.drag}
//           </span>
//           <Button
//             variant="ghost"
//             size="icon"
//             disabled={status !== "ready"}
//             aria-label={playing ? copy.hero.pause : copy.hero.play}
//             aria-pressed={!playing}
//             onClick={() => setPlaying((v) => !v)}
//             className="text-[#e4cc9e] hover:bg-white/10 hover:text-white"
//           >
//             {playing ? <Pause /> : <Play />}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";
// import Image from "next/image";
// import { useEffect, useRef, useState, type PointerEvent } from "react";
// import { Hand, Pause, Play, ShoppingBag } from "lucide-react";
// import { Button } from "@/src/components/ui/button";
// import type { OemOdmCopy, MaterialId } from "../types/oem-odm.types";
// const BAG_IMAGE = "/cream-wristlet-3d.png";
// interface OemOdmHeroVisualProps {
//     copy: OemOdmCopy;
//     color: string;
//     material?: MaterialId;
//     compact?: boolean;
// }
// // color/material props remain compatible with existing callers.
// // A single product photograph retains its original physical color and texture.
// export default function OemOdmHeroVisual({ copy, compact = false }: OemOdmHeroVisualProps) {
//     const surface = useRef<HTMLDivElement>(null);
//     const target = useRef({ x: 0, y: 0 });
//     const drag = useRef<{
//         id: number;
//         x: number;
//         y: number;
//     } | null>(null);
//     const playingRef = useRef(true);
//     const [playing, setPlaying] = useState(true);
//     const [reduced, setReduced] = useState(false);
//     const [loaded, setLoaded] = useState(false);
//     const [failed, setFailed] = useState(false);
//     useEffect(() => { playingRef.current = playing; }, [playing]);
//     useEffect(() => {
//         const media = window.matchMedia("(prefers-reduced-motion: reduce)");
//         const update = () => setReduced(media.matches);
//         update();
//         media.addEventListener("change", update);
//         return () => media.removeEventListener("change", update);
//     }, []);
//     useEffect(() => {
//         const element = surface.current;
//         if (!element)
//             return;
//         let frame = 0;
//         let x = 0;
//         let y = 0;
//         let elapsed = 0;
//         let previous = 0;
//         let visible = true;
//         const observer = new IntersectionObserver(([entry]) => {
//             visible = entry.isIntersecting;
//         });
//         observer.observe(element);
//         function animate(time: number) {
//             frame = requestAnimationFrame(animate);
//             const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
//             previous = time;
//             if (!visible || !element)
//                 return;
//             if (reduced) {
//                 element.style.transform = "none";
//                 return;
//             }
//             if (playingRef.current)
//                 elapsed += delta;
//             const blend = 1 - Math.exp(-delta * 9);
//             x += (target.current.x - x) * blend;
//             y += (target.current.y - y) * blend;
//             const float = Math.sin(elapsed * 1.25) * 7;
//             const sway = Math.sin(elapsed * 0.8) * 2;
//             element.style.transform =
//                 `translate3d(0,${float}px,35px) rotateX(${y}deg) rotateY(${x + sway}deg) rotateZ(-3deg)`;
//         }
//         frame = requestAnimationFrame(animate);
//         return () => {
//             cancelAnimationFrame(frame);
//             observer.disconnect();
//             element.style.removeProperty("transform");
//         };
//     }, [reduced]);
//     function move(event: PointerEvent<HTMLDivElement>) {
//         if (reduced)
//             return;
//         if (event.pointerType === "touch") {
//             if (drag.current?.id !== event.pointerId)
//                 return;
//             target.current = {
//                 x: Math.max(-16, Math.min(16, (event.clientX - drag.current.x) * 0.15)),
//                 y: Math.max(-8, Math.min(8, (drag.current.y - event.clientY) * 0.08)),
//             };
//             return;
//         }
//         const bounds = event.currentTarget.getBoundingClientRect();
//         target.current = {
//             x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 24,
//             y: (0.5 - (event.clientY - bounds.top) / bounds.height) * 12,
//         };
//     }
//     function reset() {
//         drag.current = null;
//         target.current = { x: 0, y: 0 };
//     }
//     return (<div className="relative isolate overflow-hidden rounded-t-[160px] rounded-b-[32px] border border-[#b49a6b]/30 bg-[#1b1a17] shadow-[10px_12px_0_#d9cfba,0_32px_55px_-25px_#0007]">
//       <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_35%_20%,rgba(205,174,111,0.2),transparent_65%)]"/>

//       <div className={"relative touch-pan-y [perspective:1000px] " + (compact ? "h-[300px]" : "h-[420px] sm:h-[520px]")} onPointerMove={move} onPointerDown={(event) => {
//             if (event.pointerType === "touch" && !reduced) {
//                 drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
//                 event.currentTarget.setPointerCapture(event.pointerId);
//             }
//         }} onPointerLeave={reset} onPointerUp={reset} onPointerCancel={reset} onLostPointerCapture={reset}>
//         <div aria-hidden="true" className="pointer-events-none absolute inset-x-[13%] bottom-[19%] top-[15%] rounded-full border border-[#d0b67f]/20 [transform:rotate(-25deg)]"/>
//         <div aria-hidden="true" className="pointer-events-none absolute inset-x-[20%] bottom-[11%] h-12 rounded-[50%] bg-black/60 blur-lg"/>

//         <div aria-hidden="true" className="pointer-events-none absolute inset-x-[15%] bottom-[7%] h-10 rounded-[50%] bg-gradient-to-r from-[#6f5936] via-[#d8bf8b] to-[#66502f] shadow-[0_12px_18px_-6px_black]"/>
//         <div aria-hidden="true" className="pointer-events-none absolute inset-x-[15%] bottom-[9%] h-10 rounded-[50%] border border-[#d8bf8b]/80 bg-gradient-to-br from-[#443d30] to-[#1a1917]"/>

//         <div ref={surface} className="pointer-events-none absolute inset-x-[12%] bottom-[15%] top-[7%] [transform-style:preserve-3d]">
//           <Image src={BAG_IMAGE} alt={`${copy.materials.colors.sand} · ${copy.hero.concept}`} fill priority sizes="(max-width: 640px) 75vw, (max-width: 1024px) 390px, 370px" draggable={false} onLoad={() => { setLoaded(true); setFailed(false); }} onError={() => { setLoaded(false); setFailed(true); }} className={"select-none object-contain drop-shadow-[12px_18px_16px_rgba(0,0,0,0.4)] transition-opacity duration-300 motion-reduce:transition-none " + (loaded && !failed ? "opacity-100" : "opacity-0")}/>
//         </div>

//         {(!loaded || failed) && (<div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center text-[#ddc697]">
//             <ShoppingBag className="size-16" strokeWidth={1} aria-hidden="true"/>
//             <p className="max-w-xs text-sm leading-7">{failed ? copy.hero.fallback : copy.hero.loading}</p>
//           </div>)}
//       </div>

//       <div className="relative mx-6 border-t border-white/10 py-5 text-[#eee7d8]">
//         {!compact && <>
//         <p className="text-sm text-[#d4b982]">{copy.hero.concept}</p>
//         <h3 className="mt-2 font-serif text-2xl">{copy.hero.visualTitle}</h3>
//         <p className="mt-3 text-sm leading-7 text-[#c6c1b7]">{copy.hero.visualDescription}</p>
//         </>}
//         <div className="mt-3 flex items-center justify-between gap-3">
//           <span className="flex items-center gap-2 text-xs text-[#c6c1b7]">
//             <Hand className="size-4" aria-hidden="true"/>
//             {copy.hero.drag}
//           </span>
//           <Button variant="ghost" size="icon" disabled={!loaded || failed || reduced} aria-label={playing ? copy.hero.pause : copy.hero.play} aria-pressed={!playing} onClick={() => setPlaying(value => !value)} className="text-[#e4cc9e] hover:bg-white/10 hover:text-white">
//             {playing ? <Pause aria-hidden="true"/> : <Play aria-hidden="true"/>}
//           </Button>
//         </div>
//       </div>
//     </div>);
// }







"use client";
import { useEffect, useRef, useState } from "react";
import type * as Three from "three";
import { Hand, Pause, Play, ShoppingBag } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { OemOdmCopy, MaterialId } from "../types/oem-odm.types";
export default function OemOdmHeroVisual({ copy, color, material = "pu", compact = false, }: {
    copy: OemOdmCopy;
    color: string;
    material?: MaterialId;
    compact?: boolean;
}) {
    const host = useRef<HTMLDivElement>(null);
    const modelRef = useRef<Three.Group | null>(null);
    const surfaceRef = useRef<Three.MeshPhongMaterial | null>(null);
    const playingRef = useRef(true);
    const [playing, setPlaying] = useState(true);
    const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
    useEffect(() => {
        playingRef.current = playing;
    }, [playing]);
    useEffect(() => {
        surfaceRef.current?.color.set(color);
    }, [color, status]);
    useEffect(() => {
        if (surfaceRef.current)
            surfaceRef.current.shininess =
                material === "pu" ? 65 : material === "eva" ? 18 : 4;
    }, [material, status]);
    useEffect(() => {
        const mount = host.current;
        if (!mount)
            return;
        let disposed = false, frame = 0, cleanup = () => { };
        import("three")
            .then((T) => {
            if (disposed)
                return;
            let renderer: Three.WebGLRenderer;
            try {
                renderer = new T.WebGLRenderer({
                    alpha: true,
                    antialias: true,
                    powerPreference: "low-power",
                });
            }
            catch {
                setStatus("failed");
                return;
            }
            const scene = new T.Scene();
            const camera = new T.PerspectiveCamera(33, 1, 0.1, 100);
            camera.position.set(0, 0.65, 7.8);
            camera.lookAt(0, 0.43, 0);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.outputColorSpace = T.SRGBColorSpace;
            renderer.domElement.style.cssText =
                "display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab;";
            renderer.domElement.setAttribute("aria-hidden", "true");
            mount.appendChild(renderer.domElement);
            scene.add(new T.HemisphereLight(0xfff5df, 0x655444, 3));
            const light = new T.DirectionalLight(0xffffff, 3.2);
            light.position.set(-3, 5, 4);
            scene.add(light);
            const rim = new T.DirectionalLight(0xffd9b3, 2);
            rim.position.set(4, 2, -2);
            scene.add(rim);
            const model = new T.Group();
            model.rotation.set(-0.06, -0.42, 0);
            scene.add(model);
            modelRef.current = model;
            const surface = new T.MeshPhongMaterial({
                color,
                shininess: material === "pu" ? 65 : material === "eva" ? 18 : 4,
            });
            surfaceRef.current = surface;
            const gold = new T.MeshPhongMaterial({ color: 0xc6a66d, shininess: 100 });
            const seam = new T.MeshPhongMaterial({ color: 0x695142, shininess: 15 });
            function rounded(w: number, h: number, d: number, r: number, mat: Three.Material) {
                const s = new T.Shape();
                const x = -w / 2, y = -h / 2;
                s.moveTo(x + r, y);
                s.lineTo(x + w - r, y);
                s.quadraticCurveTo(x + w, y, x + w, y + r);
                s.lineTo(x + w, y + h - r);
                s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                s.lineTo(x + r, y + h);
                s.quadraticCurveTo(x, y + h, x, y + h - r);
                s.lineTo(x, y + r);
                s.quadraticCurveTo(x, y, x + r, y);
                const g = new T.ExtrudeGeometry(s, {
                    depth: d,
                    bevelEnabled: true,
                    bevelSize: 0.045,
                    bevelThickness: 0.045,
                    bevelSegments: 3,
                    steps: 1,
                    curveSegments: 16,
                });
                g.translate(0, 0, -d / 2);
                return new T.Mesh(g, mat);
            }
            // A genuine, fully modeled wristlet. Hidden surfaces are inferred.
            const zipperMaterial = new T.MeshPhongMaterial({ color: 0x49463f, shininess: 22 });
            const teethMaterial = new T.MeshPhongMaterial({ color: 0x827b6d, shininess: 65 });
            const edgeMaterial = new T.MeshPhongMaterial({ color: 0x9d9279, shininess: 12 });
            const liningMaterial = new T.MeshPhongMaterial({ color: 0x514d44, shininess: 5 });
            const fabric = document.createElement("canvas");
            fabric.width = 128;
            fabric.height = 128;
            const context = fabric.getContext("2d");
            if (context) {
                context.fillStyle = "#888888";
                context.fillRect(0, 0, 128, 128);
                for (let y = 0; y < 128; y += 2) {
                    for (let x = 0; x < 128; x += 2) {
                        context.fillStyle = ((x * 17 + y * 29) % 13 < 6) ? "#747474" : "#999999";
                        context.fillRect(x, y, 1, 1);
                    }
                }
                const bump = new T.CanvasTexture(fabric);
                bump.wrapS = bump.wrapT = T.RepeatWrapping;
                bump.repeat.set(4, 4);
                surface.bumpMap = bump;
                surface.bumpScale = 0.007;
                surface.needsUpdate = true;
            }
            // Rounded EVA shells, modeled front and back rather than image planes.
            const core = rounded(1.85, 1.62, 0.31, 0.31, liningMaterial);
            model.add(core);
            const frontShell = rounded(1.82, 1.59, 0.16, 0.30, surface);
            frontShell.position.z = 0.19;
            model.add(frontShell);
            const backShell = rounded(1.82, 1.59, 0.16, 0.30, surface);
            backShell.position.z = -0.19;
            model.add(backShell);
            function roundedPath(w: number, h: number, radius: number, z: number) {
                const points: Three.Vector3[] = [];
                const corners = [
                    { x: w / 2 - radius, y: h / 2 - radius, a: 0 },
                    { x: -w / 2 + radius, y: h / 2 - radius, a: Math.PI / 2 },
                    { x: -w / 2 + radius, y: -h / 2 + radius, a: Math.PI },
                    { x: w / 2 - radius, y: -h / 2 + radius, a: Math.PI * 1.5 },
                ];
                for (const corner of corners) {
                    for (let step = 0; step <= 16; step++) {
                        const angle = corner.a + step / 16 * Math.PI / 2;
                        points.push(new T.Vector3(corner.x + Math.cos(angle) * radius, corner.y + Math.sin(angle) * radius, z));
                    }
                }
                return new T.CatmullRomCurve3(points, true, "centripetal");
            }
            const zipperPath = roundedPath(1.87, 1.64, 0.31, 0);
            const zipper = new T.Mesh(new T.TubeGeometry(zipperPath, 180, 0.029, 8, true), zipperMaterial);
            model.add(zipper);
            for (const z of [-0.115, 0.115]) {
                model.add(new T.Mesh(new T.TubeGeometry(roundedPath(1.87, 1.64, 0.31, z), 180, 0.018, 8, true), edgeMaterial));
            }
            const toothGeometry = new T.BoxGeometry(0.022, 0.038, 0.065);
            const teeth = new T.InstancedMesh(toothGeometry, teethMaterial, 180);
            const dummy = new T.Object3D();
            for (let i = 0; i < 180; i++) {
                const t = i / 180;
                const point = zipperPath.getPointAt(t);
                const tangent = zipperPath.getTangentAt(t);
                dummy.position.copy(point);
                dummy.rotation.set(0, 0, Math.atan2(tangent.y, tangent.x));
                dummy.updateMatrix();
                teeth.setMatrixAt(i, dummy.matrix);
            }
            model.add(teeth);
            // Narrow ribbon wrist loop with a real opening, side thickness and rivets.
            const strapCurve = new T.CatmullRomCurve3([
                new T.Vector3(0, 0.77, 0.11), new T.Vector3(0, 1.18, 0.14),
                new T.Vector3(0, 1.91, 0.15), new T.Vector3(0, 2.20, 0.03),
                new T.Vector3(0, 2.12, -0.11), new T.Vector3(0, 1.55, -0.13),
                new T.Vector3(0, 0.79, -0.11),
            ]);
            const strapSection = new T.Shape();
            strapSection.moveTo(-0.095, -0.014);
            strapSection.lineTo(0.095, -0.014);
            strapSection.lineTo(0.095, 0.014);
            strapSection.lineTo(-0.095, 0.014);
            strapSection.closePath();
            const strap = new T.Mesh(new T.ExtrudeGeometry(strapSection, { steps: 96, bevelEnabled: false, extrudePath: strapCurve }), surface);
            model.add(strap);
            for (const z of [-0.15, 0.15]) {
                const tab = rounded(0.20, 0.30, 0.025, 0.035, surface);
                tab.position.set(0, 0.84, z);
                model.add(tab);
                const rivet = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.022, 20), gold);
                rivet.rotation.x = Math.PI / 2;
                rivet.position.set(0, 0.86, z + (z > 0 ? 0.025 : -0.025));
                model.add(rivet);
            }
            const slider = rounded(0.10, 0.17, 0.07, 0.025, gold);
            slider.position.set(0.63, -0.74, 0.025);
            slider.rotation.z = -0.45;
            model.add(slider);
            const pullRing = new T.Mesh(new T.TorusGeometry(0.055, 0.015, 8, 20), gold);
            pullRing.position.set(0.68, -0.85, 0.055);
            model.add(pullRing);
            const pull = new T.Mesh(new T.TorusGeometry(0.075, 0.017, 8, 24), gold);
            pull.scale.y = 1.8;
            pull.position.set(0.73, -1.00, 0.08);
            pull.rotation.z = -0.4;
            model.add(pull);
            const hinge = rounded(0.65, 0.085, 0.22, 0.025, surface);
            hinge.position.y = -0.81;
            model.add(hinge);
            const pedestal = new T.Mesh(new T.CylinderGeometry(1.55, 1.58, 0.13, 80), new T.MeshPhongMaterial({ color: 0x34312b, shininess: 85 }));
            pedestal.position.y = -1.28;
            scene.add(pedestal);
            const ring = new T.Mesh(new T.TorusGeometry(1.53, 0.018, 10, 100), gold);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = -1.205;
            scene.add(ring);
            const shadow = new T.Mesh(new T.CircleGeometry(0.95, 48), new T.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.24,
                depthWrite: false,
            }));
            shadow.rotation.x = -Math.PI / 2;
            shadow.position.set(0, -1.204, 0);
            scene.add(shadow);
            const media = window.matchMedia("(prefers-reduced-motion: reduce)");
            let visible = true, dragging = false, lastX = 0, lastY = 0, previous = 0, shaderFailed = false;
            renderer.debug.onShaderError = () => {
                shaderFailed = true;
            };
            const resize = new ResizeObserver(() => {
                if (!mount.clientWidth || !mount.clientHeight)
                    return;
                camera.aspect = mount.clientWidth / mount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mount.clientWidth, mount.clientHeight, false);
            });
            resize.observe(mount);
            const intersection = new IntersectionObserver((entries) => {
                visible = entries[0].isIntersecting;
            });
            intersection.observe(mount);
            function down(e: PointerEvent) {
                dragging = true;
                lastX = e.clientX;
                lastY = e.clientY;
                renderer.domElement.setPointerCapture(e.pointerId);
            }
            function move(e: PointerEvent) {
                if (!dragging)
                    return;
                model.rotation.y += (e.clientX - lastX) * 0.009;
                model.rotation.x = Math.max(-0.55, Math.min(0.4, model.rotation.x + (e.clientY - lastY) * 0.006));
                lastX = e.clientX;
                lastY = e.clientY;
            }
            function up() {
                dragging = false;
            }
            function lost(e: Event) {
                e.preventDefault();
                setStatus("failed");
                cancelAnimationFrame(frame);
            }
            renderer.domElement.addEventListener("pointerdown", down);
            renderer.domElement.addEventListener("pointermove", move);
            renderer.domElement.addEventListener("pointerup", up);
            renderer.domElement.addEventListener("pointercancel", up);
            renderer.domElement.addEventListener("lostpointercapture", up);
            renderer.domElement.addEventListener("webglcontextlost", lost);
            function animate(time: number) {
                if (disposed)
                    return;
                frame = requestAnimationFrame(animate);
                const delta = Math.min((time - previous) / 1000, 0.05);
                previous = time;
                if (!visible)
                    return;
                if (!media.matches && playingRef.current && !dragging)
                    model.rotation.y += delta * 0.3;
                try {
                    renderer.render(scene, camera);
                    if (shaderFailed) {
                        setStatus("failed");
                        cancelAnimationFrame(frame);
                        return;
                    }
                    setStatus((s) => (s === "ready" ? s : "ready"));
                }
                catch {
                    setStatus("failed");
                    cancelAnimationFrame(frame);
                }
            }
            frame = requestAnimationFrame(animate);
            cleanup = () => {
                cancelAnimationFrame(frame);
                resize.disconnect();
                intersection.disconnect();
                renderer.domElement.removeEventListener("pointerdown", down);
                renderer.domElement.removeEventListener("pointermove", move);
                renderer.domElement.removeEventListener("pointerup", up);
                renderer.domElement.removeEventListener("pointercancel", up);
                renderer.domElement.removeEventListener("lostpointercapture", up);
                renderer.domElement.removeEventListener("webglcontextlost", lost);
                const geometries = new Set<Three.BufferGeometry>(), materials = new Set<Three.Material>();
                scene.traverse((o) => {
                    if (o instanceof T.Mesh) {
                        geometries.add(o.geometry);
                        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => materials.add(m));
                    }
                });
                geometries.forEach((g) => g.dispose());
                materials.forEach((m) => {
                    if (m instanceof T.MeshPhongMaterial)
                        m.bumpMap?.dispose();
                    m.dispose();
                });
                renderer.dispose();
                renderer.domElement.remove();
                modelRef.current = null;
                surfaceRef.current = null;
            };
        })
            .catch(() => {
            if (!disposed)
                setStatus("failed");
        });
        return () => {
            disposed = true;
            cleanup();
        };
        // Model resources are created once; color and material updates use the refs above.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (<div className="relative isolate overflow-hidden rounded-t-[160px] rounded-b-[32px] border border-[#b49a6b]/30 bg-[#1b1a17] shadow-[10px_12px_0_#d9cfba,0_32px_55px_-25px_#0007]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(205,174,111,0.2),transparent_65%)]"/>
      <div className={"relative " + (compact ? "h-[280px]" : "h-[420px] sm:h-[540px]")}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-[15%] rounded-full border border-[#c3a875]/20 [transform:rotate(-25deg)]"/>
        <div ref={host} className={"absolute inset-0 " + (status === "ready" ? "opacity-100" : "opacity-0")}/>
        {status !== "ready" && (<div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center text-[#ddc697]">
            <ShoppingBag className="size-20" strokeWidth={0.8}/>
            <p className="max-w-xs text-sm leading-6">
              {status === "loading" ? copy.hero.loading : copy.hero.fallback}
            </p>
          </div>)}
      </div>
      <div className="relative mx-6 border-t border-white/10 py-5 text-[#eee7d8]">
        {!compact && (<>
            <p className="text-sm text-[#d4b982]">{copy.hero.concept}</p>
            <h3 className="mt-2 font-serif text-2xl">{copy.hero.visualTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-[#c6c1b7]">
              {copy.hero.visualDescription}
            </p>
          </>)}
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-xs text-[#c6c1b7]">
            <Hand className="size-4" aria-hidden="true"/>
            {copy.hero.drag}
          </span>
          <Button variant="ghost" size="icon" disabled={status !== "ready"} aria-label={playing ? copy.hero.pause : copy.hero.play} aria-pressed={!playing} onClick={() => setPlaying((v) => !v)} className="text-[#e4cc9e] hover:bg-white/10 hover:text-white">
            {playing ? <Pause /> : <Play />}
          </Button>
        </div>
      </div>
    </div>);
}
