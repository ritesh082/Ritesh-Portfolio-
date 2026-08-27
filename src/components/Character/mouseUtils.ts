/**
 * Mouse and Touch interaction utilities for 3D Character
 * Adapted from Shoaib Ahmed 3D Portfolio (MIT License Copyright (c) 2025 Moncy Yohannan)
 */
import * as THREE from "three";

export interface MouseState {
  x: number;
  y: number;
  velX: number;
  velY: number;
  speed: number;
  lastMovedTime: number;
  isMoving: boolean;
}

export const handleMouseMove = (
  event: MouseEvent,
  setMousePosition: (x: number, y: number, speed: number) => void
) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY, 1);
};

export const handleTouchMove = (
  event: TouchEvent,
  setMousePosition: (x: number, y: number, speed: number) => void
) => {
  if (!event.touches[0]) return;
  const mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY, 1);
};

export const handleTouchEnd = (
  setMousePosition: (
    x: number,
    y: number,
    interpolationX: number,
    interpolationY: number
  ) => void
) => {
  setTimeout(() => {
    setMousePosition(0, 0, 0.03, 0.03);
    setTimeout(() => {
      setMousePosition(0, 0, 0.1, 0.2);
    }, 1000);
  }, 1800);
};

export const handleHeadRotation = (
  headBone: THREE.Object3D,
  mouseX: number,
  mouseY: number,
  interpolationX: number,
  interpolationY: number,
  lerp: (x: number, y: number, t: number) => number,
  extraYaw = 0,
  extraPitch = 0
) => {
  if (!headBone) return;

  const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

  if (scrollY < 300) {
    const maxRotation = Math.PI / 6;
    const targetY = mouseX * maxRotation + extraYaw;
    headBone.rotation.y = lerp(headBone.rotation.y, targetY, interpolationY);

    const minRotationX = -0.3;
    const maxRotationX = 0.4;
    let targetX = -mouseY - 0.5 * maxRotation + extraPitch;

    if (mouseY <= minRotationX) {
      targetX = -minRotationX - 0.5 * maxRotation + extraPitch;
    } else if (mouseY >= maxRotationX) {
      targetX = -maxRotation - 0.5 * maxRotation + extraPitch;
    }

    headBone.rotation.x = lerp(headBone.rotation.x, targetX, interpolationX);
  } else {
    // Subtle attentive posture when scrolling down
    headBone.rotation.x = lerp(headBone.rotation.x, -0.35 + extraPitch, 0.04);
    headBone.rotation.y = lerp(headBone.rotation.y, -0.25 + extraYaw, 0.04);
  }
};
