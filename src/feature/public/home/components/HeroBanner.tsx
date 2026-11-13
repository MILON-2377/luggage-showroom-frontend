
"use client";

import { useEffect, useRef, useState } from "react";
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
    <main>
      <section className="hero">
        <div className="heroType">
          <div className="eyebrow">
            <span className="eyebrowDot" />
            SCULPTED TO BE REMEMBERED
          </div>

          <h1>
            The art
            <br />
            of <em>carrying.</em>
          </h1>

          <p className="description">
            Quiet confidence. Unmistakable presence.
            <br />
            Objects of desire, designed around you.
          </p>

          <div className="heroLinks">
            <a href="#collection" className="primaryButton">
              Discover the collection <span>↗</span>
            </a>

            <a href="#atelier" className="textLink">
              Create with us ↗
            </a>
          </div>

          <div className="edition">
            <span>01 — 04</span>
            <div />
            <span>THE FORME SIGNATURE</span>
          </div>
        </div>

        <div className="heroStage">
          <div className="halo" />

          <div className="stageWord">FORME</div>

          <div className="stageTop">
            <span>THE SIGNATURE / 01</span>
            <span>LIVE 3D OBJECT</span>
          </div>

          <div
            ref={stageRef}
            className="model"
            role="img"
            aria-label="Interactive 3D handbag. Move your mouse to rotate."
          >
            {webglError && (
              <div className="webglFallback">
                <p>3D preview is unavailable.</p>
                <span>
                  Please enable WebGL in your browser.
                </span>
              </div>
            )}
          </div>

          <div className="annotation">
            <span>01 / THE SILHOUETTE</span>
            <p>
              Soft geometry.
              <br />
              Strong character.
            </p>
          </div>

          <div className="stageControls">
            <div className="finishSelector">
              <span className="micro">SELECT A FINISH</span>

              <div className="finishes">
                {FINISHES.map((finish) => (
                  <button
                    key={finish.name}
                    type="button"
                    className={
                      selectedFinish.name === finish.name
                        ? "selected"
                        : ""
                    }
                    style={
                      {
                        "--swatch": finish.color,
                      } as React.CSSProperties
                    }
                    aria-label={`${finish.name} finish`}
                    aria-pressed={
                      selectedFinish.name === finish.name
                    }
                    onClick={() => setSelectedFinish(finish)}
                  />
                ))}
              </div>

              <span className="finishName">
                {selectedFinish.name} / Champagne hardware
              </span>
            </div>

            <button
              type="button"
              className="rotateButton"
              onClick={() => setAutoRotate((value) => !value)}
              aria-pressed={autoRotate}
            >
              ↔ &nbsp;
              Auto rotation {autoRotate ? "on" : "off"}
              <span>360°</span>
            </button>
          </div>
        </div>

        <div className="heroBottom">
          <span>CONSIDERED IN EVERY DETAIL.</span>
          <a href="#collection">SCROLL TO DISCOVER ↓</a>
          <span>DESIGN · MATERIAL · FORM</span>
        </div>
      </section>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Manrope:wght@400;500;600&display=swap");

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #20171b;
        }

        .hero {
          position: relative;
          display: grid;
          grid-template-columns: 46% 54%;
          min-height: 690px;
          padding: 0 5% 65px;
          overflow: hidden;
          color: #f2e8d9;
          background:
            radial-gradient(
              ellipse at 70% 30%,
              #58313c 0%,
              #2c1b22 48%,
              #20171b 90%
            );
          font-family: "Manrope", sans-serif;
        }

        .heroType {
          position: relative;
          z-index: 2;
          padding: 85px 0 50px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #d7b69d;
          font-size: 9px;
          letter-spacing: 2.5px;
        }

        .eyebrowDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c49a75;
        }

        .heroType h1 {
          margin: 48px 0 22px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(76px, 8.3vw, 122px);
          font-weight: 400;
          line-height: 0.86;
          letter-spacing: -4px;
        }

        .heroType h1 em {
          color: #d6b69b;
          font-weight: 400;
        }

        .description {
          margin: 30px 0;
          color: #c3ada3;
          font-size: 12px;
          line-height: 2;
          letter-spacing: 0.3px;
        }

        .heroLinks {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 28px;
          margin-top: 35px;
        }

        .primaryButton {
          display: inline-flex;
          align-items: center;
          gap: 25px;
          padding: 16px 21px;
          background: #e7d8c6;
          color: #2b1d21;
          text-decoration: none;
          font-size: 10px;
          transition: background 0.3s;
        }

        .primaryButton:hover {
          background: #ffffff;
        }

        .textLink {
          color: #e5d1bd;
          font-size: 10px;
          text-decoration: none;
        }

        .edition {
          display: flex;
          align-items: center;
          gap: 17px;
          margin-top: 90px;
          color: #ad9389;
          font-size: 8px;
          letter-spacing: 2px;
        }

        .edition div {
          width: 65px;
          height: 1px;
          background: #856c66;
        }

        .heroStage {
          position: relative;
          min-width: 0;
          isolation: isolate;
        }

        .halo {
          position: absolute;
          inset: 12% 0 6%;
          border: 1px solid #bb8c6c27;
          border-radius: 50%;
        }

        .stageWord {
          position: absolute;
          top: 25%;
          left: 4%;
          color: #e6bc9b08;
          font-family: "Cormorant Garamond", serif;
          font-size: 150px;
          letter-spacing: 7px;
          pointer-events: none;
        }

        .model {
          position: absolute;
          inset: 15px -45px 25px;
          cursor: crosshair;
          touch-action: pan-y;
          z-index: 1;
        }

        .model canvas {
          display: block;
          width: 100%;
          height: 100%;
        }

        .webglFallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #f2e8d9;
          text-align: center;
        }

        .webglFallback p {
          font-family: "Cormorant Garamond", serif;
          font-size: 28px;
        }

        .webglFallback span {
          font-size: 11px;
          color: #c3ada3;
        }

        .stageTop {
          position: absolute;
          top: 32px;
          left: 12%;
          right: 0;
          display: flex;
          justify-content: space-between;
          color: #b49689;
          font-size: 7px;
          letter-spacing: 1.8px;
          pointer-events: none;
          z-index: 2;
        }

        .annotation {
          position: absolute;
          top: 38%;
          right: -10px;
          pointer-events: none;
          z-index: 2;
        }

        .annotation span {
          color: #c4a18b;
          font-size: 7px;
          letter-spacing: 1.5px;
        }

        .annotation p {
          color: #e7d5c7;
          font-family: "Cormorant Garamond", serif;
          font-size: 21px;
          line-height: 1.2;
        }

        .stageControls {
          position: absolute;
          bottom: 15px;
          left: 12%;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 20px;
          z-index: 3;
        }

        .micro {
          color: #bda395;
          font-size: 7px;
          letter-spacing: 1.8px;
        }

        .finishes {
          display: flex;
          gap: 12px;
          margin: 14px 0;
        }

        .finishes button {
          position: relative;
          width: 17px;
          height: 17px;
          padding: 0;
          border: 1px solid #ffffff33;
          border-radius: 50%;
          background: var(--swatch);
          cursor: pointer;
        }

        .finishes button.selected::after {
          position: absolute;
          inset: -5px;
          border: 1px solid #c7a98a;
          border-radius: 50%;
          content: "";
        }

        .finishName {
          color: #c6aa9b;
          font-size: 8px;
        }

        .rotateButton {
          padding: 10px 0;
          border: 0;
          background: transparent;
          color: #e4d1c2;
          font-family: inherit;
          font-size: 8px;
          cursor: pointer;
          white-space: nowrap;
        }

        .rotateButton span {
          margin-left: 10px;
          color: #c39c7e;
        }

        .heroBottom {
          position: absolute;
          right: 5%;
          bottom: 23px;
          left: 5%;
          display: flex;
          justify-content: space-between;
          color: #927a72;
          font-size: 7px;
          letter-spacing: 2px;
          z-index: 4;
        }

        .heroBottom a {
          color: #d4bdac;
          text-decoration: none;
        }

        @media (max-width: 1000px) {
          .hero {
            min-height: 670px;
          }

          .heroType {
            padding-top: 100px;
          }

          .stageControls {
            left: 0;
          }

          .annotation {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .hero {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 0 6% 75px;
          }

          .heroType {
            padding: 65px 0 10px;
          }

          .heroType h1 {
            margin-top: 35px;
            font-size: 90px;
          }

          .description {
            font-size: 11px;
          }

          .edition {
            margin-top: 40px;
          }

          .heroStage {
            height: 460px;
            margin-top: 0;
          }

          .model {
            inset: 0 -20px 25px;
          }

          .stageWord {
            top: 22%;
            left: 0;
            font-size: 100px;
          }

          .stageTop {
            top: 20px;
            left: 0;
          }

          .stageControls {
            right: 0;
            bottom: 0;
            left: 0;
          }

          .heroBottom {
            right: 6%;
            bottom: 20px;
            left: 6%;
          }

          .heroBottom span:last-child {
            display: none;
          }

          .heroLinks {
            gap: 18px;
          }
        }

        @media (max-width: 380px) {
          .heroType h1 {
            font-size: 76px;
          }

          .heroStage {
            height: 390px;
          }

          .stageControls {
            gap: 8px;
          }

          .rotateButton {
            font-size: 7px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </main>
  );
}
