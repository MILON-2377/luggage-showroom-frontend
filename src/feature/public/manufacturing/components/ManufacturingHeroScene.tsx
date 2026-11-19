// "use client";
// import { useEffect, useRef, useState, useMemo } from "react";
// import type * as Three from "three";
// import { ChevronLeft, ChevronRight, Hand, Images, Pause, Play } from "lucide-react";
// import { Button } from "@/src/components/ui/button";
// import type { CopyProps, ProductPhoto } from "../types/manufacturing.types";

// export default function ManufacturingHeroScene({
//   copy,
//   photos: suppliedPhotos,
// }: CopyProps & { photos: ProductPhoto[] }) {
//   const photos = useMemo(
//     () => suppliedPhotos.filter((photo) => photo.conveyor !== false),
//     [suppliedPhotos],
//   );
//   const host = useRef<HTMLDivElement>(null),
//     playingRef = useRef(true),
//     phaseRef = useRef(0),
//     selectedRef = useRef(0);
//   const [selected, setSelected] = useState(0),
//     [playing, setPlaying] = useState(true),
//     [ready, setReady] = useState(false),
//     [failed, setFailed] = useState(false),
//     [reduced, setReduced] = useState(false),
//     [loadedCount, setLoadedCount] = useState(0);
//   useEffect(() => {
//     playingRef.current = playing;
//   }, [playing]);
//   useEffect(() => {
//     selectedRef.current = selected;
//     phaseRef.current = 0.19 - selected / Math.max(1, photos.length);
//   }, [selected, photos.length]);
//   useEffect(() => {
//     const media = matchMedia("(prefers-reduced-motion: reduce)");
//     const update = () => setReduced(media.matches);
//     update();
//     media.addEventListener("change", update);
//     return () => media.removeEventListener("change", update);
//   }, []);
//   useEffect(() => {
//     const mount = host.current;
//     if (!mount || !photos.length) return;
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
//           setFailed(true);
//           return;
//         }
//         renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
//         renderer.outputColorSpace = T.SRGBColorSpace;
//         const canvas = renderer.domElement;
//         canvas.style.cssText =
//           "display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab";
//         canvas.setAttribute("aria-hidden", "true");
//         mount.appendChild(canvas);
//         const scene = new T.Scene(),
//           camera = new T.OrthographicCamera(-7, 7, 2.6, -2.6, 0.1, 100);
//         camera.position.set(2.0, 5.3, 8.6);
//         camera.lookAt(0, 0.12, -0.25);
//         scene.add(new T.HemisphereLight(0xfff2db, 0x494237, 2));
//         const light = new T.DirectionalLight(0xffffff, 2.2);
//         light.position.set(-3, 6, 4);
//         scene.add(light);
//         const root = new T.Group();
//         scene.add(root);
//         const gold = new T.MeshPhongMaterial({ color: 0xb89a60, shininess: 85 }),
//           dark = new T.MeshPhongMaterial({ color: 0x282824, shininess: 40 }),
//           belt = new T.MeshPhongMaterial({ color: 0x48483f, shininess: 12 }),
//           rollerMaterial = new T.MeshPhongMaterial({ color: 0x696451, shininess: 70 });

//         const cream = new T.MeshPhongMaterial({ color: 0xd9c9a5, shininess: 30 });
//         const rose = new T.MeshPhongMaterial({ color: 0xb8828b, shininess: 20 });
//         const carton = new T.MeshPhongMaterial({ color: 0xc2a36a, shininess: 8 });
//         const green = new T.MeshPhongMaterial({ color: 0x52614e, shininess: 18 });
//         function box(
//           w: number,
//           h: number,
//           d: number,
//           material: Three.Material,
//           x: number,
//           y: number,
//           z: number,
//         ) {
//           const object = new T.Mesh(new T.BoxGeometry(w, h, d), material);
//           object.position.set(x, y, z);
//           root.add(object);
//           return object;
//         }
//         // Factory floor and its gold structural edge.
//         box(13.0, 0.1, 5.6, gold, 0, -1.18, -0.1);
//         box(12.8, 0.15, 5.4, dark, 0, -1.055, -0.1);
//         box(12.45, 0.025, 5.05, belt, 0, -0.967, -0.1);
//         // Main production conveyor, with rotating industrial rollers.
//         box(11.5, 0.16, 1.3, dark, 0, -0.48, 0.75);
//         const rollers: Three.Mesh[] = [];
//         for (let i = 0; i < 47; i++) {
//           const roller = new T.Mesh(
//             new T.CylinderGeometry(0.045, 0.045, 1.22, 12),
//             i % 2 ? gold : rollerMaterial,
//           );
//           roller.rotation.x = Math.PI / 2;
//           roller.position.set(-5.5 + i * 0.24, -0.35, 0.75);
//           root.add(roller);
//           rollers.push(roller);
//         }
//         for (const z of [0.05, 1.45]) box(11.7, 0.065, 0.055, gold, 0, -0.27, z);
//         for (const x of [-4.5, 0, 4.5])
//           for (const z of [0.25, 1.25]) box(0.11, 0.5, 0.11, gold, x, -0.73, z);
//         // Open factory frame, leaving every workstation visible.
//         for (const x of [-5.45, 5.45]) {
//           box(0.075, 2.95, 0.075, gold, x, 0.49, -2.25);
//           box(0.23, 0.07, 0.23, cream, x, -0.91, -2.25);
//         }
//         box(10.98, 0.08, 0.08, gold, 0, 1.97, -2.25);
//         box(9.1, 0.055, 0.16, cream, 0, 1.83, -2.19);
//         // Preparation press, sewing station and packing bench.
//         for (const x of [-3.55, 0, 3.55]) {
//           box(2.05, 0.12, 1.05, cream, x, -0.12, -1.28);
//           box(2.1, 0.04, 1.1, gold, x, -0.2, -1.28);
//           for (const dx of [-0.75, 0.75])
//             for (const z of [-1.65, -0.95])
//               box(0.075, 0.72, 0.075, gold, x + dx, -0.59, z);
//         }
//         // Forming/preparation press.
//         box(0.18, 1.13, 0.26, gold, -2.82, 0.43, -1.6);
//         box(1.35, 0.16, 0.36, gold, -3.4, 0.98, -1.6);
//         box(0.055, 0.55, 0.055, rollerMaterial, -3.9, 0.63, -1.5);
//         box(0.67, 0.08, 0.5, cream, -3.9, 0.31, -1.5);
//         for (let i = 0; i < 5; i++)
//           box(1.05, 0.026, 0.64, i % 2 ? rose : cream, -3.6, -0.03 + i * 0.032, -1.25);
//         // Sewing machine with arm, needle, wheel and spool.
//         box(0.25, 0.75, 0.3, cream, 0.46, 0.32, -1.27);
//         box(1.1, 0.22, 0.34, cream, 0.02, 0.77, -1.27);
//         box(0.09, 0.53, 0.1, gold, -0.45, 0.44, -1.27);
//         box(0.018, 0.15, 0.018, rollerMaterial, -0.45, 0.1, -1.27);
//         box(0.78, 0.028, 0.5, rose, -0.2, -0.025, -1.19);
//         const wheel = new T.Mesh(new T.TorusGeometry(0.23, 0.04, 10, 32), dark);
//         wheel.rotation.y = Math.PI / 2;
//         wheel.position.set(0.63, 0.72, -1.27);
//         root.add(wheel);
//         const spool = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.19, 20), gold);
//         spool.position.set(0.36, 1.0, -1.27);
//         root.add(spool);
//         // Packing station with cartons and tape.
//         box(0.88, 0.65, 0.7, carton, 3.4, 0.27, -1.27);
//         box(0.12, 0.66, 0.71, cream, 3.4, 0.27, -1.27);
//         box(0.55, 0.46, 0.48, carton, 4.08, 0.18, -1.5);
//         box(0.08, 0.47, 0.49, gold, 4.08, 0.18, -1.5);
//         // Front-side stock shelf, matching the reference layout.
//         for (let level = 0; level < 3; level++) {
//           box(1.05, 0.045, 0.75, gold, -5.15, -0.72 + level * 0.34, 1.92);
//           for (let k = 0; k < 2; k++)
//             box(
//               0.35,
//               0.25,
//               0.48,
//               level === 1 ? green : carton,
//               -5.39 + k * 0.48,
//               -0.57 + level * 0.34,
//               1.92,
//             );
//         }
//         for (const x of [-5.64, -4.66]) box(0.04, 1.13, 0.04, gold, x, -0.39, 1.92);
//         box(0.95, 0.55, 0.82, carton, 5.12, -0.68, 1.88);
//         box(0.68, 0.43, 0.62, cream, 5.12, -0.19, 1.88);
//         box(0.11, 0.44, 0.63, gold, 5.12, -0.19, 1.88);
//         const sprites = photos.map(() => {
//           const material = new T.SpriteMaterial({
//             transparent: true,
//             depthWrite: false,
//             toneMapped: false,
//           });
//           const sprite = new T.Sprite(material);
//           sprite.visible = false;
//           root.add(sprite);
//           return sprite;
//         });
//         const heights: number[] = photos.map(() => 1.5),
//           textures: Three.Texture[] = [];
//         let loaded = 0,
//           finished = 0;
//         photos.forEach((photo, index) => {
//           new T.TextureLoader().load(
//             photo.src.replace(/^\/manufacturing\/(?:products|workspaces)\//, "/"),
//             (texture) => {
//               if (disposed) {
//                 texture.dispose();
//                 return;
//               }
//               texture.colorSpace = T.SRGBColorSpace;
//               textures.push(texture);
//               const image = texture.image as HTMLImageElement;
//               let ratio = image.width / image.height;
//               // Crop transparent padding through texture UVs; original photo files are unchanged.
//               try {
//                 const scan = document.createElement("canvas");
//                 scan.width = 256;
//                 scan.height = Math.max(1, Math.round(256 / ratio));
//                 const context = scan.getContext("2d");
//                 if (context) {
//                   context.drawImage(image, 0, 0, scan.width, scan.height);
//                   const pixels = context.getImageData(
//                     0,
//                     0,
//                     scan.width,
//                     scan.height,
//                   ).data;
//                   let left = scan.width,
//                     right = 0,
//                     top = scan.height,
//                     bottom = 0;
//                   for (let y = 0; y < scan.height; y++)
//                     for (let x = 0; x < scan.width; x++) {
//                       if (pixels[(y * scan.width + x) * 4 + 3] > 24) {
//                         left = Math.min(left, x);
//                         right = Math.max(right, x);
//                         top = Math.min(top, y);
//                         bottom = Math.max(bottom, y);
//                       }
//                     }
//                   if (right > left && bottom > top) {
//                     left = Math.max(0, left - 3);
//                     right = Math.min(scan.width - 1, right + 3);
//                     top = Math.max(0, top - 3);
//                     bottom = Math.min(scan.height - 1, bottom + 3);
//                     const w = (right - left + 1) / scan.width,
//                       h = (bottom - top + 1) / scan.height;
//                     texture.repeat.set(w, h);
//                     texture.offset.set(
//                       left / scan.width,
//                       1 - (bottom + 1) / scan.height,
//                     );
//                     ratio = (right - left + 1) / (bottom - top + 1);
//                   }
//                 }
//               } catch {}
//               const width = Math.min(1.3, 1.55 * ratio),
//                 height = width / ratio;
//               heights[index] = height;
//               sprites[index].scale.set(width, height, 1);
//               sprites[index].material.map = texture;
//               sprites[index].material.needsUpdate = true;
//               sprites[index].visible = true;
//               loaded++;
//               finished++;
//               setLoadedCount(loaded);
//             },
//             undefined,
//             () => {
//               finished++;
//               if (finished === photos.length && loaded === 0 && !disposed)
//                 setFailed(true);
//             },
//           );
//         });

//         const perimeter = 24;
//         function position(t: number) {
//           const distance = (((t % 1) + 1) % 1) * perimeter;
//           if (distance < 12) return { x: -6 + distance, z: 0.75, front: true };
//           return { x: 6 - (distance - 12), z: -2.4, front: false };
//         }
//         let previous = 0,
//           visible = true,
//           dragging = false,
//           lastX = 0,
//           shaderFailed = false;
//         const media = matchMedia("(prefers-reduced-motion: reduce)");
//         renderer.debug.onShaderError = () => {
//           shaderFailed = true;
//         };
//         const resize = new ResizeObserver(() => {
//           if (!mount.clientWidth || !mount.clientHeight) return;
//           const aspect = mount.clientWidth / mount.clientHeight;
//           const halfHeight = 3.15;
//           camera.left = -halfHeight * aspect;
//           camera.right = halfHeight * aspect;
//           camera.top = halfHeight;
//           camera.bottom = -halfHeight;
//           camera.updateProjectionMatrix();
//           renderer.setSize(mount.clientWidth, mount.clientHeight, false);
//         });
//         resize.observe(mount);
//         const observer = new IntersectionObserver(([entry]) => {
//           visible = entry.isIntersecting;
//         });
//         observer.observe(mount);
//         function down(e: PointerEvent) {
//           dragging = true;
//           lastX = e.clientX;
//           canvas.setPointerCapture(e.pointerId);
//         }
//         function move(e: PointerEvent) {
//           if (dragging) {
//             root.rotation.y += (e.clientX - lastX) * 0.004;
//             lastX = e.clientX;
//           }
//         }
//         function up() {
//           dragging = false;
//         }
//         function lost(e: Event) {
//           e.preventDefault();
//           setFailed(true);
//           setReady(false);
//           cancelAnimationFrame(frame);
//         }
//         canvas.addEventListener("pointerdown", down);
//         canvas.addEventListener("pointermove", move);
//         canvas.addEventListener("pointerup", up);
//         canvas.addEventListener("pointercancel", up);
//         canvas.addEventListener("lostpointercapture", up);
//         canvas.addEventListener("webglcontextlost", lost);
//         function animate(time: number) {
//           if (disposed) return;
//           frame = requestAnimationFrame(animate);
//           const dt = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
//           previous = time;
//           if (!visible) return;
//           if (playingRef.current && !media.matches) {
//             phaseRef.current += dt * 0.035;
//             rollers.forEach((roller) => (roller.rotation.y += dt * 3));
//           }
//           sprites.forEach((sprite, index) => {
//             const p = position(index / photos.length + phaseRef.current);
//             sprite.position.set(
//               p.x,
//               (p.front ? -0.28 : -0.65) + heights[index] / 2,
//               p.z,
//             );
//             sprite.material.opacity = p.front ? 1 : 0.6;
//           });
//           try {
//             renderer.render(scene, camera);
//             if (shaderFailed) {
//               setFailed(true);
//               cancelAnimationFrame(frame);
//               return;
//             }
//             if (loaded > 0) setReady(true);
//           } catch {
//             setFailed(true);
//             cancelAnimationFrame(frame);
//           }
//         }
//         frame = requestAnimationFrame(animate);
//         cleanup = () => {
//           cancelAnimationFrame(frame);
//           resize.disconnect();
//           observer.disconnect();
//           canvas.removeEventListener("pointerdown", down);
//           canvas.removeEventListener("pointermove", move);
//           canvas.removeEventListener("pointerup", up);
//           canvas.removeEventListener("pointercancel", up);
//           canvas.removeEventListener("lostpointercapture", up);
//           canvas.removeEventListener("webglcontextlost", lost);
//           const geometries = new Set<Three.BufferGeometry>(),
//             materials = new Set<Three.Material>();
//           scene.traverse((object) => {
//             if (object instanceof T.Mesh) {
//               geometries.add(object.geometry);
//               (Array.isArray(object.material)
//                 ? object.material
//                 : [object.material]
//               ).forEach((material) => materials.add(material));
//             } else if (object instanceof T.Sprite) materials.add(object.material);
//           });
//           textures.forEach((texture) => texture.dispose());
//           geometries.forEach((geometry) => geometry.dispose());
//           materials.forEach((material) => material.dispose());
//           renderer.dispose();
//           canvas.remove();
//         };
//       })
//       .catch(() => {
//         if (!disposed) setFailed(true);
//       });
//     return () => {
//       disposed = true;
//       cleanup();
//     };
//   }, [photos]);
//   function change(delta: number) {
//     setSelected(
//       (value) => (value + delta + photos.length) % Math.max(1, photos.length),
//     );
//   }
//   return (
//     <div className="relative isolate overflow-hidden rounded-[36px] border border-[#dbc28f]/30 bg-[#26241e] shadow-[3px_4px_0_#d4bf95,9px_12px_0_#78613b,0_35px_55px_-25px_black] sm:rounded-[60px]">
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(228,196,134,0.18),transparent_70%)]"
//       />
//       <div className="relative h-[360px] sm:h-[440px] lg:h-[520px]">
//         <div
//           ref={host}
//           data-loaded-photos={loadedCount}
//           data-photo-count={photos.length}
//           className={
//             "absolute inset-0 " + (ready && !failed ? "opacity-100" : "opacity-0")
//           }
//         />
//         {(!ready || failed) && (
//           <div
//             role="status"
//             className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center text-[#e1c794]"
//           >
//             <Images className="size-16" strokeWidth={1} />
//             <p className="max-w-lg text-sm leading-7">
//               {failed ? copy.hero.fallback : copy.hero.loading}
//             </p>
//           </div>
//         )}
//       </div>
//       <div className="relative mx-5 flex flex-wrap items-center justify-between gap-5 border-t border-[#cfb47d]/15 py-5 sm:mx-8">
//         <div>
//           <p className="text-xs tracking-wide text-[#ceb17c]">
//             {copy.photos.photos} · {loadedCount} / {photos.length}
//           </p>
//           <p className="mt-2 text-lg text-[#f1e4ca]">
//             {photos[selected]
//               ? (copy.photos.names[photos[selected].id] ?? photos[selected].name)
//               : copy.photos.photos}
//           </p>
//         </div>
//         <p className="flex items-center gap-2 text-xs text-[#c7c0b4]">
//           <Hand className="size-4" />
//           {copy.hero.drag}
//         </p>
//         <div className="flex gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             aria-label={copy.photos.previous}
//             disabled={photos.length < 2}
//             onClick={() => change(-1)}
//             className="text-[#dfc99b] hover:bg-white/10 hover:text-white"
//           >
//             <ChevronLeft />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             aria-label={playing ? copy.hero.pause : copy.hero.play}
//             aria-pressed={!playing}
//             disabled={!ready || failed || reduced}
//             onClick={() => setPlaying((value) => !value)}
//             className="text-[#dfc99b] hover:bg-white/10 hover:text-white"
//           >
//             {playing ? <Pause /> : <Play />}
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             aria-label={copy.photos.next}
//             disabled={photos.length < 2}
//             onClick={() => change(1)}
//             className="text-[#dfc99b] hover:bg-white/10 hover:text-white"
//           >
//             <ChevronRight />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import type * as Three from "three";
import { ChevronLeft, ChevronRight, Hand, Images, Pause, Play } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { CopyProps, ProductPhoto } from "../types/manufacturing.types";


// Recycle only the slot that exits. Each replacement advances the photo queue.
function getConveyorSlot(slot:number, distance:number, start:number, total:number, visible:number) {
  const length=11.6;
  const spacing=length/Math.max(1,visible);
  const offset=(visible-0.5-slot)*spacing+distance;
  const lap=Math.floor(offset/length);
  const wrapped=((offset%length)+length)%length;
  return { x:-length/2+wrapped, photoIndex:((start+slot+lap*visible)%total+total)%total };
}

export default function ManufacturingHeroScene({
  copy,
  photos: suppliedPhotos,
}: CopyProps & { photos: ProductPhoto[] }) {
  const photos = useMemo(
    () => suppliedPhotos.filter((photo) => photo.conveyor !== false),
    [suppliedPhotos],
  );
  const host = useRef<HTMLDivElement>(null),
    playingRef = useRef(true),
    phaseRef = useRef(0),
    selectedRef = useRef(0);
  const [selected, setSelected] = useState(0),
    [playing, setPlaying] = useState(true),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [reduced, setReduced] = useState(false),
    [loadedCount, setLoadedCount] = useState(0);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    selectedRef.current = selected;
    phaseRef.current = 0;
  }, [selected, photos.length]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const mount = host.current;
    if (!mount || !photos.length) return;
    let disposed = false,
      frame = 0,
      cleanup = () => {};
    import("three")
      .then((T) => {
        if (disposed) return;
        let renderer: Three.WebGLRenderer;
        try {
          renderer = new T.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
        } catch {
          setFailed(true);
          return;
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        renderer.outputColorSpace = T.SRGBColorSpace;
        const canvas = renderer.domElement;
        canvas.style.cssText =
          "display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab";
        canvas.setAttribute("aria-hidden", "true");
        mount.appendChild(canvas);
        const scene = new T.Scene(),
          camera = new T.OrthographicCamera(-7, 7, 2.6, -2.6, 0.1, 100);
        camera.position.set(2.0, 5.3, 8.6);
        camera.lookAt(0, 0.12, -0.25);
        scene.add(new T.HemisphereLight(0xfff2db, 0x494237, 2));
        const light = new T.DirectionalLight(0xffffff, 2.2);
        light.position.set(-3, 6, 4);
        scene.add(light);
        const root = new T.Group();
        scene.add(root);
        const gold = new T.MeshPhongMaterial({ color: 0xb89a60, shininess: 85 }),
          dark = new T.MeshPhongMaterial({ color: 0x282824, shininess: 40 }),
          belt = new T.MeshPhongMaterial({ color: 0x48483f, shininess: 12 }),
          rollerMaterial = new T.MeshPhongMaterial({ color: 0x696451, shininess: 70 });

        const cream = new T.MeshPhongMaterial({ color: 0xd9c9a5, shininess: 30 });
        const rose = new T.MeshPhongMaterial({ color: 0xb8828b, shininess: 20 });
        const carton = new T.MeshPhongMaterial({ color: 0xc2a36a, shininess: 8 });
        const green = new T.MeshPhongMaterial({ color: 0x52614e, shininess: 18 });
        function box(
          w: number,
          h: number,
          d: number,
          material: Three.Material,
          x: number,
          y: number,
          z: number,
        ) {
          const object = new T.Mesh(new T.BoxGeometry(w, h, d), material);
          object.position.set(x, y, z);
          root.add(object);
          return object;
        }
        // Factory floor and its gold structural edge.
        box(13.0, 0.1, 5.6, gold, 0, -1.18, -0.1);
        box(12.8, 0.15, 5.4, dark, 0, -1.055, -0.1);
        box(12.45, 0.025, 5.05, belt, 0, -0.967, -0.1);
        // Main production conveyor, with rotating industrial rollers.
        box(11.5, 0.16, 1.3, dark, 0, -0.48, 0.75);
        const rollers: Three.Mesh[] = [];
        for (let i = 0; i < 47; i++) {
          const roller = new T.Mesh(
            new T.CylinderGeometry(0.045, 0.045, 1.22, 12),
            i % 2 ? gold : rollerMaterial,
          );
          roller.rotation.x = Math.PI / 2;
          roller.position.set(-5.5 + i * 0.24, -0.35, 0.75);
          root.add(roller);
          rollers.push(roller);
        }
        for (const z of [0.05, 1.45]) box(11.7, 0.065, 0.055, gold, 0, -0.27, z);
        for (const x of [-4.5, 0, 4.5])
          for (const z of [0.25, 1.25]) box(0.11, 0.5, 0.11, gold, x, -0.73, z);
        // Open factory frame, leaving every workstation visible.
        for (const x of [-5.45, 5.45]) {
          box(0.075, 2.95, 0.075, gold, x, 0.49, -2.25);
          box(0.23, 0.07, 0.23, cream, x, -0.91, -2.25);
        }
        box(10.98, 0.08, 0.08, gold, 0, 1.97, -2.25);
        box(9.1, 0.055, 0.16, cream, 0, 1.83, -2.19);
        // Preparation press, sewing station and packing bench.
        for (const x of [-3.55, 0, 3.55]) {
          box(2.05, 0.12, 1.05, cream, x, -0.12, -1.28);
          box(2.1, 0.04, 1.1, gold, x, -0.2, -1.28);
          for (const dx of [-0.75, 0.75])
            for (const z of [-1.65, -0.95])
              box(0.075, 0.72, 0.075, gold, x + dx, -0.59, z);
        }
        // Forming/preparation press.
        box(0.18, 1.13, 0.26, gold, -2.82, 0.43, -1.6);
        box(1.35, 0.16, 0.36, gold, -3.4, 0.98, -1.6);
        box(0.055, 0.55, 0.055, rollerMaterial, -3.9, 0.63, -1.5);
        box(0.67, 0.08, 0.5, cream, -3.9, 0.31, -1.5);
        for (let i = 0; i < 5; i++)
          box(1.05, 0.026, 0.64, i % 2 ? rose : cream, -3.6, -0.03 + i * 0.032, -1.25);
        // Sewing machine with arm, needle, wheel and spool.
        box(0.25, 0.75, 0.3, cream, 0.46, 0.32, -1.27);
        box(1.1, 0.22, 0.34, cream, 0.02, 0.77, -1.27);
        box(0.09, 0.53, 0.1, gold, -0.45, 0.44, -1.27);
        box(0.018, 0.15, 0.018, rollerMaterial, -0.45, 0.1, -1.27);
        box(0.78, 0.028, 0.5, rose, -0.2, -0.025, -1.19);
        const wheel = new T.Mesh(new T.TorusGeometry(0.23, 0.04, 10, 32), dark);
        wheel.rotation.y = Math.PI / 2;
        wheel.position.set(0.63, 0.72, -1.27);
        root.add(wheel);
        const spool = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.19, 20), gold);
        spool.position.set(0.36, 1.0, -1.27);
        root.add(spool);
        // Packing station with cartons and tape.
        box(0.88, 0.65, 0.7, carton, 3.4, 0.27, -1.27);
        box(0.12, 0.66, 0.71, cream, 3.4, 0.27, -1.27);
        box(0.55, 0.46, 0.48, carton, 4.08, 0.18, -1.5);
        box(0.08, 0.47, 0.49, gold, 4.08, 0.18, -1.5);
        // Front-side stock shelf, matching the reference layout.
        for (let level = 0; level < 3; level++) {
          box(1.05, 0.045, 0.75, gold, -5.15, -0.72 + level * 0.34, 1.92);
          for (let k = 0; k < 2; k++)
            box(
              0.35,
              0.25,
              0.48,
              level === 1 ? green : carton,
              -5.39 + k * 0.48,
              -0.57 + level * 0.34,
              1.92,
            );
        }
        for (const x of [-5.64, -4.66]) box(0.04, 1.13, 0.04, gold, x, -0.39, 1.92);
        box(0.95, 0.55, 0.82, carton, 5.12, -0.68, 1.88);
        box(0.68, 0.43, 0.62, cream, 5.12, -0.19, 1.88);
        box(0.11, 0.44, 0.63, gold, 5.12, -0.19, 1.88);
        const slotCount = Math.min(3, photos.length);
        const sprites = Array.from({length: slotCount}, () => {
          const material = new T.SpriteMaterial({
            transparent: true,
            depthWrite: false,
            toneMapped: false,
          });
          const sprite = new T.Sprite(material);
          sprite.visible = false;
          root.add(sprite);
          return sprite;
        });
        const heights: number[] = photos.map(() => 1.5);
        const widths: number[] = photos.map(() => 1.3);
        const textures: (Three.Texture | null)[] = photos.map(() => null);
        let loaded = 0,
          finished = 0;
        photos.forEach((photo, index) => {
          new T.TextureLoader().load(
            photo.src.replace(/^\/manufacturing\/(?:products|workspaces)\//, "/"),
            (texture) => {
              if (disposed) {
                texture.dispose();
                return;
              }
              texture.colorSpace = T.SRGBColorSpace;
              textures[index] = texture;
              const image = texture.image as HTMLImageElement;
              let ratio = image.width / image.height;
              // Crop transparent padding through texture UVs; original photo files are unchanged.
              try {
                const scan = document.createElement("canvas");
                scan.width = 256;
                scan.height = Math.max(1, Math.round(256 / ratio));
                const context = scan.getContext("2d");
                if (context) {
                  context.drawImage(image, 0, 0, scan.width, scan.height);
                  const pixels = context.getImageData(
                    0,
                    0,
                    scan.width,
                    scan.height,
                  ).data;
                  let left = scan.width,
                    right = 0,
                    top = scan.height,
                    bottom = 0;
                  for (let y = 0; y < scan.height; y++)
                    for (let x = 0; x < scan.width; x++) {
                      if (pixels[(y * scan.width + x) * 4 + 3] > 24) {
                        left = Math.min(left, x);
                        right = Math.max(right, x);
                        top = Math.min(top, y);
                        bottom = Math.max(bottom, y);
                      }
                    }
                  if (right > left && bottom > top) {
                    left = Math.max(0, left - 3);
                    right = Math.min(scan.width - 1, right + 3);
                    top = Math.max(0, top - 3);
                    bottom = Math.min(scan.height - 1, bottom + 3);
                    const w = (right - left + 1) / scan.width,
                      h = (bottom - top + 1) / scan.height;
                    texture.repeat.set(w, h);
                    texture.offset.set(
                      left / scan.width,
                      1 - (bottom + 1) / scan.height,
                    );
                    ratio = (right - left + 1) / (bottom - top + 1);
                  }
                }
              } catch {}
              const width = Math.min(1.3, 1.55 * ratio),
                height = width / ratio;
              heights[index] = height;
              widths[index] = width;
              loaded++;
              finished++;
              setLoadedCount(loaded);
            },
            undefined,
            () => {
              finished++;
              if (finished === photos.length && loaded === 0 && !disposed)
                setFailed(true);
            },
          );
        });

        let previous = 0,
          visible = true,
          dragging = false,
          lastX = 0,
          shaderFailed = false;
        const media = matchMedia("(prefers-reduced-motion: reduce)");
        renderer.debug.onShaderError = () => {
          shaderFailed = true;
        };
        const resize = new ResizeObserver(() => {
          if (!mount.clientWidth || !mount.clientHeight) return;
          const aspect = mount.clientWidth / mount.clientHeight;
          const halfHeight = 3.15;
          camera.left = -halfHeight * aspect;
          camera.right = halfHeight * aspect;
          camera.top = halfHeight;
          camera.bottom = -halfHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mount.clientWidth, mount.clientHeight, false);
        });
        resize.observe(mount);
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
        observer.observe(mount);
        function down(e: PointerEvent) {
          dragging = true;
          lastX = e.clientX;
          canvas.setPointerCapture(e.pointerId);
        }
        function move(e: PointerEvent) {
          if (dragging) {
            root.rotation.y += (e.clientX - lastX) * 0.004;
            lastX = e.clientX;
          }
        }
        function up() {
          dragging = false;
        }
        function lost(e: Event) {
          e.preventDefault();
          setFailed(true);
          setReady(false);
          cancelAnimationFrame(frame);
        }
        canvas.addEventListener("pointerdown", down);
        canvas.addEventListener("pointermove", move);
        canvas.addEventListener("pointerup", up);
        canvas.addEventListener("pointercancel", up);
        canvas.addEventListener("lostpointercapture", up);
        canvas.addEventListener("webglcontextlost", lost);
        function animate(time: number) {
          if (disposed) return;
          frame = requestAnimationFrame(animate);
          const dt = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
          previous = time;
          if (!visible) return;
          if (playingRef.current && !media.matches) {
            phaseRef.current += dt * 0.85; // Forward speed, in world units per second.
            rollers.forEach((roller) => (roller.rotation.y += dt * 3));
          }

          const visibleIds: string[] = [];
          sprites.forEach((sprite, slot) => {
            const entry = getConveyorSlot(slot, phaseRef.current, selectedRef.current, photos.length, slotCount);
            const photoIndex = entry.photoIndex;
            const texture = textures[photoIndex];
            sprite.visible = Boolean(texture);
            if (!texture) return;
            if (sprite.material.map !== texture) {
              sprite.material.map = texture;
              sprite.material.needsUpdate = true;
              sprite.scale.set(widths[photoIndex], heights[photoIndex], 1);
            }
            // Every product stays on the front line; there is no rear return path.
            sprite.position.set(entry.x, -0.28 + heights[photoIndex] / 2, 0.75);
            sprite.material.opacity = 1;
            visibleIds.push(photos[photoIndex].id);
          });
          canvas.dataset.visibleCount = String(visibleIds.length);
          canvas.dataset.visiblePhotoIds = visibleIds.join(",");
          try {
            renderer.render(scene, camera);
            if (shaderFailed) {
              setFailed(true);
              cancelAnimationFrame(frame);
              return;
            }
            if (loaded > 0) setReady(true);
          } catch {
            setFailed(true);
            cancelAnimationFrame(frame);
          }
        }
        frame = requestAnimationFrame(animate);
        cleanup = () => {
          cancelAnimationFrame(frame);
          resize.disconnect();
          observer.disconnect();
          canvas.removeEventListener("pointerdown", down);
          canvas.removeEventListener("pointermove", move);
          canvas.removeEventListener("pointerup", up);
          canvas.removeEventListener("pointercancel", up);
          canvas.removeEventListener("lostpointercapture", up);
          canvas.removeEventListener("webglcontextlost", lost);
          const geometries = new Set<Three.BufferGeometry>(),
            materials = new Set<Three.Material>();
          scene.traverse((object) => {
            if (object instanceof T.Mesh) {
              geometries.add(object.geometry);
              (Array.isArray(object.material)
                ? object.material
                : [object.material]
              ).forEach((material) => materials.add(material));
            } else if (object instanceof T.Sprite) materials.add(object.material);
          });
          textures.forEach((texture) => texture?.dispose());
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          renderer.dispose();
          canvas.remove();
        };
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [photos]);
  function change(delta: number) {
    setSelected(
      (value) => (value + delta + photos.length) % Math.max(1, photos.length),
    );
  }
  return (
    <div className="relative isolate overflow-hidden rounded-[36px] border border-[#dbc28f]/30 bg-[#26241e] shadow-[3px_4px_0_#d4bf95,9px_12px_0_#78613b,0_35px_55px_-25px_black] sm:rounded-[60px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(228,196,134,0.18),transparent_70%)]"
      />
      <div className="relative h-[360px] sm:h-[440px] lg:h-[520px]">
        <div
          ref={host}
          data-loaded-photos={loadedCount}
          data-photo-count={photos.length}
          className={
            "absolute inset-0 " + (ready && !failed ? "opacity-100" : "opacity-0")
          }
        />
        {(!ready || failed) && (
          <div
            role="status"
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center text-[#e1c794]"
          >
            <Images className="size-16" strokeWidth={1} />
            <p className="max-w-lg text-sm leading-7">
              {failed ? copy.hero.fallback : copy.hero.loading}
            </p>
          </div>
        )}
      </div>
      <div className="relative mx-5 flex flex-wrap items-center justify-between gap-5 border-t border-[#cfb47d]/15 py-5 sm:mx-8">
        <div>
          <p className="text-xs tracking-wide text-[#ceb17c]">
            {copy.photos.photos} · {loadedCount} / {photos.length}
          </p>
          <p className="mt-2 text-lg text-[#f1e4ca]">
            {photos[selected]
              ? (copy.photos.names[photos[selected].id] ?? photos[selected].name)
              : copy.photos.photos}
          </p>
        </div>
        <p className="flex items-center gap-2 text-xs text-[#c7c0b4]">
          <Hand className="size-4" />
          {copy.hero.drag}
        </p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={copy.photos.previous}
            disabled={photos.length < 2}
            onClick={() => change(-1)}
            className="text-[#dfc99b] hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={playing ? copy.hero.pause : copy.hero.play}
            aria-pressed={!playing}
            disabled={!ready || failed || reduced}
            onClick={() => setPlaying((value) => !value)}
            className="text-[#dfc99b] hover:bg-white/10 hover:text-white"
          >
            {playing ? <Pause /> : <Play />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={copy.photos.next}
            disabled={photos.length < 2}
            onClick={() => change(1)}
            className="text-[#dfc99b] hover:bg-white/10 hover:text-white"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
