import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import "./App.css";

type ViewMode = "home" | "loading" | "login" | "dashboard";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
  isSad?: boolean;
  mouseRatioX?: number;
  mouseRatioY?: number;
}

function Pupil({
  size = 12,
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
  isSad = false,
  mouseRatioX = 0,
  mouseRatioY = 0,
}: PupilProps) {
  const pupilPosition = useMemo(() => {
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    return {
      x: Math.max(-maxDistance, Math.min(maxDistance, mouseRatioX * maxDistance * 2)),
      y: Math.max(-maxDistance, Math.min(maxDistance, mouseRatioY * maxDistance * 2)),
    };
  }, [forceLookX, forceLookY, maxDistance, mouseRatioX, mouseRatioY]);

  return (
    <div
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y + (isSad ? 2 : 0)}px) scaleY(${isSad ? 0.68 : 1})`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
}

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
  isSad?: boolean;
  mouseRatioX?: number;
  mouseRatioY?: number;
}

function EyeBall({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY,
  isSad = false,
  mouseRatioX = 0,
  mouseRatioY = 0,
}: EyeBallProps) {
  const pupilPosition = useMemo(() => {
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    return {
      x: Math.max(-maxDistance, Math.min(maxDistance, mouseRatioX * maxDistance * 2)),
      y: Math.max(-maxDistance, Math.min(maxDistance, mouseRatioY * maxDistance * 2)),
    };
  }, [forceLookX, forceLookY, maxDistance, mouseRatioX, mouseRatioY]);

  return (
    <div
      className="flex items-center justify-center rounded-full transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: eyeColor,
        overflow: "hidden",
        transform: isSad ? "scaleY(0.84) translateY(2px)" : undefined,
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y + (isSad ? 2 : 0)}px) scaleY(${isSad ? 0.68 : 1})`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
}

interface AnimatedCharactersProps {
  isTyping?: boolean;
  showPassword?: boolean;
  passwordLength?: number;
  activeField?: "email" | "password" | null;
  isGlancingAtField?: boolean;
  isLoginIntent?: boolean;
  isLeaving?: boolean;
}

function AnimatedCharacters({
  isTyping = false,
  showPassword = false,
  passwordLength = 0,
  activeField = null,
  isGlancingAtField = false,
  isLoginIntent = false,
  isLeaving = false,
}: AnimatedCharactersProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;
    const scheduleBlink = () => {
      const blinkTimeout = window.setTimeout(() => {
        setIsPurpleBlinking(true);
        window.setTimeout(() => {
          setIsPurpleBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());
      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;
    const scheduleBlink = () => {
      const blinkTimeout = window.setTimeout(() => {
        setIsBlackBlinking(true);
        window.setTimeout(() => {
          setIsBlackBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());
      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!passwordLength || !showPassword) {
      return;
    }

    let mounted = true;
    let peekTimer = 0;
    let resetTimer = 0;

    const schedulePeek = () => {
      peekTimer = window.setTimeout(() => {
        if (!mounted) return;
        setIsPurplePeeking(true);
        resetTimer = window.setTimeout(() => {
          if (!mounted) return;
          setIsPurplePeeking(false);
          schedulePeek();
        }, 800);
      }, Math.random() * 3000 + 2000);
    };

    schedulePeek();

    return () => {
      mounted = false;
      window.clearTimeout(peekTimer);
      window.clearTimeout(resetTimer);
    };
  }, [passwordLength, showPassword]);

  const calculatePosition = (intensity = 1) => {
    const viewportWidth = typeof window === "undefined" ? 1 : window.innerWidth || 1;
    const viewportHeight = typeof window === "undefined" ? 1 : window.innerHeight || 1;
    const ratioX = mouseX / viewportWidth - 0.5;
    const ratioY = mouseY / viewportHeight - 0.5;

    return {
      faceX: Math.max(-15, Math.min(15, ratioX * 28 * intensity)),
      faceY: Math.max(-10, Math.min(10, ratioY * 20 * intensity)),
      bodySkew: Math.max(-6, Math.min(6, ratioX * -11 * intensity)),
    };
  };

  const purplePos = calculatePosition(1.05);
  const blackPos = calculatePosition(0.9);
  const yellowPos = calculatePosition(0.8);
  const orangePos = calculatePosition(0.7);
  const isEmailActive = activeField === "email";
  const isLookingAtEachOther = isEmailActive && isGlancingAtField;
  const isHidingPassword = passwordLength > 0 && !showPassword;
  const isPasswordVisible = passwordLength > 0 && showPassword;
  const isSneakyPeeking = isPasswordVisible && isPurplePeeking;
  const isLookingTowardForm = isEmailActive && !isLookingAtEachOther;
  const formFaceOffset = isLookingTowardForm ? { x: 14, y: -6 } : { x: 0, y: 0 };
  const formPupilOffset = isLookingTowardForm ? { x: 5, y: -2 } : { x: 0, y: 0 };
  const isSad = isLoginIntent && !isLeaving;
  const viewportWidth = typeof window === "undefined" ? 1 : window.innerWidth || 1;
  const viewportHeight = typeof window === "undefined" ? 1 : window.innerHeight || 1;
  const mouseRatioX = mouseX / viewportWidth - 0.5;
  const mouseRatioY = mouseY / viewportHeight - 0.5;

  return (
    <div className="relative mx-auto scale-[0.68] origin-bottom sm:scale-[0.82] lg:scale-100" style={{ width: "550px", height: "400px" }}>
      <div
        className="character-pop character-pop-top-drop absolute bottom-0"
        style={{ left: "70px", zIndex: 1, animationDelay: "0.08s" }}
      >
        <div className={cn("absolute bottom-0", isSad && "character-plead-left", isLeaving && "character-exit-up")}>
          <div
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
          style={{
            width: "180px",
            height: isTyping || isHidingPassword ? "440px" : "400px",
            backgroundColor: "#6C3FF5",
            borderRadius: "10px 10px 0 0",
            transform: isPasswordVisible
              ? "skewX(0deg)"
              : isLoginIntent
                ? `skewX(${purplePos.bodySkew - 16}deg) translateX(20px) rotate(-10deg) translateY(12px)`
              : isLookingTowardForm
                ? `skewX(${purplePos.bodySkew - 8}deg) translateX(28px)`
                : isTyping || isHidingPassword
                  ? `skewX(${purplePos.bodySkew - 12}deg) translateX(40px)`
                  : `skewX(${purplePos.bodySkew}deg)`,
            transformOrigin: "bottom center",
          }}
        >
        <div
          className="absolute flex gap-8 transition-all duration-700 ease-in-out"
          style={{
            left: isPasswordVisible
              ? "20px"
              : isLookingAtEachOther
                ? "55px"
                : `${45 + purplePos.faceX + formFaceOffset.x}px`,
            top: isPasswordVisible
              ? "35px"
              : isLookingAtEachOther
                ? "65px"
                : `${40 + purplePos.faceY + formFaceOffset.y}px`,
          }}
        >
          <EyeBall
            size={18}
            pupilSize={7}
            maxDistance={5}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={isPurpleBlinking}
            forceLookX={isPasswordVisible ? (isSneakyPeeking ? 4 : -4) : isLookingAtEachOther ? 3 : isLookingTowardForm ? formPupilOffset.x : undefined}
            forceLookY={isPasswordVisible ? (isSneakyPeeking ? 5 : -4) : isLookingAtEachOther ? 4 : isLookingTowardForm ? formPupilOffset.y : undefined}
            isSad={isSad}
            mouseRatioX={mouseRatioX}
            mouseRatioY={mouseRatioY}
          />
          <EyeBall
            size={18}
            pupilSize={7}
            maxDistance={5}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={isPurpleBlinking}
            forceLookX={isPasswordVisible ? (isSneakyPeeking ? 4 : -4) : isLookingAtEachOther ? 3 : isLookingTowardForm ? formPupilOffset.x : undefined}
            forceLookY={isPasswordVisible ? (isSneakyPeeking ? 5 : -4) : isLookingAtEachOther ? 4 : isLookingTowardForm ? formPupilOffset.y : undefined}
            isSad={isSad}
            mouseRatioX={mouseRatioX}
            mouseRatioY={mouseRatioY}
          />
        </div>
        <div
          className="absolute transition-all duration-500 ease-out"
          style={{
            left: isPasswordVisible ? "44px" : isLookingTowardForm ? "62px" : `${60 + purplePos.faceX}px`,
            top: isPasswordVisible ? "78px" : isLookingTowardForm ? "88px" : `${84 + purplePos.faceY}px`,
            width: "44px",
            height: isSad ? "16px" : "6px",
            borderTop: isSad ? "4px solid #2D2D2D" : "none",
            borderBottom: isSad ? "none" : "4px solid #2D2D2D",
            borderRadius: isSad ? "999px 999px 0 0" : "999px",
            transform: isSad ? "rotate(-6deg) scaleX(0.76) translateY(2px)" : "scaleX(0.72)",
            opacity: isSad ? 0.92 : 0.38,
          }}
        />
          </div>
        </div>
      </div>

      <div
        className="character-pop character-pop-spin-in absolute bottom-0"
        style={{ left: "240px", zIndex: 2, animationDelay: "0.28s" }}
      >
        <div className={cn("absolute bottom-0", isSad && "character-plead-right", isLeaving && "character-exit-up")}>
          <div
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
          style={{
            width: "120px",
            height: "310px",
            backgroundColor: "#2D2D2D",
            borderRadius: "8px 8px 0 0",
            transform: isPasswordVisible
              ? "skewX(0deg)"
              : isLoginIntent
                ? `skewX(${blackPos.bodySkew * 1.5 + 14}deg) translateX(8px) rotate(9deg) translateY(8px)`
              : isLookingTowardForm
                ? `skewX(${blackPos.bodySkew * 1.25 + 6}deg) translateX(10px)`
                : isLookingAtEachOther
                  ? `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(20px)`
                  : isTyping || isHidingPassword
                    ? `skewX(${blackPos.bodySkew * 1.5}deg)`
                    : `skewX(${blackPos.bodySkew}deg)`,
            transformOrigin: "bottom center",
          }}
        >
        <div
          className="absolute flex gap-6 transition-all duration-700 ease-in-out"
          style={{
            left: isPasswordVisible
              ? "10px"
              : isLookingAtEachOther
                ? "32px"
                : `${26 + blackPos.faceX + (isLookingTowardForm ? 10 : 0)}px`,
            top: isPasswordVisible
              ? "28px"
              : isLookingAtEachOther
                ? "12px"
                : `${32 + blackPos.faceY + (isLookingTowardForm ? -10 : 0)}px`,
          }}
        >
          <EyeBall
            size={16}
            pupilSize={6}
            maxDistance={4}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={isBlackBlinking}
            forceLookX={isPasswordVisible ? -4 : isLookingAtEachOther ? 0 : isLookingTowardForm ? 4 : undefined}
            forceLookY={isPasswordVisible ? -4 : isLookingAtEachOther ? -4 : isLookingTowardForm ? -3 : undefined}
            isSad={isSad}
            mouseRatioX={mouseRatioX}
            mouseRatioY={mouseRatioY}
          />
          <EyeBall
            size={16}
            pupilSize={6}
            maxDistance={4}
            eyeColor="white"
            pupilColor="#2D2D2D"
            isBlinking={isBlackBlinking}
            forceLookX={isPasswordVisible ? -4 : isLookingAtEachOther ? 0 : isLookingTowardForm ? 4 : undefined}
            forceLookY={isPasswordVisible ? -4 : isLookingAtEachOther ? -4 : isLookingTowardForm ? -3 : undefined}
            isSad={isSad}
            mouseRatioX={mouseRatioX}
            mouseRatioY={mouseRatioY}
          />
        </div>
        <div
          className="absolute transition-all duration-500 ease-out"
          style={{
            left: isPasswordVisible ? "28px" : isLookingTowardForm ? "40px" : `${34 + blackPos.faceX}px`,
            top: isPasswordVisible ? "66px" : isLookingTowardForm ? "74px" : `${70 + blackPos.faceY}px`,
            width: "34px",
            height: isSad ? "14px" : "5px",
            borderTop: isSad ? "4px solid #f4f4f5" : "none",
            borderBottom: isSad ? "none" : "4px solid #f4f4f5",
            borderRadius: isSad ? "999px 999px 0 0" : "999px",
            transform: isSad ? "rotate(6deg) scaleX(0.74) translateY(1px)" : "scaleX(0.7)",
            opacity: isSad ? 0.95 : 0.45,
          }}
        />
          </div>
        </div>
      </div>

      <div
        className="character-pop character-pop-scoot-up absolute bottom-0"
        style={{ left: "0px", zIndex: 3, animationDelay: "0.42s" }}
      >
        <div className={cn("absolute bottom-0", isSad && "character-plead-left", isLeaving && "character-exit-down")}>
          <div
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
          style={{
            width: "240px",
            height: "200px",
            backgroundColor: "#FF9B6B",
            borderRadius: "120px 120px 0 0",
            transform: isPasswordVisible
              ? "skewX(0deg)"
              : isLoginIntent
                ? `skewX(${orangePos.bodySkew - 8}deg) rotate(-6deg) translateY(10px)`
                : `skewX(${orangePos.bodySkew}deg)`,
            transformOrigin: "bottom center",
          }}
        >
        <div
          className="absolute flex gap-8 transition-all duration-200 ease-out"
          style={{
            left: isPasswordVisible ? "50px" : `${82 + orangePos.faceX + (isLookingTowardForm ? 8 : 0)}px`,
            top: isPasswordVisible ? "85px" : `${90 + orangePos.faceY + (isLookingTowardForm ? -6 : 0)}px`,
          }}
        >
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isPasswordVisible ? -5 : isLookingTowardForm ? 4 : undefined} forceLookY={isPasswordVisible ? -4 : isLookingTowardForm ? -2 : undefined} isSad={isSad} mouseRatioX={mouseRatioX} mouseRatioY={mouseRatioY} />
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isPasswordVisible ? -5 : isLookingTowardForm ? 4 : undefined} forceLookY={isPasswordVisible ? -4 : isLookingTowardForm ? -2 : undefined} isSad={isSad} mouseRatioX={mouseRatioX} mouseRatioY={mouseRatioY} />
        </div>
        <div
          className="absolute transition-all duration-500 ease-out"
          style={{
            left: isPasswordVisible ? "70px" : isLookingTowardForm ? "84px" : `${94 + orangePos.faceX}px`,
            top: isPasswordVisible ? "116px" : isLookingTowardForm ? "122px" : `${124 + orangePos.faceY}px`,
            width: "40px",
            height: isSad ? "16px" : "5px",
            borderTop: isSad ? "4px solid #2D2D2D" : "none",
            borderBottom: isSad ? "none" : "4px solid #2D2D2D",
            borderRadius: isSad ? "999px 999px 0 0" : "999px",
            transform: isSad ? "rotate(-4deg) scaleX(0.78) translateY(2px)" : "scaleX(0.8)",
            opacity: isSad ? 0.9 : 0.4,
          }}
        />
          </div>
        </div>
      </div>

      <div
        className="character-pop character-pop-peek-rise absolute bottom-0"
        style={{ left: "310px", zIndex: 4, animationDelay: "0.56s" }}
      >
        <div className={cn("absolute bottom-0", isSad && "character-plead-right", isLeaving && "character-exit-down")}>
          <div
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
          style={{
            width: "140px",
            height: "230px",
            backgroundColor: "#E8D754",
            borderRadius: "70px 70px 0 0",
            transform: isPasswordVisible
              ? "skewX(0deg)"
              : isLoginIntent
                ? `skewX(${yellowPos.bodySkew + 8}deg) rotate(6deg) translateY(12px)`
                : `skewX(${yellowPos.bodySkew}deg)`,
            transformOrigin: "bottom center",
          }}
        >
        <div
          className="absolute flex gap-6 transition-all duration-200 ease-out"
          style={{
            left: isPasswordVisible ? "20px" : `${52 + yellowPos.faceX + (isLookingTowardForm ? 8 : 0)}px`,
            top: isPasswordVisible ? "35px" : `${40 + yellowPos.faceY + (isLookingTowardForm ? -6 : 0)}px`,
          }}
        >
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isPasswordVisible ? -5 : isLookingTowardForm ? 4 : undefined} forceLookY={isPasswordVisible ? -4 : isLookingTowardForm ? -2 : undefined} isSad={isSad} mouseRatioX={mouseRatioX} mouseRatioY={mouseRatioY} />
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isPasswordVisible ? -5 : isLookingTowardForm ? 4 : undefined} forceLookY={isPasswordVisible ? -4 : isLookingTowardForm ? -2 : undefined} isSad={isSad} mouseRatioX={mouseRatioX} mouseRatioY={mouseRatioY} />
        </div>
        <div
          className="absolute h-[4px] w-20 rounded-full bg-[#2D2D2D] transition-all duration-200 ease-out"
          style={{
            left: isPasswordVisible ? "10px" : `${40 + yellowPos.faceX + (isLookingTowardForm ? 8 : 0)}px`,
            top: isPasswordVisible ? "88px" : `${88 + yellowPos.faceY + (isLookingTowardForm ? -6 : 0)}px`,
            height: isSad ? "0px" : "4px",
            backgroundColor: isSad ? "transparent" : "#2D2D2D",
            borderTop: isSad ? "4px solid #2D2D2D" : "none",
            borderTopLeftRadius: isSad ? "999px" : undefined,
            borderTopRightRadius: isSad ? "999px" : undefined,
            borderBottomLeftRadius: isSad ? "0" : undefined,
            borderBottomRightRadius: isSad ? "0" : undefined,
            transform: isSad ? "rotate(4deg) scaleX(0.72) translateY(3px)" : undefined,
          }}
        />
          </div>
        </div>
      </div>
    </div>
  );
}

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ReactNode;
}

const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ text = "Button", icon, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-full border bg-white px-6 py-2 text-center font-semibold text-zinc-900 transition-colors",
          className,
        )}
        {...props}
      >
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {text}
        </span>
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-full bg-zinc-950 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span>{text}</span>
          {icon || <ArrowRight className="h-4 w-4" />}
        </div>
      </button>
    );
  },
);
InteractiveHoverButton.displayName = "InteractiveHoverButton";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0d0d0f] text-white">
      <div className="flex flex-col items-center gap-6">
        <div className="luma-spin">
          <span />
          <span />
          <span />
        </div>
        <p className="text-sm tracking-[0.24em] text-white/70 uppercase">Loading CareerCompass...</p>
      </div>
    </div>
  );
}

function DashboardScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img
              src="https://i.postimg.cc/nLrDYrHW/icon.png"
              alt="CareerCompass logo"
              className="h-10 w-10 rounded-xl bg-white/10 p-1"
            />
            <div>
              <p className="text-sm font-semibold tracking-wide">CareerCompass</p>
              <p className="text-xs text-white/55">Post-login demo page</p>
            </div>
          </div>
          <button onClick={onReset} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10">
            Back To Demo
          </button>
        </header>

        <main className="flex flex-1 items-center justify-center">
          <div className="max-w-3xl text-center">
            <p className="mb-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-emerald-200">
              Login transition complete
            </p>
            <h1 className="text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              The characters gave up and let you in.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65">
              This page is only here to complete the demo flow after the unified character exit animation.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function HomeScreen({ onOpenLogin }: { onOpenLogin: () => void }) {
  return (
    <div className="home-shell min-h-screen overflow-hidden bg-[#0d0d0f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(143,143,151,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(45deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img
              src="https://i.postimg.cc/nLrDYrHW/icon.png"
              alt="CareerCompass logo"
              className="h-10 w-10 rounded-xl bg-white/10 p-1"
            />
            <div>
              <p className="text-sm font-semibold tracking-wide">CareerCompass</p>
              <p className="text-xs text-white/55">Demo landing page</p>
            </div>
          </div>
          <InteractiveHoverButton
            text="Log in"
            onClick={onOpenLogin}
            className="h-11 min-w-[118px] border-white/15 bg-white text-sm"
          />
        </header>

        <main className="relative flex flex-1 flex-col justify-center py-20 lg:py-10">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="max-w-3xl">
              <p className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/70">
                AI career platform mock
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Start on a clean home screen.
                <span className="block text-white/55">Open the original login flow from the top right.</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
                This demo now mirrors the CareerCompass pattern more closely: a separate landing view, then a deliberate loading transition into the two-column login experience.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <InteractiveHoverButton text="Enter Login" onClick={onOpenLogin} className="h-12 min-w-[150px] border-white/15 bg-white" />
                <button className="h-12 rounded-full border border-white/10 px-6 text-sm font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white">
                  Explore Home
                </button>
              </div>
            </section>

            <section className="relative">
              <div className="absolute -left-8 top-8 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute right-0 top-1/3 h-40 w-40 rounded-full bg-white/8 blur-3xl" />
              <div className="home-card rounded-[32px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
                <div className="rounded-[28px] border border-white/10 bg-[#111214] p-6 shadow-2xl shadow-black/40">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/45">Preview</p>
                      <h2 className="mt-1 text-xl font-semibold">Login Stage</h2>
                    </div>
                    <div className="flex gap-2">
                      <span className="h-3 w-3 rounded-full bg-white/20" />
                      <span className="h-3 w-3 rounded-full bg-white/15" />
                      <span className="h-3 w-3 rounded-full bg-white/10" />
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,#d1d5db_0%,#6b7280_100%)] px-4 pt-10">
                    <AnimatedCharacters />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function LoginScreen({ onBack, onLoginComplete }: { onBack: () => void; onLoginComplete: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeField, setActiveField] = useState<"email" | "password" | null>(null);
  const [isEmailGlancing, setIsEmailGlancing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginIntent, setIsLoginIntent] = useState(false);
  const [isLoginHover, setIsLoginHover] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState("");

  const triggerEmailGlance = () => {
    setIsEmailGlancing(true);
    window.setTimeout(() => {
      setIsEmailGlancing(false);
    }, 800);
  };

  const triggerLoginIntent = () => {
    if (isLoginIntent) {
      return;
    }

    setIsLoginIntent(true);
    window.setTimeout(() => {
      setIsLoginIntent(false);
    }, 820);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@") || password.length < 6) {
      setError("Please enter a valid email and a password with at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setIsLoginIntent(false);
    setIsLoginHover(false);
    setIsLeaving(true);
    window.setTimeout(() => {
      onLoginComplete();
    }, 980);
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden grid lg:grid-cols-2 bg-[#fafafa] text-[#09090b] login-enter">
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 p-12 text-white">
        <div className="relative z-20 flex items-center justify-between">
          <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 text-lg font-semibold">
            <img
              src="https://i.postimg.cc/nLrDYrHW/icon.png"
              alt="CareerCompass logo"
              className="rounded-lg bg-white/10 p-1 backdrop-blur-sm"
              width={32}
              height={32}
            />
            <span>CareerCompass</span>
          </a>
          <button onClick={onBack} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/85 transition-colors hover:bg-white/10">
            Back
          </button>
        </div>

        <div className="relative z-20 flex h-[500px] items-end justify-center">
          <AnimatedCharacters
            isTyping={isTyping}
            showPassword={showPassword}
            passwordLength={password.length}
            activeField={activeField}
            isGlancingAtField={isEmailGlancing}
            isLoginIntent={isLoginHover}
            isLeaving={isLeaving}
          />
        </div>

        <div className="relative z-20 flex items-center gap-8 text-sm text-gray-200/85">
          <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
          <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute right-1/4 top-1/4 size-64 rounded-full bg-gray-400/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 rounded-full bg-gray-300/20 blur-3xl" />
      </div>

      <div className="flex items-center justify-center bg-[#fafafa] p-8">
        <div className="w-full max-w-[420px] login-form-enter">
          <div className="mb-12 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <img
                src="https://i.postimg.cc/nLrDYrHW/icon.png"
                alt="CareerCompass logo"
                className="rounded-md"
                width={32}
                height={32}
              />
              <span>CareerCompass</span>
            </div>
            <button onClick={onBack} className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100">
              Back
            </button>
          </div>

          <div className="mb-10 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-sm text-zinc-500">Please enter your details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => {
                    setIsTyping(true);
                    setActiveField("email");
                    triggerEmailGlance();
                  }}
                  onBlur={() => {
                    setIsTyping(false);
                    setActiveField(null);
                    setIsEmailGlancing(false);
                  }}
                  className="h-12 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm outline-none transition-colors focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => {
                    setIsTyping(true);
                    setActiveField("password");
                    setIsEmailGlancing(false);
                  }}
                  onBlur={() => {
                    setIsTyping(false);
                    setActiveField(null);
                    setIsEmailGlancing(false);
                  }}
                  className="h-12 w-full rounded-md border border-zinc-200 bg-white px-4 pr-11 text-sm outline-none transition-colors focus:border-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-900"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" />
                Remember for 30 days
              </label>
              <a href="#" className="text-sm font-medium text-zinc-900 hover:underline">Forgot password?</a>
            </div>

            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <InteractiveHoverButton
              type="submit"
              text={isLoading ? "Signing in..." : "Log in"}
              className="h-12 w-full border-zinc-200 bg-white text-base font-medium disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              onMouseEnter={() => {
                setIsLoginHover(true);
                triggerLoginIntent();
              }}
              onMouseLeave={() => setIsLoginHover(false)}
              onFocus={() => {
                setIsLoginHover(true);
                triggerLoginIntent();
              }}
              onBlur={() => setIsLoginHover(false)}
            />
          </form>

          <div className="mt-6">
            <InteractiveHoverButton
              type="button"
              text="Log in with Google"
              className="h-12 w-full border-zinc-200 bg-white text-base font-medium"
              icon={
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2C322.3 113.2 289.4 96 248 96c-88.8 0-160.1 71.9-160.1 160.1s71.3 160.1 160.1 160.1c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"
                  />
                </svg>
              }
            />
          </div>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Don&apos;t have an account? <a href="#" className="font-medium text-zinc-900 hover:underline">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("home");

  const openLogin = () => {
    setViewMode("loading");
    window.setTimeout(() => {
      setViewMode("login");
    }, 1150);
  };

  const goHome = () => {
    setViewMode("home");
  };

  if (viewMode === "loading") {
    return <LoadingScreen />;
  }

  if (viewMode === "login") {
    return <LoginScreen onBack={goHome} onLoginComplete={() => setViewMode("dashboard")} />;
  }

  if (viewMode === "dashboard") {
    return <DashboardScreen onReset={() => setViewMode("home")} />;
  }

  return <HomeScreen onOpenLogin={openLogin} />;
}
