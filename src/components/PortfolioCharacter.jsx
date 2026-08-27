"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// Predefined Emotion Configurations & Responses
const EMOTIONS = {
  welcome: {
    message: "Hi! 👋 Let's explore together!",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "smile",
    eyeType: "sparkle",
    pose: "wave",
    effect: "float",
  },
  excited: {
    message: "Let's go! Amazing work! ✨",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "big-smile",
    eyeType: "happy-curve",
    pose: "celebrate",
    effect: "sparkles",
  },
  proud: {
    message: "Check this out! 📄",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "smirk",
    eyeType: "normal",
    pose: "confident",
    effect: "proud-glow",
  },
  friendly: {
    message: "Let's connect! 💌",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "smile",
    eyeType: "normal",
    pose: "open-arms",
    effect: "heart",
  },
  encouraging: {
    message: "Send it! 🚀",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "big-smile",
    eyeType: "sparkle",
    pose: "victory",
    effect: "bounce",
  },
  playful: {
    message: "Catch me if you can! 🎪",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "tongue",
    eyeType: "wink",
    pose: "tilt",
    effect: "bounce",
  },
  celebrating: {
    message: "We did it! 🎉",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "open-laugh",
    eyeType: "happy-curve",
    pose: "celebrate",
    effect: "confetti",
  },
  curious: {
    message: "Ooh, what's over here? 🔍",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "o-mouth",
    eyeType: "wide",
    pose: "tilt-curious",
    effect: "magnify",
  },
  thinking: {
    message: "Hmm, thinking... ⏳",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "straight",
    eyeType: "look-up",
    pose: "think",
    effect: "spin",
  },
  worried: {
    message: "Oh no... 😟",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "sad-frown",
    eyeType: "worried",
    pose: "tremble",
    effect: "teardrop",
  },
  success: {
    message: "Awesome job! ✅",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "big-smile",
    eyeType: "happy-curve",
    pose: "victory",
    effect: "checkmark",
  },
  impressed: {
    message: "Incredible results! 🏆",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "open-wow",
    eyeType: "star-eyes",
    pose: "cheer",
    effect: "stars",
  },
  sleepy: {
    message: "*yawn* Cozy here... 💤",
    bodyColor: "#FF6B9D",
    headColor: "#FFD93D",
    mouthType: "o-mouth",
    eyeType: "sleepy",
    pose: "stretch",
    effect: "zzz",
  },
};

export default function PortfolioCharacter() {
  // ── Coordinates & Motion ──
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [facing, setFacing] = useState("right"); // 'left' | 'right'
  const [movementState, setMovementState] = useState("idle"); // 'idle' | 'walking' | 'running' | 'jumping' | 'skipping' | 'sitting' | 'spinning' | 'dancing' | 'stretching' | 'scratching'
  const [jumpHeight, setJumpHeight] = useState(0);
  const [moveDuration, setMoveDuration] = useState(0.8); // seconds for CSS transition
  
  // ── Personality & States ──
  const [currentEmotion, setCurrentEmotion] = useState("welcome");
  const [customMessage, setCustomMessage] = useState(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [clickCombo, setClickCombo] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // ── Refs ──
  const characterRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const emotionTimeoutRef = useRef(null);
  const blinkTimerRef = useRef(null);
  const movementTimerRef = useRef(null);
  const idleActionTimerRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastMouseActivityRef = useRef(Date.now());
  const attentionSeekingRef = useRef(null);
  const isMovingRef = useRef(false);
  const lastScrollSectionRef = useRef("");

  // Sync posRef
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  const activeData = EMOTIONS[currentEmotion] || EMOTIONS.welcome;
  const activeMessage = customMessage || activeData.message;

  // ── 1. Spawn Visual Effects (Dust, Sparkles, Confetti, Hearts) ──
  const spawnEffect = useCallback((type, count = 3) => {
    const id = Date.now() + Math.random();
    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: `${id}-${i}`,
      type,
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 30,
      scale: Math.random() * 0.5 + 0.8,
    }));
    setParticles((prev) => [...prev.slice(-12), ...newItems]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newItems.some((n) => n.id === p.id)));
    }, 1000);
  }, []);

  // ── 2. Viewport Boundary Helper ──
  const getSafeBounds = useCallback(() => {
    if (typeof window === "undefined") return { minX: 20, maxX: 500, minY: 60, maxY: 500 };
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const charW = isMobile ? 90 : isTablet ? 110 : 120;
    const charH = isMobile ? 120 : isTablet ? 140 : 150;

    return {
      minX: 24,
      maxX: Math.max(width - charW - 24, 24),
      minY: isMobile ? height - 260 : 70, // on mobile, stay closer to bottom area
      maxY: Math.max(height - charH - 24, 70),
    };
  }, []);

  // ── 3. Smooth Jump Action ──
  const triggerJump = useCallback((height = 45, duration = 600) => {
    setMovementState("jumping");
    setJumpHeight(height);
    spawnEffect("dust", 2);

    setTimeout(() => {
      setJumpHeight(0);
      setTimeout(() => {
        setMovementState("idle");
        spawnEffect("dust", 3); // landing dust
      }, duration / 2);
    }, duration / 2);
  }, [spawnEffect]);

  // ── 4. Smart Element Platform Scanner ──
  const getPagePlatforms = useCallback(() => {
    if (typeof document === "undefined") return [];
    const elements = Array.from(
      document.querySelectorAll(
        "section, [data-work-card], [data-char-action], a.group, a[href], button, nav, header, h1, h2, h3, [class*='card'], footer"
      )
    );
    const platforms = [];
    elements.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const rect = el.getBoundingClientRect();
      const isBtn = el.tagName === "BUTTON" || el.tagName === "A" || el.getAttribute("role") === "button";
      if (rect.width > 40 && rect.height > 16 && rect.top > 0 && rect.top < window.innerHeight) {
        platforms.push({
          x: Math.max(16, rect.left + rect.width * 0.5 - 45),
          y: Math.max(20, rect.top - (isBtn ? 78 : 65)), // Sit right on top of button or card
          width: rect.width,
          isButton: isBtn,
          name: el.tagName.toLowerCase(),
        });
      }
    });
    return platforms;
  }, []);

  // ── 5. Move Character to Target Coordinates (With Real Running & Element Parkour) ──
  const moveTo = useCallback((targetX, targetY, speedMultiplier = 1, onArrival = null) => {
    const bounds = getSafeBounds();
    const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, targetX));
    const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, targetY));

    const currentX = posRef.current.x;
    const currentY = posRef.current.y;
    const dx = clampedX - currentX;
    const dy = clampedY - currentY;
    const distance = Math.hypot(dx, dy);

    if (distance < 15) {
      if (onArrival) onArrival();
      return;
    }

    // Determine facing direction
    if (dx > 5) setFacing("right");
    else if (dx < -5) setFacing("left");

    // Check if moving significantly upward: Use element climbing parkour!
    const isClimbingUp = dy < -70;

    if (isClimbingUp && Math.random() > 0.3) {
      // Find intermediate platform on page to leap onto first!
      const platforms = getPagePlatforms();
      const midPlatform = platforms.find(
        (p) => p.y > clampedY + 30 && p.y < currentY - 30
      );

      if (midPlatform) {
        // Step 1: Run & Jump onto intermediate portfolio element/card
        setMovementState("jumping");
        setJumpHeight(35);
        setMoveDuration(0.65);
        isMovingRef.current = true;
        setPos({ x: midPlatform.x, y: midPlatform.y });
        spawnEffect("dust", 3);

        setTimeout(() => {
          // Landed on element! Show proud/excited pose
          setJumpHeight(0);
          setMovementState("running");
          spawnEffect("dust", 2);

          // Step 2: Leap up to final target
          setTimeout(() => {
            setMovementState("jumping");
            setJumpHeight(45);
            setMoveDuration(0.7);
            setPos({ x: clampedX, y: clampedY });

            setTimeout(() => {
              isMovingRef.current = false;
              setJumpHeight(0);
              setMovementState("idle");
              spawnEffect("dust", 3);
              if (onArrival) onArrival();
            }, 700);
          }, 350);
        }, 650);
        return;
      }
    }

    // Standard Horizontal / Downward Run & Walk
    const isRun = speedMultiplier > 1.2 || distance > 220;
    const isSkip = !isRun && Math.random() > 0.6;
    const baseSpeed = isRun ? 320 : isSkip ? 220 : 160; // px per second
    const duration = Math.max(0.5, Math.min(3.5, distance / (baseSpeed * speedMultiplier)));

    setMoveDuration(duration);
    setMovementState(isRun ? "running" : isSkip ? "skipping" : "walking");
    isMovingRef.current = true;

    if (isRun) {
      spawnEffect("dust", 2);
    }

    setPos({ x: clampedX, y: clampedY });

    setTimeout(() => {
      isMovingRef.current = false;
      setMovementState("idle");
      spawnEffect("dust", 1);
      if (onArrival) {
        onArrival();
      }
    }, duration * 1000);
  }, [getSafeBounds, getPagePlatforms, spawnEffect]);

  // ── 6. Idle Random Actions When Stationary ──
  const performRandomIdleAction = useCallback(() => {
    if (isMovingRef.current) return;

    const idleActions = ["stretching", "scratching", "dancing", "lookAround", "sitDown", "hop"];
    const chosen = idleActions[Math.floor(Math.random() * idleActions.length)];

    if (chosen === "stretching") {
      setMovementState("stretching");
      setCurrentEmotion("sleepy");
      setTimeout(() => {
        setMovementState("idle");
        setCurrentEmotion("welcome");
      }, 3200);
    } else if (chosen === "scratching") {
      setMovementState("scratching");
      setCurrentEmotion("curious");
      setTimeout(() => {
        setMovementState("idle");
        setCurrentEmotion("welcome");
      }, 2800);
    } else if (chosen === "dancing") {
      setMovementState("dancing");
      setCurrentEmotion("playful");
      spawnEffect("sparkle", 3);
      setTimeout(() => {
        setMovementState("idle");
        setCurrentEmotion("welcome");
      }, 3500);
    } else if (chosen === "sitDown") {
      setMovementState("sitting");
      setTimeout(() => {
        setMovementState("idle");
      }, 3000);
    } else if (chosen === "hop") {
      triggerJump(28, 450);
    } else {
      // look around
      setFacing((prev) => (prev === "right" ? "left" : "right"));
      setTimeout(() => {
        setFacing((prev) => (prev === "right" ? "left" : "right"));
      }, 1200);
    }
  }, [spawnEffect, triggerJump]);

  // ── 7. Autonomous Wandering & Element Exploration System ──
  const scheduleNextAutonomousMove = useCallback(() => {
    if (movementTimerRef.current) clearTimeout(movementTimerRef.current);

    // Random interval between 5 and 12 seconds
    const nextInterval = Math.random() * 7000 + 5000;

    movementTimerRef.current = setTimeout(() => {
      if (isMinimized) {
        scheduleNextAutonomousMove();
        return;
      }

      const bounds = getSafeBounds();
      const platforms = getPagePlatforms();
      const patternRand = Math.random();

      // Pattern 1: Climb onto a random UI element/button (55%)
      if (patternRand < 0.55 && platforms.length > 0) {
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
        setCurrentEmotion(randomPlatform.isButton ? "proud" : "curious");
        moveTo(randomPlatform.x, randomPlatform.y, 1.3, () => {
          setMovementState("sitting"); // Sit on designer stool on element
          triggerJump(15, 300);
          scheduleNextAutonomousMove();
        });
      }
      // Pattern 2: Fast run across screen (25%)
      else if (patternRand < 0.8) {
        const targetX = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX;
        const targetY = Math.random() * (bounds.maxY - bounds.minY) + bounds.minY;

        setCurrentEmotion("excited");
        moveTo(targetX, targetY, 1.6, () => {
          triggerJump(38, 450);
          spawnEffect("sparkle", 3);
          setTimeout(() => {
            scheduleNextAutonomousMove();
          }, 1200);
        });
      }
      // Pattern 3: Relax & Sit / Look around (20%)
      else {
        setMovementState("sitting");
        setTimeout(() => {
          setMovementState("idle");
          scheduleNextAutonomousMove();
        }, 3500);
      }
    }, nextInterval);
  }, [getSafeBounds, getPagePlatforms, isMinimized, moveTo, performRandomIdleAction, spawnEffect, triggerJump]);

  // ── 7. Initialize Home Position (Directly on Top of "View Resume" Button) ──
  const locateResumeButton = useCallback(() => {
    if (typeof document === "undefined") return null;
    const resumeBtn =
      document.querySelector('[data-char-action="resume"]') ||
      document.querySelector('a[href*="resume"]') ||
      document.querySelector('a[href*="Resume"]') ||
      document.querySelector('a[href*="pdf"]');

    if (resumeBtn instanceof HTMLElement) {
      const rect = resumeBtn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return {
          x: Math.max(16, rect.left + rect.width * 0.5 - 45),
          y: Math.max(16, rect.top - 82), // Sits right on the top border of the resume button
        };
      }
    }
    return null;
  }, []);

  useEffect(() => {
    setIsClient(true);

    const positionOnResume = () => {
      const btnPos = locateResumeButton();
      if (btnPos) {
        setPos(btnPos);
        posRef.current = btnPos;
        setMovementState("sitting"); // Start in cute sitting pose!
        setCurrentEmotion("proud");
        setCustomMessage("Check out my resume! 📄✨");
        setBubbleVisible(true);
      } else {
        // Fallback near hero top left if button not yet rendered
        const isMobile = window.innerWidth < 640;
        const fallback = {
          x: isMobile ? 40 : 120,
          y: isMobile ? 180 : 260,
        };
        setPos(fallback);
        posRef.current = fallback;
        setMovementState("sitting");
      }
    };

    // Immediate attempt
    positionOnResume();

    // Re-check after intro animations / hydration settle
    const t1 = setTimeout(positionOnResume, 300);
    const t2 = setTimeout(positionOnResume, 1000);
    const t3 = setTimeout(positionOnResume, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [locateResumeButton]);

  // Start Autonomous Loop after mounting
  useEffect(() => {
    if (!isClient) return;
    const initialDelay = setTimeout(() => {
      scheduleNextAutonomousMove();
    }, 5500);

    return () => {
      clearTimeout(initialDelay);
      if (movementTimerRef.current) clearTimeout(movementTimerRef.current);
      if (idleActionTimerRef.current) clearTimeout(idleActionTimerRef.current);
    };
  }, [isClient, scheduleNextAutonomousMove]);

  // ── 8. Natural Eye Blinking ──
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160);

      const nextBlink = Math.random() * 2500 + 3500;
      blinkTimerRef.current = setTimeout(triggerBlink, nextBlink);
    };

    blinkTimerRef.current = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(blinkTimerRef.current);
  }, []);

  // ── 9. Mouse Tracking & Eye Pupil Movement ──
  const handleMouseMove = useCallback((e) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
    lastMouseActivityRef.current = Date.now();

    if (!characterRef.current) return;
    const rect = characterRef.current.getBoundingClientRect();
    const charCenterX = rect.left + rect.width / 2;
    const charCenterY = rect.top + rect.height * 0.35;

    const deltaX = e.clientX - charCenterX;
    const deltaY = e.clientY - charCenterY;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.hypot(deltaX, deltaY);

    // Max pupil movement radius is 4.5 pixels
    const maxOffset = 4.5;
    const intensity = Math.min(distance / 120, 1) * maxOffset;

    setPupilOffset({
      x: Math.cos(angle) * intensity,
      y: Math.sin(angle) * intensity,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // ── 10. Inactivity & Attention-Seeking Feature ──
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastMouseActivityRef.current;
      if (timeSinceActivity > 14000 && !isMovingRef.current && !isMinimized) {
        // Character seeks attention playfully!
        lastMouseActivityRef.current = Date.now();
        triggerJump(35, 500);
        setCustomMessage("Hey! Still here! 👋✨");
        setBubbleVisible(true);
        setCurrentEmotion("playful");

        setTimeout(() => {
          setCustomMessage(null);
          setCurrentEmotion("welcome");
        }, 4000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isMinimized, triggerJump]);

  // ── 11. Emotion & Message Trigger Helper ──
  const setEmotion = useCallback((emotionKey, duration = null, message = null) => {
    if (EMOTIONS[emotionKey]) {
      setCurrentEmotion(emotionKey);
      setCustomMessage(message);
      setBubbleVisible(true);

      if (emotionTimeoutRef.current) {
        clearTimeout(emotionTimeoutRef.current);
      }

      if (duration) {
        emotionTimeoutRef.current = setTimeout(() => {
          setCurrentEmotion("welcome");
          setCustomMessage(null);
        }, duration);
      }
    }
  }, []);

  // ── 12. Smart DOM Interaction & Hover Reagent ──
  useEffect(() => {
    const detectEmotionFromElement = (el) => {
      if (!el || !(el instanceof HTMLElement)) return null;

      // 1. Direct emotion data attribute
      const explicitEmotion = el.closest("[data-char-emotion]")?.getAttribute("data-char-emotion");
      if (explicitEmotion && EMOTIONS[explicitEmotion]) {
        return { emotion: explicitEmotion, message: null };
      }

      // 2. Action data attribute mapping
      const explicitAction = el.closest("[data-char-action]")?.getAttribute("data-char-action");
      if (explicitAction) {
        if (explicitAction.includes("work-poster")) return { emotion: "curious", message: "Check out this reel! 🎬" };
        if (explicitAction.includes("work")) return { emotion: "excited", message: "Let's go! Amazing work! ✨" };
        if (explicitAction.includes("resume")) return { emotion: "proud", message: "Check this out! 📄" };
        if (explicitAction.includes("result") || explicitAction.includes("proof")) return { emotion: "impressed", message: "Real verified proof! 🏆" };
        if (explicitAction.includes("contact")) return { emotion: "friendly", message: "Let's connect! 💌" };
      }

      // 3. Inspect element text & attributes
      const text = (el.innerText || el.textContent || "").toLowerCase();
      const href = (el.getAttribute("href") || "").toLowerCase();
      const className = (el.className && typeof el.className === "string" ? el.className : "").toLowerCase();
      const tagName = el.tagName.toLowerCase();

      if (text.includes("explore the work") || href === "#work") {
        return { emotion: "excited", message: "Let's go! Amazing work! ✨" };
      }
      if (text.includes("view resume") || text.includes("resume") || href.includes("resume") || text.includes("cv")) {
        return { emotion: "proud", message: "Check this out! 📄" };
      }
      if (text.includes("get in touch") || href === "#contact" || href.startsWith("mailto:")) {
        return { emotion: "friendly", message: "Let's connect! 💌" };
      }
      if (text.includes("send message") || (tagName === "button" && el.getAttribute("type") === "submit")) {
        return { emotion: "encouraging", message: "Send it! 🚀" };
      }
      if (text.includes("send another") || text.includes("replay intro") || text.includes("skip")) {
        return { emotion: "playful", message: "Here we go! 🎬" };
      }
      if (text.includes("proof") || text.includes("watch original reel") || text.includes("reel")) {
        return { emotion: "celebrating", message: "Look at that proof! 🎉" };
      }
      if (className.includes("poster") || el.closest(".group\\/poster") || tagName === "img") {
        return { emotion: "curious", message: "Ooh, so detailed! 🔍" };
      }
      if (className.includes("animate-spin") || className.includes("loading") || text.includes("loading")) {
        return { emotion: "thinking", message: "Crunching data... ⏳" };
      }
      if (text.includes("error") || text.includes("required") || className.includes("error") || el.getAttribute("role") === "alert") {
        return { emotion: "worried", message: "Oh no... 😟" };
      }
      if (text.includes("ready to send") || text.includes("success") || className.includes("success")) {
        return { emotion: "success", message: "We did it! 🎉" };
      }
      if (href === "#results" || text.includes("real results") || text.includes("metrics")) {
        return { emotion: "impressed", message: "Incredible outcomes! 🏆" };
      }

      return null;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const detected = detectEmotionFromElement(target);
      if (detected) {
        setEmotion(detected.emotion, null, detected.message);

        // Turn character towards hovered element & hop
        if (target instanceof HTMLElement) {
          const rect = target.getBoundingClientRect();
          if (rect.left > posRef.current.x) setFacing("right");
          else setFacing("left");

          if (detected.emotion === "excited" || detected.emotion === "encouraging" || detected.emotion === "celebrating") {
            triggerJump(25, 400);
            spawnEffect("sparkle", 2);
          }
        }
      }
    };

    const handleMouseOut = (e) => {
      const related = e.relatedTarget;
      if (!related || !detectEmotionFromElement(related)) {
        if (emotionTimeoutRef.current) clearTimeout(emotionTimeoutRef.current);
        emotionTimeoutRef.current = setTimeout(() => {
          setCurrentEmotion("welcome");
          setCustomMessage(null);
        }, 700);
      }
    };

    const handleCustomEmotion = (e) => {
      if (e.detail) {
        if (typeof e.detail === "string" && EMOTIONS[e.detail]) {
          setEmotion(e.detail);
        } else if (typeof e.detail === "object" && e.detail.emotion) {
          setEmotion(e.detail.emotion, e.detail.duration || 3000, e.detail.message);
        }
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("set-character-emotion", handleCustomEmotion);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("set-character-emotion", handleCustomEmotion);
      if (emotionTimeoutRef.current) clearTimeout(emotionTimeoutRef.current);
    };
  }, [setEmotion, spawnEffect, triggerJump]);

  // ── 13. Scroll Awareness & Section Guide ──
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const sections = [
          { id: "work", name: "Work & Reels", msg: "Exploring projects! 💼✨" },
          { id: "results", name: "Outcomes", msg: "Look at these metrics! 📈" },
          { id: "about", name: "About", msg: "Learn more about Ritesh! 💡" },
          { id: "experience", name: "Experience", msg: "Deep industry track record! ⚡" },
          { id: "contact", name: "Contact", msg: "Let's build something great! 📬" },
        ];

        for (const sec of sections) {
          const el = document.getElementById(sec.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
              if (lastScrollSectionRef.current !== sec.id) {
                lastScrollSectionRef.current = sec.id;
                setCustomMessage(sec.msg);
                setBubbleVisible(true);
                triggerJump(20, 350);
                setTimeout(() => setCustomMessage(null), 3000);
              }
              break;
            }
          }
        }
      }, 250);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [triggerJump]);

  // ── 14. Interactive Easter Eggs & Combo Clicks ──
  const handleCharacterClick = (e) => {
    e.stopPropagation();
    const newCombo = clickCombo + 1;
    setClickCombo(newCombo);

    // Reset combo after 2.5 seconds
    setTimeout(() => setClickCombo(0), 2500);

    if (newCombo >= 5) {
      // Mega Celebration Combo!
      setCurrentEmotion("celebrating");
      setCustomMessage("WHOOPEE! 🎉✨🚀");
      triggerJump(60, 700);
      spawnEffect("confetti", 8);
      setMovementState("spinning");
      setTimeout(() => {
        setMovementState("idle");
        setCustomMessage(null);
        setCurrentEmotion("welcome");
      }, 3500);
    } else if (newCombo === 3) {
      // Spin Pirouette
      setMovementState("spinning");
      setCurrentEmotion("excited");
      setCustomMessage("Spinning around! 💫");
      spawnEffect("sparkle", 5);
      setTimeout(() => {
        setMovementState("idle");
        setCustomMessage(null);
      }, 2000);
    } else {
      // Single / double bounce
      const playfulEmotions = ["playful", "excited", "celebrating", "impressed", "friendly"];
      const randomEmotion = playfulEmotions[Math.floor(Math.random() * playfulEmotions.length)];
      setEmotion(randomEmotion, 2200);
      triggerJump(30, 450);
      spawnEffect("heart", 2);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    // High jump & flip
    triggerJump(50, 600);
    spawnEffect("sparkle", 4);
    setCustomMessage("Yaaaay! 🤸‍♂️");
    setTimeout(() => setCustomMessage(null), 2000);
  };

  // ── 15. Render Sparkles / Badges / Particles ──
  const renderEffects = () => {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {/* Floating state badge / particles */}
        {activeData.effect === "sparkles" && (
          <>
            <span className="absolute -top-3 -left-2 text-xs animate-ping">✨</span>
            <span className="absolute -top-4 right-1 text-xs animate-bounce" style={{ animationDelay: "0.2s" }}>⭐</span>
            <span className="absolute top-4 -left-4 text-xs animate-pulse" style={{ animationDelay: "0.4s" }}>✨</span>
          </>
        )}
        {activeData.effect === "confetti" && (
          <>
            <span className="absolute -top-4 left-0 text-xs animate-bounce">🎊</span>
            <span className="absolute -top-3 right-0 text-xs animate-ping">🎉</span>
            <span className="absolute top-2 -right-3 text-xs animate-pulse">✨</span>
          </>
        )}
        {activeData.effect === "heart" && (
          <span className="absolute -top-4 right-2 text-xs animate-bounce">💖</span>
        )}
        {activeData.effect === "teardrop" && (
          <div className="absolute top-8 right-3 w-1.5 h-2.5 bg-[#4FC3F7] rounded-full animate-bounce" />
        )}
        {activeData.effect === "checkmark" && (
          <div className="absolute -top-2 right-0 w-5 h-5 bg-[#4CAF50] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md animate-bounce">
            ✓
          </div>
        )}
        {activeData.effect === "stars" && (
          <>
            <span className="absolute -top-3 -right-2 text-xs animate-spin">🌟</span>
            <span className="absolute -top-3 -left-2 text-xs animate-ping">⭐</span>
          </>
        )}
        {activeData.effect === "zzz" && (
          <span className="absolute -top-4 -right-1 text-xs font-bold text-[#FF6B9D] animate-bounce">💤</span>
        )}

        {/* Dynamic Spawned Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute transition-all duration-700 pointer-events-none text-xs"
            style={{
              left: `calc(50% + ${p.x}px)`,
              top: `calc(70% + ${p.y}px)`,
              transform: `scale(${p.scale})`,
              opacity: 0.9,
            }}
          >
            {p.type === "dust" && <span className="text-[10px] opacity-70">💨</span>}
            {p.type === "sparkle" && <span>✨</span>}
            {p.type === "confetti" && <span>🎉</span>}
            {p.type === "heart" && <span>💖</span>}
          </div>
        ))}
      </div>
    );
  };

  // Skip rendering during SSR until client coordinates are computed
  if (!isClient) {
    return null;
  }

  const isWalking = movementState === "walking";
  const isRunning = movementState === "running";
  const isSkipping = movementState === "skipping";
  const isDancing = movementState === "dancing";
  const isStretching = movementState === "stretching";
  const isScratching = movementState === "scratching";
  const isSitting = movementState === "sitting";
  const isSpinning = movementState === "spinning";

  return (
    <aside
      aria-label="Interactive Portfolio Companion Character"
      className="fixed z-50 select-none font-sans pointer-events-none"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: isMovingRef.current
          ? `transform ${moveDuration}s cubic-bezier(0.25, 1, 0.5, 1)`
          : "transform 0.4s ease-out",
      }}
    >
      <div className="relative flex flex-col items-center pointer-events-none">
        
        {/* ── 1. Speech / Chat Bubble ── */}
        {!isMinimized && bubbleVisible && (
          <div
            className={`transition-all duration-300 transform origin-bottom mb-2 relative pointer-events-auto ${
              bubbleVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-2 pointer-events-none"
            }`}
          >
            <div className="bg-white text-[#1a1a1a] px-3.5 py-1.5 rounded-full border-2 border-[#C75B3F] shadow-xl shadow-black/10 flex items-center gap-1.5 max-w-[210px] sm:max-w-[260px] cursor-default">
              <span className="text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                {activeMessage}
              </span>
            </div>
            {/* Bubble Tail */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#C75B3F] mx-auto -mt-0.5" />
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white mx-auto -mt-[7.5px]" />
          </div>
        )}

        {/* ── 2. Articulated Character 2D SVG & Shadow ── */}
        <div
          ref={characterRef}
          onClick={handleCharacterClick}
          onDoubleClick={handleDoubleClick}
          className={`relative cursor-pointer transition-all duration-300 pointer-events-auto ${
            isMinimized ? "scale-75 opacity-70 hover:opacity-100" : "scale-100"
          }`}
          style={{
            transform: `translateY(-${jumpHeight}px) ${facing === "left" ? "scaleX(-1)" : "scaleX(1)"} ${
              isSpinning ? "rotate(360deg)" : ""
            }`,
            transition: jumpHeight > 0
              ? "transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)"
              : "transform 0.3s ease",
          }}
        >
          {renderEffects()}

          {/* Dynamic Ground Shadow */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-[2px] transition-all duration-300 pointer-events-none"
            style={{
              width: jumpHeight > 0 ? "35px" : isRunning ? "65px" : "55px",
              height: jumpHeight > 0 ? "6px" : "12px",
              opacity: jumpHeight > 0 ? 0.2 : 0.45,
            }}
          />

          {/* SVG Character Canvas */}
          <svg
            viewBox="0 0 100 115"
            className="w-20 h-24 sm:w-24 sm:h-28 drop-shadow-xl overflow-visible"
            style={{
              animation: isRunning
                ? "run-bounce 0.22s infinite alternate cubic-bezier(0.4, 0, 0.6, 1)"
                : isWalking
                ? "walk-bob 0.45s infinite alternate ease-in-out"
                : isDancing
                ? "dance-sway 0.6s infinite alternate ease-in-out"
                : isStretching
                ? "stretch-grow 1.8s infinite alternate ease-in-out"
                : activeData.pose === "celebrate" || activeData.pose === "cheer"
                ? "jump-bounce 0.45s infinite alternate ease-in-out"
                : "grounded-idle 3.2s ease-in-out infinite",
            }}
          >
            {/* ── DESIGNER CHAIR / STOOL (When Character is Sitting) ── */}
            {isSitting && (
              <g className="transition-all duration-300">
                {/* Backrest behind body */}
                <rect
                  x="24"
                  y="48"
                  width="52"
                  height="38"
                  rx="8"
                  fill="#2A2B30"
                  stroke="#1a1a1a"
                  strokeWidth="2.2"
                />
                {/* Wooden accent bar on backrest */}
                <rect
                  x="28"
                  y="52"
                  width="44"
                  height="6"
                  rx="3"
                  fill="#C75B3F"
                  opacity="0.9"
                />
                {/* Chair Seat Cushion */}
                <ellipse
                  cx="50"
                  cy="92"
                  rx="30"
                  ry="7.5"
                  fill="#1E1F24"
                  stroke="#1a1a1a"
                  strokeWidth="2.2"
                />
                {/* Terracotta Trim Ring */}
                <ellipse
                  cx="50"
                  cy="92"
                  rx="26"
                  ry="4.5"
                  fill="#C75B3F"
                  opacity="0.8"
                />
                {/* Stool Angled Legs */}
                <line x1="26" y1="94" x2="16" y2="114" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="74" y1="94" x2="84" y2="114" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="42" y1="95" x2="38" y2="114" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                <line x1="58" y1="95" x2="62" y2="114" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                {/* Footrest Ring */}
                <path d="M 22 108 Q 50 113 78 108" stroke="#1a1a1a" strokeWidth="2" fill="none" />
              </g>
            )}

            {/* ── EARS ── */}
            <circle cx="28" cy="22" r="7.5" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="2.2" />
            <circle cx="28" cy="22" r="4" fill="#FFB6C1" opacity="0.6" />

            <circle cx="72" cy="22" r="7.5" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="2.2" />
            <circle cx="72" cy="22" r="4" fill="#FFB6C1" opacity="0.6" />

            {/* ── LEGS & FEET (High-Energy Articulation) ── */}
            {/* Left Leg */}
            <g
              style={{
                transformOrigin: "39px 88px",
                transform: isRunning
                  ? "rotate(-45deg)"
                  : isWalking
                  ? "rotate(-25deg)"
                  : isSkipping
                  ? "rotate(-20deg)"
                  : isSitting
                  ? "rotate(-80deg) translateY(-6px)"
                  : "none",
                animation: isRunning
                  ? "leg-run-left 0.22s infinite alternate ease-in-out"
                  : isWalking
                  ? "leg-walk-left 0.45s infinite alternate ease-in-out"
                  : "none",
              }}
            >
              {/* Thigh/Shin */}
              <rect x="35" y="88" width="9.5" height="16" rx="4.75" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="2.2" />
              {/* Cute Running Shoe */}
              <ellipse cx="37" cy="104" rx="7.5" ry="4.5" fill="#1a1a1a" />
              <path d="M 32 104 Q 38 102 44 104" stroke="#FAF8F5" strokeWidth="1.5" fill="none" />
            </g>

            {/* Right Leg */}
            <g
              style={{
                transformOrigin: "61px 88px",
                transform: isRunning
                  ? "rotate(45deg)"
                  : isWalking
                  ? "rotate(25deg)"
                  : isSkipping
                  ? "rotate(20deg)"
                  : isSitting
                  ? "rotate(-80deg) translateY(-6px) translateX(4px)"
                  : "none",
                animation: isRunning
                  ? "leg-run-right 0.22s infinite alternate ease-in-out"
                  : isWalking
                  ? "leg-walk-right 0.45s infinite alternate ease-in-out"
                  : "none",
              }}
            >
              {/* Thigh/Shin */}
              <rect x="56" y="88" width="9.5" height="16" rx="4.75" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="2.2" />
              {/* Cute Running Shoe */}
              <ellipse cx="63" cy="104" rx="7.5" ry="4.5" fill="#1a1a1a" />
              <path d="M 58 104 Q 64 102 70 104" stroke="#FAF8F5" strokeWidth="1.5" fill="none" />
            </g>

            {/* ── BODY (Pink Ellipse) ── */}
            <ellipse
              cx="50"
              cy="76"
              rx="24"
              ry="21"
              fill="#FF6B9D"
              stroke="#1a1a1a"
              strokeWidth="2.5"
            />

            {/* Belly highlight badge */}
            <ellipse cx="50" cy="78" rx="14" ry="12" fill="#FFA5C3" opacity="0.75" />

            {/* ── ARMS (Articulated Left & Right) ── */}
            {/* Left Arm */}
            <g
              style={{
                transformOrigin: "24px 66px",
                transform: isStretching
                  ? "rotate(-130deg) translateY(4px)"
                  : isScratching
                  ? "rotate(-140deg) translateX(-4px)"
                  : isDancing
                  ? "rotate(-30deg)"
                  : activeData.pose === "wave" || activeData.pose === "celebrate" || activeData.pose === "cheer" || activeData.pose === "victory"
                  ? "rotate(-40deg)"
                  : activeData.pose === "thumbs-up"
                  ? "rotate(-25deg)"
                  : isRunning
                  ? "rotate(40deg)"
                  : isWalking
                  ? "rotate(20deg)"
                  : "rotate(15deg)",
                animation: activeData.pose === "wave"
                  ? "wave-arm 0.8s ease-in-out infinite alternate"
                  : isRunning
                  ? "arm-run-left 0.25s infinite alternate ease-in-out"
                  : isWalking
                  ? "arm-walk-left 0.5s infinite alternate ease-in-out"
                  : isDancing
                  ? "dance-arm-left 0.6s infinite alternate ease-in-out"
                  : "none",
              }}
            >
              <rect
                x="16"
                y="64"
                width="8.5"
                height="18"
                rx="4.25"
                fill="#FFD93D"
                stroke="#1a1a1a"
                strokeWidth="2.2"
              />
              {activeData.pose === "thumbs-up" && (
                <circle cx="15" cy="64" r="3.5" fill="#FFD93D" stroke="#1a1a1a" strokeWidth="2" />
              )}
            </g>

            {/* Right Arm */}
            <g
              style={{
                transformOrigin: "76px 66px",
                transform: isStretching
                  ? "rotate(130deg) translateY(4px)"
                  : isScratching
                  ? "rotate(20deg)"
                  : isDancing
                  ? "rotate(30deg)"
                  : activeData.pose === "celebrate" || activeData.pose === "cheer" || activeData.pose === "victory"
                  ? "rotate(40deg)"
                  : activeData.pose === "open-arms"
                  ? "rotate(35deg)"
                  : isRunning
                  ? "rotate(-40deg)"
                  : isWalking
                  ? "rotate(-20deg)"
                  : "rotate(-15deg)",
                animation: activeData.pose === "celebrate" || activeData.pose === "victory"
                  ? "wave-arm-right 0.8s ease-in-out infinite alternate"
                  : isRunning
                  ? "arm-run-right 0.25s infinite alternate ease-in-out"
                  : isWalking
                  ? "arm-walk-right 0.5s infinite alternate ease-in-out"
                  : isDancing
                  ? "dance-arm-right 0.6s infinite alternate ease-in-out"
                  : "none",
              }}
            >
              <rect
                x="75"
                y="64"
                width="8.5"
                height="18"
                rx="4.25"
                fill="#FFD93D"
                stroke="#1a1a1a"
                strokeWidth="2.2"
              />
            </g>

            {/* ── HEAD (Yellow Circle + Expressions) ── */}
            <g
              style={{
                transform:
                  isScratching || activeData.pose === "tilt" || activeData.pose === "tilt-curious"
                    ? "rotate(9deg)"
                    : activeData.pose === "confident"
                    ? "translateY(-3px)"
                    : isStretching
                    ? "translateY(-2px) scale(1.03)"
                    : "none",
                transformOrigin: "50px 38px",
                transition: "transform 0.3s ease",
              }}
            >
              <circle
                cx="50"
                cy="38"
                r="26"
                fill="#FFD93D"
                stroke="#1a1a1a"
                strokeWidth="2.5"
              />

              {/* Cute Cheek Blushes */}
              <ellipse cx="33" cy="44" rx="4.8" ry="3.2" fill="#FF8DA1" opacity="0.85" />
              <ellipse cx="67" cy="44" rx="4.8" ry="3.2" fill="#FF8DA1" opacity="0.85" />

              {/* ── EYES (Interactive & Dynamic Expressions) ── */}
              {isBlinking ? (
                // Blinking closed eye curves
                <g stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <path d="M 34 38 Q 40 43 46 38" />
                  <path d="M 54 38 Q 60 43 66 38" />
                </g>
              ) : activeData.eyeType === "happy-curve" ? (
                // Happy curved eyes ^^
                <g stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round" fill="none">
                  <path d="M 33 40 Q 39 32 45 40" />
                  <path d="M 55 40 Q 61 32 67 40" />
                </g>
              ) : activeData.eyeType === "sleepy" ? (
                // Sleepy eyes
                <g stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" fill="none">
                  <path d="M 34 39 Q 40 42 46 39" />
                  <path d="M 54 39 Q 60 42 66 39" />
                </g>
              ) : activeData.eyeType === "wink" ? (
                // Playful wink eye
                <g>
                  <circle cx="39" cy="36" r="7" fill="white" stroke="#1a1a1a" strokeWidth="2" />
                  <circle
                    cx={39 + pupilOffset.x}
                    cy={36 + pupilOffset.y}
                    r="3.6"
                    fill="#1a1a1a"
                  />
                  <circle
                    cx={39 + pupilOffset.x - 1.2}
                    cy={36 + pupilOffset.y - 1.2}
                    r="1.2"
                    fill="white"
                  />
                  <path
                    d="M 55 38 Q 61 31 67 38"
                    stroke="#1a1a1a"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              ) : activeData.eyeType === "star-eyes" ? (
                // Impressed star eyes
                <g fill="#FF8A00" stroke="#1a1a1a" strokeWidth="1.2">
                  <polygon points="39,29 41,34 46,35 42,38 43,43 39,40 35,43 36,38 32,35 37,34" />
                  <polygon points="61,29 63,34 68,35 64,38 65,43 61,40 57,43 58,38 54,35 59,34" />
                </g>
              ) : activeData.eyeType === "worried" ? (
                // Worried angled eyes
                <g>
                  <circle cx="39" cy="37" r="6.5" fill="white" stroke="#1a1a1a" strokeWidth="2" />
                  <circle cx="39" cy="39" r="3.2" fill="#1a1a1a" />
                  <path d="M 33 29 Q 39 33 45 31" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />

                  <circle cx="61" cy="37" r="6.5" fill="white" stroke="#1a1a1a" strokeWidth="2" />
                  <circle cx="61" cy="39" r="3.2" fill="#1a1a1a" />
                  <path d="M 55 31 Q 61 33 67 29" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />
                </g>
              ) : (
                // Standard tracking eyes with big shine dots
                <g>
                  {/* Left Eye */}
                  <circle cx="39" cy="36" r="7" fill="white" stroke="#1a1a1a" strokeWidth="2" />
                  <circle
                    cx={39 + pupilOffset.x}
                    cy={36 + pupilOffset.y}
                    r="3.6"
                    fill="#1a1a1a"
                  />
                  <circle
                    cx={39 + pupilOffset.x - 1.2}
                    cy={36 + pupilOffset.y - 1.2}
                    r="1.3"
                    fill="white"
                  />

                  {/* Right Eye */}
                  <circle cx="61" cy="36" r="7" fill="white" stroke="#1a1a1a" strokeWidth="2" />
                  <circle
                    cx={61 + pupilOffset.x}
                    cy={36 + pupilOffset.y}
                    r="3.6"
                    fill="#1a1a1a"
                  />
                  <circle
                    cx={61 + pupilOffset.x - 1.2}
                    cy={36 + pupilOffset.y - 1.2}
                    r="1.3"
                    fill="white"
                  />
                </g>
              )}

              {/* ── MOUTH (Expressive) ── */}
              {activeData.mouthType === "big-smile" || activeData.mouthType === "open-laugh" ? (
                // Open big happy mouth
                <g>
                  <path
                    d="M 43 45 Q 50 56 57 45 Z"
                    fill="#C75B3F"
                    stroke="#1a1a1a"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path d="M 46 49 Q 50 53 54 49" fill="#FF8DA1" />
                </g>
              ) : activeData.mouthType === "sad-frown" ? (
                // Sad frown
                <path
                  d="M 43 51 Q 50 44 57 51"
                  stroke="#1a1a1a"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : activeData.mouthType === "o-mouth" || activeData.mouthType === "open-wow" || isStretching ? (
                // Big Yawning / Curious 'O' mouth
                <ellipse
                  cx="50"
                  cy="47"
                  rx="4.2"
                  ry="5.5"
                  fill="#C75B3F"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                />
              ) : activeData.mouthType === "tongue" ? (
                // Tongue out playful
                <g>
                  <path d="M 43 46 Q 50 52 57 46" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <path d="M 48 48 Q 50 56 54 50 Z" fill="#FF6B9D" stroke="#1a1a1a" strokeWidth="1.2" />
                </g>
              ) : activeData.mouthType === "smirk" ? (
                // Proud confident smirk
                <path
                  d="M 44 47 Q 52 48 57 44"
                  stroke="#1a1a1a"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                // Standard gentle smile
                <path
                  d="M 44 46 Q 50 52 56 46"
                  stroke="#1a1a1a"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>
          </svg>
        </div>

        {/* Minimize / Info toggle button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(!isMinimized);
          }}
          title={isMinimized ? "Show Character" : "Minimize Character"}
          aria-label={isMinimized ? "Show Character" : "Minimize Character"}
          className="mt-1 text-[10px] font-mono text-[#8a8a8a] hover:text-[#C75B3F] transition-colors p-1 pointer-events-auto cursor-pointer"
        >
          {isMinimized ? "▲" : "▼"}
        </button>
      </div>

      {/* Global CSS Keyframes for High-Performance 60FPS Realistic Animations */}
      <style jsx>{`
        @keyframes grounded-idle {
          0%, 100% {
            transform: translateY(0px) scale(1, 1);
          }
          50% {
            transform: translateY(-2px) scale(1.02, 0.98);
          }
        }
        @keyframes walk-bob {
          0% {
            transform: translateY(0px) rotate(-2deg);
          }
          50% {
            transform: translateY(-6px) rotate(0deg);
          }
          100% {
            transform: translateY(0px) rotate(2deg);
          }
        }
        @keyframes run-bounce {
          0% {
            transform: translateY(0px) rotate(-6deg) scale(1, 0.95);
          }
          100% {
            transform: translateY(-10px) rotate(6deg) scale(0.96, 1.04);
          }
        }
        @keyframes dance-sway {
          0% {
            transform: rotate(-8deg) translateY(-2px);
          }
          100% {
            transform: rotate(8deg) translateY(-4px);
          }
        }
        @keyframes stretch-grow {
          0% {
            transform: scaleY(1);
          }
          100% {
            transform: scaleY(1.08) translateY(-4px);
          }
        }
        @keyframes jump-bounce {
          0% {
            transform: translateY(0px) scale(1.05, 0.95);
          }
          100% {
            transform: translateY(-16px) scale(0.95, 1.08);
          }
        }
        @keyframes leg-walk-left {
          0% { transform: rotate(-35deg) translateY(-2px); }
          100% { transform: rotate(35deg) translateY(2px); }
        }
        @keyframes leg-walk-right {
          0% { transform: rotate(35deg) translateY(2px); }
          100% { transform: rotate(-35deg) translateY(-2px); }
        }
        @keyframes leg-run-left {
          0% { transform: rotate(-55deg) translateY(-4px) scaleY(0.9); }
          100% { transform: rotate(55deg) translateY(4px) scaleY(1.05); }
        }
        @keyframes leg-run-right {
          0% { transform: rotate(55deg) translateY(4px) scaleY(1.05); }
          100% { transform: rotate(-55deg) translateY(-4px) scaleY(0.9); }
        }
        @keyframes arm-walk-left {
          0% { transform: rotate(35deg); }
          100% { transform: rotate(-35deg); }
        }
        @keyframes arm-walk-right {
          0% { transform: rotate(-35deg); }
          100% { transform: rotate(35deg); }
        }
        @keyframes arm-run-left {
          0% { transform: rotate(65deg) translateY(-2px); }
          100% { transform: rotate(-65deg) translateY(2px); }
        }
        @keyframes arm-run-right {
          0% { transform: rotate(-65deg) translateY(2px); }
          100% { transform: rotate(65deg) translateY(-2px); }
        }
        @keyframes dance-arm-left {
          0% { transform: rotate(-20deg); }
          100% { transform: rotate(45deg); }
        }
        @keyframes dance-arm-right {
          0% { transform: rotate(45deg); }
          100% { transform: rotate(-20deg); }
        }
        @keyframes wave-arm {
          0% { transform: rotate(-20deg); }
          100% { transform: rotate(30deg); }
        }
        @keyframes wave-arm-right {
          0% { transform: rotate(30deg); }
          100% { transform: rotate(-20deg); }
        }
      `}</style>
    </aside>
  );
}
