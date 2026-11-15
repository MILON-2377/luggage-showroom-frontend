"use client";

import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import * as THREE from "three";

export default function FaqRobot() {
  const container = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const host = container.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
    } catch {
      setUnavailable(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
    camera.position.set(0, 1.1, 7.6);
    camera.lookAt(0, 0.15, 0);

    const gold = new THREE.MeshStandardMaterial({
      color: 0xa58b65,
      metalness: 0.8,
      roughness: 0.25,
    });

    const pearl = new THREE.MeshStandardMaterial({
      color: 0xe3d9c5,
      metalness: 0.45,
      roughness: 0.22,
    });

    const dark = new THREE.MeshStandardMaterial({
      color: 0x151719,
      metalness: 0.5,
      roughness: 0.25,
    });

    const glow = new THREE.MeshStandardMaterial({
      color: 0xffe4ae,
      emissive: 0xffcc77,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });

    function mesh(
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      parent: THREE.Object3D,
      position: [number, number, number] = [0, 0, 0],
    ) {
      const object = new THREE.Mesh(geometry, material);
      object.position.set(...position);
      parent.add(object);
      return object;
    }

    scene.add(new THREE.HemisphereLight(0xffedce, 0x222b3a, 3));

    const keyLight = new THREE.DirectionalLight(0xffffff, 5);
    keyLight.position.set(-3, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd5aa65, 4);
    rimLight.position.set(3, 2, -3);
    scene.add(rimLight);

    const frontLight = new THREE.PointLight(0xffddaa, 12);
    frontLight.position.set(0, 0, 3);
    scene.add(frontLight);

    const robot = new THREE.Group();
    scene.add(robot);

    // Rounded body.
    const body = mesh(
      new THREE.SphereGeometry(0.66, 40, 28),
      pearl,
      robot,
      [0, -0.35, 0],
    );
    body.scale.set(0.85, 1, 0.7);

    const chest = mesh(
      new THREE.SphereGeometry(0.33, 32, 20),
      dark,
      robot,
      [0, -0.27, 0.38],
    );
    chest.scale.set(1, 0.85, 0.3);

    mesh(
      new THREE.TorusGeometry(0.14, 0.025, 12, 40),
      gold,
      robot,
      [0, -0.25, 0.48],
    );

    mesh(
      new THREE.SphereGeometry(0.075, 20, 16),
      glow,
      robot,
      [0, -0.25, 0.5],
    );

    // The head can turn independently.
    const head = new THREE.Group();
    head.position.y = 0.65;
    robot.add(head);

    const helmet = mesh(
      new THREE.SphereGeometry(0.77, 48, 32),
      pearl,
      head,
    );
    helmet.scale.set(1.12, 0.83, 0.82);

    // Dark curved visor.
    const visor = mesh(
      new THREE.SphereGeometry(0.63, 40, 28),
      dark,
      head,
      [0, -0.02, 0.4],
    );
    visor.scale.set(1.12, 0.7, 0.46);

    const eyes = [-0.25, 0.25].map((x) => {
      const eye = mesh(
        new THREE.SphereGeometry(0.085, 24, 20),
        glow,
        head,
        [x, 0.02, 0.69],
      );
      eye.scale.set(0.75, 1.5, 0.35);
      return eye;
    });

    // Small smile.
    const smile = mesh(
      new THREE.TorusGeometry(0.13, 0.018, 8, 24, Math.PI),
      gold,
      head,
      [0, -0.08, 0.69],
    );
    smile.rotation.z = Math.PI;

    // Ears and antenna.
    [-1, 1].forEach((side) => {
      const ear = mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.13, 24),
        gold,
        head,
        [side * 0.83, 0, 0],
      );
      ear.rotation.z = Math.PI / 2;
    });

    mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.24, 12),
      gold,
      head,
      [0, 0.7, 0],
    );

    mesh(
      new THREE.SphereGeometry(0.075, 20, 16),
      glow,
      head,
      [0, 0.85, 0],
    );

    // Arms pivot at the shoulders.
    function createArm(side: number) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.57, -0.05, 0);
      robot.add(arm);

      mesh(
        new THREE.SphereGeometry(0.15, 24, 20),
        gold,
        arm,
      );

      mesh(
        new THREE.CapsuleGeometry(0.12, 0.4, 8, 20),
        pearl,
        arm,
        [side * 0.13, -0.3, 0],
      );

      mesh(
        new THREE.SphereGeometry(0.15, 24, 20),
        gold,
        arm,
        [side * 0.18, -0.57, 0],
      );

      return arm;
    }

    const leftArm = createArm(-1);
    const wavingArm = createArm(1);
    leftArm.rotation.z = -0.2;

    // Hover thruster.
    const thruster = mesh(
      new THREE.TorusGeometry(0.26, 0.055, 16, 48),
      gold,
      robot,
      [0, -0.98, 0],
    );
    thruster.rotation.x = Math.PI / 2;

    const engine = mesh(
      new THREE.ConeGeometry(0.18, 0.42, 32),
      glow,
      robot,
      [0, -1.15, 0],
    );
    engine.rotation.z = Math.PI;

    // Platform below the floating robot.
    mesh(
      new THREE.CylinderGeometry(1.3, 1.4, 0.14, 64),
      dark,
      scene,
      [0, -1.65, 0],
    );

    const platformRing = mesh(
      new THREE.TorusGeometry(1.28, 0.025, 12, 80),
      gold,
      scene,
      [0, -1.56, 0],
    );
    platformRing.rotation.x = Math.PI / 2;

    const halo = mesh(
      new THREE.TorusGeometry(1.65, 0.012, 8, 100),
      gold,
      scene,
      [0, 0.15, -0.5],
    );
    halo.rotation.set(0.35, 0.4, -0.25);

    const pointer = new THREE.Vector2();
    const preference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let reducedMotion = preference.matches;
    let visible = true;
    let frame = 0;
    let disposed = false;

    function resize() {
      if (!host || disposed) return;

      const width = host.clientWidth;
      const height = host.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.render(scene, camera);
    }

    function followPointer(event: globalThis.PointerEvent) {
      if (
        reducedMotion ||
        event.pointerType === "touch" ||
        !window.matchMedia("(hover: hover)").matches
      ) {
        return;
      }

      const bounds = host!.getBoundingClientRect();

      pointer.set(
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
        -((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
      );
    }

    function resetPointer() {
      pointer.set(0, 0);
    }

    function motionChanged() {
      reducedMotion = preference.matches;
      resetPointer();
    }

    const started = performance.now();

    function animate(now: number) {
      if (disposed) return;

      frame = requestAnimationFrame(animate);

      if (!visible || document.hidden) return;

      const time = (now - started) / 1000;

      if (!reducedMotion) {
        robot.position.y = Math.sin(time * 1.7) * 0.12;
        robot.rotation.y = Math.sin(time * 0.6) * 0.1;

        head.rotation.y +=
          (pointer.x * 0.35 - head.rotation.y) * 0.06;

        head.rotation.x +=
          (-pointer.y * 0.18 - head.rotation.x) * 0.06;

        // Brief blink roughly every five seconds.
        const blink = time % 5 < 0.14 ? 0.12 : 1.5;
        eyes.forEach((eye) => {
          eye.scale.y += (blink - eye.scale.y) * 0.4;
        });

        // A friendly wave during the opening seconds of each cycle.
        const waving = time % 12 < 3.5;
        const target = waving
          ? 2.25 + Math.sin(time * 7) * 0.22
          : 0.25;

        wavingArm.rotation.z +=
          (target - wavingArm.rotation.z) * 0.07;

        engine.scale.y = 1 + Math.sin(time * 8) * 0.08;
        halo.rotation.z = -0.25 + Math.sin(time * 0.4) * 0.12;
      } else {
        robot.position.y = 0;
        robot.rotation.y = 0;
        head.rotation.set(0, 0, 0);
        wavingArm.rotation.z = 0.25;
        eyes.forEach((eye) => {
          eye.scale.y = 1.5;
        });
        engine.scale.y = 1;
      }

      renderer.render(scene, camera);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
    );
    visibilityObserver.observe(host);

    host.addEventListener("pointermove", followPointer);
    host.addEventListener("pointerleave", resetPointer);
    host.addEventListener("pointercancel", resetPointer);
    preference.addEventListener("change", motionChanged);

    resize();
    frame = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);

      resizeObserver.disconnect();
      visibilityObserver.disconnect();

      host.removeEventListener("pointermove", followPointer);
      host.removeEventListener("pointerleave", resetPointer);
      host.removeEventListener("pointercancel", resetPointer);
      preference.removeEventListener("change", motionChanged);

      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();

      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        geometries.add(object.geometry);

        const objectMaterials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        objectMaterials.forEach((material) =>
          materials.add(material),
        );
      });

      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={container}
      aria-hidden="true"
      className="relative h-[340px] w-full sm:h-[390px] [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
    >
      {unavailable && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-32 items-center justify-center rounded-[36px] border border-accent/40 bg-accent/10 shadow-2xl">
            <Bot
              className="size-16 text-accent"
              strokeWidth={1}
            />
          </div>
        </div>
      )}
    </div>
  );
}