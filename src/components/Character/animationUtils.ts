/**
 * Animation utilities for 3D Character
 * Adapted from Shoaib Ahmed 3D Portfolio (MIT License Copyright (c) 2025 Moncy Yohannan)
 */
import * as THREE from "three";
import { GLTF } from "three-stdlib";

export const typingBoneNames = [
  "thighL",
  "thighR",
  "shinL",
  "shinR",
  "forearmL",
  "forearmR",
  "handL",
  "handR",
  "f_pinky03R",
  "f_pinky02L",
  "f_pinky02R",
  "f_pinky01L",
  "f_pinky01R",
  "palm04L",
  "palm04R",
  "f_ring01L",
  "thumb01L",
  "thumb01R",
  "thumb03L",
  "thumb03R",
  "palm02L",
  "palm02R",
  "palm01L",
  "palm01R",
  "f_index01L",
  "f_index01R",
  "palm03L",
  "palm03R",
  "f_ring02L",
  "f_ring02R",
  "f_ring01R",
  "f_ring03L",
  "f_ring03R",
  "f_middle01L",
  "f_middle02L",
  "f_middle03L",
  "f_middle01R",
  "f_middle02R",
  "f_middle03R",
  "f_index02L",
  "f_index03L",
  "f_index02R",
  "f_index03R",
  "thumb02L",
  "f_pinky03L",
  "upper_armL",
  "upper_armR",
  "thumb02R",
  "toeL",
  "heel02L",
  "toeR",
  "heel02R",
];

export const eyebrowBoneNames = ["eyebrow_L", "eyebrow_R"];

export const setAnimations = (gltf: GLTF) => {
  const character = gltf.scene;
  const mixer = new THREE.AnimationMixer(character);

  const keyActions: THREE.AnimationAction[] = [];
  let typingAction: THREE.AnimationAction | null = null;
  let angryAction: THREE.AnimationAction | null = null;

  if (gltf.animations && gltf.animations.length > 0) {
    const introClip = gltf.animations.find(
      (clip) => clip.name === "introAnimation"
    );
    if (introClip) {
      const introAction = mixer.clipAction(introClip);
      introAction.setLoop(THREE.LoopOnce, 1);
      introAction.clampWhenFinished = true;
      introAction.play();
    }

    // Interactive Typing Actions
    const keyClipNames = ["key1", "key2", "key3", "key4", "key5", "key6"];
    keyClipNames.forEach((name) => {
      const clip = THREE.AnimationClip.findByName(gltf.animations || [], name);
      if (!clip) return;
      const action = mixer.clipAction(clip);
      action.play();
      action.timeScale = 1.1;
      keyActions.push(action);
    });

    typingAction = createBoneAction(gltf, mixer, "typing", typingBoneNames);
    if (typingAction) {
      typingAction.enabled = true;
      typingAction.play();
      typingAction.timeScale = 1.1;
    }

    // Angry Bug-fixing Clip
    const angryClip = gltf.animations?.find((clip) => clip.name === "angry");
    if (angryClip) {
      angryAction = mixer.clipAction(angryClip);
      angryAction.setLoop(THREE.LoopOnce, 1);
      angryAction.clampWhenFinished = true;
    }
  }

  function startIntro() {
    if (!gltf.animations) return;
    const introClip = gltf.animations.find(
      (clip) => clip.name === "introAnimation"
    );
    if (introClip) {
      const introAction = mixer.clipAction(introClip);
      introAction.setLoop(THREE.LoopOnce, 1);
      introAction.clampWhenFinished = true;
      introAction.reset().play();
    }

    setTimeout(() => {
      const blink = gltf.animations?.find((clip) => clip.name === "Blink");
      if (blink) {
        mixer.clipAction(blink).play().fadeIn(0.5);
      }
    }, 1500);
  }

  // Trigger eyebrow lift on CTA hover or curious interaction
  const eyeBrowUpAction = createBoneAction(
    gltf,
    mixer,
    "browup",
    eyebrowBoneNames
  );
  if (eyeBrowUpAction) {
    eyeBrowUpAction.setLoop(THREE.LoopOnce, 1);
    eyeBrowUpAction.clampWhenFinished = true;
  }

  const triggerBrowUp = () => {
    if (eyeBrowUpAction) {
      eyeBrowUpAction.reset();
      eyeBrowUpAction.enabled = true;
      eyeBrowUpAction.setEffectiveWeight(3);
      eyeBrowUpAction.fadeIn(0.3).play();
    }
  };

  const triggerBrowReset = () => {
    if (eyeBrowUpAction) {
      eyeBrowUpAction.fadeOut(0.4);
    }
  };

  // High-speed typing frenzy trigger
  let frenzyTimeout: number | undefined;
  const triggerTypingFrenzy = (duration = 2400) => {
    if (typingAction) typingAction.timeScale = 2.8;
    keyActions.forEach((a) => (a.timeScale = 3.0));

    if (frenzyTimeout) clearTimeout(frenzyTimeout);
    frenzyTimeout = window.setTimeout(() => {
      if (typingAction) typingAction.timeScale = 1.1;
      keyActions.forEach((a) => (a.timeScale = 1.1));
    }, duration);
  };

  // Comical Angry / Bug-Hunting gesture
  const triggerAngryReaction = () => {
    if (angryAction) {
      angryAction.reset();
      angryAction.setEffectiveWeight(2);
      angryAction.fadeIn(0.2).play();
      setTimeout(() => {
        if (angryAction) angryAction.fadeOut(0.5);
      }, 1600);
    }
  };

  return {
    mixer,
    startIntro,
    triggerBrowUp,
    triggerBrowReset,
    triggerTypingFrenzy,
    triggerAngryReaction,
  };
};

const createBoneAction = (
  gltf: GLTF,
  mixer: THREE.AnimationMixer,
  clip: string,
  boneNames: string[]
): THREE.AnimationAction | null => {
  if (!gltf.animations) return null;
  const animationClip = THREE.AnimationClip.findByName(gltf.animations, clip);
  if (!animationClip) return null;

  const filteredClip = filterAnimationTracks(animationClip, boneNames);
  return mixer.clipAction(filteredClip);
};

const filterAnimationTracks = (
  clip: THREE.AnimationClip,
  boneNames: string[]
): THREE.AnimationClip => {
  const filteredTracks = clip.tracks.filter((track) =>
    boneNames.some((boneName) => track.name.includes(boneName))
  );

  return new THREE.AnimationClip(
    clip.name + "_filtered",
    clip.duration,
    filteredTracks
  );
};

export default setAnimations;
