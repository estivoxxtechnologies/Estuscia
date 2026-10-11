import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { S, M } from './state';

export default function Scene({ reduce, onFail }: { reduce: boolean; onFail: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const small = innerWidth < 820, touch = matchMedia('(hover:none)').matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: 'high-performance' });
      if (!renderer.getContext()) throw new Error('no gl');
    } catch { onFail(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060d, 0.035);
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const group = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 2),
      new THREE.MeshStandardMaterial({ color: 0xb7bfd0, metalness: 1, roughness: 0.22, flatShading: true, envMapIntensity: 0.7 }));
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.75, 1),
      new THREE.MeshBasicMaterial({ color: 0xd8bd85, wireframe: true, transparent: true, opacity: 0.35 }));
    group.add(core, wire);
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(2.1 + i * 0.45, 0.012 + i * 0.006, 12, 160),
        new THREE.MeshStandardMaterial({ color: i ? 0xd8bd85 : 0xdfe6f5, metalness: 1, roughness: 0.2, emissive: 0x2a2008 }));
      r.rotation.set(i * 1.1, i * 0.7, 0); rings.push(r); group.add(r);
    }
    const n = small ? 350 : 1400, pos = new Float32Array(n * 3);
    for (let i = 0; i < n * 3; i++) pos[i] = (Math.random() - 0.5) * (i % 3 === 2 ? 30 : 24);
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.025, color: 0xd8bd85, transparent: true, opacity: 0.7, depthWrite: false }));
    scene.add(pts);
    const N = small ? 40 : 90;
    const cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.16, 0.16),
      new THREE.MeshStandardMaterial({ color: 0xcfd6e6, metalness: 1, roughness: 0.3 }), N);
    group.add(cubes); scene.add(group);
    scene.add(new THREE.AmbientLight(0x334066, 0.6));
    const gold = new THREE.PointLight(0xffd9a0, 60, 40, 1.5); gold.position.set(4, 3, 5);
    const blue = new THREE.PointLight(0x4a6dff, 45, 40, 1.5); blue.position.set(-5, -2, 3);
    scene.add(gold, blue);

    const resize = () => { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); if (reduce) draw(0); };
    const tmp = new THREE.Object3D(); const clock = new THREE.Clock(); let raf = 0, lastPulse = -1;
    function draw(T: number) {
      group.rotation.y = S.rot * Math.PI * 2 + T * 0.12 + M.x * 0.25;
      group.rotation.x = Math.sin(S.rot * 3) * 0.3 + M.y * 0.2;
      group.position.x += ((small ? 0 : S.x) - group.position.x) * 0.06;
      group.position.y = Math.sin(T * 0.6) * 0.12;
      // zoom-through: camera pushes into the scene during section transitions, then pulls back
      cam.position.z += ((S.z - S.pulse * 2.6) - cam.position.z) * 0.08;
      cam.position.x += (M.x * 0.4 - cam.position.x) * 0.04; cam.lookAt(0, 0, 0);
      const fov = 42 + S.pulse * 14;
      if (Math.abs(cam.fov - fov) > 0.05) { cam.fov = fov; cam.updateProjectionMatrix(); }
      if (Math.abs(S.pulse - lastPulse) > 0.005) { lastPulse = S.pulse; document.documentElement.style.setProperty('--pulse', S.pulse.toFixed(3)); }
      core.scale.setScalar(1 - S.wire * 0.35);
      (wire.material as THREE.MeshBasicMaterial).opacity = 0.15 + S.wire * 0.5;
      wire.rotation.y = -T * 0.1; wire.scale.setScalar(1 + S.spread * 0.4);
      rings.forEach((r, i) => { r.scale.setScalar(1 + S.spread * (0.5 + i * 0.5)); r.rotation.x += 0.002 * (i + 1); r.rotation.y += 0.0015 * (i + 1); });
      gold.intensity = 40 + S.glow * 60; pts.rotation.y = T * 0.01 + S.rot * 0.8; pts.scale.setScalar(1 + S.pulse * 0.6);
      for (let i = 0; i < N; i++) {
        const a = i * 0.55, r = 2.4 + i * 0.045, s = Math.max(0, Math.min(1, S.grow * N * 1.2 - i));
        tmp.position.set(Math.cos(a) * r, (i / N - 0.5) * 5, Math.sin(a) * r); tmp.rotation.set(a, a * 0.7, 0);
        tmp.scale.setScalar(s); tmp.updateMatrix(); cubes.setMatrixAt(i, tmp.matrix);
      }
      cubes.instanceMatrix.needsUpdate = true; renderer.render(scene, cam);
    }
    const loop = () => { draw(clock.getElapsedTime()); raf = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => { M.x = (e.clientX / innerWidth) * 2 - 1; M.y = (e.clientY / innerHeight) * 2 - 1; };
    resize(); addEventListener('resize', resize);
    if (!reduce) { loop(); if (!touch) addEventListener('pointermove', move); }
    return () => {
      cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointermove', move);
      scene.traverse(o => { const m = o as THREE.Mesh; m.geometry?.dispose(); const mat = m.material as THREE.Material | undefined; mat?.dispose?.(); });
      pm.dispose(); renderer.dispose();
    };
  }, [reduce, onFail]);
  return <canvas id="gl" ref={ref} aria-hidden="true" />;
}
