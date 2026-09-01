import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type Refs = {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh | null;
  mountains: THREE.Mesh[];
  locations: number[];
  animationId: number | null;
  targetCameraX?: number;
  targetCameraY?: number;
  targetCameraZ?: number;
};

const SECTIONS = [
  {
    title: "HORIZON",
    line1: "Where vision meets reality,",
    line2: "we shape the future of tomorrow",
  },
  {
    title: "COSMOS",
    line1: "Beyond the boundaries of imagination,",
    line2: "lies the universe of possibilities",
  },
  {
    title: "INFINITY",
    line1: "In the space between thought and creation,",
    line2: "we find the essence of true innovation",
  },
];

export const Component = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 2;

  const threeRefs = useRef<Refs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    locations: [],
    animationId: null,
  });

  useEffect(() => {
    const refs = threeRefs.current;

    const createStarField = () => {
      const starCount = 5000;
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const c = Math.random();
          if (c < 0.7) color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
          else if (c < 0.9) color.setHSL(0.08, 0.5, 0.8);
          else color.setHSL(0.6, 0.5, 0.8);

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;
          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: { time: { value: 0 }, depth: { value: i } },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            void main() {
              vColor = color;
              vec3 pos = position;
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene!.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xffb347) },
          color2: { value: new THREE.Color(0xc9a227) },
          opacity: { value: 0.3 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      refs.scene!.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const layers = [
        { distance: -50, height: 60, color: 0x1a1713, opacity: 1 },
        { distance: -100, height: 80, color: 0x241d15, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x3a2b16, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x5a4318, opacity: 0.4 },
      ];

      layers.forEach((layer, index) => {
        const points: THREE.Vector2[] = [];
        const segments = 50;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y =
            Math.sin(i * 0.1) * layer.height +
            Math.sin(i * 0.05) * layer.height * 0.5 +
            Math.random() * layer.height * 0.2 -
            100;
          points.push(new THREE.Vector2(x, y));
        }
        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance, index };
        refs.scene!.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = () => {
      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform float time;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(1.0, 0.75, 0.3) * intensity;
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });
      refs.scene!.add(new THREE.Mesh(geometry, material));
    };

    const getLocation = () => {
      refs.locations = refs.mountains.map((m) => m.position.z);
    };

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      refs.stars.forEach((starField) => {
        const mat = starField.material as THREE.ShaderMaterial;
        if (mat.uniforms?.['time']) mat.uniforms['time'].value = time;
      });

      if (refs.nebula) {
        const mat = refs.nebula.material as THREE.ShaderMaterial;
        if (mat.uniforms?.['time']) mat.uniforms['time'].value = time * 0.5;
      }

      if (refs.camera && refs.targetCameraX !== undefined) {
        const s = 0.05;
        smoothCameraPos.current.x += (refs.targetCameraX! - smoothCameraPos.current.x) * s;
        smoothCameraPos.current.y += (refs.targetCameraY! - smoothCameraPos.current.y) * s;
        smoothCameraPos.current.z += (refs.targetCameraZ! - smoothCameraPos.current.z) * s;

        refs.camera.position.x = smoothCameraPos.current.x + Math.sin(time * 0.1) * 2;
        refs.camera.position.y = smoothCameraPos.current.y + Math.cos(time * 0.15) * 1;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + Math.cos(time * 0.15) * 1 * parallaxFactor;
      });

      refs.composer?.render();
    };

    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

    refs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    refs.camera.position.z = 100;
    refs.camera.position.y = 20;

    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: true,
      alpha: true,
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 0.5;

    refs.composer = new EffectComposer(refs.renderer);
    refs.composer.addPass(new RenderPass(refs.scene, refs.camera));
    refs.composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,
        0.4,
        0.85,
      ),
    );

    createStarField();
    createNebula();
    createMountains();
    createAtmosphere();
    getLocation();
    animate();
    setIsReady(true);

    const handleResize = () => {
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      refs.stars.forEach((s) => {
        s.geometry.dispose();
        (s.material as THREE.Material).dispose();
      });
      refs.mountains.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        (refs.nebula.material as THREE.Material).dispose();
      }
      refs.renderer?.dispose();
      refs.stars = [];
      refs.mountains = [];
      refs.nebula = null;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    gsap.set(
      [menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current],
      { visibility: "visible" },
    );

    const tl = gsap.timeline();

    if (menuRef.current) {
      tl.from(menuRef.current, { x: -100, opacity: 0, duration: 1, ease: "power3.out" });
    }
    if (titleRef.current) {
      tl.from(
        titleRef.current.querySelectorAll(".title-char"),
        { y: 200, opacity: 0, duration: 1.5, stagger: 0.05, ease: "power4.out" },
        "-=0.5",
      );
    }
    if (subtitleRef.current) {
      tl.from(
        subtitleRef.current.querySelectorAll(".subtitle-line"),
        { y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" },
        "-=0.8",
      );
    }
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, { opacity: 0, y: 50, duration: 1, ease: "power2.out" }, "-=0.5");
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  useEffect(() => {
    const handleScroll = () => {
      const refs = threeRefs.current;
      if (!refs.mountains.length || !refs.nebula) return;

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

      setScrollProgress(progress);
      const newSection = Math.min(Math.floor(progress * totalSections), totalSections);
      setCurrentSection(newSection);

      const sectionProgress = (progress * totalSections) % 1;

      const cameraPositions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 40, z: -50 },
        { x: 0, y: 50, z: -700 },
      ];
      const currentPos = cameraPositions[newSection] ?? cameraPositions[0]!;
      const nextPos = cameraPositions[newSection + 1] ?? currentPos;

      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      refs.mountains.forEach((mountain, i) => {
        const speed = 1 + i * 0.9;
        const targetZ = (mountain.userData['baseZ'] as number) + scrollY * speed * 0.5;
        refs.nebula!.position.z = targetZ + progress * speed * 0.01 - 100;
        mountain.position.z = progress > 0.7 ? 600000 : (refs.locations[i] ?? 0);
      });
      if (refs.mountains[3]) refs.nebula.position.z = refs.mountains[3].position.z;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalSections]);

  const splitTitle = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="title-char inline-block">
        {char === " " ? "\u00a0" : char}
      </span>
    ));

  return (
    <div className="relative bg-black text-white">
      <canvas ref={canvasRef} className="fixed inset-0 h-full w-full" />

      {/* Side menu */}
      <div
        ref={menuRef}
        className="invisible fixed start-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-6 md:flex"
      >
        <div className="flex flex-col gap-1.5">
          <span className="h-px w-8 bg-white/60" />
          <span className="h-px w-8 bg-white/60" />
          <span className="h-px w-8 bg-white/60" />
        </div>
        <p className="font-display text-xs uppercase tracking-[0.4em] [writing-mode:vertical-rl]">
          Space
        </p>
      </div>

      {/* Hero */}
      <section className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
        <h1
          ref={titleRef}
          className="invisible font-display text-6xl leading-none tracking-[0.15em] md:text-[9rem]"
        >
          {splitTitle(SECTIONS[0]!.title)}
        </h1>
        <div ref={subtitleRef} className="invisible mt-8 space-y-2 text-white/70">
          <p className="subtitle-line text-base md:text-lg">{SECTIONS[0]!.line1}</p>
          <p className="subtitle-line text-base md:text-lg">{SECTIONS[0]!.line2}</p>
        </div>
      </section>

      {/* Scroll progress */}
      <div
        ref={scrollProgressRef}
        className="invisible fixed bottom-8 end-8 z-20 flex flex-col items-end gap-3"
      >
        <p className="font-display text-[10px] uppercase tracking-[0.4em] text-white/70">Scroll</p>
        <div className="h-24 w-px bg-white/20">
          <div
            className="w-px bg-white transition-[height] duration-150"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <p className="font-display text-[10px] tracking-[0.3em] text-white/70">
          {String(currentSection).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
        </p>
      </div>

      {/* Additional scroll sections */}
      {SECTIONS.slice(1).map((s) => (
        <section
          key={s.title}
          className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center"
        >
          <h2 className="font-display text-5xl leading-none tracking-[0.15em] md:text-[7rem]">
            {s.title}
          </h2>
          <div className="mt-8 space-y-2 text-white/70">
            <p className="text-base md:text-lg">{s.line1}</p>
            <p className="text-base md:text-lg">{s.line2}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Component;
