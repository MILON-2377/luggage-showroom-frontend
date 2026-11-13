
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Handbag3DProps = {
  color: string;
  autoRotate: boolean;
  className: string;
};

const BASE_ROTATION_X = -0.06;
const BASE_ROTATION_Y = -0.4;
const BASE_ROTATION_Z = -0.045;

function createBagShape(width: number, height: number) {
  const shape = new THREE.Shape();

  shape.moveTo(-width * 0.44, -height / 2);
  shape.quadraticCurveTo(-width * 0.51, -height / 2, -width * 0.49, -height * 0.36);
  shape.lineTo(-width * 0.43, height * 0.37);
  shape.quadraticCurveTo(-width * 0.42, height / 2, -width * 0.32, height / 2);
  shape.lineTo(width * 0.32, height / 2);
  shape.quadraticCurveTo(width * 0.42, height / 2, width * 0.43, height * 0.37);
  shape.lineTo(width * 0.49, -height * 0.36);
  shape.quadraticCurveTo(width * 0.51, -height / 2, width * 0.44, -height / 2);
  shape.closePath();

  return shape;
}

function createExtrude(
  shape: THREE.Shape,
  depth: number,
  bevel = 0.07
) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 30,
  });

  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();

  return geometry;
}

// Original procedural handbag model
function createHandbag(color: string) {
  const group = new THREE.Group();

  const leatherTextureCanvas = document.createElement("canvas");
  leatherTextureCanvas.width = 256;
  leatherTextureCanvas.height = 256;

  const context = leatherTextureCanvas.getContext("2d");

  if (context) {
    const imageData = context.createImageData(256, 256);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const value = 100 + Math.random() * 85;

      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);
  }

  const leatherTexture = new THREE.CanvasTexture(leatherTextureCanvas);
  leatherTexture.wrapS = THREE.RepeatWrapping;
  leatherTexture.wrapT = THREE.RepeatWrapping;
  leatherTexture.repeat.set(4, 4);

  const leather = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.43,
    metalness: 0.02,
    bumpMap: leatherTexture,
    bumpScale: 0.018,
  });

  const sideMat = leather.clone();
  sideMat.color.multiplyScalar(0.75);

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

  const width = 2.16;
  const height = 1.65;
  const depth = 0.72;

  function addMesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    x = 0,
    y = 0,
    z = 0
  ) {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    group.add(mesh);

    return mesh;
  }

  addMesh(createExtrude(createBagShape(width, height), depth), leather);

  function addTube(
    points: number[][],
    radius: number,
    material: THREE.Material = leather
  ) {
    const curve = new THREE.CatmullRomCurve3(
      points.map((point) =>
        new THREE.Vector3(point[0], point[1], point[2])
      )
    );

    return addMesh(
      new THREE.TubeGeometry(curve, 50, radius, 8, false),
      material
    );
  }

  // Original piping
  for (const z of [-depth / 2 - 0.072, depth / 2 + 0.072]) {
    const points = createBagShape(width * 0.96, height * 0.96)
      .getPoints(70)
      .map((point) => [point.x, point.y, z]);

    addTube(points, 0.009, thread);
  }

  // Original front flap and champagne clasp
  const flap = new THREE.Shape();

  flap.moveTo(-0.89, 0.71);
  flap.lineTo(0.89, 0.71);
  flap.lineTo(0.84, 0.22);
  flap.quadraticCurveTo(0, -0.26, -0.84, 0.22);
  flap.closePath();

  addMesh(
    createExtrude(flap, 0.04, 0.035),
    leather,
    0,
    0,
    depth / 2 + 0.1
  );

  addMesh(
    new THREE.BoxGeometry(0.28, 0.22, 0.075),
    gold,
    0,
    0.04,
    depth / 2 + 0.18
  );

  addMesh(
    new THREE.BoxGeometry(0.075, 0.29, 0.09),
    gold,
    0,
    0.04,
    depth / 2 + 0.23
  );

  // Original top handle
  const top = height / 2 + 0.97;
  const span = 0.63;

  for (const z of [-depth * 0.37, depth * 0.37]) {
    addTube(
      [
        [-span, height * 0.34, z],
        [-span * 0.98, top - 0.23, z],
        [-span * 0.6, top, z],
        [span * 0.6, top, z],
        [span * 0.98, top - 0.23, z],
        [span, height * 0.34, z],
      ],
      0.055
    );

    for (const x of [-span, span]) {
      addMesh(
        new THREE.TorusGeometry(0.075, 0.018, 8, 24),
        gold,
        x,
        height * 0.4,
        z + 0.04
      );

      addMesh(
        new THREE.BoxGeometry(0.095, 0.22, 0.045),
        leather,
        x,
        height * 0.31,
        z + 0.075
      );
    }
  }

  // Original foil brand mark
  const logoCanvas = document.createElement("canvas");
  logoCanvas.width = 512;
  logoCanvas.height = 128;

  const logoContext = logoCanvas.getContext("2d");

  if (logoContext) {
    logoContext.fillStyle = "#dfc797";
    logoContext.textAlign = "center";
    logoContext.font = "27px Georgia";
    logoContext.fillText("M A I S O N  F O R M E", 256, 60);

    logoContext.font = "12px Arial";
    logoContext.fillText("D E S I G N  H O U S E", 256, 86);
  }

  const logoTexture = new THREE.CanvasTexture(logoCanvas);

  const logoMaterial = new THREE.MeshBasicMaterial({
    map: logoTexture,
    transparent: true,
    depthWrite: false,
  });

  addMesh(
    new THREE.PlaneGeometry(0.8, 0.2),
    logoMaterial,
    0,
    -0.49,
    depth / 2 + 0.085
  );

  group.userData.leathers = [leather, sideMat];
  group.userData.textures = [leatherTexture, logoTexture];

  return group;
}

export default function Handbag3D({
   color,
  autoRotate,
  className,
}: Handbag3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const hoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  const autoRotateRef = useRef(autoRotate);
  const colorRef = useRef(color);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    colorRef.current = color;

    const model = modelRef.current;
    if (!model) return;

    const materials = model.userData.leathers as THREE.MeshStandardMaterial[];

    materials?.forEach((material) => {
      material.color.set(color);
    });
  }, [color]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;

    try {
  const canvas = document.createElement("canvas");

  const gl =
    canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      powerPreference: "default",
    }) ||
    canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "default",
    });

  if (!gl) {
    console.error(
      "WebGL is unavailable. Please check browser hardware acceleration."
    );
    return;
  }

  renderer = new THREE.WebGLRenderer({
    canvas,
    context: gl,
    alpha: true,
    antialias: false,
    powerPreference: "default",
  });
} catch (error) {
  console.error("Three.js renderer initialization failed:", error);
  return;
}

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 1.2, 7.7);
    camera.lookAt(0, 0.25, 0);

    scene.add(
      new THREE.HemisphereLight("#ffead4", "#392e3c", 2.5)
    );

    const keyLight = new THREE.DirectionalLight("#ffead2", 4.2);
    keyLight.position.set(-3, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#ffe0ad", 3.5);
    rimLight.position.set(4, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight("#dedbff", 1.3);
    fillLight.position.set(3, 1, 4);
    scene.add(fillLight);

    // Original studio reflection environment
    const studio = new THREE.Scene();
    studio.background = new THREE.Color("#8d8680");

    const softboxes = [
      [-3, 2, 2, 2, 5],
      [3, 2, 0, 1, 4],
      [0, 5, 0, 5, 2],
    ];

    softboxes.forEach(([x, y, z, sx, sy]) => {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(sx, sy),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(3, 2.7, 2.2),
          side: THREE.DoubleSide,
        })
      );

      plane.position.set(x, y, z);
      plane.lookAt(0, 0, 0);
      studio.add(plane);
    });

    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(studio, 0.1);

    scene.environment = environment.texture;
    pmrem.dispose();

    studio.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => material.dispose());
      }
    });

    // Original handbag
    const model = createHandbag(colorRef.current);

    model.rotation.set(
      BASE_ROTATION_X,
      BASE_ROTATION_Y,
      BASE_ROTATION_Z
    );

    model.position.y = -0.02;

    scene.add(model);
    modelRef.current = model;

    // Original display platform
    const stone = new THREE.MeshStandardMaterial({
      color: "#35282b",
      roughness: 0.7,
      metalness: 0.12,
    });

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.65, 1.75, 0.19, 96),
      stone
    );

    platform.position.y = -1.22;
    platform.receiveShadow = true;
    scene.add(platform);

    const trim = new THREE.Mesh(
      new THREE.TorusGeometry(1.66, 0.008, 6, 96),
      new THREE.MeshStandardMaterial({
        color: "#aa8460",
        metalness: 0.8,
        roughness: 0.35,
      })
    );

    trim.rotation.x = Math.PI / 2;
    trim.position.y = -1.13;
    scene.add(trim);

    let animationFrame = 0;
    let lastTime = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      renderer.setSize(width, height, false);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    resizeObserver.observe(container);

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      const rect = container.getBoundingClientRect();

      pointerRef.current.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

      pointerRef.current.y =
        ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        hoveredRef.current = true;
      }
    };

    const handlePointerLeave = () => {
      hoveredRef.current = false;
      pointerRef.current = { x: 0, y: 0 };
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerenter", handlePointerEnter);
    container.addEventListener("pointerleave", handlePointerLeave);

    // Smooth hover tracking + automatic 360-degree rotation
    const animate = (time: number) => {
      animationFrame = requestAnimationFrame(animate);

      const delta = lastTime
        ? Math.min((time - lastTime) / 1000, 0.05)
        : 0;

      lastTime = time;

      if (!reducedMotion) {
        if (hoveredRef.current) {
          const targetY =
            BASE_ROTATION_Y + pointerRef.current.x * 0.75;

          const targetX = THREE.MathUtils.clamp(
            BASE_ROTATION_X - pointerRef.current.y * 0.3,
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
          // Return to normal vertical angle
          model.rotation.x = THREE.MathUtils.damp(
            model.rotation.x,
            BASE_ROTATION_X,
            4,
            delta
          );

          // Resume auto rotation when pointer leaves
          if (autoRotateRef.current) {
            model.rotation.y += delta * 0.15;
          }
        }

        model.position.y = -0.02 + Math.sin(time * 0.0008) * 0.035;
      }

      renderer.render(scene, camera);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("pointerleave", handlePointerLeave);

      modelRef.current = null;

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => {
            if ("map" in material && material.map) {
              material.map.dispose();
            }

            if (
              "bumpMap" in material &&
              material.bumpMap
            ) {
              material.bumpMap.dispose();
            }

            material.dispose();
          });
        }
      });

      environment.texture.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
