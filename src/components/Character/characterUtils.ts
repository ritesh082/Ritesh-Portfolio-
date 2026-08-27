/**
 * 3D Character Model Loader
 * Adapted from Shoaib Ahmed 3D Portfolio (MIT License Copyright (c) 2025 Moncy Yohannan)
 */
import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";

export const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = (modelPath = "/models/character.glb") =>
    new Promise<GLTF | null>((resolve, reject) => {
      loader.load(
        modelPath,
        async (gltf) => {
          const character = gltf.scene;

          try {
            await renderer.compileAsync(character, camera, scene);
          } catch {
            // Lazy shader fallback
          }

          character.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (mesh.isMesh) {
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              mesh.frustumCulled = true;
            }
          });

          // Aligns foot bones to ground level
          const footR = character.getObjectByName("footR");
          const footL = character.getObjectByName("footL");
          if (footR) footR.position.y = 3.36;
          if (footL) footL.position.y = 3.36;

          dracoLoader.dispose();
          resolve(gltf);
        },
        undefined,
        (error) => reject(error)
      );
    });

  return { loadCharacter };
};

export default setCharacter;
