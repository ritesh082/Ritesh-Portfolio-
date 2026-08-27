/**
 * Warm studio lighting setup for 3D Character
 * Adapted for warm ivory / terracotta aesthetic
 */
import * as THREE from "three";
import { RGBELoader } from "three-stdlib";

export const setLighting = (scene: THREE.Scene) => {
  // 1. Warm Ambient Light
  const ambientLight = new THREE.AmbientLight(0xfff9f2, 1.2);
  scene.add(ambientLight);

  // 2. Key Directional Light (Warm Studio Key from Front-Right)
  const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1.8);
  directionalLight.position.set(3.5, 8.5, 5.0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 40;
  directionalLight.shadow.bias = -0.0001;
  scene.add(directionalLight);

  // 3. Soft Fill Light (Lavender tint from left)
  const fillLight = new THREE.DirectionalLight(0xe8dff5, 0.8);
  fillLight.position.set(-4, 6, 2);
  scene.add(fillLight);

  // 4. Subtle Warm Terracotta Rim Light
  const rimLight = new THREE.PointLight(0xc75b3f, 1.2, 50, 2);
  rimLight.position.set(-3, 6, -3);
  scene.add(rimLight);

  // 5. HDRI Environment Reflection (graceful load)
  try {
    new RGBELoader()
      .setPath("/models/")
      .load("char_enviorment.hdr", function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.environmentIntensity = 0.45;
      });
  } catch {
    // Environment fallback
  }

  function setPointLight(screenLight: THREE.Mesh | null | undefined) {
    if (!screenLight) return;
    const material = screenLight.material as THREE.MeshStandardMaterial | undefined;
    if (!material) return;
    if (material.opacity > 0.9) {
      rimLight.intensity = (material.emissiveIntensity || 1) * 2;
    } else {
      rimLight.intensity = 0.8;
    }
  }

  function dispose() {
    ambientLight.dispose();
    directionalLight.dispose();
    fillLight.dispose();
    rimLight.dispose();
  }

  return { setPointLight, dispose };
};

export default setLighting;
