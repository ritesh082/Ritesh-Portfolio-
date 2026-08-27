"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import setCharacter from "./characterUtils";
import setLighting from "./lighting";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./mouseUtils";
import setAnimations from "./animationUtils";
import { createDesignerChair } from "./chairUtils";
import { Sparkles, MessageSquare, Flame, Lightbulb, RotateCw, Hand } from "lucide-react";

interface CharacterSceneProps {
  className?: string;
}

const DEV_DIALOGUES = [
  "Building ultra-fast, responsive web apps! ⚡",
  "Just shipped another high-conversion feature 🚀",
  "Bridging deep engineering & cinematic design ✨",
  "Check out my real project metrics below! 📈",
  "TypeScript + Next.js + Three.js = pure magic 💻",
  "Need full-stack engineering power? Let's talk! 📬",
  "Pro tip: Drag me around to rotate in 3D! 🪑",
  "Obsessed with 60fps fluid micro-interactions 🎨",
];

export default function CharacterScene({ className = "" }: CharacterSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // ── Interactive State ──
  const [speechBubble, setSpeechBubble] = useState<string | null>(
    "Hi there! Welcome to my portfolio 👋"
  );
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [particles, setParticles] = useState<
    Array<{ id: number; text: string; x: number; y: number }>
  >([]);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Refs for animation & controls
  const animControlsRef = useRef<ReturnType<typeof setAnimations> | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);
  const chairRef = useRef<THREE.Group | null>(null);
  const screenLightRef = useRef<THREE.Mesh | null>(null);
  const dragRotationRef = useRef({ yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const baseRotationY = -0.45;
  const speechTimerRef = useRef<number | undefined>(undefined);
  const dialogueIndexRef = useRef(0);

  // ── 1. Web Audio Synthesizer Pop (Zero external dependencies) ──
  const playAudioPop = useCallback((pitch = 600, type: OscillatorType = "sine") => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // Audio context may be restricted by browser policy before first gesture
    }
  }, []);

  // ── 2. Particle Spawn Helper ──
  const spawnSparkles = useCallback((emoji = "✨") => {
    const id = Date.now() + Math.random();
    const newItems = Array.from({ length: 4 }).map((_, i) => ({
      id: id + i,
      text: emoji,
      x: 35 + (Math.random() - 0.5) * 35,
      y: 40 + (Math.random() - 0.5) * 30,
    }));
    setParticles((prev) => [...prev.slice(-8), ...newItems]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newItems.some((n) => n.id === p.id)));
    }, 1200);
  }, []);

  // ── 3. Show Speech Dialogue ──
  const triggerSpeech = useCallback((text?: string) => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    const msg =
      text || DEV_DIALOGUES[dialogueIndexRef.current % DEV_DIALOGUES.length];
    dialogueIndexRef.current++;
    setSpeechBubble(msg);

    speechTimerRef.current = window.setTimeout(() => {
      setSpeechBubble(null);
    }, 4500);
  }, []);

  // ── 4. Action Handlers for Quick Chips ──
  const handleTurboCode = useCallback(() => {
    playAudioPop(850, "triangle");
    spawnSparkles("⚡");
    setActiveReaction("turbo");
    triggerSpeech("Overclocking TypeScript compiler! ⚡🔥");
    animControlsRef.current?.triggerTypingFrenzy(3000);
    animControlsRef.current?.triggerBrowUp();

    // Pulse laptop screen light
    if (screenLightRef.current?.material) {
      const mat = screenLightRef.current.material as THREE.MeshStandardMaterial;
      mat.emissive = new THREE.Color(0xff6b35);
      mat.emissiveIntensity = 3.5;
      setTimeout(() => {
        mat.emissive = new THREE.Color(0x38bdf8);
        mat.emissiveIntensity = 1.8;
      }, 3000);
    }

    setTimeout(() => setActiveReaction(null), 3000);
  }, [playAudioPop, spawnSparkles, triggerSpeech]);

  const handleSayHi = useCallback(() => {
    playAudioPop(700, "sine");
    spawnSparkles("👋");
    setActiveReaction("hi");
    triggerSpeech("Hey there! Thanks for visiting my work 👋");
    animControlsRef.current?.startIntro();
    animControlsRef.current?.triggerBrowUp();
    setTimeout(() => setActiveReaction(null), 2500);
  }, [playAudioPop, spawnSparkles, triggerSpeech]);

  const handleIdea = useCallback(() => {
    playAudioPop(920, "sine");
    spawnSparkles("💡");
    setActiveReaction("idea");
    triggerSpeech("Idea: What if we make the UI 10x faster? 💡");
    animControlsRef.current?.triggerBrowUp();
    setTimeout(() => {
      animControlsRef.current?.triggerBrowReset();
      setActiveReaction(null);
    }, 2800);
  }, [playAudioPop, spawnSparkles, triggerSpeech]);

  const handleSpinChair = useCallback(() => {
    playAudioPop(550, "sine");
    spawnSparkles("🪑");
    setActiveReaction("spin");
    triggerSpeech("Wheee! 360° designer chair swivel! 🪑💫");

    // Add 360 degree spin to targetYaw
    dragRotationRef.current.targetYaw += Math.PI * 2;
    setTimeout(() => setActiveReaction(null), 2000);
  }, [playAudioPop, spawnSparkles, triggerSpeech]);

  // ── 5. General Canvas Click Trigger ──
  const handleCharacterClick = useCallback(() => {
    if (isDraggingRef.current) return;
    const actions = [handleTurboCode, handleSayHi, handleIdea, handleSpinChair];
    const chosen = actions[Math.floor(Math.random() * actions.length)];
    chosen();
  }, [handleTurboCode, handleSayHi, handleIdea, handleSpinChair]);

  // Initial speech bubble settle
  useEffect(() => {
    speechTimerRef.current = window.setTimeout(() => {
      setSpeechBubble(null);
    }, 6000);
    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, []);

  // ── 6. Three.js Scene Setup & Render Loop ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    const rect = container.getBoundingClientRect();
    const width = rect.width || 400;
    const height = rect.height || 500;
    const aspect = width / height;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(27, aspect, 0.1, 1000);
    camera.position.set(0, 7.8, 36.5);
    camera.lookAt(0, 6.35, 0);
    camera.zoom = 1.0;
    camera.updateProjectionMatrix();

    // ── Soft Contact Shadow Floor Disk Beneath Character & Chair ──
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext("2d");
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, "rgba(45, 25, 18, 0.65)");
      grad.addColorStop(0.5, "rgba(45, 25, 18, 0.3)");
      grad.addColorStop(1, "rgba(45, 25, 18, 0)");
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(8.2, 8.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 3.38, 0);
    scene.add(shadowMesh);

    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Mesh | null = null;
    let mixer: THREE.AnimationMixer | undefined;
    let animControls: ReturnType<typeof setAnimations> | undefined;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };
    let interpolation = { x: 0.08, y: 0.12 };
    let extraYaw = 0;
    let extraPitch = 0;
    let lastMouseMove = performance.now();
    let isTouch = false;

    // ── Mouse & Touch Tracking ──
    const onMouseMove = (event: MouseEvent) => {
      isTouch = false;
      lastMouseMove = performance.now();
      handleMouseMove(event, (x, y) => {
        targetMouse.x = x;
        targetMouse.y = y;
      });
    };

    const onTouchMove = (event: TouchEvent) => {
      isTouch = true;
      lastMouseMove = performance.now();
      handleTouchMove(event, (x, y) => {
        targetMouse.x = x;
        targetMouse.y = y;
      });
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, ix, iy) => {
        targetMouse.x = x;
        targetMouse.y = y;
        interpolation.x = ix;
        interpolation.y = iy;
      });
    };

    // ── Semantic CTA & Target Element Detection ([data-char-action]) ──
    const handleActionHover = (e: Event) => {
      const target = (e.target as Element)?.closest?.("[data-char-action]");
      if (target) {
        const action = target.getAttribute("data-char-action");
        if (action === "work") {
          extraYaw = 0.28;
          extraPitch = -0.12;
          animControls?.triggerBrowUp();
        } else if (action === "resume") {
          extraYaw = 0.20;
          extraPitch = -0.18;
          animControls?.triggerBrowUp();
        } else if (action === "work-poster") {
          extraYaw = 0.22;
          extraPitch = -0.08;
        } else if (action === "result") {
          extraYaw = 0.15;
          extraPitch = 0.05;
          animControls?.triggerBrowUp();
        } else if (action === "contact") {
          extraYaw = 0.22;
          extraPitch = -0.05;
        }
      }
    };

    const handleActionLeave = (e: Event) => {
      const target = (e.target as Element)?.closest?.("[data-char-action]");
      if (target) {
        extraYaw = 0;
        extraPitch = 0;
        animControls?.triggerBrowReset();
      }
    };

    // ── Pointer Drag-To-Rotate Handling ──
    let hasDraggedSignificantly = false;

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      hasDraggedSignificantly = false;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      setIsDraggingState(true);
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasDraggedSignificantly = true;
      }
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      // Apply drag to target rotation with responsive sensitivity
      dragRotationRef.current.targetYaw += dx * 0.008;
      dragRotationRef.current.targetPitch = Math.max(
        -0.25,
        Math.min(0.25, dragRotationRef.current.targetPitch + dy * 0.004)
      );
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDraggingState(false);
      try {
        (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
      } catch {
        // Safe fallback
      }

      // If user merely tapped/clicked without dragging, trigger click interaction
      if (!hasDraggedSignificantly) {
        handleCharacterClick();
      }
    };

    const canvasDom = renderer.domElement;
    canvasDom.addEventListener("pointerdown", onPointerDown);
    canvasDom.addEventListener("pointermove", onPointerMove);
    canvasDom.addEventListener("pointerup", onPointerUp);
    canvasDom.addEventListener("pointercancel", onPointerUp);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    window.addEventListener("pointerover", handleActionHover, { passive: true });
    window.addEventListener("mouseover", handleActionHover, { passive: true });
    window.addEventListener("pointerout", handleActionLeave, { passive: true });
    window.addEventListener("mouseout", handleActionLeave, { passive: true });

    // ── Debounced Resize ──
    let resizeTimer: number | undefined;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!container) return;
        const newRect = container.getBoundingClientRect();
        const nw = newRect.width || 400;
        const nh = newRect.height || 500;
        renderer.setSize(nw, nh);
        const newAspect = nw / nh;
        camera.aspect = newAspect;
        camera.fov = newAspect < 0.85 ? 27 * (0.85 / Math.max(newAspect, 0.45)) : 27;
        camera.position.set(0, 7.8, 36.5);
        camera.lookAt(0, 6.35, 0);
        camera.updateProjectionMatrix();
      }, 100);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── IntersectionObserver: Pause when offscreen ──
    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { rootMargin: "100px" }
    );
    io.observe(container);

    // ── Load 3D Character Model + Attach Ergonomic Designer Chair ──
    loadCharacter("/models/character.glb")
      .then((gltf) => {
        if (!isMounted || !gltf) return;
        try {
          const character = gltf.scene;
          character.position.set(-0.2, -0.1, 0);
          character.rotation.y = baseRotationY;

          // ── Create & Attach Designer Ergonomic Office Chair ──
          const chair = createDesignerChair();
          character.add(chair);
          chairRef.current = chair;
          characterRef.current = character;

          scene.add(character);

          headBone = character.getObjectByName("spine006") || null;
          const sl = character.getObjectByName("screenlight");
          screenLight = (sl as THREE.Mesh) || null;
          screenLightRef.current = screenLight;

          animControls = setAnimations(gltf);
          animControlsRef.current = animControls;
          mixer = animControls.mixer;

          if (!reducedMotion) {
            animControls.startIntro();
          }

          setLoaded(true);
        } catch {
          setHasError(true);
        }
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      });

    // ── Animation & Render Loop ──
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const now = performance.now();
      const timeSinceMove = (now - lastMouseMove) / 1000;

      // Visitor Awareness: When cursor stops moving (>1.2s), ease back towards resting state
      if (timeSinceMove > 1.2 && !isTouch && extraYaw === 0) {
        targetMouse.x += (0 - targetMouse.x) * 0.03;
        targetMouse.y += (0 - targetMouse.y) * 0.03;
      }

      mouse.x += (targetMouse.x - mouse.x) * 0.1;
      mouse.y += (targetMouse.y - mouse.y) * 0.1;

      // When user is not dragging, gently spring target rotation back to default view (0, 0)
      if (!isDraggingRef.current) {
        dragRotationRef.current.targetYaw +=
          (0 - dragRotationRef.current.targetYaw) * 0.04;
        dragRotationRef.current.targetPitch +=
          (0 - dragRotationRef.current.targetPitch) * 0.05;
      }

      // Smooth drag rotation interpolation
      dragRotationRef.current.yaw +=
        (dragRotationRef.current.targetYaw - dragRotationRef.current.yaw) * 0.12;
      dragRotationRef.current.pitch +=
        (dragRotationRef.current.targetPitch - dragRotationRef.current.pitch) * 0.12;

      if (characterRef.current) {
        characterRef.current.rotation.y =
          baseRotationY + dragRotationRef.current.yaw;
        characterRef.current.rotation.x = dragRotationRef.current.pitch;
      }

      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp,
          extraYaw,
          extraPitch
        );
        if (screenLight) light.setPointLight(screenLight);
      }

      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      if (resizeTimer) clearTimeout(resizeTimer);
      io.disconnect();

      canvasDom.removeEventListener("pointerdown", onPointerDown);
      canvasDom.removeEventListener("pointermove", onPointerMove);
      canvasDom.removeEventListener("pointerup", onPointerUp);
      canvasDom.removeEventListener("pointercancel", onPointerUp);

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("pointerover", handleActionHover);
      window.removeEventListener("mouseover", handleActionHover);
      window.removeEventListener("pointerout", handleActionLeave);
      window.removeEventListener("mouseout", handleActionLeave);
      window.removeEventListener("resize", onResize);

      // Dispose Three.js scene assets
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
      light.dispose();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [baseRotationY, handleCharacterClick]);

  if (hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C75B3F]/15 via-[#F3EFE9] to-[#9B8EC4]/10 border border-[#1a1a1a]/8 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-3xl mb-1">💻</span>
          <span className="font-mono text-[11px] font-medium text-[#1a1a1a]/70 uppercase tracking-wider">
            Creative Workspace
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center select-none group ${className}`}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      {/* ── 1. Floating Speech / Reaction Bubble ── */}
      {speechBubble && (
        <div className="absolute -top-4 sm:-top-6 z-30 pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="bg-white/95 backdrop-blur-md text-[#1a1a1a] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl border-2 border-[#C75B3F] shadow-xl shadow-[#C75B3F]/10 flex items-center gap-2 max-w-[280px] sm:max-w-[320px]">
            <MessageSquare className="w-3.5 h-3.5 text-[#C75B3F] shrink-0" />
            <span className="font-sans text-xs sm:text-[13px] font-medium text-[#1a1a1a] tracking-tight leading-snug">
              {speechBubble}
            </span>
          </div>
          {/* Bubble Tail */}
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#C75B3F] mx-auto -mt-0.5" />
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white mx-auto -mt-[7.5px]" />
        </div>
      )}

      {/* ── 2. Floating Emojis / Particle Bursts ── */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute z-30 pointer-events-none text-xl sm:text-2xl animate-bounce transition-all duration-700"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
        >
          {p.text}
        </div>
      ))}

      {/* ── 3. Loading Spinner ── */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-[#C75B3F]/25 border-t-[#C75B3F] animate-spin" />
        </div>
      )}

      {/* ── 4. 3D Canvas Viewport (Supports Drag-To-Orbit & Click) ── */}
      <div
        ref={containerRef}
        className={`w-full h-full touch-none ${isDraggingState ? "cursor-grabbing" : "cursor-grab"
          }`}
        title="Drag to orbit in 3D • Click for reactions!"
      />

      {/* ── 5. Drag Hint Badge ── */}
      <div
        className={`absolute top-2 right-2 sm:right-4 z-20 pointer-events-none transition-opacity duration-300 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#1a1a1a]/10 bg-white/70 backdrop-blur-sm text-[#8a8a8a] flex items-center gap-1.5 ${isInteracting ? "opacity-100" : "opacity-60"
          }`}
      >
        <RotateCw className="w-2.5 h-2.5 text-[#C75B3F] animate-spin" style={{ animationDuration: "6s" }} />
        <span>Drag 3D model</span>
      </div>

      {/* ── 6. Interactive Quick Action Chips (Tangible Interactivity) ── */}
      <div className="absolute -bottom-6 sm:-bottom-4 z-20 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTurboCode();
          }}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-medium transition-all shadow-sm cursor-pointer border ${activeReaction === "turbo"
            ? "bg-[#C75B3F] text-white border-[#C75B3F] scale-105"
            : "bg-white/90 hover:bg-white text-[#1a1a1a] border-[#1a1a1a]/10 hover:border-[#C75B3F]/40 hover:shadow-md"
            }`}
          title="Trigger high-speed code burst & screen glow"
        >
          <Flame className="w-3 h-3 text-[#C75B3F]" />
          <span>Turbo</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSayHi();
          }}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-medium transition-all shadow-sm cursor-pointer border ${activeReaction === "hi"
            ? "bg-[#C75B3F] text-white border-[#C75B3F] scale-105"
            : "bg-white/90 hover:bg-white text-[#1a1a1a] border-[#1a1a1a]/10 hover:border-[#C75B3F]/40 hover:shadow-md"
            }`}
          title="Play greeting wave"
        >
          <Hand className="w-3 h-3 text-[#E6B325]" />
          <span>Say Hi</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleIdea();
          }}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-medium transition-all shadow-sm cursor-pointer border ${activeReaction === "idea"
            ? "bg-[#C75B3F] text-white border-[#C75B3F] scale-105"
            : "bg-white/90 hover:bg-white text-[#1a1a1a] border-[#1a1a1a]/10 hover:border-[#C75B3F]/40 hover:shadow-md"
            }`}
          title="Trigger idea lightbulb"
        >
          <Lightbulb className="w-3 h-3 text-[#E6B325]" />
          <span>Idea</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSpinChair();
          }}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-medium transition-all shadow-sm cursor-pointer border ${activeReaction === "spin"
            ? "bg-[#C75B3F] text-white border-[#C75B3F] scale-105"
            : "bg-white/90 hover:bg-white text-[#1a1a1a] border-[#1a1a1a]/10 hover:border-[#C75B3F]/40 hover:shadow-md"
            }`}
          title="Spin the designer chair 360°"
        >
          <RotateCw className="w-3 h-3 text-[#C75B3F]" />
          <span>Spin</span>
        </button>
      </div>
    </div>
  );
}
