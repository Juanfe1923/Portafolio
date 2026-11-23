import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Orbit, RotateCw, Layers } from "lucide-react";
import { soundManager } from "@/utils/audio";

type ShapeType = "icosahedron" | "torusKnot" | "octahedron";

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

interface TechNodeDef {
  id: string;
  name: string;
  domainLabel: string;
  colorHex: string;
  colorInt: number;
  radius: number;
  angle: number;
  speed: number;
  tiltAngleX: number;
  tiltAngleZ: number;
  yBob: number;
}

const TECH_NODES: TechNodeDef[] = [
  // FRONTEND (Cian Neón - Anillo 1)
  {
    id: "react",
    name: "React",
    domainLabel: "Frontend",
    colorHex: "#38bdf8",
    colorInt: 0x38bdf8,
    radius: 3.3,
    angle: 0,
    speed: 0.012,
    tiltAngleX: 0.35,
    tiltAngleZ: 0.2,
    yBob: 0.25,
  },
  {
    id: "nextjs",
    name: "Next.js",
    domainLabel: "Full Stack",
    colorHex: "#38bdf8",
    colorInt: 0x38bdf8,
    radius: 3.3,
    angle: Math.PI * 0.5,
    speed: 0.012,
    tiltAngleX: 0.35,
    tiltAngleZ: 0.2,
    yBob: -0.25,
  },
  {
    id: "js",
    name: "JavaScript",
    domainLabel: "Frontend",
    colorHex: "#38bdf8",
    colorInt: 0x38bdf8,
    radius: 3.3,
    angle: Math.PI,
    speed: 0.012,
    tiltAngleX: 0.35,
    tiltAngleZ: 0.2,
    yBob: 0.2,
  },
  {
    id: "html-css",
    name: "HTML5/CSS3",
    domainLabel: "Frontend",
    colorHex: "#38bdf8",
    colorInt: 0x38bdf8,
    radius: 3.3,
    angle: Math.PI * 1.5,
    speed: 0.012,
    tiltAngleX: 0.35,
    tiltAngleZ: 0.2,
    yBob: -0.2,
  },

  // BACKEND (Violeta Holograma - Anillo 2)
  {
    id: "python",
    name: "Python",
    domainLabel: "Backend",
    colorHex: "#c084fc",
    colorInt: 0xc084fc,
    radius: 3.8,
    angle: 0.3,
    speed: -0.01,
    tiltAngleX: -0.4,
    tiltAngleZ: -0.3,
    yBob: 0.3,
  },
  {
    id: "django",
    name: "Django",
    domainLabel: "Backend API",
    colorHex: "#c084fc",
    colorInt: 0xc084fc,
    radius: 3.8,
    angle: 0.3 + Math.PI * 0.5,
    speed: -0.01,
    tiltAngleX: -0.4,
    tiltAngleZ: -0.3,
    yBob: -0.3,
  },
  {
    id: "nodejs",
    name: "Node.js",
    domainLabel: "Backend",
    colorHex: "#c084fc",
    colorInt: 0xc084fc,
    radius: 3.8,
    angle: 0.3 + Math.PI,
    speed: -0.01,
    tiltAngleX: -0.4,
    tiltAngleZ: -0.3,
    yBob: 0.25,
  },
  {
    id: "apis-rest",
    name: "APIs REST",
    domainLabel: "Arquitectura",
    colorHex: "#c084fc",
    colorInt: 0xc084fc,
    radius: 3.8,
    angle: 0.3 + Math.PI * 1.5,
    speed: -0.01,
    tiltAngleX: -0.4,
    tiltAngleZ: -0.3,
    yBob: -0.25,
  },

  // BASES DE DATOS (Verde Esmeralda - Anillo 3)
  {
    id: "postgresql",
    name: "PostgreSQL",
    domainLabel: "Base de Datos",
    colorHex: "#34d399",
    colorInt: 0x34d399,
    radius: 4.3,
    angle: 0.7,
    speed: 0.008,
    tiltAngleX: 0.65,
    tiltAngleZ: -0.35,
    yBob: 0.35,
  },
  {
    id: "supabase",
    name: "Supabase",
    domainLabel: "BaaS & Realtime",
    colorHex: "#34d399",
    colorInt: 0x34d399,
    radius: 4.3,
    angle: 0.7 + Math.PI * 0.5,
    speed: 0.008,
    tiltAngleX: 0.65,
    tiltAngleZ: -0.35,
    yBob: -0.35,
  },
  {
    id: "mysql",
    name: "MySQL",
    domainLabel: "Relacional",
    colorHex: "#34d399",
    colorInt: 0x34d399,
    radius: 4.3,
    angle: 0.7 + Math.PI,
    speed: 0.008,
    tiltAngleX: 0.65,
    tiltAngleZ: -0.35,
    yBob: 0.3,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    domainLabel: "NoSQL",
    colorHex: "#34d399",
    colorInt: 0x34d399,
    radius: 4.3,
    angle: 0.7 + Math.PI * 1.5,
    speed: 0.008,
    tiltAngleX: 0.65,
    tiltAngleZ: -0.35,
    yBob: -0.3,
  },

  // HERRAMIENTAS & DEVOPS (Azul Cielo / Ámbar - Anillo 4)
  {
    id: "docker",
    name: "Docker",
    domainLabel: "Contenedores",
    colorHex: "#38bdf8",
    colorInt: 0x38bdf8,
    radius: 4.8,
    angle: 1.1,
    speed: -0.007,
    tiltAngleX: -0.7,
    tiltAngleZ: 0.45,
    yBob: 0.4,
  },
  {
    id: "git",
    name: "Git",
    domainLabel: "Control Versiones",
    colorHex: "#fbbf24",
    colorInt: 0xfbbf24,
    radius: 4.8,
    angle: 1.1 + Math.PI * 0.5,
    speed: -0.007,
    tiltAngleX: -0.7,
    tiltAngleZ: 0.45,
    yBob: -0.4,
  },
  {
    id: "github",
    name: "GitHub",
    domainLabel: "CI/CD & Cloud",
    colorHex: "#38bdf8",
    colorInt: 0x38bdf8,
    radius: 4.8,
    angle: 1.1 + Math.PI,
    speed: -0.007,
    tiltAngleX: -0.7,
    tiltAngleZ: 0.45,
    yBob: 0.35,
  },
  {
    id: "postman",
    name: "Postman",
    domainLabel: "Testing APIs",
    colorHex: "#fbbf24",
    colorInt: 0xfbbf24,
    radius: 4.8,
    angle: 1.1 + Math.PI * 1.5,
    speed: -0.007,
    tiltAngleX: -0.7,
    tiltAngleZ: 0.45,
    yBob: -0.35,
  },

  // MOBILE (Celeste Flutter - Anillo 5)
  {
    id: "flutter",
    name: "Flutter",
    domainLabel: "Mobile Dev",
    colorHex: "#54c5f8",
    colorInt: 0x54c5f8,
    radius: 5.4,
    angle: Math.PI * 0.75,
    speed: 0.009,
    tiltAngleX: 0.5,
    tiltAngleZ: -0.6,
    yBob: 0.3,
  },
  {
    id: "dart",
    name: "Dart",
    domainLabel: "Flutter Lang",
    colorHex: "#54c5f8",
    colorInt: 0x54c5f8,
    radius: 5.4,
    angle: Math.PI * 0.75 + Math.PI,
    speed: 0.009,
    tiltAngleX: 0.5,
    tiltAngleZ: -0.6,
    yBob: -0.3,
  },
];

// Helper to create crisp 2D badge canvas textures for 3D billboard sprites
function createBadgeTexture(
  name: string,
  colorHex: string,
  categoryLabel: string
) {
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 90;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background Glass Pill
  ctx.fillStyle = "rgba(7, 10, 18, 0.88)";
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 3.5;

  const r = 22;
  const x = 5;
  const y = 5;
  const w = canvas.width - 10;
  const h = canvas.height - 10;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Glow dot indicator
  ctx.beginPath();
  ctx.arc(36, 45, 7.5, 0, Math.PI * 2);
  ctx.fillStyle = colorHex;
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Title text
  ctx.font = "bold 30px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(name, 56, 43);

  // Subtitle / domain label
  ctx.font = "bold 15px ui-monospace, monospace";
  ctx.fillStyle = colorHex;
  ctx.fillText(categoryLabel.toUpperCase(), 56, 67);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export default function ThreeDScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState<ShapeType>("icosahedron");
  const [wireframeOnly, setWireframeOnly] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [webglFailed, setWebglFailed] = useState(false);

  // References to communicate with render loop
  const sceneStateRef = useRef<{
    shape: ShapeType;
    wireframeOnly: boolean;
    speed: number;
    coreGroup: THREE.Group | null;
  }>({
    shape: "icosahedron",
    wireframeOnly: false,
    speed: 1,
    coreGroup: null,
  });

  useEffect(() => {
    sceneStateRef.current.shape = shape;
    sceneStateRef.current.wireframeOnly = wireframeOnly;
    sceneStateRef.current.speed = speed;
  }, [shape, wireframeOnly, speed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!isWebGLAvailable()) {
      setWebglFailed(true);
      return;
    }

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 9.4; // Camera distance gives comfortable perspective of all orbiting nodes

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglFailed(true);
      return;
    }
    setWebglFailed(false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // GROUPS
    const masterGroup = new THREE.Group();
    const coreGroup = new THREE.Group();
    const constellationGroup = new THREE.Group();
    const dustGroup = new THREE.Group();
    const orbitRingsGroup = new THREE.Group();

    masterGroup.add(coreGroup);
    masterGroup.add(constellationGroup);
    masterGroup.add(dustGroup);
    masterGroup.add(orbitRingsGroup);
    scene.add(masterGroup);

    sceneStateRef.current.coreGroup = coreGroup;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 6, 30);
    cyanLight.position.set(6, 6, 6);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0xa855f7, 6, 30);
    violetLight.position.set(-6, -6, -4);
    scene.add(violetLight);

    const emeraldLight = new THREE.PointLight(0x34d399, 5, 25);
    emeraldLight.position.set(0, 7, -5);
    scene.add(emeraldLight);

    // MATERIALS FOR CORE
    const wireframeMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
    });

    const innerSolidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x070a12,
      roughness: 0.3,
      metalness: 0.8,
      transmission: 0.5,
      opacity: 0.9,
      transparent: true,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.08,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    // BUILD CORE SHAPE
    let solidMesh: THREE.Mesh | null = null;
    let wireMesh: THREE.Mesh | null = null;
    let pointsMesh: THREE.Points | null = null;

    const buildCoreShape = (type: ShapeType) => {
      while (coreGroup.children.length > 0) {
        const obj = coreGroup.children[0];
        coreGroup.remove(obj);
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
        }
      }

      let geom: THREE.BufferGeometry;
      if (type === "icosahedron") {
        geom = new THREE.IcosahedronGeometry(2.0, 1);
      } else if (type === "torusKnot") {
        geom = new THREE.TorusKnotGeometry(1.3, 0.42, 100, 16);
      } else {
        geom = new THREE.OctahedronGeometry(2.2, 0);
      }

      solidMesh = new THREE.Mesh(geom, innerSolidMaterial);
      wireMesh = new THREE.Mesh(geom, wireframeMaterial);
      pointsMesh = new THREE.Points(geom, pointsMaterial);

      solidMesh.scale.set(0.97, 0.97, 0.97);
      pointsMesh.scale.set(1.03, 1.03, 1.03);

      if (!sceneStateRef.current.wireframeOnly) {
        coreGroup.add(solidMesh);
      }
      coreGroup.add(wireMesh);
      coreGroup.add(pointsMesh);
    };

    buildCoreShape(sceneStateRef.current.shape);

    // BACKGROUND DUST PARTICLES
    const dustCount = 220;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const cCyan = new THREE.Color(0x38bdf8);
    const cViolet = new THREE.Color(0xa855f7);
    const cEmerald = new THREE.Color(0x34d399);

    for (let i = 0; i < dustCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 3.5 + Math.random() * 2.8;

      dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPositions[i * 3 + 2] = r * Math.cos(phi);

      const c = i % 3 === 0 ? cCyan : i % 3 === 1 ? cViolet : cEmerald;
      dustColors[i * 3] = c.r;
      dustColors[i * 3 + 1] = c.g;
      dustColors[i * 3 + 2] = c.b;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3)
    );
    dustGeometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    dustGroup.add(new THREE.Points(dustGeometry, dustMat));

    // ORBITAL GUIDE RINGS (Visual tracks for the 4 domains)
    const ringRadii = [3.3, 3.8, 4.3, 4.8];
    const ringColors = [0x38bdf8, 0xa855f7, 0x34d399, 0x38bdf8];
    const ringTilts = [
      { x: 0.35, z: 0.2 },
      { x: -0.4, z: -0.3 },
      { x: 0.65, z: -0.35 },
      { x: -0.7, z: 0.45 },
    ];

    const ringMeshes: THREE.Line[] = [];
    ringRadii.forEach((rad, idx) => {
      const segments = 64;
      const ringPts = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        ringPts.push(
          new THREE.Vector3(Math.cos(theta) * rad, 0, Math.sin(theta) * rad)
        );
      }
      const ringGeom = new THREE.BufferGeometry().setFromPoints(ringPts);
      const ringMat = new THREE.LineBasicMaterial({
        color: ringColors[idx],
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      });
      const ringLine = new THREE.Line(ringGeom, ringMat);
      ringLine.rotation.x = ringTilts[idx].x;
      ringLine.rotation.z = ringTilts[idx].z;
      orbitRingsGroup.add(ringLine);
      ringMeshes.push(ringLine);
    });

    // BUILD THE 16 TECH NODES + 3D SPRITE BADGES + DYNAMIC CONNECTION LINES
    const sphereGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const haloGeom = new THREE.RingGeometry(0.16, 0.22, 16);

    interface ActiveTechNode {
      def: TechNodeDef;
      mesh: THREE.Mesh;
      haloMesh: THREE.Mesh;
      sprite: THREE.Sprite;
      texture: THREE.CanvasTexture | null;
      currentAngle: number;
    }

    const activeNodes: ActiveTechNode[] = [];

    // LINE SEGMENTS FOR LASER CONNECTIONS TO CORE
    const connectionPositions = new Float32Array(TECH_NODES.length * 2 * 3);
    const connectionColors = new Float32Array(TECH_NODES.length * 2 * 3);

    TECH_NODES.forEach((node, i) => {
      // Node Material
      const nodeMat = new THREE.MeshStandardMaterial({
        color: node.colorInt,
        emissive: node.colorInt,
        emissiveIntensity: 1.4,
        roughness: 0.2,
      });
      const nodeMesh = new THREE.Mesh(sphereGeom, nodeMat);

      // Halo ring around node
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.colorInt,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const haloMesh = new THREE.Mesh(haloGeom, haloMat);
      nodeMesh.add(haloMesh);

      // High-res 3D Billboard Sprite Badge
      const texture = createBadgeTexture(
        node.name,
        node.colorHex,
        node.domainLabel
      );
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.15, 0.35, 1);
      sprite.position.set(0, 0.32, 0);
      nodeMesh.add(sprite);

      constellationGroup.add(nodeMesh);

      activeNodes.push({
        def: node,
        mesh: nodeMesh,
        haloMesh,
        sprite,
        texture,
        currentAngle: node.angle,
      });

      // Colors for connection lines
      const col = new THREE.Color(node.colorInt);
      // Origin vertex (core)
      connectionColors[i * 6] = col.r * 0.5;
      connectionColors[i * 6 + 1] = col.g * 0.5;
      connectionColors[i * 6 + 2] = col.b * 0.5;
      // Target vertex (node)
      connectionColors[i * 6 + 3] = col.r;
      connectionColors[i * 6 + 4] = col.g;
      connectionColors[i * 6 + 5] = col.b;
    });

    const connectionGeometry = new THREE.BufferGeometry();
    connectionGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(connectionPositions, 3)
    );
    connectionGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(connectionColors, 3)
    );

    const connectionMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const connectionLines = new THREE.LineSegments(
      connectionGeometry,
      connectionMaterial
    );
    constellationGroup.add(connectionLines);

    // MOUSE & DRAG INTERACTION
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0.3;
    let currentRotationX = 0.2;
    let currentRotationY = 0.3;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.007;
        targetRotationX += deltaY * 0.007;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        // Parallax tilt on mouse hover
        targetRotationY = normX * 0.45;
        targetRotationX = -normY * 0.45;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ANIMATION LOOP - All 16 nodes and lines are always rendered simultaneously
    let animationId = 0;
    let lastShape = sceneStateRef.current.shape;
    let lastWireframeOnly = sceneStateRef.current.wireframeOnly;

    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);

      // Check if shape changed
      if (
        sceneStateRef.current.shape !== lastShape ||
        sceneStateRef.current.wireframeOnly !== lastWireframeOnly
      ) {
        lastShape = sceneStateRef.current.shape;
        lastWireframeOnly = sceneStateRef.current.wireframeOnly;
        buildCoreShape(lastShape);
      }

      const spd = sceneStateRef.current.speed;

      // Smooth rotation interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.06;
      currentRotationY += (targetRotationY - currentRotationY) * 0.06;

      masterGroup.rotation.x = currentRotationX;
      masterGroup.rotation.y = currentRotationY;

      // Rotate core
      coreGroup.rotation.y += 0.007 * spd;
      coreGroup.rotation.x += 0.003 * spd;

      // Rotate dust
      dustGroup.rotation.y -= 0.002 * spd;

      // Update positions of all 16 tech nodes simultaneously
      const posAttr = connectionGeometry.attributes
        .position as THREE.BufferAttribute;
      const tSeconds = time * 0.001;

      activeNodes.forEach((node, i) => {
        node.currentAngle += node.def.speed * spd;

        // Base circular coordinate on orbital ring
        const baseRad = node.def.radius;
        const xOrb = Math.cos(node.currentAngle) * baseRad;
        const zOrb = Math.sin(node.currentAngle) * baseRad;
        const yOrb = Math.sin(tSeconds * 1.5 + i) * node.def.yBob;

        // Apply orbital ring tilt (X and Z rotations)
        const cosX = Math.cos(node.def.tiltAngleX);
        const sinX = Math.sin(node.def.tiltAngleX);
        const cosZ = Math.cos(node.def.tiltAngleZ);
        const sinZ = Math.sin(node.def.tiltAngleZ);

        // 3D Tilt calculation
        const yTilted = yOrb * cosX - zOrb * sinX;
        const zTilted = yOrb * sinX + zOrb * cosX;
        const xFinal = xOrb * cosZ - yTilted * sinZ;
        const yFinal = xOrb * sinZ + yTilted * cosZ;
        const zFinal = zTilted;

        node.mesh.position.set(xFinal, yFinal, zFinal);
        node.haloMesh.rotation.z += 0.02 * spd;

        // Permanent connection line endpoint from core (0,0,0) to node
        posAttr.setXYZ(i * 2, 0, 0, 0);
        posAttr.setXYZ(i * 2 + 1, xFinal, yFinal, zFinal);
      });

      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      resizeObserver.disconnect();

      dustGeometry.dispose();
      dustMat.dispose();
      sphereGeom.dispose();
      haloGeom.dispose();
      connectionGeometry.dispose();
      connectionMaterial.dispose();
      wireframeMaterial.dispose();
      innerSolidMaterial.dispose();
      pointsMaterial.dispose();

      ringMeshes.forEach((rm) => {
        rm.geometry.dispose();
        (rm.material as THREE.Material).dispose();
      });

      activeNodes.forEach((node) => {
        node.texture?.dispose();
        node.sprite.material.dispose();
        (node.mesh.material as THREE.Material).dispose();
        (node.haloMesh.material as THREE.Material).dispose();
      });

      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  const switchShape = (newShape: ShapeType) => {
    soundManager.playClick();
    setShape(newShape);
  };

  const toggleWireframe = () => {
    soundManager.playClick();
    setWireframeOnly((prev) => !prev);
  };

  const toggleSpeed = () => {
    soundManager.playClick();
    setSpeed((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[440px] sm:h-[500px] lg:h-[540px]">
      {/* ThreeJS WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title="Arrastra para rotar el ecosistema 3D en 360°"
      />

      {webglFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-6 text-center backdrop-blur-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            <Orbit size={22} />
          </div>
          <p className="font-mono text-xs font-bold text-cyan-300">
            Vista 3D no disponible
          </p>
          <p className="max-w-xs text-[11px] leading-relaxed text-slate-400">
            Tu navegador tiene WebGL deshabilitado. Activa la aceleración por
            hardware o abre el portafolio en Chrome, Edge o Firefox para ver el
            ecosistema 3D.
          </p>
        </div>
      )}

      {!webglFailed && (
        <>
          {/* Top Left Status Badge */}
        <div className="pointer-events-none absolute top-3 left-4 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-950/80 px-3.5 py-1.5 font-mono text-[11px] text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="font-bold">Ecosistema 3D Completo</span>
          <span className="text-slate-400">· 16 Nodos Conectados</span>
        </div>

        {/* Hint overlay */}
        <div className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 text-center text-[11px] font-mono text-slate-400 opacity-80 hidden sm:block">
          ✦ Arrastra para girar en 360° · Vista orbital permanente de Frontend, Backend, Bases & DevOps ✦
        </div>

        {/* Cyber Controls Dock: Core shape switcher, wireframe toggle, speed */}
        <div className="absolute bottom-2 flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-slate-800/80 bg-slate-950/85 p-1.5 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => switchShape("icosahedron")}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-mono transition-all ${
              shape === "icosahedron"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Núcleo Geodésico"
          >
            <Sparkles size={12} />
            Icosaedro
          </button>

          <button
            onClick={() => switchShape("torusKnot")}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-mono transition-all ${
              shape === "torusKnot"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Bucle Toroidal"
          >
            <Orbit size={12} />
            Torus
          </button>

          <button
            onClick={() => switchShape("octahedron")}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-mono transition-all ${
              shape === "octahedron"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Núcleo Octaedro"
          >
            <Layers size={12} />
            Octaedro
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          <button
            onClick={toggleWireframe}
            className={`rounded-xl px-2.5 py-1 text-xs font-mono transition-all ${
              wireframeOnly
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Alternar modo alambre / sólido"
          >
            {wireframeOnly ? "Holo Wire" : "Sólido + Wire"}
          </button>

          <button
            onClick={toggleSpeed}
            className="flex items-center gap-1 rounded-xl px-2 py-1 text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-all"
            title="Velocidad de rotación"
          >
            <RotateCw
              size={11}
              className={speed === 2 ? "animate-spin text-cyan-400" : ""}
            />
            {speed}x
          </button>
        </div>
        </>
      )}
    </div>
  );
}
