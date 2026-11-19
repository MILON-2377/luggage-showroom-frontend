
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { Button, buttonVariants } from "@/src/components/ui/button";
const heroSerif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], display: "swap", variable: "--hero-serif" });
const heroSans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--hero-sans" });
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const FINISHES = [
  { name: "Oxblood", color: "#6f2636" },
  { name: "Cognac", color: "#ae7445" },
  { name: "Obsidian", color: "#242726" },
  { name: "Limestone", color: "#c9bca0" },
];

function createLeatherTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#888888";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 18000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 2 + 0.3;
    const shade = Math.floor(Math.random() * 90 + 80);

    ctx.fillStyle = `rgba(${shade},${shade},${shade},0.15)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  return texture;
}

function createLogoTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;

  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 1024, 256);
  ctx.textAlign = "center";
  ctx.fillStyle = "#e3c69a";

  ctx.font = "30px Georgia";
  ctx.fillText("M A I S O N   F O R M E", 512, 105);

  ctx.font = "15px Georgia";
  ctx.fillText("D E S I G N   H O U S E", 512, 155);

  return new THREE.CanvasTexture(canvas);
}

function createBagShape() {
  const shape = new THREE.Shape();

  shape.moveTo(-1.02, -0.78);
  shape.bezierCurveTo(-1.12, -0.78, -1.12, -0.68, -1.12, -0.52);
  shape.lineTo(-1.08, 0.42);
  shape.bezierCurveTo(-1.08, 0.62, -0.94, 0.76, -0.73, 0.78);
  shape.lineTo(0.73, 0.78);
  shape.bezierCurveTo(0.94, 0.76, 1.08, 0.62, 1.08, 0.42);
  shape.lineTo(1.12, -0.52);
  shape.bezierCurveTo(1.12, -0.68, 1.12, -0.78, 1.02, -0.78);
  shape.closePath();

  return shape;
}

function createFlapShape() {
  const shape = new THREE.Shape();

  shape.moveTo(-0.98, 0.55);
  shape.bezierCurveTo(-0.98, 0.77, -0.82, 0.82, -0.62, 0.82);
  shape.lineTo(0.62, 0.82);
  shape.bezierCurveTo(0.82, 0.82, 0.98, 0.77, 0.98, 0.55);
  shape.lineTo(0.93, 0.12);
  shape.bezierCurveTo(0.91, -0.05, 0.77, -0.16, 0.58, -0.17);
  shape.lineTo(-0.58, -0.17);
  shape.bezierCurveTo(-0.77, -0.16, -0.91, -0.05, -0.93, 0.12);
  shape.closePath();

  return shape;
}

function createHandbag(color: string) {
  const bag = new THREE.Group();

  const leatherTexture = createLeatherTexture();
  const logoTexture = createLogoTexture();

  const leather = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.43,
    metalness: 0.02,
    bumpMap: leatherTexture,
    bumpScale: 0.018,
  });

  const gold = new THREE.MeshStandardMaterial({
    color: "#d9b883",
    metalness: 0.92,
    roughness: 0.22,
  });

  const thread = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).lerp(
      new THREE.Color("#dcc1a4"),
      0.32
    ),
    roughness: 0.75,
  });

  // Main handbag body
  const bodyGeometry = new THREE.ExtrudeGeometry(createBagShape(), {
    depth: 0.72,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.07,
    bevelThickness: 0.07,
    curveSegments: 20,
  });

  bodyGeometry.translate(0, 0, -0.36);

  const body = new THREE.Mesh(bodyGeometry, leather);
  body.castShadow = true;
  body.receiveShadow = true;
  bag.add(body);

  // Side panels
  const sideMaterial = leather.clone();

  const sideGeometry = new THREE.BoxGeometry(0.09, 1.25, 0.73);

  [-1.03, 1.03].forEach((x) => {
    const side = new THREE.Mesh(sideGeometry, sideMaterial);
    side.position.set(x, -0.03, 0);
    side.castShadow = true;
    bag.add(side);
  });

  // Front flap
  const flapGeometry = new THREE.ExtrudeGeometry(createFlapShape(), {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 20,
  });

  flapGeometry.translate(0, 0, 0.39);

  const flap = new THREE.Mesh(flapGeometry, leather);
  flap.position.y = 0.04;
  flap.castShadow = true;
  bag.add(flap);

  // Leather piping
  function addPiping(
    points: THREE.Vector3[],
    radius = 0.018
  ) {
    const curve = new THREE.CatmullRomCurve3(points);

    const geometry = new THREE.TubeGeometry(
      curve,
      64,
      radius,
      8,
      false
    );

    const mesh = new THREE.Mesh(geometry, thread);
    mesh.castShadow = true;
    bag.add(mesh);
  }

  addPiping([
    new THREE.Vector3(-0.98, -0.55, 0.42),
    new THREE.Vector3(-0.96, 0.28, 0.42),
    new THREE.Vector3(-0.8, 0.7, 0.42),
    new THREE.Vector3(0, 0.75, 0.42),
    new THREE.Vector3(0.8, 0.7, 0.42),
    new THREE.Vector3(0.96, 0.28, 0.42),
    new THREE.Vector3(0.98, -0.55, 0.42),
  ]);

  // Front stitching
  addPiping([
    new THREE.Vector3(-0.87, -0.65, 0.425),
    new THREE.Vector3(-0.88, 0.32, 0.425),
    new THREE.Vector3(-0.72, 0.64, 0.425),
    new THREE.Vector3(0, 0.68, 0.425),
    new THREE.Vector3(0.72, 0.64, 0.425),
    new THREE.Vector3(0.88, 0.32, 0.425),
    new THREE.Vector3(0.87, -0.65, 0.425),
  ], 0.009);

  // Gold clasp
  const claspBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.27, 0.22, 0.09),
    gold
  );

  claspBase.position.set(0, -0.12, 0.51);
  claspBase.castShadow = true;
  bag.add(claspBase);

  const claspCenter = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.16, 0.035),
    new THREE.MeshStandardMaterial({
      color: "#f0d6a4",
      metalness: 0.95,
      roughness: 0.18,
    })
  );

  claspCenter.position.set(0, -0.12, 0.565);
  bag.add(claspCenter);

  // Clasp decorative line
  const claspLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.12, 0.015),
    new THREE.MeshStandardMaterial({
      color: "#927044",
      metalness: 0.9,
      roughness: 0.25,
    })
  );

  claspLine.position.set(0, -0.12, 0.59);
  bag.add(claspLine);

  // Handle
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.57, 0.75, 0.02),
    new THREE.Vector3(-0.55, 1.12, 0.02),
    new THREE.Vector3(-0.36, 1.43, 0.02),
    new THREE.Vector3(0, 1.51, 0.02),
    new THREE.Vector3(0.36, 1.43, 0.02),
    new THREE.Vector3(0.55, 1.12, 0.02),
    new THREE.Vector3(0.57, 0.75, 0.02),
  ]);

  const handle = new THREE.Mesh(
    new THREE.TubeGeometry(handleCurve, 64, 0.075, 16, false),
    leather
  );

  handle.castShadow = true;
  bag.add(handle);

  // Handle rings and leather tabs
  [-0.57, 0.57].forEach((x) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.095, 0.025, 12, 32),
      gold
    );

    ring.position.set(x, 0.76, 0.04);
    ring.rotation.y = Math.PI / 2;
    bag.add(ring);

    const tab = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.24, 0.13),
      leather
    );

    tab.position.set(x, 0.68, 0.05);
    bag.add(tab);
  });

  // Brand logo
  const logoMaterial = new THREE.MeshBasicMaterial({
    map: logoTexture,
    transparent: true,
    depthWrite: false,
  });

  const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.85, 0.21),
    logoMaterial
  );

  logo.position.set(0, -0.45, 0.435);
  bag.add(logo);

  bag.userData.leathers = [leather, sideMaterial];
  bag.userData.textures = [leatherTexture, logoTexture];

  bag.rotation.set(-0.06, -0.4, -0.045);
  bag.position.y = -0.02;

  return bag;
}

export default function HeroBanner() {
  const stageRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const autoRotateRef = useRef(true);
  const pointerRef = useRef({ x: 0, y: 0, hovered: false });

  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [webglError, setWebglError] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const container = stageRef.current;

    if (!container) return;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "default",
      });
    } catch (error) {
      console.error("WebGL renderer could not be created:", error);
      setWebglError(true);
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.8)
    );

    renderer.setClearColor(0x000000, 0);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      34,
      1,
      0.1,
      100
    );

    camera.position.set(0, 1.2, 7.7);
    camera.lookAt(0, 0.25, 0);

    // Studio environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment();

    const environmentTexture = pmrem.fromScene(environment).texture;
    scene.environment = environmentTexture;

    environment.dispose();
    pmrem.dispose();

    // Original studio lighting
    const hemisphere = new THREE.HemisphereLight(
      "#ffead4",
      "#392e3c",
      2.5
    );

    scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight("#ffead2", 4.2);
    keyLight.position.set(-3, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#ffe0ad", 3.5);
    rimLight.position.set(4, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight("#dedbff", 1.3);
    fillLight.position.set(3, 1, 4);
    scene.add(fillLight);

    // Handbag
    const model = createHandbag(selectedFinish.color);
    modelRef.current = model;
    scene.add(model);

    // Display platform
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: "#35282b",
      roughness: 0.34,
      metalness: 0.22,
    });

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.75, 1.65, 0.19, 96),
      platformMaterial
    );

    platform.position.y = -1.22;
    platform.receiveShadow = true;
    platform.castShadow = true;
    scene.add(platform);

    const trim = new THREE.Mesh(
      new THREE.TorusGeometry(1.69, 0.018, 12, 120),
      new THREE.MeshStandardMaterial({
        color: "#c9a46e",
        metalness: 0.92,
        roughness: 0.2,
      })
    );

    trim.rotation.x = Math.PI / 2;
    trim.position.y = -1.13;
    scene.add(trim);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.22 })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.325;
    ground.receiveShadow = true;
    scene.add(ground);

    const clock = new THREE.Clock();

    const baseRotationX = -0.06;
    const baseRotationY = -0.4;

    let animationFrame = 0;
    let isDisposed = false;

    const resize = () => {
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    // Mouse interaction: hover and move, no dragging required
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const rect = container.getBoundingClientRect();

      pointerRef.current.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

      pointerRef.current.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

      pointerRef.current.hovered = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.hovered = false;
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    let hasRendered = false;
    const animate = () => {
      if (isDisposed) return;

      animationFrame = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;

      if (pointerRef.current.hovered) {
        const targetY =
          baseRotationY + pointerRef.current.x * 0.75;

        const targetX = THREE.MathUtils.clamp(
          baseRotationX - pointerRef.current.y * 0.3,
          -0.38,
          0.28
        );

        model.rotation.y = THREE.MathUtils.damp(
          model.rotation.y,
          targetY,
          7,
          delta
        );

        model.rotation.x = THREE.MathUtils.damp(
          model.rotation.x,
          targetX,
          7,
          delta
        );
      } else {
        model.rotation.x = THREE.MathUtils.damp(
          model.rotation.x,
          baseRotationX,
          3,
          delta
        );

        if (autoRotateRef.current) {
          model.rotation.y += delta * 0.15;
        } else {
          model.rotation.y = THREE.MathUtils.damp(
            model.rotation.y,
            baseRotationY,
            2,
            delta
          );
        }
      }

      model.position.y =
        -0.02 + Math.sin(time * 1.2) * 0.018;

      renderer.render(scene, camera);
      if (!hasRendered) { hasRendered = true; setSceneReady(true); }
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrame);

      observer.disconnect();

      container.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      container.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture) {
                value.dispose();
              }
            });

            material.dispose();
          });
        }
      });

      renderer.dispose();
      renderer.domElement.remove();

      scene.environment?.dispose();
      modelRef.current = null;
    };
  }, []);

  // Update rotation setting
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Update leather finish without rebuilding the 3D model
  useEffect(() => {
    const model = modelRef.current;

    if (!model) return;

    const leathers = model.userData
      .leathers as THREE.MeshStandardMaterial[];

    leathers?.forEach((material) => {
      material.color.set(selectedFinish.color);
    });
  }, [selectedFinish]);

  return (
    <section className={`${heroSerif.variable} ${heroSans.variable} relative grid min-h-[690px] grid-cols-[46%_54%] overflow-hidden bg-[radial-gradient(ellipse_at_70%_30%,#58313c_0%,#2c1b22_48%,#20171b_90%)] px-[5%] pb-[65px] text-[#f2e8d9] [font-family:var(--hero-sans),sans-serif] max-[1000px]:min-h-[670px] max-[700px]:min-h-0 max-[700px]:grid-cols-1 max-[700px]:px-[6%] max-[700px]:pb-[75px]`}>
      <div className="relative z-2 pt-[85px] pb-[50px] max-[1000px]:pt-[100px] max-[700px]:pt-[65px] max-[700px]:pb-[10px]">
        <div className="flex items-center gap-[10px] text-[9px] tracking-[2.5px] text-[#d7b69d]">
          <span aria-hidden="true" className="size-[6px] rounded-full bg-[#c49a75]" />
          SCULPTED TO BE REMEMBERED
        </div>
        <h1 className="mt-12 mb-[22px] text-[clamp(76px,8.3vw,122px)] leading-[0.86] font-normal tracking-[-4px] [font-family:var(--hero-serif),serif] max-[700px]:mt-[35px] max-[700px]:text-[90px] max-[380px]:text-[76px]">
          The art<br />of <em className="font-normal text-[#d6b69b]">carrying.</em>
        </h1>
        <p className="my-[30px] text-xs leading-[2] tracking-[0.3px] text-[#c3ada3] max-[700px]:text-[11px]">
          Quiet confidence. Unmistakable presence.<br />Objects of desire, designed around you.
        </p>
        <div className="mt-[35px] flex flex-wrap items-center gap-7 max-[700px]:gap-[18px]">
          <a href="#collection" className={buttonVariants({variant:"secondary",className:"h-auto gap-[25px] rounded-none bg-[#e7d8c6] px-[21px] py-4 text-[10px] font-normal text-[#2b1d21] hover:bg-white"})}>
            Discover the collection <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
          <a href="#atelier" className={buttonVariants({variant:"link",className:"h-auto gap-1 rounded-none p-0 text-[10px] font-normal text-[#e5d1bd]"})}>
            Create with us <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
        </div>
        <div className="mt-[90px] flex items-center gap-[17px] text-[8px] tracking-[2px] text-[#ad9389] max-[700px]:mt-10">
          <span>01 — 04</span><div aria-hidden="true" className="h-px w-[65px] bg-[#856c66]" /><span>THE FORME SIGNATURE</span>
        </div>
      </div>

      <div className="relative isolate min-w-0 max-[700px]:h-[460px] max-[380px]:h-[390px]">
        <div aria-hidden="true" className="absolute inset-x-0 top-[12%] bottom-[6%] rounded-[50%] border border-[#bb8c6c27]" />
        <div aria-hidden="true" className="pointer-events-none absolute top-[25%] left-[4%] text-[150px] tracking-[7px] text-[#e6bc9b08] [font-family:var(--hero-serif),serif] max-[700px]:top-[22%] max-[700px]:left-0 max-[700px]:text-[100px]">FORME</div>
        <div className="pointer-events-none absolute top-8 right-0 left-[12%] z-2 flex justify-between text-[7px] tracking-[1.8px] text-[#b49689] max-[700px]:top-5 max-[700px]:left-0">
          <span>THE SIGNATURE / 01</span><span>LIVE 3D OBJECT</span>
        </div>

        <div
          ref={stageRef}
          data-scene-ready={sceneReady ? "true" : "false"}
          role="img"
          aria-label="Interactive 3D handbag. Move your mouse to rotate."
          className="absolute top-[15px] right-[-45px] bottom-[25px] left-[-45px] z-1 touch-pan-y cursor-crosshair max-[700px]:top-0 max-[700px]:right-[-20px] max-[700px]:left-[-20px] [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full [&>canvas]:opacity-0 [&>canvas]:transition-opacity [&>canvas]:duration-200 data-[scene-ready=true]:[&>canvas]:opacity-100 motion-reduce:[&>canvas]:transition-none"
        >
          <Image
            src="/hero-bag-preview.png"
            alt=""
            fill
            preload
            sizes="(max-width: 700px) 100vw, 60vw"
            onLoad={() => setPreviewReady(true)}
            onError={() => setPreviewReady(false)}
            className="pointer-events-none z-2 border-0 object-contain outline-none transition-opacity duration-200 motion-reduce:transition-none"
            style={{ opacity: previewReady && !sceneReady ? 1 : 0 }}
          />
          {webglError && (
            <div className="pointer-events-none absolute inset-x-0 bottom-14 z-3 text-center text-[#f2e8d9]">
              <p className="text-xl [font-family:var(--hero-serif),serif]">3D preview is unavailable.</p>
              <span className="text-[11px] text-[#c3ada3]">Please enable WebGL in your browser.</span>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute top-[38%] right-[-10px] z-2 max-[1000px]:hidden">
          <span className="text-[7px] tracking-[1.5px] text-[#c4a18b]">01 / THE SILHOUETTE</span>
          <p className="text-[21px] leading-[1.2] text-[#e7d5c7] [font-family:var(--hero-serif),serif]">Soft geometry.<br />Strong character.</p>
        </div>
        <div className="absolute right-0 bottom-[15px] left-[12%] z-3 flex items-end justify-between gap-5 max-[1000px]:left-0 max-[700px]:bottom-0 max-[380px]:gap-2">
          <div>
            <span className="text-[7px] tracking-[1.8px] text-[#bda395]">SELECT A FINISH</span>
            <div className="my-[14px] flex gap-3">
              {FINISHES.map(finish => (
                <Button
                  key={finish.name}
                  variant="ghost"
                  size="icon"
                  aria-label={`${finish.name} finish`}
                  aria-pressed={selectedFinish.name === finish.name}
                  onClick={() => setSelectedFinish(finish)}
                  style={{ backgroundColor: finish.color }}
                  className={`relative size-[17px] rounded-full border border-white/20 p-0 ${selectedFinish.name === finish.name ? "after:absolute after:-inset-[5px] after:rounded-full after:border after:border-[#c7a98a] after:content-['']" : ""}`}
                />
              ))}
            </div>
            <span className="text-[8px] text-[#c6aa9b]">{selectedFinish.name} / Champagne hardware</span>
          </div>
          <Button
            variant="ghost"
            aria-pressed={autoRotate}
            onClick={() => setAutoRotate(value => !value)}
            className="h-auto shrink-0 gap-1 rounded-none border-0 bg-transparent px-0 py-[10px] text-[8px] font-normal text-[#e4d1c2] max-[380px]:text-[7px]"
          >
            {autoRotate ? <Pause className="size-3" aria-hidden="true" /> : <Play className="size-3" aria-hidden="true" />}
            Auto rotation {autoRotate ? "on" : "off"}<span className="ml-2.5 text-[#c39c7e]">360°</span>
          </Button>
        </div>
      </div>
      <div className="absolute right-[5%] bottom-[23px] left-[5%] z-4 flex justify-between gap-3 text-[7px] tracking-[2px] text-[#927a72] max-[700px]:right-[6%] max-[700px]:bottom-5 max-[700px]:left-[6%]">
        <span>CONSIDERED IN EVERY DETAIL.</span>
        <a href="#collection" className="inline-flex items-center gap-1 text-[#d4bdac]">SCROLL TO DISCOVER <ArrowDown className="size-3" aria-hidden="true" /></a>
        <span className="max-[700px]:hidden">DESIGN · MATERIAL · FORM</span>
      </div>
    </section>
  );
}
