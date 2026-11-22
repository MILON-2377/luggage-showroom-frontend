"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Images,
  Hand,
  Layers3,
  PackageOpen,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import type { QuoteCopy } from "../types/quote.types";

const MODELS = [
  "compact",
  "travel",
  "wristlet",
  "organizer",
  "roundOpen",
  "roundYellow",
  "camo",
  "roundPink",
  "atelier",
] as const;
type ModelId = (typeof MODELS)[number];
const PHOTOS = {
  compact: "/1.png",
  travel: "/8.png",
  wristlet: "/3.png",
  organizer: "/4.png",
  roundOpen: "/5.png",
  roundYellow: "/6.png",
  camo: "/7.png",
  roundPink: "/bag-closed-pink.png",
} as const;

const FINISHES = [
  { id: "original", hex: "#232629", color: 0x232629 },
  { id: "cream", hex: "#dfcba6", color: 0xdfcba6 },
  { id: "rose", hex: "#bc8a80", color: 0xbc8a80 },
  { id: "olive", hex: "#777652", color: 0x777652 },
] as const;
type Finish = (typeof FINISHES)[number]["id"];

export default function QuoteHeroScene({ copy }: { copy: QuoteCopy }) {
  const c = copy.atelier;
  const mount = useRef<HTMLDivElement>(null);
  const controls = useRef({
    playing: true,
    exploded: true,
    finish: "original" as Finish,
    model: "compact" as ModelId,
    rotation: 0.82,
  });
  const [playing, setPlaying] = useState(true);
  const [exploded, setExploded] = useState(true);
  const [finish, setFinish] = useState<Finish>("original");
  const [model, setModel] = useState<ModelId>("compact");
  useEffect(() => {
    controls.current.model = model;
  }, [model]);
  function chooseModel(next: ModelId) {
    setModel(next);
    setFinish("original");
    controls.current.rotation = 0.82;
  }
  const [status, setStatus] = useState<"loading" | "ready" | "failed">(
    "loading",
  );

  useEffect(() => {
    controls.current.playing = playing;
  }, [playing]);
  useEffect(() => {
    controls.current.exploded = exploded;
  }, [exploded]);
  useEffect(() => {
    controls.current.finish = finish;
  }, [finish]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    Promise.all([
      import("three"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
    ])
      .then(([T, { RoomEnvironment }]) => {
        if (disposed) return;
        const scene = new T.Scene();
        let renderer: InstanceType<typeof T.WebGLRenderer>;
        try {
          renderer = new T.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "low-power",
          });
        } catch {
          setStatus("failed");
          return;
        }
        const geometries = new Set<InstanceType<typeof T.BufferGeometry>>();
        const materials = new Set<InstanceType<typeof T.Material>>();
        const textures = new Set<InstanceType<typeof T.Texture>>();
        let environment:
          | ReturnType<InstanceType<typeof T.PMREMGenerator>["fromScene"]>
          | undefined;
        let frame = 0;
        let resize: ResizeObserver | undefined;
        let intersection: IntersectionObserver | undefined;
        const canvas = renderer.domElement;
        const media = matchMedia("(prefers-reduced-motion: reduce)");
        const lost = (event: Event) => {
          event.preventDefault();
          cancelAnimationFrame(frame);
          setStatus("failed");
        };
        const listeners: (() => void)[] = [];
        cleanup = () => {
          cancelAnimationFrame(frame);
          resize?.disconnect();
          intersection?.disconnect();
          listeners.forEach((remove) => remove());
          canvas.removeEventListener("webglcontextlost", lost);
          scene.traverse((object) => {
            if (object instanceof T.Mesh || object instanceof T.LineSegments)
              geometries.add(object.geometry);
          });
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          textures.forEach((texture) => texture.dispose());
          environment?.dispose();
          renderer.dispose();
          canvas.remove();
        };
        try {
          renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
          renderer.outputColorSpace = T.SRGBColorSpace;
          renderer.toneMapping = T.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 0.9;
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = T.PCFSoftShadowMap;
          canvas.style.cssText =
            "display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab";
          host.appendChild(canvas);
          canvas.addEventListener("webglcontextlost", lost);
          const pmrem = new T.PMREMGenerator(renderer);
          const room = new RoomEnvironment();
          environment = pmrem.fromScene(room, 0.06);
          scene.environment = environment.texture;
          scene.environmentIntensity = 0.55;
          room.dispose();
          pmrem.dispose();

          const camera = new T.PerspectiveCamera(34, 1, 0.1, 50);
          camera.position.set(2.8, 2.3, 9.8);
          camera.lookAt(0, 0.45, 0);
          scene.add(new T.HemisphereLight(0xffecd4, 0x33291e, 0.8));
          const key = new T.SpotLight(0xffe4bd, 42, 25, 0.65, 0.8, 1.6);
          key.position.set(-3, 6, 5);
          key.target.position.set(0, 0, 0);
          key.castShadow = true;
          key.shadow.mapSize.set(1024, 1024);
          key.shadow.normalBias = 0.035;
          key.shadow.bias = -0.0002;
          scene.add(key, key.target);
          const fill = new T.DirectionalLight(0xffffff, 1.1);
          fill.position.set(4, 2, 4);
          scene.add(fill);
          const rim = new T.DirectionalLight(0xffb661, 1.8);
          rim.position.set(-2, 3, -4);
          scene.add(rim);

          // Small deterministic textures are created locally; no image URLs or font fetches.
          function texture(kind: "grain" | "stone") {
            const surface = document.createElement("canvas");
            surface.width = surface.height = 256;
            const paint = surface.getContext("2d")!;
            paint.fillStyle = kind === "stone" ? "#bba98b" : "#b4b4b4";
            paint.fillRect(0, 0, 256, 256);
            let seed = 73;
            const random = () => {
              seed = (seed * 16807) % 2147483647;
              return seed / 2147483647;
            };
            for (let i = 0; i < (kind === "stone" ? 7000 : 16000); i++) {
              const shade = Math.floor(90 + random() * 140);
              paint.fillStyle =
                kind === "stone"
                  ? `rgba(69,48,26,${random() * 0.2})`
                  : `rgb(${shade},${shade},${shade})`;
              paint.beginPath();
              paint.ellipse(
                random() * 256,
                random() * 256,
                kind === "stone" ? random() * 2.2 : 0.7,
                kind === "stone" ? random() * 0.8 : 0.45,
                random() * 3,
                0,
                Math.PI * 2,
              );
              paint.fill();
            }
            const map = new T.CanvasTexture(surface);
            map.wrapS = map.wrapT = T.RepeatWrapping;
            map.repeat.set(kind === "stone" ? 2 : 4, kind === "stone" ? 2 : 4);
            textures.add(map);
            return map;
          }
          const grain = texture("grain"),
            stoneMap = texture("stone");
          stoneMap.colorSpace = T.SRGBColorSpace;
          function material(
            params: ConstructorParameters<typeof T.MeshStandardMaterial>[0],
          ) {
            const value = new T.MeshStandardMaterial(params);
            materials.add(value);
            return value;
          }
          const leather = material({
            color: 0xdfcba6,
            roughness: 0.62,
            bumpMap: grain,
            bumpScale: 0.04,
            envMapIntensity: 0.6,
          });
          const gold = material({
            color: 0xc5a16b,
            metalness: 0.92,
            roughness: 0.26,
            envMapIntensity: 1.25,
          });
          const bronze = material({
            color: 0x654c2c,
            metalness: 0.82,
            roughness: 0.38,
          });
          const lining = material({
            color: 0x5c142b,
            roughness: 0.9,
            bumpMap: grain,
            bumpScale: 0.025,
          });
          const foam = material({
            color: 0xd8c9a9,
            roughness: 1,
            bumpMap: grain,
            bumpScale: 0.045,
          });
          const stone = material({
            color: 0xf3dfba,
            map: stoneMap,
            roughness: 0.88,
            bumpMap: stoneMap,
            bumpScale: 0.05,
          });

          function shape(w: number, h: number, r: number) {
            const s = new T.Shape();
            s.moveTo(-w / 2 + r, -h / 2);
            s.lineTo(w / 2 - r, -h / 2);
            s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
            s.lineTo(w / 2, h / 2 - r);
            s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
            s.lineTo(-w / 2 + r, h / 2);
            s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
            s.lineTo(-w / 2, -h / 2 + r);
            s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
            return s;
          }
          function rounded(
            w: number,
            h: number,
            r: number,
            depth: number,
            mat: InstanceType<typeof T.Material>,
          ) {
            const geometry = new T.ExtrudeGeometry(shape(w, h, r), {
              depth,
              bevelEnabled: true,
              bevelThickness: 0.035,
              bevelSize: 0.035,
              bevelSegments: 4,
              curveSegments: 20,
              steps: 1,
            });
            geometry.translate(0, 0, -depth / 2);
            const mesh = new T.Mesh(geometry, mat);
            mesh.castShadow = mesh.receiveShadow = true;
            return mesh;
          }
          function stitches(
            parent: InstanceType<typeof T.Group>,
            w: number,
            h: number,
            z: number,
          ) {
            const points = shape(w, h, 0.25).getSpacedPoints(200);
            const coordinates: number[] = [];
            for (let i = 0; i < points.length - 1; i += 2) {
              coordinates.push(
                points[i].x,
                points[i].y,
                z,
                points[i + 1].x,
                points[i + 1].y,
                z,
              );
            }
            const geometry = new T.BufferGeometry();
            geometry.setAttribute(
              "position",
              new T.Float32BufferAttribute(coordinates, 3),
            );
            const mat = new T.LineBasicMaterial({ color: 0xf3e6ca });
            materials.add(mat);
            parent.add(new T.LineSegments(geometry, mat));
          }

          const bag = new T.Group();
          bag.position.set(-0.42, 0.78, 0);
          bag.rotation.z = -0.08;
          scene.add(bag);
          const back = new T.Group(),
            padding = new T.Group(),
            insert = new T.Group(),
            front = new T.Group();
          bag.add(back, padding, insert, front);
          const shellShape = shape(1.72, 2.06, 0.34);
          const opening = new T.Path(
            shape(1.48, 1.82, 0.25).getPoints(80).reverse(),
          );
          shellShape.holes.push(opening);
          const shellGeometry = new T.ExtrudeGeometry(shellShape, {
            depth: 0.48,
            bevelEnabled: true,
            bevelThickness: 0.025,
            bevelSize: 0.025,
            bevelSegments: 4,
            curveSegments: 20,
            steps: 1,
          });
          shellGeometry.translate(0, 0, -0.24);
          const body = new T.Mesh(shellGeometry, leather);
          body.castShadow = body.receiveShadow = true;
          back.add(body);
          const rear = rounded(1.66, 2, 0.32, 0.06, leather);
          rear.position.z = -0.25;
          back.add(rear);
          const inner = rounded(1.48, 1.82, 0.25, 0.045, lining);
          inner.position.z = -0.18;
          back.add(inner);
          stitches(back, 1.6, 1.94, -0.28);
          const protectiveLayer = rounded(1.51, 1.86, 0.3, 0.14, foam);
          padding.add(protectiveLayer);
          const fabricLayer = rounded(1.42, 1.78, 0.28, 0.14, lining);
          insert.add(fabricLayer);
          const pocket = rounded(1.22, 0.62, 0.12, 0.035, lining);
          pocket.position.set(0, -0.34, 0.11);
          insert.add(pocket);
          // Narrow fabric ridges suggest an elastic organizer pocket.
          for (let i = 0; i < 12; i++) {
            const ridge = new T.Mesh(
              new T.CapsuleGeometry(0.012, 0.45, 3, 5),
              lining,
            );
            ridge.position.set(-0.55 + i * 0.1, -0.34, 0.145);
            insert.add(ridge);
          }
          const face = rounded(1.7, 2.04, 0.34, 0.11, leather);
          front.add(face);
          stitches(front, 1.57, 1.91, 0.1);
          const plaque = rounded(0.24, 0.3, 0.035, 0.018, gold);
          plaque.position.set(0, -0.04, 0.12);
          front.add(plaque);
          const emblem = new T.Mesh(
            new T.TorusGeometry(0.052, 0.009, 6, 26, Math.PI * 1.7),
            bronze,
          );
          emblem.position.set(0, -0.04, 0.143);
          front.add(emblem);

          // Individually oriented zipper teeth follow the case perimeter.
          const outline = shape(1.76, 2.1, 0.35).getSpacedPoints(144);
          const teethGeometry = new T.BoxGeometry(0.031, 0.055, 0.055);
          geometries.add(teethGeometry);
          const teeth = new T.InstancedMesh(teethGeometry, gold, 144);
          const dummy = new T.Object3D();
          for (let i = 0; i < 144; i++) {
            const p = outline[i],
              next = outline[(i + 1) % 144];
            dummy.position.set(p.x, p.y, 0.29);
            dummy.rotation.set(0, 0, Math.atan2(next.y - p.y, next.x - p.x));
            dummy.updateMatrix();
            teeth.setMatrixAt(i, dummy.matrix);
          }
          back.add(teeth);
          const pull = rounded(0.13, 0.37, 0.055, 0.035, gold);
          pull.position.set(-0.89, -0.65, 0.34);
          pull.rotation.z = -0.18;
          back.add(pull);
          for (let i = 0; i < 3; i++) {
            const link = new T.Mesh(
              new T.TorusGeometry(0.09, 0.025, 8, 26),
              gold,
            );
            link.position.set(-0.94 - i * 0.065, 0.65 - i * 0.13, 0.03);
            link.rotation.y = i % 2 ? Math.PI / 2 : 0;
            back.add(link);
          }
          // A closed, flat leather ribbon forms the wrist loop, with real thickness.
          const strapCurve = new T.CatmullRomCurve3([
            new T.Vector3(-1.08, 0.4, 0),
            new T.Vector3(-1.48, -0.4, 0.05),
            new T.Vector3(-1.5, -1.3, 0.14),
            new T.Vector3(-1.14, -1.45, 0.2),
            new T.Vector3(-1.05, -0.6, 0.1),
            new T.Vector3(-1.08, 0.4, 0),
          ]);
          const strapShape = new T.Shape();
          strapShape.moveTo(-0.07, -0.018);
          strapShape.lineTo(0.07, -0.018);
          strapShape.lineTo(0.07, 0.018);
          strapShape.lineTo(-0.07, 0.018);
          strapShape.closePath();
          const strap = new T.Mesh(
            new T.ExtrudeGeometry(strapShape, {
              steps: 72,
              bevelEnabled: false,
              extrudePath: strapCurve,
            }),
            leather,
          );
          strap.castShadow = true;
          back.add(strap);

          // The two reference photographs guide these approximate 3D reconstructions.
          // Their unphotographed sides are designed surfaces, not recovered geometry.
          const caseExterior = material({
            color: 0x232629,
            roughness: 0.68,
            bumpMap: grain,
            bumpScale: 0.027,
            envMapIntensity: 0.55,
          });
          const caseLining = material({
            color: 0x141a1f,
            roughness: 0.94,
            bumpMap: grain,
            bumpScale: 0.035,
          });
          const caseFoam = material({
            color: 0x24292e,
            roughness: 1,
            bumpMap: grain,
            bumpScale: 0.055,
          });
          const silver = material({
            color: 0xbcc4c9,
            metalness: 0.95,
            roughness: 0.22,
          });
          const zipBlack = material({ color: 0x141517, roughness: 0.78 });

          function hollow(
            w: number,
            h: number,
            r: number,
            depth: number,
            exterior: InstanceType<typeof T.Material>,
            inside: InstanceType<typeof T.Material>,
          ) {
            const group = new T.Group();
            const outline = shape(w, h, r);
            outline.holes.push(
              new T.Path(
                shape(w - 0.19, h - 0.19, Math.max(0.08, r - 0.08))
                  .getPoints(70)
                  .reverse(),
              ),
            );
            const geometry = new T.ExtrudeGeometry(outline, {
              depth,
              bevelEnabled: true,
              bevelSize: 0.025,
              bevelThickness: 0.025,
              bevelSegments: 4,
              curveSegments: 20,
            });
            geometry.translate(0, 0, -depth / 2);
            const wall = new T.Mesh(geometry, exterior);
            wall.castShadow = wall.receiveShadow = true;
            group.add(wall);
            const rear = rounded(w - 0.05, h - 0.05, r - 0.02, 0.05, exterior);
            rear.position.z = -depth / 2;
            group.add(rear);
            const liner = rounded(
              w - 0.2,
              h - 0.2,
              Math.max(0.08, r - 0.09),
              0.025,
              inside,
            );
            liner.position.z = -depth / 2 + 0.045;
            group.add(liner);
            return group;
          }
          function zipper(
            parent: InstanceType<typeof T.Group>,
            w: number,
            h: number,
            r: number,
            z: number,
          ) {
            const outline = shape(w, h, r).getSpacedPoints(160),
              geo = new T.BoxGeometry(0.025, 0.04, 0.045);
            geometries.add(geo);
            const teeth = new T.InstancedMesh(geo, zipBlack, 160),
              marker = new T.Object3D();
            for (let i = 0; i < 160; i++) {
              const a = outline[i],
                b = outline[(i + 1) % 160];
              marker.position.set(a.x, a.y, z);
              marker.rotation.set(0, 0, Math.atan2(b.y - a.y, b.x - a.x));
              marker.updateMatrix();
              teeth.setMatrixAt(i, marker.matrix);
            }
            parent.add(teeth);
          }
          const compact = new T.Group();
          compact.position.set(-0.15, 0.7, 0);
          compact.rotation.z = -0.18;
          scene.add(compact);
          const compactBack = new T.Group(),
            compactPadding = new T.Group(),
            compactCover = new T.Group();
          compact.add(compactBack, compactPadding, compactCover);
          compactBack.add(
            hollow(2.35, 1.7, 0.44, 0.5, caseExterior, caseLining),
          );
          zipper(compactBack, 2.36, 1.71, 0.44, 0.27);
          const compactPad = rounded(2.1, 1.45, 0.35, 0.12, caseFoam);
          compactPadding.add(compactPad);
          const compactFace = rounded(2.31, 1.66, 0.43, 0.16, caseExterior);
          compactCover.add(compactFace);
          const bump = new T.Mesh(
            new T.SphereGeometry(0.37, 36, 22),
            caseExterior,
          );
          bump.scale.set(1, 0.95, 0.4);
          bump.position.set(0.59, -0.01, 0.1);
          bump.castShadow = bump.receiveShadow = true;
          compactCover.add(bump);
          const zipRing = new T.Mesh(
            new T.TorusGeometry(0.09, 0.018, 8, 30),
            silver,
          );
          zipRing.position.set(-1.18, 0.63, 0.13);
          compactBack.add(zipRing);
          const zipPull = rounded(0.12, 0.39, 0.05, 0.025, zipBlack);
          zipPull.position.set(-1.31, 0.43, 0.15);
          zipPull.rotation.z = -0.45;
          compactBack.add(zipPull);
          const clipPath = new T.CatmullRomCurve3([
            new T.Vector3(-1.5, -0.15, 0),
            new T.Vector3(-1.74, -0.45, 0),
            new T.Vector3(-1.83, -0.88, 0),
            new T.Vector3(-1.55, -1.03, 0),
            new T.Vector3(-1.29, -0.76, 0),
            new T.Vector3(-1.5, -0.15, 0),
          ]);
          const clip = new T.Mesh(
            new T.TubeGeometry(clipPath, 55, 0.028, 8, false),
            silver,
          );
          compactBack.add(clip);
          const gate = new T.Mesh(
            new T.CylinderGeometry(0.031, 0.031, 0.39, 10),
            silver,
          );
          gate.position.set(-1.39, -0.46, 0);
          gate.rotation.z = 0.35;
          compactBack.add(gate);

          const travel = new T.Group();
          travel.position.set(0, -0.13, 0);
          travel.rotation.y = -0.28;
          travel.scale.setScalar(0.95);
          scene.add(travel);
          const travelBase = hollow(
            2.9,
            1.85,
            0.35,
            0.55,
            caseExterior,
            caseLining,
          );
          travelBase.rotation.x = -Math.PI / 2;
          travelBase.position.y = 0.12;
          travel.add(travelBase);
          zipper(travelBase, 2.91, 1.86, 0.35, 0.3);
          const hinge = new T.Group();
          hinge.position.set(0, 0.39, -0.9);
          travel.add(hinge);
          const lid = hollow(2.9, 1.85, 0.35, 0.18, caseExterior, caseLining);
          lid.position.set(0, 0.925, 0);
          hinge.add(lid);
          zipper(lid, 2.91, 1.86, 0.35, 0.115);
          const travelInsert = rounded(2.57, 1.52, 0.24, 0.09, caseFoam);
          travelInsert.rotation.x = -Math.PI / 2;
          travel.add(travelInsert);
          const handlePath = new T.CatmullRomCurve3([
            new T.Vector3(-0.39, 0.1, 0.94),
            new T.Vector3(-0.38, -0.13, 1.35),
            new T.Vector3(0.38, -0.13, 1.35),
            new T.Vector3(0.39, 0.1, 0.94),
          ]);
          const carryHandle = new T.Mesh(
            new T.TubeGeometry(handlePath, 35, 0.065, 8, false),
            caseExterior,
          );
          carryHandle.castShadow = true;
          travel.add(carryHandle);
          for (const side of [-1, 1]) {
            const mount = rounded(0.16, 0.28, 0.03, 0.035, caseExterior);
            mount.rotation.x = -0.2;
            mount.position.set(side * 0.39, 0.1, 0.97);
            travel.add(mount);
          }

          // Additional photo-guided shapes. Unseen surfaces remain illustrative.
          const extraFinishes: {
            material: InstanceType<typeof T.MeshStandardMaterial>;
            original: number;
          }[] = [];
          function finishMaterial(
            color: number,
            map?: InstanceType<typeof T.Texture>,
          ) {
            const mat = material({
              color,
              map,
              roughness: 0.73,
              bumpMap: grain,
              bumpScale: 0.025,
            });
            extraFinishes.push({ material: mat, original: color });
            return mat;
          }
          const wristletMat = finishMaterial(0xdacba9),
            organizerMat = finishMaterial(0x72767a),
            yellowMat = finishMaterial(0xf4ce47),
            pinkMat = finishMaterial(0xcb6d96);
          const orangeTrim = material({ color: 0xc77229, roughness: 0.72 });
          const meshPocket = material({
            color: 0x555b61,
            roughness: 0.95,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
          });

          const wristlet = new T.Group();
          wristlet.position.set(-0.2, 0.48, 0);
          scene.add(wristlet);
          const wristBack = new T.Group(),
            wristPad = new T.Group(),
            wristFront = new T.Group();
          wristlet.add(wristBack, wristPad, wristFront);
          wristBack.add(
            hollow(1.83, 1.83, 0.35, 0.45, wristletMat, caseLining),
          );
          zipper(wristBack, 1.87, 1.87, 0.36, 0.26);
          wristPad.add(rounded(1.58, 1.58, 0.28, 0.1, caseFoam));
          wristFront.add(rounded(1.8, 1.8, 0.34, 0.14, wristletMat));
          stitches(wristFront, 1.68, 1.68, 0.11);
          const wristPath = new T.CatmullRomCurve3([
            new T.Vector3(0, 0.95, 0),
            new T.Vector3(-0.08, 1.55, 0),
            new T.Vector3(-0.02, 2.2, 0),
            new T.Vector3(0.12, 2.18, 0.015),
            new T.Vector3(0.14, 1.55, 0.02),
            new T.Vector3(0.05, 0.95, 0.015),
          ]);
          const wristRibbonShape = new T.Shape();
          wristRibbonShape.moveTo(-0.055, -0.014);
          wristRibbonShape.lineTo(0.055, -0.014);
          wristRibbonShape.lineTo(0.055, 0.014);
          wristRibbonShape.lineTo(-0.055, 0.014);
          wristRibbonShape.closePath();
          const wristRibbon = new T.Mesh(
            new T.ExtrudeGeometry(wristRibbonShape, {
              steps: 64,
              bevelEnabled: false,
              extrudePath: wristPath,
            }),
            wristletMat,
          );
          wristBack.add(wristRibbon);
          const snap = new T.Mesh(new T.SphereGeometry(0.04, 12, 8), gold);
          snap.scale.z = 0.3;
          snap.position.set(0.03, 1.06, 0.05);
          wristBack.add(snap);

          const organizer = new T.Group();
          organizer.position.set(0, -0.1, 0);
          organizer.scale.setScalar(0.97);
          scene.add(organizer);
          const organizerBase = hollow(
            2.7,
            1.8,
            0.3,
            0.55,
            organizerMat,
            caseLining,
          );
          organizerBase.rotation.x = -Math.PI / 2;
          organizerBase.position.y = 0.12;
          organizer.add(organizerBase);
          zipper(organizerBase, 2.72, 1.82, 0.31, 0.3);
          const organizerHinge = new T.Group();
          organizerHinge.position.set(0, 0.4, -0.88);
          organizer.add(organizerHinge);
          const organizerLid = hollow(
            2.7,
            1.8,
            0.3,
            0.17,
            organizerMat,
            caseLining,
          );
          organizerLid.position.y = 0.9;
          organizerHinge.add(organizerLid);
          zipper(organizerLid, 2.72, 1.82, 0.31, 0.12);
          const meshPanel = new T.Mesh(
            new T.PlaneGeometry(2.35, 1.22, 26, 16),
            meshPocket,
          );
          meshPanel.position.set(0, -0.08, 0.13);
          organizerLid.add(meshPanel);
          const pocketEdge = rounded(2.36, 0.045, 0.015, 0.025, organizerMat);
          pocketEdge.position.set(0, 0.54, 0.15);
          organizerLid.add(pocketEdge);
          const organizerInsert = new T.Group();
          organizer.add(organizerInsert);
          const organizerFloor = rounded(2.38, 1.49, 0.22, 0.075, organizerMat);
          organizerFloor.rotation.x = -Math.PI / 2;
          organizerInsert.add(organizerFloor);
          for (const x of [-0.4, 0.4]) {
            const partition = rounded(0.055, 0.38, 0.025, 1.32, organizerMat);
            partition.position.set(x, 0.17, 0);
            organizerInsert.add(partition);
          }
          const organizerHandlePath = new T.CatmullRomCurve3([
            new T.Vector3(-0.54, 1.8, -0.03),
            new T.Vector3(-0.4, 2.09, 0),
            new T.Vector3(0.4, 2.09, 0),
            new T.Vector3(0.54, 1.8, -0.03),
          ]);
          const organizerHandle = new T.Mesh(
            new T.TubeGeometry(organizerHandlePath, 36, 0.055, 8, false),
            organizerMat,
          );
          organizerLid.add(organizerHandle);
          organizerHandle.position.y = -0.9;

          function circularTray(
            exterior: InstanceType<typeof T.Material>,
            trim: InstanceType<typeof T.Material>,
          ) {
            const group = new T.Group();
            const profile = [
              new T.Vector2(0, -0.18),
              new T.Vector2(0.98, -0.18),
              new T.Vector2(1.08, -0.12),
              new T.Vector2(1.09, 0.17),
              new T.Vector2(1.06, 0.23),
              new T.Vector2(0.97, 0.23),
              new T.Vector2(0.95, -0.055),
              new T.Vector2(0, -0.055),
            ];
            const bowl = new T.Mesh(new T.LatheGeometry(profile, 80), exterior);
            bowl.castShadow = bowl.receiveShadow = true;
            group.add(bowl);
            const floor = new T.Mesh(
              new T.CylinderGeometry(0.955, 0.955, 0.035, 72),
              caseLining,
            );
            floor.position.y = -0.04;
            group.add(floor);
            const lip = new T.Mesh(
              new T.TorusGeometry(1.064, 0.022, 8, 100),
              trim,
            );
            lip.rotation.x = Math.PI / 2;
            lip.position.y = 0.205;
            group.add(lip);
            return group;
          }
          const roundOpen = new T.Group();
          roundOpen.position.set(0, -0.12, 0);
          scene.add(roundOpen);
          const openBowl = circularTray(caseExterior, orangeTrim);
          roundOpen.add(openBowl);
          const roundHinge = new T.Group();
          roundHinge.position.set(0, 0.21, -1);
          roundOpen.add(roundHinge);
          const openLid = circularTray(caseExterior, orangeTrim);
          openLid.rotation.x = Math.PI;
          openLid.position.z = 1;
          roundHinge.add(openLid);
          const roundPad = new T.Mesh(
            new T.CylinderGeometry(0.88, 0.88, 0.065, 72),
            caseFoam,
          );
          roundOpen.add(roundPad);

          function closedRound(
            exterior: InstanceType<typeof T.MeshStandardMaterial>,
          ) {
            const root = new T.Group();
            root.position.set(-0.16, 0.64, 0);
            scene.add(root);
            const rear = circularTray(caseExterior, zipBlack);
            rear.rotation.x = Math.PI / 2;
            root.add(rear);
            const faceGroup = new T.Group();
            root.add(faceGroup);
            const disk = new T.Mesh(
              new T.CylinderGeometry(1.025, 1.025, 0.16, 90),
              exterior,
            );
            disk.rotation.x = Math.PI / 2;
            disk.castShadow = disk.receiveShadow = true;
            faceGroup.add(disk);
            const rim = new T.Mesh(
              new T.TorusGeometry(1.015, 0.034, 10, 100),
              exterior,
            );
            rim.position.z = 0.075;
            faceGroup.add(rim);
            const pad = new T.Mesh(
              new T.CylinderGeometry(0.91, 0.91, 0.09, 72),
              caseFoam,
            );
            pad.rotation.x = Math.PI / 2;
            root.add(pad);
            const grip = new T.Mesh(
              new T.CapsuleGeometry(0.065, 0.42, 5, 20),
              exterior,
            );
            grip.rotation.z = Math.PI / 2;
            grip.position.set(0, 1.05, 0.04);
            root.add(grip);
            const tab = rounded(0.11, 0.27, 0.04, 0.035, zipBlack);
            tab.position.set(0, -1.18, 0.12);
            root.add(tab);
            return { root, faceGroup, pad };
          }
          const roundYellow = closedRound(yellowMat),
            roundPink = closedRound(pinkMat);

          // Use an actual fabric patch from 7.png, not a flat picture of the whole bag.
          const fabricCanvas = document.createElement("canvas");
          fabricCanvas.width = fabricCanvas.height = 256;
          const fabricPaint = fabricCanvas.getContext("2d")!;
          fabricPaint.fillStyle = "#235dc7";
          fabricPaint.fillRect(0, 0, 256, 256);
          for (let i = 0; i < 18; i++) {
            fabricPaint.fillStyle = [
              "#122c59",
              "#448cd8",
              "#9baec5",
              "#0f1930",
            ][i % 4];
            fabricPaint.beginPath();
            const x = (i * 53) % 256,
              y = (i * 79) % 256;
            fabricPaint.moveTo(x, y);
            fabricPaint.lineTo(x + 75, y + 20);
            fabricPaint.lineTo(x + 45, y + 67);
            fabricPaint.lineTo(x - 20, y + 45);
            fabricPaint.fill();
          }
          const fabricTexture = new T.CanvasTexture(fabricCanvas);
          fabricTexture.colorSpace = T.SRGBColorSpace;
          textures.add(fabricTexture);
          const sourcePhoto = new window.Image();
          sourcePhoto.onload = () => {
            if (disposed) return;
            fabricPaint.drawImage(
              sourcePhoto,
              140,
              150,
              220,
              220,
              0,
              0,
              256,
              256,
            );
            fabricTexture.needsUpdate = true;
          };
          sourcePhoto.src = "/7.png";
          listeners.push(() => {
            sourcePhoto.onload = null;
          });
          const camoMaterial = finishMaterial(0xffffff, fabricTexture);
          const camo = new T.Group();
          camo.position.set(-0.12, 0.66, 0);
          scene.add(camo);
          const camoBack = new T.Group(),
            camoFront = new T.Group(),
            camoPad = new T.Group();
          camo.add(camoBack, camoPad, camoFront);
          camoBack.add(hollow(2, 2.02, 0.42, 0.47, camoMaterial, caseLining));
          zipper(camoBack, 2.03, 2.05, 0.43, 0.26);
          const camoPanel = rounded(1.97, 1.99, 0.41, 0.15, camoMaterial);
          const position = camoPanel.geometry.attributes.position,
            uv = camoPanel.geometry.attributes.uv;
          for (let i = 0; i < uv.count; i++)
            uv.setXY(
              i,
              (position.getX(i) + 1.03) / 2.06,
              (position.getY(i) + 1.05) / 2.1,
            );
          uv.needsUpdate = true;
          camoFront.add(camoPanel);
          camoPad.add(rounded(1.72, 1.74, 0.32, 0.1, caseFoam));
          const camoGrip = new T.Mesh(
            new T.CapsuleGeometry(0.075, 0.58, 5, 20),
            zipBlack,
          );
          camoGrip.rotation.z = Math.PI / 2;
          camoGrip.position.set(0, 1.05, 0.04);
          camoBack.add(camoGrip);
          const bluePull = rounded(
            0.13,
            0.4,
            0.04,
            0.035,
            material({ color: 0x4195d0, roughness: 0.65 }),
          );
          bluePull.position.set(1.03, 0.81, 0.16);
          bluePull.rotation.z = 0.62;
          camoBack.add(bluePull);

          const platform = new T.Group();
          platform.position.y = -1.02;
          scene.add(platform);
          for (const [radius, height, y] of [
            [2.05, 0.18, 0],
            [1.76, 0.16, 0.16],
            [1.39, 0.13, 0.3],
          ]) {
            const step = new T.Mesh(
              new T.CylinderGeometry(radius, radius, height, 96),
              y === 0.3 ? bronze : stone,
            );
            step.position.y = y;
            step.receiveShadow = step.castShadow = true;
            platform.add(step);
          }
          const rimRing = new T.Mesh(
            new T.TorusGeometry(1.39, 0.012, 8, 96),
            gold,
          );
          rimRing.rotation.x = -Math.PI / 2;
          rimRing.position.y = 0.37;
          platform.add(rimRing);
          const shadowCanvas = document.createElement("canvas");
          shadowCanvas.width = shadowCanvas.height = 128;
          const shadowPaint = shadowCanvas.getContext("2d")!;
          const gradient = shadowPaint.createRadialGradient(
            64,
            64,
            8,
            64,
            64,
            64,
          );
          gradient.addColorStop(0, "rgba(0,0,0,0.45)");
          gradient.addColorStop(1, "rgba(0,0,0,0)");
          shadowPaint.fillStyle = gradient;
          shadowPaint.fillRect(0, 0, 128, 128);
          const shadowMap = new T.CanvasTexture(shadowCanvas);
          textures.add(shadowMap);
          const softShadow = new T.MeshBasicMaterial({
            map: shadowMap,
            transparent: true,
            depthWrite: false,
          });
          materials.add(softShadow);
          const floor = new T.Mesh(new T.PlaneGeometry(5.6, 4), softShadow);
          floor.rotation.x = -Math.PI / 2;
          floor.position.y = -1.13;
          scene.add(floor);

          const orbit = new T.Group();
          scene.add(orbit);
          const arc = new T.Mesh(
            new T.TorusGeometry(2.08, 0.009, 8, 140, Math.PI * 1.65),
            gold,
          );
          arc.position.set(0, 0.85, -0.65);
          arc.rotation.set(0.06, 0.24, -0.4);
          orbit.add(arc);
          const lowerArc = new T.Mesh(
            new T.TorusGeometry(2.05, 0.008, 6, 120, Math.PI * 1.3),
            gold,
          );
          lowerArc.position.set(0, -0.34, 0.3);
          lowerArc.rotation.set(1.25, 0.12, -0.75);
          orbit.add(lowerArc);
          const swatches: InstanceType<typeof T.Mesh>[] = [];
          FINISHES.filter((finish) => finish.id !== "original").forEach(
            (finish, index) => {
              const geometry = new T.PlaneGeometry(0.75, 0.65, 20, 20);
              const positions = geometry.attributes.position;
              for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i),
                  y = positions.getY(i);
                positions.setZ(i, Math.sin(x * 5 + y * 2) * 0.14);
              }
              geometry.computeVertexNormals();
              const mat = material({
                color: finish.color,
                roughness: 0.6,
                bumpMap: grain,
                bumpScale: 0.016,
                side: T.DoubleSide,
              });
              const swatch = new T.Mesh(geometry, mat);
              const pos = [
                [1.52, 1.8, 0.05],
                [-1.9, 2, -0.2],
                [1.85, 0.1, 0.1],
              ][index];
              swatch.position.set(pos[0], pos[1], pos[2]);
              swatch.rotation.set(
                -0.2,
                index === 1 ? 0.4 : -0.3,
                index === 2 ? -0.4 : 0.3,
              );
              swatch.castShadow = true;
              scene.add(swatch);
              swatches.push(swatch);
            },
          );

          const fit = () => {
            const box = host.getBoundingClientRect();
            renderer.setSize(box.width, box.height, false);
            camera.aspect = box.width / Math.max(1, box.height);
            camera.updateProjectionMatrix();
          };
          resize = new ResizeObserver(fit);
          resize.observe(host);
          fit();
          let visible = true,
            dragging = false,
            originX = 0,
            originY = 0,
            lastX = 0,
            lastTime = 0,
            elapsed = 0,
            layer = 1;
          intersection = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
          });
          intersection.observe(host);
          const down = (event: PointerEvent) => {
            dragging = true;
            originX = lastX = event.clientX;
            originY = event.clientY;
            if (event.pointerType !== "touch")
              canvas.setPointerCapture(event.pointerId);
            canvas.style.cursor = "grabbing";
          };
          const move = (event: PointerEvent) => {
            if (!dragging) return;
            if (
              event.pointerType === "touch" &&
              Math.abs(event.clientY - originY) >
                Math.abs(event.clientX - originX)
            )
              return;
            controls.current.rotation += (event.clientX - lastX) * 0.008;
            lastX = event.clientX;
          };
          const up = () => {
            dragging = false;
            canvas.style.cursor = "grab";
          };
          const bind = (
            name:
              | "pointerdown"
              | "pointermove"
              | "pointerup"
              | "pointercancel"
              | "lostpointercapture",
            handler: (event: PointerEvent) => void,
          ) => {
            canvas.addEventListener(name, handler);
            listeners.push(() => canvas.removeEventListener(name, handler));
          };
          bind("pointerdown", down);
          bind("pointermove", move);
          bind("pointerup", up);
          bind("pointercancel", up);
          bind("lostpointercapture", up);
          let lastFinish: Finish = "original";
          function draw(time: number) {
            if (disposed || !host) return;
            const dt = Math.min((time - lastTime) / 1000, 0.05);
            lastTime = time;
            if (visible && !document.hidden) {
              const moving = controls.current.playing && !media.matches;
              if (moving && !dragging) {
                controls.current.rotation += dt * 0.12;
                elapsed += dt;
              }
              const targetLayer = controls.current.exploded ? 1 : 0;
              layer = media.matches
                ? targetLayer
                : T.MathUtils.damp(layer, targetLayer, 6, dt);
              back.position.set(-0.45 * layer, 0, -0.32 * layer);
              padding.position.set(0.08 * layer, 0, 0.34 + 0.17 * layer);
              insert.position.set(0.48 * layer, 0, 0.36 + 0.55 * layer);
              front.position.set(1.02 * layer, 0, 0.39 + 0.95 * layer);
              // The optional padding and insert disappear inside the closed shell.
              padding.visible = insert.visible = layer > 0.03;
              bag.rotation.y = controls.current.rotation;
              bag.visible = controls.current.model === "atelier";
              compact.visible = controls.current.model === "compact";
              travel.visible = controls.current.model === "travel";
              const extraModels = {
                wristlet,
                organizer,
                roundOpen,
                roundYellow: roundYellow.root,
                camo,
                roundPink: roundPink.root,
              };
              for (const [id, root] of Object.entries(extraModels)) {
                root.visible = controls.current.model === id;
                root.rotation.y = controls.current.rotation;
              }
              wristBack.position.set(-0.3 * layer, 0, -0.18 * layer);
              wristPad.position.set(0.15 * layer, 0, 0.32 + 0.25 * layer);
              wristFront.position.set(0.62 * layer, 0, 0.32 + 0.68 * layer);
              wristPad.visible = layer > 0.03;
              organizerHinge.rotation.x = T.MathUtils.lerp(
                Math.PI / 2,
                -0.17,
                layer,
              );
              organizerInsert.position.set(
                0.16 * layer,
                0.01 + 0.39 * layer,
                0,
              );
              roundHinge.rotation.x = -1.75 * layer;
              roundPad.position.set(0.23 * layer, 0.0 + 0.42 * layer, 0);
              roundPad.visible = layer > 0.03;
              for (const item of [roundYellow, roundPink]) {
                item.faceGroup.position.set(
                  0.64 * layer,
                  0,
                  0.27 + 0.75 * layer,
                );
                item.pad.position.set(0.18 * layer, 0, 0.24 + 0.3 * layer);
                item.pad.visible = layer > 0.03;
              }
              camoBack.position.set(-0.27 * layer, 0, -0.16 * layer);
              camoPad.position.set(0.16 * layer, 0, 0.3 + 0.28 * layer);
              camoFront.position.set(0.66 * layer, 0, 0.31 + 0.7 * layer);
              camoPad.visible = layer > 0.03;
              compact.rotation.y = controls.current.rotation;
              travel.rotation.y = controls.current.rotation - 0.28;
              compactBack.position.set(-0.32 * layer, 0, -0.15 * layer);
              compactPadding.position.set(0.2 * layer, 0, 0.32 + 0.35 * layer);
              compactCover.position.set(0.7 * layer, 0, 0.36 + 0.75 * layer);
              compactPadding.visible = layer > 0.03;
              hinge.rotation.x = T.MathUtils.lerp(Math.PI / 2, -0.16, layer);
              travelInsert.position.set(
                0.22 * layer,
                0.0 + 0.48 * layer,
                0.08 * layer,
              );
              swatches.forEach((swatch, index) => {
                const baseY = [1.8, 2, 0.1][index];
                swatch.position.y =
                  baseY + Math.sin(elapsed * 0.7 + index * 2) * 0.045;
              });
              if (lastFinish !== controls.current.finish) {
                lastFinish = controls.current.finish;
                leather.color.setHex(
                  lastFinish === "original"
                    ? 0xdfcba6
                    : FINISHES.find((item) => item.id === lastFinish)!.color,
                );
              }
              caseExterior.color.setHex(
                lastFinish === "original"
                  ? 0x232629
                  : FINISHES.find((item) => item.id === lastFinish)!.color,
              );
              for (const item of extraFinishes)
                item.material.color.setHex(
                  lastFinish === "original"
                    ? item.original
                    : FINISHES.find((f) => f.id === lastFinish)!.color,
                );
              try {
                renderer.render(scene, camera);
                host.dataset.rotation = String(bag.rotation.y);
                host.dataset.layer = String(layer);
                host.dataset.finish = lastFinish;
                host.dataset.model = controls.current.model;
              } catch {
                setStatus("failed");
                return;
              }
            }
            frame = requestAnimationFrame(draw);
          }
          setStatus("ready");
          frame = requestAnimationFrame(draw);
        } catch {
          cleanup();
          setStatus("failed");
        }
      })
      .catch(() => {
        if (!disposed) setStatus("failed");
      });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <figure className="relative isolate rounded-t-[110px] rounded-b-[34px] border border-[#c0a272]/80 bg-[#211e18] p-4 text-[#f8efdc] shadow-[7px_9px_0_#a48a5e,0_26px_50px_-18px_#37271380] sm:rounded-t-[160px] sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[7px] -z-10 rounded-t-[104px] rounded-b-[29px] border border-white/10 bg-[radial-gradient(ellipse_at_40%_14%,#6c4e2d_0%,#32291e_36%,#1d1c18_72%)] sm:rounded-t-[153px]"
      />
      <div className="relative isolate overflow-hidden rounded-t-[92px] pt-4 sm:rounded-t-[135px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[7%] bottom-[7%] top-[2%] -z-10 rounded-t-full rounded-b-[100px] bg-[radial-gradient(ellipse_at_50%_0%,#9a6e3d44,transparent_65%)]"
        />
        <div
          role="img"
          aria-label={c.modelLabel + " · " + c.models[model]}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              controls.current.rotation +=
                event.key === "ArrowLeft" ? -0.18 : 0.18;
            }
          }}
          className="relative aspect-[1/1.13] w-full rounded-t-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d1b076]"
        >
          <div ref={mount} data-atelier-scene className="absolute inset-0" />
          {status !== "ready" && (
            <div
              role="status"
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center text-[#dbc18d]"
            >
              <PackageOpen className="size-14" strokeWidth={1} />
              <p className="max-w-xs text-sm leading-7">
                {status === "failed" ? copy.hero.fallback : c.loading}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-1 pb-6 pt-1">
        <div role="group" aria-label={c.finishLabel} className="flex gap-3">
          {FINISHES.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              disabled={status !== "ready"}
              aria-label={c.finishes[item.id]}
              aria-pressed={finish === item.id}
              onClick={() => setFinish(item.id)}
              className={
                "size-11 rounded-full border-2 p-[4px] hover:bg-white/10 " +
                (finish === item.id ? "border-[#e4c68a]" : "border-transparent")
              }
            >
              <span
                style={{ backgroundColor: item.hex }}
                className="flex size-full items-center justify-center rounded-full border border-[#ddbd7e]/60 text-[#312719] shadow-[inset_0_2px_4px_#fff5,0_2px_4px_#0005]"
              >
                {finish === item.id && <Check className="size-4" />}
              </span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              chooseModel(MODELS[(MODELS.indexOf(model) + 1) % MODELS.length])
            }
            disabled={status !== "ready"}
            aria-label={c.changePhoto}
            title={c.changePhoto}
            className="rounded-full text-[#dec38d] hover:bg-white/10 hover:text-white"
          >
            <Images className="size-5" strokeWidth={1.3} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              controls.current.rotation = 0.82;
            }}
            disabled={status !== "ready"}
            aria-label={c.reset}
            className="rounded-full text-[#dec38d] hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="size-5" strokeWidth={1.3} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPlaying((value) => !value)}
            disabled={status !== "ready"}
            aria-label={playing ? copy.hero.pause : copy.hero.play}
            aria-pressed={!playing}
            className="rounded-full text-[#dec38d] hover:bg-white/10 hover:text-white"
          >
            {playing ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="mb-5 min-w-0 space-y-3 rounded-2xl border border-[#bc9d64]/20 bg-black/10 p-3">
        <div
          role="group"
          aria-label={c.chooseBag}
          className="flex max-w-full gap-2 overflow-x-auto pb-1"
        >
          {MODELS.map((id) => (
            <Button
              key={id}
              variant="ghost"
              size="icon"
              disabled={status !== "ready"}
              onClick={() => chooseModel(id)}
              aria-label={c.models[id]}
              aria-pressed={model === id}
              className={
                "size-12 shrink-0 overflow-hidden rounded-xl border p-1 hover:bg-white/10 " +
                (model === id
                  ? "border-[#dfc388] bg-white/5"
                  : "border-white/10")
              }
            >
              {id === "atelier" ? (
                <Layers3 className="size-6 text-[#d9bd87]" />
              ) : (
                <Image
                  src={PHOTOS[id]}
                  alt=""
                  width={44}
                  height={44}
                  unoptimized
                  className="size-full object-contain"
                />
              )}
            </Button>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p aria-live="polite" className="text-sm text-[#ead7b5]">
            {c.models[model]}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#b5a68b]">
            {c.referenceNote}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#c4a167]/25 py-4 text-[#cbb88f]">
        <p className="flex items-center gap-2 text-xs leading-6">
          <Hand className="size-4 shrink-0" />
          {c.drag}
        </p>
        <Button
          variant="ghost"
          size="sm"
          disabled={status !== "ready"}
          aria-pressed={exploded}
          onClick={() => setExploded((value) => !value)}
          className="gap-2 rounded-full border border-[#bc9d64]/25 text-xs text-[#e4cfaa] hover:bg-[#c8a66b]/15 hover:text-white"
        >
          <Layers3 className="size-4" />
          {exploded ? c.assemble : c.explode}
        </Button>
      </div>
      <figcaption className="border-t border-[#c4a167]/25 pb-1 pt-6">
        <p className="text-xs uppercase tracking-[0.19em] text-[#d3b27a]">
          {c.eyebrow}
        </p>
        <h2 className="mt-4 font-serif text-3xl leading-[1.14] tracking-tight sm:text-4xl">
          {c.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#ded0b7]">{c.description}</p>
        <Button
          size="lg"
          onClick={() => {
            document.getElementById("quote-form")?.scrollIntoView({
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
              block: "start",
            });
            document
              .querySelector<HTMLInputElement>("#quote-name")
              ?.focus({ preventScroll: true });
          }}
          className="mt-6 h-auto min-h-14 w-full whitespace-normal rounded-2xl border border-[#f8ebce] bg-gradient-to-br from-[#faf0dd] via-[#ebd9b8] to-[#d4b88a] px-4 py-4 text-center font-serif text-xl text-[#2e2418] shadow-[inset_0_0_0_3px_#ae8b5266,0_4px_0_#8d7047,0_10px_20px_#0004] transition-transform hover:-translate-y-0.5 hover:bg-[#f3e5c9] active:translate-y-1 motion-reduce:transform-none"
        >
          {c.cta}
        </Button>
        <p className="mt-5 text-center text-xs leading-6 text-[#af9f82]">
          {copy.hero.sceneNote}
        </p>
      </figcaption>
    </figure>
  );
}
