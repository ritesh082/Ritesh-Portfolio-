/**
 * 3D Ergonomic Designer Office Chair Generator for Three.js
 * Modeled to fit the character's seated posture precisely.
 */
import * as THREE from "three";

export function createDesignerChair(): THREE.Group {
  const chairGroup = new THREE.Group();
  chairGroup.name = "ErgonomicOfficeChair";

  // ── Materials ──
  // Rich charcoal leather with subtle sheen
  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x222328,
    roughness: 0.55,
    metalness: 0.15,
  });

  // Terracotta accent piping
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xc75b3f,
    roughness: 0.45,
    metalness: 0.2,
  });

  // Matte dark metal frame / lumbar struts
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x141518,
    roughness: 0.35,
    metalness: 0.85,
  });

  // Polished chrome hydraulic cylinder
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xdddddf,
    roughness: 0.15,
    metalness: 0.95,
  });

  // Caster wheel material
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x18191c,
    roughness: 0.6,
    metalness: 0.2,
  });

  // ── 1. Cushioned Seat (Positioned right under the pelvis at y ~ 6.22, z ~ -0.42) ──
  const seatGeo = new THREE.CylinderGeometry(1.4, 1.48, 0.32, 32);
  const seatMesh = new THREE.Mesh(seatGeo, leatherMat);
  seatMesh.position.set(0, 6.22, -0.42);
  seatMesh.castShadow = true;
  seatMesh.receiveShadow = true;
  chairGroup.add(seatMesh);

  // Seat accent trim ring
  const seatRingGeo = new THREE.TorusGeometry(1.44, 0.035, 16, 32);
  const seatRing = new THREE.Mesh(seatRingGeo, accentMat);
  seatRing.rotation.x = Math.PI / 2;
  seatRing.position.set(0, 6.22, -0.42);
  seatRing.castShadow = true;
  chairGroup.add(seatRing);

  // Seat underside pan
  const panGeo = new THREE.CylinderGeometry(1.3, 0.7, 0.2, 24);
  const panMesh = new THREE.Mesh(panGeo, frameMat);
  panMesh.position.set(0, 6.06, -0.42);
  panMesh.castShadow = true;
  chairGroup.add(panMesh);

  // ── 2. Ergonomic Contoured Backrest (Arching behind spine at y ~ 7.5 to 8.6, z ~ -1.25) ──
  const backGeo = new THREE.BoxGeometry(2.35, 2.7, 0.22, 10, 10);
  // Curve the backrest slightly for ergonomic form
  const backPos = backGeo.attributes.position;
  for (let i = 0; i < backPos.count; i++) {
    const x = backPos.getX(i);
    const y = backPos.getY(i);
    // Subtle horizontal wrap
    backPos.setZ(i, backPos.getZ(i) - (x * x) * 0.08 + (y * y) * 0.02);
  }
  backGeo.computeVertexNormals();

  const backMesh = new THREE.Mesh(backGeo, leatherMat);
  backMesh.position.set(0, 7.65, -1.28);
  backMesh.rotation.x = 0.14; // gentle recline
  backMesh.castShadow = true;
  backMesh.receiveShadow = true;
  chairGroup.add(backMesh);

  // Backrest Lumbar Spine Strut (Connects seat pan to backrest)
  const spineSupportGeo = new THREE.CylinderGeometry(0.12, 0.14, 2.1, 16);
  const spineSupport = new THREE.Mesh(spineSupportGeo, frameMat);
  spineSupport.position.set(0, 6.85, -1.1);
  spineSupport.rotation.x = -0.32;
  spineSupport.castShadow = true;
  chairGroup.add(spineSupport);

  // Upper headrest/backrest accent plate
  const topPlateGeo = new THREE.BoxGeometry(1.6, 0.25, 0.18);
  const topPlate = new THREE.Mesh(topPlateGeo, accentMat);
  topPlate.position.set(0, 8.85, -1.48);
  topPlate.rotation.x = 0.14;
  topPlate.castShadow = true;
  chairGroup.add(topPlate);

  // ── 3. Ergonomic Armrests (Left & Right) ──
  [-1, 1].forEach((side) => {
    // Vertical strut from seat pan
    const armStrutGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.95, 16);
    const armStrut = new THREE.Mesh(armStrutGeo, frameMat);
    armStrut.position.set(side * 1.48, 6.55, -0.42);
    armStrut.rotation.z = side * -0.12;
    armStrut.castShadow = true;
    chairGroup.add(armStrut);

    // Soft-touch cushioned armpad
    const armPadGeo = new THREE.BoxGeometry(0.38, 0.1, 1.15);
    const armPad = new THREE.Mesh(armPadGeo, leatherMat);
    armPad.position.set(side * 1.54, 7.05, -0.38);
    armPad.castShadow = true;
    chairGroup.add(armPad);
  });

  // ── 4. Swivel Pneumatic Lift Column (Center post from y ~ 3.65 to 6.06) ──
  // Outer sleeve
  const sleeveGeo = new THREE.CylinderGeometry(0.24, 0.26, 1.4, 24);
  const sleeveMesh = new THREE.Mesh(sleeveGeo, frameMat);
  sleeveMesh.position.set(0, 4.4, -0.42);
  sleeveMesh.castShadow = true;
  chairGroup.add(sleeveMesh);

  // Chrome hydraulic piston
  const pistonGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.3, 24);
  const pistonMesh = new THREE.Mesh(pistonGeo, chromeMat);
  pistonMesh.position.set(0, 5.4, -0.42);
  pistonMesh.castShadow = true;
  chairGroup.add(pistonMesh);

  // ── 5. 5-Star Wheeled Base (Ground level y ~ 3.40 to 3.75) ──
  const hubGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.28, 24);
  const hubMesh = new THREE.Mesh(hubGeo, frameMat);
  hubMesh.position.set(0, 3.75, -0.42);
  hubMesh.castShadow = true;
  chairGroup.add(hubMesh);

  const starLegCount = 5;
  const baseRadius = 1.65;

  for (let i = 0; i < starLegCount; i++) {
    const angle = (i * (Math.PI * 2)) / starLegCount;
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);

    // Radiating leg beam
    const legGeo = new THREE.BoxGeometry(0.18, 0.14, baseRadius);
    const legMesh = new THREE.Mesh(legGeo, frameMat);
    legMesh.position.set(
      (dirX * baseRadius) / 2,
      3.62,
      -0.42 + (dirZ * baseRadius) / 2
    );
    legMesh.rotation.y = -angle + Math.PI / 2;
    legMesh.rotation.x = -0.06; // slight angle down to floor
    legMesh.castShadow = true;
    chairGroup.add(legMesh);

    // Caster wheel housing & wheels at leg tip (touches floor at y = 3.40)
    const tipX = dirX * baseRadius;
    const tipZ = -0.42 + dirZ * baseRadius;

    // Pin
    const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.16, 12);
    const pinMesh = new THREE.Mesh(pinGeo, chromeMat);
    pinMesh.position.set(tipX, 3.5, tipZ);
    chairGroup.add(pinMesh);

    // Dual-wheel caster discs
    const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.12, 16);
    const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat);
    wheelMesh.rotation.z = Math.PI / 2;
    wheelMesh.position.set(tipX, 3.42, tipZ);
    wheelMesh.castShadow = true;
    chairGroup.add(wheelMesh);
  }

  // Traversal to ensure all elements cast/receive shadow
  chairGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return chairGroup;
}

export default createDesignerChair;
