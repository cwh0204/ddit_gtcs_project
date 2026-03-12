import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// src/domain/warehouse/warehouseScene.js

/**
 * 원본 ex11.js 100% 동일 (UI 제외) + 사이버펑크 그리드 추가
 * + Memory Leak 방지를 위한 강력한 dispose 패턴 적용
 */
export default function createWarehouse(canvas) {
  // ========= Renderer =========
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ========= Scene =========
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1628); // 🌃 네온 블루 배경

  // ========= Camera =========
  const camera = new THREE.PerspectiveCamera(48, canvas.clientWidth / canvas.clientHeight, 0.1, 500);
  camera.position.set(120, 100, 90);
  scene.add(camera);

  // ========= Controls: Orbit only =========
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.08;
  orbit.minDistance = 6;
  orbit.maxDistance = 260;
  orbit.enablePan = true;
  orbit.target.set(52, 1, 10);
  orbit.update();

  // ========= Lights =========
  scene.add(new THREE.AmbientLight(0xffffff, 0.18));

  const hemi = new THREE.HemisphereLight(0xa9c3ff, 0x0b0d12, 0.28);
  scene.add(hemi);

  const moonLight = new THREE.DirectionalLight(0xc7dcff, 1.9);
  moonLight.position.set(35, 55, 20);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(2048, 2048);

  moonLight.shadow.bias = -0.00025;
  moonLight.shadow.normalBias = 0.02;

  scene.add(moonLight);

  // ========= Yard config =========
  const L = 6.0;
  const H = 2.6;
  const W = 2.4;

  const GAP_X = 0.6;
  const GAP_Z = 0.6;
  const GAP_Y = 0.08;

  const stepX = L + GAP_X;
  const stepZ = W + GAP_Z;
  const stepY = H + GAP_Y;

  const zoneStacks = {
    A: { x: 5, z: 5, y: 2 },
    B: { x: 5, z: 5, y: 2 },
    C: { x: 5, z: 5, y: 2 },
    D: { x: 5, z: 5, y: 2 },
    E: { x: 5, z: 5, y: 2 },
    F: { x: 5, z: 5, y: 2 },
    G: { x: 5, z: 5, y: 2 },
    H: { x: 5, z: 5, y: 2 },
    I: { x: 5, z: 5, y: 2 },
  };
  const zoneLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

  const maxX = Math.max(...Object.values(zoneStacks).map((v) => v.x));
  const maxZ = Math.max(...Object.values(zoneStacks).map((v) => v.z));

  const zonePadding = 3.2;
  const zoneSizeX = maxX * stepX + zonePadding * 2;
  const zoneSizeZ = maxZ * stepZ + zonePadding * 2;

  const laneGap = 6.0;
  const yardSizeX = 3 * zoneSizeX + 2 * laneGap;
  const yardSizeZ = 3 * zoneSizeZ + 2 * laneGap;

  {
    const pad = 10;
    const halfX = yardSizeX / 2 + pad;
    const halfZ = yardSizeZ / 2 + pad;

    moonLight.shadow.camera.near = 1;
    moonLight.shadow.camera.far = 220;
    moonLight.shadow.camera.left = -halfX;
    moonLight.shadow.camera.right = halfX;
    moonLight.shadow.camera.top = halfZ;
    moonLight.shadow.camera.bottom = -halfZ;
    moonLight.shadow.camera.updateProjectionMatrix();
  }

  // ========= Ground =========
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(yardSizeX + 40, yardSizeZ + 40),
    new THREE.MeshStandardMaterial({
      color: 0x1a1f2e, // 약간 밝게 조정
      roughness: 1.0,
      metalness: 0.0,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // =========사이버펑크 그리드=========
  function createCyberGrid() {
    const gridGroup = new THREE.Group();

    // 1. 메인 그리드 (큰 간격)
    const gridSize = yardSizeX + 60;
    const gridDivisions = 30;
    const gridColor1 = 0x00d9ff; // 네온 시안
    const gridColor2 = 0x0066ff; // 네온 블루

    const mainGrid = new THREE.GridHelper(gridSize, gridDivisions, gridColor1, gridColor2);
    mainGrid.position.y = 0.04; // 바닥보다 살짝 위
    mainGrid.material.opacity = 0.25;
    mainGrid.material.transparent = true;
    gridGroup.add(mainGrid);

    // 2. 서브 그리드 (작은 간격 - 디테일)
    const subGrid = new THREE.GridHelper(
      gridSize,
      gridDivisions * 3, // 3배 더 촘촘
      0x00d9ff,
      0x00d9ff,
    );
    subGrid.position.y = 0.03;
    subGrid.material.opacity = 0.06; // 매우 연하게
    subGrid.material.transparent = true;
    gridGroup.add(subGrid);

    // 3. 중앙 십자선 (밝게 강조)
    const crossMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      opacity: 0.5,
      transparent: true,
    });

    const crossPoints = [];
    // X축 라인
    crossPoints.push(new THREE.Vector3(-gridSize / 2, 0.05, 0));
    crossPoints.push(new THREE.Vector3(gridSize / 2, 0.05, 0));

    const xLineGeometry = new THREE.BufferGeometry().setFromPoints(crossPoints);
    const xLine = new THREE.Line(xLineGeometry, crossMaterial);
    gridGroup.add(xLine);

    const zPoints = [];
    // Z축 라인
    zPoints.push(new THREE.Vector3(0, 0.05, -gridSize / 2));
    zPoints.push(new THREE.Vector3(0, 0.05, gridSize / 2));

    const zLineGeometry = new THREE.BufferGeometry().setFromPoints(zPoints);
    const zLine = new THREE.Line(zLineGeometry, crossMaterial);
    gridGroup.add(zLine);

    // 4. 펄스 효과 (애니메이션)
    const pulseGrid = new THREE.GridHelper(gridSize, 20, 0x00ffff, 0x00ffff);
    pulseGrid.position.y = 0.06;
    pulseGrid.material.opacity = 0;
    pulseGrid.material.transparent = true;
    gridGroup.add(pulseGrid);

    // 펄스 애니메이션 함수
    let pulseTime = 0;
    const animatePulse = () => {
      pulseTime += 0.015;
      const pulse = Math.sin(pulseTime) * 0.5 + 0.5;
      pulseGrid.material.opacity = pulse * 0.12;
    };

    return { gridGroup, animatePulse };
  }

  const { gridGroup, animatePulse } = createCyberGrid();
  scene.add(gridGroup);

  // ========= Zone lines =========
  const ORANGE = 0xf97316;
  const lineMat = new THREE.LineBasicMaterial({ color: ORANGE });

  const lines = [];
  const halfX = yardSizeX / 2;
  const halfZ = yardSizeZ / 2;

  lines.push(-halfX, 0.02, -halfZ, halfX, 0.02, -halfZ);
  lines.push(halfX, 0.02, -halfZ, halfX, 0.02, halfZ);
  lines.push(halfX, 0.02, halfZ, -halfX, 0.02, halfZ);
  lines.push(-halfX, 0.02, halfZ, -halfX, 0.02, -halfZ);

  const x1 = -halfX + zoneSizeX + laneGap * 0.5;
  const x2 = halfX - zoneSizeX - laneGap * 0.5;
  lines.push(x1, 0.02, -halfZ, x1, 0.02, halfZ);
  lines.push(x2, 0.02, -halfZ, x2, 0.02, halfZ);

  const z1 = -halfZ + zoneSizeZ + laneGap * 0.5;
  const z2 = halfZ - zoneSizeZ - laneGap * 0.5;
  lines.push(-halfX, 0.02, z1, halfX, 0.02, z1);
  lines.push(-halfX, 0.02, z2, halfX, 0.02, z2);

  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
  scene.add(new THREE.LineSegments(lineGeom, lineMat));

  // ========= Zone labels =========
  function makeLabelTexture(letter) {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "bold 160px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, size / 2, size / 2 + 6);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  function addZoneLabel(letter, x, z) {
    const tex = makeLabelTexture(letter);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), mat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(x, 0.07, z); // 그리드보다 위
    scene.add(plane);
  }

  function zoneCenter(col, row) {
    const startX = -yardSizeX / 2 + zoneSizeX / 2;
    const startZ = -yardSizeZ / 2 + zoneSizeZ / 2;
    const x = startX + col * (zoneSizeX + laneGap);
    const z = startZ + row * (zoneSizeZ + laneGap);
    return { x, z };
  }

  let li = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const { x, z } = zoneCenter(col, row);
      addZoneLabel(zoneLetters[li++], x, z);
    }
  }

  // ========= Street lights =========
  function addStreetLight(x, z) {
    const group = new THREE.Group();

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 10, 16), new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.8 }));
    pole.position.set(x, 5, z);
    pole.castShadow = true;
    pole.receiveShadow = true;
    group.add(pole);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 0.15), new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.8 }));
    arm.position.set(x + 1.1, 9.2, z);
    arm.castShadow = true;
    group.add(arm);

    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfff1c2,
        emissiveIntensity: 1.2,
        roughness: 0.3,
      }),
    );
    bulb.position.set(x + 2.15, 9.2, z);
    group.add(bulb);

    const light = new THREE.PointLight(0xfff1c2, 1.2, 45, 2);
    light.position.set(x + 2.15, 9.2, z);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    group.add(light);

    scene.add(group);
  }

  const cornerMargin = 2.0;
  addStreetLight(-halfX + cornerMargin, -halfZ + cornerMargin);
  addStreetLight(halfX - cornerMargin, -halfZ + cornerMargin);
  addStreetLight(halfX - cornerMargin, halfZ - cornerMargin);
  addStreetLight(-halfX + cornerMargin, halfZ - cornerMargin);

  // ========= Texture helper =========
  function tuneTexture(tex) {
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
    tex.needsUpdate = true;
  }

  function canvasTex(w, h, drawFn) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    drawFn(ctx, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tuneTexture(tex);
    return tex;
  }

  // ========= Container textures =========
  const livingCoralHex = "#FF6F61";

  function makeSideTexture() {
    return canvasTex(1024, 512, (ctx, w, h) => {
      ctx.fillStyle = livingCoralHex;
      ctx.fillRect(0, 0, w, h);

      const ribW = 20;
      for (let x = 0; x < w; x += ribW) {
        ctx.fillStyle = "rgba(0,0,0,0.06)";
        ctx.fillRect(x + ribW * 0.62, 0, ribW * 0.14, h);
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.fillRect(x + ribW * 0.1, 0, ribW * 0.1, h);
      }

      const stripeCount = 7;
      const stripeThickness = 16;
      const gap = h / (stripeCount + 1);

      for (let i = 1; i <= stripeCount; i++) {
        const y = Math.round(i * gap);
        ctx.fillStyle = "rgba(255,255,255,0.82)";
        ctx.fillRect(0, y - stripeThickness / 2, w, stripeThickness);

        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.fillRect(0, y - stripeThickness / 2 - 2, w, 2);
        ctx.fillRect(0, y + stripeThickness / 2, w, 2);
      }

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(0,0,0,0.16)");
      grad.addColorStop(0.2, "rgba(0,0,0,0.02)");
      grad.addColorStop(0.8, "rgba(0,0,0,0.02)");
      grad.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(0,0,0,0.05)";
      for (let i = 0; i < 1800; i++) {
        const x = (Math.random() * w) | 0;
        const y = (Math.random() * h) | 0;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }

  function makeDoorTexture() {
    return canvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = livingCoralHex;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0,0,0,0.26)";
      ctx.lineWidth = 10;
      ctx.strokeRect(14, 14, w - 28, h - 28);

      ctx.strokeStyle = "rgba(0,0,0,0.20)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w / 2, 24);
      ctx.lineTo(w / 2, h - 24);
      ctx.stroke();

      const ribW = 18;
      for (let x = 0; x < w; x += ribW) {
        ctx.fillStyle = "rgba(0,0,0,0.055)";
        ctx.fillRect(x + ribW * 0.6, 0, ribW * 0.14, h);
        ctx.fillStyle = "rgba(255,255,255,0.035)";
        ctx.fillRect(x + ribW * 0.1, 0, ribW * 0.1, h);
      }

      ctx.strokeStyle = "rgba(20,20,20,0.55)";
      ctx.lineWidth = 8;
      const rodX1 = w * 0.33;
      const rodX2 = w * 0.67;
      [rodX1, rodX2].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 48);
        ctx.lineTo(x, h - 48);
        ctx.stroke();
        ctx.fillStyle = "rgba(20,20,20,0.55)";
        ctx.fillRect(x - 26, h * 0.55 - 6, 52, 12);
      });

      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillRect(26, 36, 120, 18);

      const grad = ctx.createRadialGradient(w * 0.5, h * 0.8, 30, w * 0.5, h * 0.8, 260);
      grad.addColorStop(0, "rgba(0,0,0,0.16)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(0,0,0,0.05)";
      for (let i = 0; i < 1200; i++) {
        const x = (Math.random() * w) | 0;
        const y = (Math.random() * h) | 0;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }

  function makeTopTexture() {
    return canvasTex(512, 512, (ctx, w, h) => {
      ctx.fillStyle = livingCoralHex;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 6;
      for (let y = 64; y < h; y += 96) {
        ctx.beginPath();
        ctx.moveTo(24, y);
        ctx.lineTo(w - 24, y);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 4;
      for (let y = 32; y < h; y += 96) {
        ctx.beginPath();
        ctx.moveTo(24, y);
        ctx.lineTo(w - 24, y);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(0,0,0,0.045)";
      for (let i = 0; i < 900; i++) {
        const x = (Math.random() * w) | 0;
        const y = (Math.random() * h) | 0;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }

  const sideTex = makeSideTexture();
  const doorTex = makeDoorTexture();
  const topTex = makeTopTexture();

  const endMat = new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.62, metalness: 0.08 });
  const sideMat = new THREE.MeshStandardMaterial({ map: sideTex, roughness: 0.58, metalness: 0.06 });
  const topBottomMat = new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.7, metalness: 0.04 });

  const bodyMaterials = [endMat, endMat, topBottomMat, topBottomMat, sideMat, sideMat];

  function setAllFaded(faded) {
    const targetOpacity = faded ? 0.42 : 1.0;
    bodyMaterials.forEach((mat) => {
      mat.transparent = faded;
      mat.opacity = targetOpacity;
      mat.needsUpdate = true;
    });
  }

  // ========= Containers (Instanced) =========
  const totalContainers = Object.values(zoneStacks).reduce((acc, v) => acc + v.x * v.z * v.y, 0);
  const bodyGeom = new THREE.BoxGeometry(L, H, W);
  const bodyMesh = new THREE.InstancedMesh(bodyGeom, bodyMaterials, totalContainers);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  scene.add(bodyMesh);

  const selectedSolidMesh = new THREE.Mesh(bodyGeom.clone(), bodyMaterials);
  selectedSolidMesh.visible = false;
  selectedSolidMesh.castShadow = true;
  selectedSolidMesh.receiveShadow = true;
  scene.add(selectedSolidMesh);

  const highlightColor = 0x22c55e;
  const highlightMesh = new THREE.Mesh(
    bodyGeom.clone(),
    new THREE.MeshStandardMaterial({
      color: highlightColor,
      transparent: true,
      opacity: 0.92,
      emissive: highlightColor,
      emissiveIntensity: 2.2,
      roughness: 0.4,
      metalness: 0.0,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
  );
  highlightMesh.visible = false;
  highlightMesh.scale.set(1.03, 1.03, 1.03);
  highlightMesh.castShadow = false;
  highlightMesh.receiveShadow = false;
  scene.add(highlightMesh);

  // ========= ID mapping =========
  const idToIndex = new Map();
  const pad2 = (n) => String(n).padStart(2, "0");
  function makeContainerId(zone, gx, gz, gy) {
    return `${zone}-${pad2(gx)}-${pad2(gz)}-${pad2(gy)}`;
  }

  const tmpMat4 = new THREE.Matrix4();

  function resetHighlight() {
    highlightMesh.visible = false;
    selectedSolidMesh.visible = false;
    setAllFaded(false);
  }

  // ========= Camera animation state =========
  const clock = new THREE.Clock();
  let cameraAnim = null;

  function animateCameraTo(toPos, toTarget, duration = 1.6) {
    // 도착 지점에서 카메라가 바라볼 방향의 quaternion 미리 계산
    const toQuat = new THREE.Quaternion();
    const tempCam = camera.clone();
    tempCam.position.copy(toPos);
    tempCam.lookAt(toTarget);
    toQuat.copy(tempCam.quaternion);

    // ✅ 애니메이션 시작 시 OrbitControls 비활성화 (덮어쓰기 방지)
    orbit.enabled = false;

    cameraAnim = {
      fromPos: camera.position.clone(),
      fromQuat: camera.quaternion.clone(), // 현재 회전값
      fromTarget: orbit.target.clone(),
      toPos: toPos.clone(),
      toQuat, // 목표 회전값
      toTarget: toTarget.clone(),
      elapsed: 0,
      duration,
    };
  }

  function highlightIndex(index) {
    if (index == null || index < 0 || index >= totalContainers) return false;

    bodyMesh.getMatrixAt(index, tmpMat4);

    setAllFaded(true);

    selectedSolidMesh.matrixAutoUpdate = false;
    selectedSolidMesh.matrix.copy(tmpMat4);
    selectedSolidMesh.visible = true;

    highlightMesh.matrixAutoUpdate = false;
    highlightMesh.matrix.copy(tmpMat4);
    highlightMesh.visible = true;

    // ✅ 하이라이트된 컨테이너 위치 추출 → 수직 시점으로 카메라 이동
    const containerPos = new THREE.Vector3();
    containerPos.setFromMatrixPosition(tmpMat4);

    const topDownHeight = 80; // 수직에서 내려다보는 높이
    const toPos = new THREE.Vector3(containerPos.x, topDownHeight, containerPos.z);
    const toTarget = new THREE.Vector3(containerPos.x, 0, containerPos.z);

    animateCameraTo(toPos, toTarget, 1.2);

    return true;
  }

  // ========= Placement =========
  const m = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);

  let idxBody = 0;
  const baseY = H * 0.5;

  const zoneOrder = [
    { letter: "A", col: 0, row: 0 },
    { letter: "B", col: 1, row: 0 },
    { letter: "C", col: 2, row: 0 },
    { letter: "D", col: 0, row: 1 },
    { letter: "E", col: 1, row: 1 },
    { letter: "F", col: 2, row: 1 },
    { letter: "G", col: 0, row: 2 },
    { letter: "H", col: 1, row: 2 },
    { letter: "I", col: 2, row: 2 },
  ];

  for (const zinfo of zoneOrder) {
    const { x: zoneX, z: zoneZ } = zoneCenter(zinfo.col, zinfo.row);
    const stack = zoneStacks[zinfo.letter];

    const offsetX = (stack.x - 1) * stepX * 0.5;
    const offsetZ = (stack.z - 1) * stepZ * 0.5;

    for (let y = 0; y < stack.y; y++) {
      for (let z = 0; z < stack.z; z++) {
        for (let x = 0; x < stack.x; x++) {
          const cx = zoneX + (x * stepX - offsetX);
          const cz = zoneZ + (z * stepZ - offsetZ);
          const cy = baseY + y * stepY;

          pos.set(cx, cy, cz);
          m.compose(pos, quat, scale);
          bodyMesh.setMatrixAt(idxBody, m);

          const cid = makeContainerId(zinfo.letter, x + 1, z + 1, y + 1);
          idToIndex.set(cid, idxBody);

          idxBody++;
        }
      }
    }
  }

  bodyMesh.instanceMatrix.needsUpdate = true;

  // ========= Resize =========
  const onResize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  // ========= Loop =========
  // (중요) 애니메이션 프레임 ID 저장 변수
  let animationId = null;

  const animate = () => {
    const delta = clock.getDelta();

    if (cameraAnim) {
      cameraAnim.elapsed += delta;
      const rawT = Math.min(cameraAnim.elapsed / cameraAnim.duration, 1);

      // easeInOutQuint
      const t = rawT < 0.5 ? 16 * rawT * rawT * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 5) / 2;

      // position lerp + quaternion slerp 동시 적용
      camera.position.lerpVectors(cameraAnim.fromPos, cameraAnim.toPos, t);
      camera.quaternion.slerpQuaternions(cameraAnim.fromQuat, cameraAnim.toQuat, t);
      orbit.target.lerpVectors(cameraAnim.fromTarget, cameraAnim.toTarget, t);

      if (rawT >= 1) {
        // ✅ 애니메이션 완료 → OrbitControls 재활성화
        orbit.target.copy(cameraAnim.toTarget);
        orbit.update();
        orbit.enabled = true;
        cameraAnim = null;
      }
    } else {
      orbit.update();
    }

    animatePulse();
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };
  animate();

  // ========= Public API =========
  return {
    scene,
    camera,
    renderer,
    orbit,
    idToIndex,
    highlightIndex,
    resetHighlight,
    onResize,
    // (중요) 강화된 dispose 함수: 메모리 누수 방지
    dispose: () => {
      // 1. 애니메이션 루프 중지
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }

      // 2. 컨트롤 제거 (이벤트 리스너 해제)
      orbit.dispose();

      // 3. 씬 내부 객체(지오메트리, 매테리얼, 텍스처) 정리
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];

          materials.forEach((m) => {
            // 텍스처(Map)가 있다면 해제 (중요: CanvasTexture 등)
            if (m.map) m.map.dispose();
            if (m.lightMap) m.lightMap.dispose();
            if (m.bumpMap) m.bumpMap.dispose();
            if (m.normalMap) m.normalMap.dispose();
            if (m.specularMap) m.specularMap.dispose();
            if (m.envMap) m.envMap.dispose();

            m.dispose();
          });
        }
      });

      // 4. 렌더러 정리
      renderer.dispose();

      // (선택) 렌더러 컨텍스트 강제 소실이 필요할 경우 아래 주석 해제 (보통 dispose로 충분)
      // renderer.forceContextLoss();
    },
  };
}
