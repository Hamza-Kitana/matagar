import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type Pose = { x: number; y: number; s: number; rx: number; ry: number; rz: number };

const TAU = Math.PI * 2;
const SECTIONS = ["top", "statement", "collection", "about", "contact"];

// x/y are fractions of the visible viewport (negative x = left, the side free of RTL copy).
// ry keeps accumulating whole turns so the phone spins while it travels between sections.
const DESKTOP_POSES: Pose[] = [
  { x: -0.23, y: -0.02, s: 0.93, rx: -0.08, ry: -0.42, rz: -0.12 },
  { x: -0.28, y: 0, s: 0.84, rx: 0.12, ry: 0.5 + TAU, rz: 0.16 },
  { x: -0.4, y: 0.18, s: 0.58, rx: -0.22, ry: -0.35 + TAU, rz: -0.38 },
  { x: 0.26, y: 0, s: 0.88, rx: 0.1, ry: -0.55 + TAU * 2, rz: 0.14 },
  { x: -0.25, y: -0.02, s: 0.96, rx: -0.06, ry: 0.32 + TAU * 2, rz: -0.08 },
];

const MOBILE_POSES: Pose[] = [
  { x: -0.17, y: -0.27, s: 0.5, rx: -0.1, ry: -0.4, rz: -0.14 },
  { x: -0.3, y: -0.3, s: 0.36, rx: 0.1, ry: 0.5 + TAU, rz: 0.2 },
  { x: -0.24, y: -0.14, s: 0.34, rx: -0.15, ry: -0.3 + TAU, rz: -0.3 },
  { x: 0.28, y: -0.3, s: 0.38, rx: 0.1, ry: -0.5 + TAU * 2, rz: 0.18 },
  { x: -0.26, y: -0.3, s: 0.4, rx: -0.06, ry: 0.3 + TAU * 2, rz: -0.1 },
];

const SCREENS = [
  { kicker: "أهلاً فيك", title: "متجرنا", sub: "إكسسوارات بستايل مختلف" },
  { kicker: "مختارة بعناية", title: "تفاصيل تفرق", sub: "كل قطعة إلها حكاية" },
  { kicker: "المجموعة", title: "60 قطعة", sub: "ساعات · سماعات · شواحن والمزيد" },
  { kicker: "VYBE", title: "ستايلك", sub: "بيبيّن من التفاصيل" },
  { kicker: "جاهزين نرد", title: "احكي معنا", sub: "@vybe على إنستغرام" },
];
const SCREEN_FONT = "Cairo, Arial, sans-serif";

function fitFont(ctx: CanvasRenderingContext2D, text: string, weight: number, size: number, maxWidth: number) {
  ctx.font = `${weight} ${size}px ${SCREEN_FONT}`;
  const width = ctx.measureText(text).width;
  if (width > maxWidth) ctx.font = `${weight} ${Math.floor(size * maxWidth / width)}px ${SCREEN_FONT}`;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function drawScreen(ctx: CanvasRenderingContext2D, index: number) {
  const { width: w, height: h } = ctx.canvas;
  const screen = SCREENS[index] ?? SCREENS[0]!;
  const bg = ctx.createLinearGradient(0, 0, w * 0.9, h);
  bg.addColorStop(0, "#14302a");
  bg.addColorStop(0.55, "#071a19");
  bg.addColorStop(1, "#030c0b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w * 0.55, h * 0.48);
  ctx.rotate(-0.46 + index * 0.35);
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "#c5fc62";
  ctx.beginPath(); ctx.ellipse(-120, -45, 130, 520, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = "#6eab86";
  ctx.beginPath(); ctx.ellipse(75, -110, 120, 520, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = "#153b32";
  ctx.beginPath(); ctx.ellipse(180, -130, 100, 470, 0, 0, TAU); ctx.fill();
  ctx.restore();

  const veil = ctx.createLinearGradient(0, h * 0.45, 0, h);
  veil.addColorStop(0, "rgba(3,12,11,0)");
  veil.addColorStop(1, "rgba(3,12,11,.85)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#f4f7ec";
  ctx.font = "700 28px Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText("9:41", 44, 62);
  for (let bar = 0; bar < 4; bar++) {
    const barHeight = 8 + bar * 5;
    ctx.fillRect(w - 112 + bar * 11, 72 - barHeight, 7, barHeight);
  }
  ctx.beginPath(); ctx.roundRect(w - 60, 52, 24, 20, 4); ctx.fill();

  ctx.font = "900 34px Arial, sans-serif";
  ctx.fillText("VYBE", 56, 140);
  ctx.fillStyle = "#c5fc62";
  ctx.fillText(".", 56 + ctx.measureText("VYBE").width, 140);
  ctx.fillStyle = "rgba(244,247,236,.14)";
  ctx.beginPath(); ctx.roundRect(w - 108, 116, 64, 48, 24); ctx.fill();
  ctx.strokeStyle = "#f4f7ec";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(w - 88, 132, 24, 22, 4); ctx.stroke();
  ctx.beginPath(); ctx.arc(w - 76, 132, 7, Math.PI, 0); ctx.stroke();

  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(3,12,11,.62)";
  fitFont(ctx, screen.kicker, 700, 26, w * 0.7);
  const kickerWidth = ctx.measureText(screen.kicker).width + 44;
  ctx.beginPath(); ctx.roundRect(w / 2 - kickerWidth / 2, h * 0.62 - 24, kickerWidth, 48, 24); ctx.fill();
  ctx.fillStyle = "#c5fc62";
  ctx.fillText(screen.kicker, w / 2, h * 0.62 + 2);

  ctx.fillStyle = "#f4f7ec";
  fitFont(ctx, screen.title, 900, 120, w * 0.84);
  ctx.fillText(screen.title, w / 2, h * 0.73);
  ctx.fillStyle = "rgba(244,247,236,.78)";
  fitFont(ctx, screen.sub, 600, 30, w * 0.82);
  ctx.fillText(screen.sub, w / 2, h * 0.83);
  ctx.direction = "ltr";

  ctx.fillStyle = "rgba(244,247,236,.7)";
  ctx.beginPath(); ctx.roundRect(w / 2 - 90, h - 40, 180, 9, 5); ctx.fill();
}

function radialTexture(inner: string, outer: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function mountPhoneScene(canvas: HTMLCanvasElement): (() => void) | undefined {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch {
    return undefined;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.z = 12;

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-4, 6, 8);
  scene.add(key);
  const rim = new THREE.PointLight(0xb7ff4b, 60);
  rim.position.set(4, -2, 3);
  scene.add(rim);
  const backRim = new THREE.PointLight(0x7fd6ff, 35);
  backRim.position.set(-3, 3, -4);
  scene.add(backRim);

  // Halo and particles follow the phone's position but not its rotation.
  const aura = new THREE.Group();
  scene.add(aura);
  const glowTexture = radialTexture("rgba(197,252,98,.55)", "rgba(197,252,98,0)");
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: glowTexture, transparent: true, depthWrite: false }));
  glow.position.z = -1.6;
  aura.add(glow);

  const dotTexture = radialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)");
  const particleCount = 140;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 2.6 + Math.random() * 3.2;
    const theta = Math.random() * TAU;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 1.3;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xc5fc62, size: 0.09, map: dotTexture, transparent: true, opacity: 0.85, depthWrite: false, sizeAttenuation: true }));
  aura.add(particles);

  const phone = new THREE.Group();
  scene.add(phone);

  const frameMaterial = new THREE.MeshPhysicalMaterial({ color: 0x9aa39d, metalness: 1, roughness: 0.18, envMapIntensity: 1.2 });
  const backMaterial = new THREE.MeshPhysicalMaterial({ color: 0x0f1a18, metalness: 0.55, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12 });
  const edge = new THREE.Mesh(new RoundedBoxGeometry(2.55, 5.25, 0.3, 6, 0.26), frameMaterial);
  phone.add(edge);
  const body = new THREE.Mesh(new RoundedBoxGeometry(2.47, 5.17, 0.32, 6, 0.24), backMaterial);
  phone.add(body);

  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 512;
  screenCanvas.height = 1080;
  const screenCtx = screenCanvas.getContext("2d");
  let screenIndex = 0;
  if (screenCtx) drawScreen(screenCtx, screenIndex);
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  let disposed = false;
  Promise.all(["900 120px Cairo", "700 26px Cairo", "600 30px Cairo"].map(font => document.fonts.load(font, "متجرنا"))).then(() => {
    if (disposed || !screenCtx) return;
    drawScreen(screenCtx, screenIndex);
    screenTexture.needsUpdate = true;
  }, () => undefined);
  const screen = new THREE.Mesh(new RoundedBoxGeometry(2.36, 5.04, 0.02, 6, 0.2), new THREE.MeshBasicMaterial({ map: screenTexture }));
  screen.position.z = 0.162;
  phone.add(screen);
  const glass = new THREE.Mesh(new RoundedBoxGeometry(2.38, 5.06, 0.01, 6, 0.21), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, roughness: 0, metalness: 0, clearcoat: 1 }));
  glass.position.z = 0.176;
  phone.add(glass);
  const island = new THREE.Mesh(new RoundedBoxGeometry(0.7, 0.2, 0.02, 4, 0.09), new THREE.MeshBasicMaterial({ color: 0x020606 }));
  island.position.set(0, 2.25, 0.18);
  phone.add(island);

  const buttonGeometry = new RoundedBoxGeometry(0.05, 0.5, 0.08, 3, 0.025);
  const powerButton = new THREE.Mesh(buttonGeometry, frameMaterial);
  powerButton.position.set(1.29, 1.1, 0);
  phone.add(powerButton);
  const volumeUp = new THREE.Mesh(buttonGeometry, frameMaterial);
  volumeUp.position.set(-1.29, 1.35, 0);
  phone.add(volumeUp);
  const volumeDown = new THREE.Mesh(buttonGeometry, frameMaterial);
  volumeDown.position.set(-1.29, 0.7, 0);
  phone.add(volumeDown);

  const bump = new THREE.Mesh(new RoundedBoxGeometry(1.15, 1.15, 0.12, 5, 0.22), backMaterial);
  bump.position.set(0.55, 1.75, -0.19);
  phone.add(bump);
  const lensGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 40);
  const lensMaterial = new THREE.MeshPhysicalMaterial({ color: 0x050808, metalness: 0.2, roughness: 0.05, clearcoat: 1 });
  const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xa8b0aa, metalness: 1, roughness: 0.2 });
  const ringGeometry = new THREE.TorusGeometry(0.21, 0.035, 12, 40);
  for (const [lx, ly] of [[0.3, 2.0], [0.8, 2.0], [0.3, 1.5]] as const) {
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(lx, ly, -0.27);
    phone.add(lens);
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(lx, ly, -0.3);
    phone.add(ring);
  }
  const flash = new THREE.Mesh(new THREE.CircleGeometry(0.07, 20), new THREE.MeshBasicMaterial({ color: 0xfff6d8 }));
  flash.position.set(0.8, 1.5, -0.26);
  flash.rotation.y = Math.PI;
  phone.add(flash);

  const logoCanvas = document.createElement("canvas");
  logoCanvas.width = 512;
  logoCanvas.height = 160;
  const logoCtx = logoCanvas.getContext("2d");
  if (logoCtx) {
    logoCtx.fillStyle = "#c5fc62";
    logoCtx.font = "900 120px Arial, sans-serif";
    logoCtx.textAlign = "center";
    logoCtx.textBaseline = "middle";
    logoCtx.fillText("VYBE.", 256, 84);
  }
  const logoTexture = new THREE.CanvasTexture(logoCanvas);
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.44), new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true }));
  logo.position.set(0, -0.6, -0.165);
  logo.rotation.y = Math.PI;
  phone.add(logo);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let anchors: number[] = [];
  const current: Pose = { ...DESKTOP_POSES[0]! };
  let lift = 0;
  let mouseX = 0;
  let mouseY = 0;
  let smoothMouseX = 0;
  let smoothMouseY = 0;
  let lastScroll = window.scrollY;
  let velocity = 0;
  let lastTime = performance.now();
  let frame = 0;
  let lastRender = 0;
  let first = true;

  const measure = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    anchors = SECTIONS.map((id, index) => {
      const el = document.getElementById(id);
      if (!el || index === 0) return 0;
      if (index === SECTIONS.length - 1) return max;
      return clamp(el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2, 0, max);
    });
  };
  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    measure();
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  };

  const render = (time: number) => {
    const dt = Math.min(0.05, (time - lastTime) / 1000);
    lastTime = time;
    const scrollY = window.scrollY;
    velocity = lerp(velocity, (scrollY - lastScroll) / Math.max(dt, 0.001), 0.12);
    lastScroll = scrollY;

    const mobile = window.innerWidth < 768;
    const poses = mobile ? MOBILE_POSES : DESKTOP_POSES;
    let index = 0;
    while (index < anchors.length - 2 && scrollY > anchors[index + 1]!) index++;
    const start = anchors[index] ?? 0;
    const span = (anchors[index + 1] ?? start) - start;
    const t = span > 0 ? clamp((scrollY - start) / span, 0, 1) : 0;
    const eased = t * t * (3 - 2 * t);
    const from = poses[index]!;
    const to = poses[index + 1] ?? from;

    const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const visibleWidth = visibleHeight * camera.aspect;
    const fit = mobile ? 1 : clamp(visibleWidth / 13, 0.72, 1.08);
    const arc = Math.sin(eased * Math.PI);
    const target: Pose = {
      x: lerp(from.x, to.x, eased) * visibleWidth,
      y: (lerp(from.y, to.y, eased) + arc * 0.04) * visibleHeight,
      s: lerp(from.s, to.s, eased) * fit * (1 - arc * 0.08),
      rx: lerp(from.rx, to.rx, eased),
      ry: lerp(from.ry, to.ry, eased),
      rz: lerp(from.rz, to.rz, eased),
    };

    const k = reduced.matches || first ? 1 : 1 - Math.exp(-dt * 5);
    first = false;
    current.x = lerp(current.x, target.x, k);
    current.y = lerp(current.y, target.y, k);
    current.s = lerp(current.s, target.s, k);
    current.rx = lerp(current.rx, target.rx, k);
    current.ry = lerp(current.ry, target.ry, k);
    current.rz = lerp(current.rz, target.rz, k);
    lift = lerp(lift, arc, k);
    smoothMouseX = lerp(smoothMouseX, mouseX, 0.06);
    smoothMouseY = lerp(smoothMouseY, mouseY, 0.06);

    const float = reduced.matches ? 0 : Math.sin(time * 0.0011) * 0.1;
    const tilt = reduced.matches ? 0 : clamp(velocity * 0.00025, -0.35, 0.35);
    phone.position.set(current.x, current.y + float, lift * 1.4);
    phone.scale.setScalar(current.s);
    phone.rotation.set(current.rx + smoothMouseY * 0.3 + tilt * 0.6, current.ry + smoothMouseX * 0.5, current.rz - tilt);

    aura.position.set(current.x, current.y + float, 0);
    aura.scale.setScalar(current.s);
    if (!reduced.matches) {
      particles.rotation.y = time * 0.00012;
      particles.rotation.x = Math.sin(time * 0.0002) * 0.15;
    }

    const nextScreen = Math.round(index + eased);
    if (nextScreen !== screenIndex && screenCtx) {
      screenIndex = nextScreen;
      drawScreen(screenCtx, screenIndex);
      screenTexture.needsUpdate = true;
    }

    // While only the slow idle float is moving, 30fps is visually identical and halves GPU work.
    const settled = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) + Math.abs(target.ry - current.ry) < 0.004
      && Math.abs(velocity) < 4 && Math.abs(mouseX - smoothMouseX) + Math.abs(mouseY - smoothMouseY) < 0.003;
    if (!settled || time - lastRender >= 32) {
      renderer.render(scene, camera);
      lastRender = time;
    }
    frame = requestAnimationFrame(render);
  };

  resize();
  const layoutObserver = new ResizeObserver(measure);
  layoutObserver.observe(document.body);
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove, { passive: true });
  frame = requestAnimationFrame(render);
  canvas.classList.add("is-ready");

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    layoutObserver.disconnect();
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
    scene.traverse(object => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      materials.forEach(material => material.dispose());
    });
    [screenTexture, logoTexture, glowTexture, dotTexture, envTexture].forEach(texture => texture.dispose());
    renderer.dispose();
  };
}
