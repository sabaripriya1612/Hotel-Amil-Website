"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";

export type EquirectHandle = {
  /** Magnify the view. factor > 1 narrows the field of view (zooms in). */
  zoom: (factor: number) => void;
  /** Return the camera to the default forward-facing position. */
  reset: () => void;
};

const DEG = Math.PI / 180;
const MIN_FOV = 30 * DEG;
const MAX_FOV = 95 * DEG;
const INITIAL_FOV = 75 * DEG;
const MAX_PITCH = 85 * DEG;

const VERT_SHADER = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

/* Equirectangular (2:1 panorama) -> perspective projection, computed per fragment.
   Screen ray -> yaw/pitch rotation -> longitude/latitude -> texture lookup. */
const FRAG_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uYaw;
uniform float uPitch;
uniform float uTanFov;

const float PI = 3.141592653589793;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float aspect = uRes.x / uRes.y;
  vec3 dir = normalize(vec3(p.x * aspect * uTanFov, p.y * uTanFov, -1.0));

  // Pitch (look up/down)
  float cp = cos(uPitch);
  float sp = sin(uPitch);
  dir = vec3(dir.x, dir.y * cp - dir.z * sp, dir.y * sp + dir.z * cp);

  // Yaw (look left/right)
  float cy = cos(uYaw);
  float sy = sin(uYaw);
  dir = vec3(dir.x * cy + dir.z * sy, dir.y, -dir.x * sy + dir.z * cy);

  float lon = atan(dir.x, -dir.z);
  float lat = asin(clamp(dir.y, -1.0, 1.0));
  vec2 uv = vec2(0.5 + lon / (2.0 * PI), 0.5 - lat / PI);

  gl_FragColor = texture2D(uTex, uv);
}
`;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/**
 * True spherical 360° viewer for equirectangular panoramas (2:1 images
 * produced by 360° cameras). Renders with raw WebGL — no extra dependencies.
 * Drag to look around (including up/down), scroll or pinch to zoom.
 */
export function EquirectViewer({
  url,
  className,
  ref: handleRef,
}: {
  url: string;
  className?: string;
  ref?: React.Ref<EquirectHandle>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Camera state lives in refs: mutated every pointer move, drawn on demand via RAF.
  const camera = useRef({ yaw: 0, pitch: 0, fov: INITIAL_FOV });
  const api = useRef<{ draw: () => void } | null>(null);

  useImperativeHandle(handleRef, () => ({
    zoom(factor) {
      const c = camera.current;
      c.fov = clamp(2 * Math.atan(Math.tan(c.fov / 2) / factor), MIN_FOV, MAX_FOV);
      api.current?.draw();
    },
    reset() {
      camera.current = { yaw: 0, pitch: 0, fov: INITIAL_FOV };
      api.current?.draw();
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl2", { antialias: false }) ??
      (canvas.getContext("webgl", { antialias: false }) as WebGLRenderingContext | null);
    if (!gl) {
      setStatus("error");
      return;
    }
    const isGL2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;

    // ---- Program ----
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT_SHADER));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setStatus("error");
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uYaw = gl.getUniformLocation(program, "uYaw");
    const uPitch = gl.getUniformLocation(program, "uPitch");
    const uTanFov = gl.getUniformLocation(program, "uTanFov");

    // ---- Draw on demand (one frame per animation frame when dirty) ----
    let raf = 0;
    const draw = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const c = camera.current;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uYaw, c.yaw);
        gl.uniform1f(uPitch, c.pitch);
        gl.uniform1f(uTanFov, Math.tan(c.fov / 2));
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      });
    };

    // ---- Canvas sizing (device-pixel-ratio aware) ----
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ---- Texture ----
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Sensible defaults while the panorama loads (1px mid grey).
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([60, 40, 44]));

    let disposed = false;
    const image = new window.Image();
    image.onload = () => {
      if (disposed || !texture) return;
      // Downscale panoramas that exceed this GPU's maximum texture size.
      const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      const targetW = Math.min(image.naturalWidth, maxTex, 8192);
      let source: TexImageSource = image;
      if (targetW < image.naturalWidth) {
        const scale = targetW / image.naturalWidth;
        const c = document.createElement("canvas");
        c.width = Math.round(image.naturalWidth * scale);
        c.height = Math.round(image.naturalHeight * scale);
        c.getContext("2d")?.drawImage(image, 0, 0, c.width, c.height);
        source = c;
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

      const isPOT = (v: number) => (v & (v - 1)) === 0;
      const dims = "width" in source ? (source as HTMLImageElement | HTMLCanvasElement).width : 0;
      const canMipmap = isGL2 || isPOT(dims);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (canMipmap) {
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
      setStatus("ready");
      draw();
    };
    image.onerror = () => {
      if (!disposed) setStatus("error");
    };
    image.src = url;

    // ---- Interaction: drag to look, pinch/scroll to zoom ----
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDist = 0;

    const onPointerDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try {
        canvas.setPointerCapture?.(e.pointerId);
      } catch {
        // Pointer may already be released; dragging still works without capture.
      }
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      if (pointers.size === 1) {
        const c = camera.current;
        const sensitivity = c.fov / Math.max(1, canvas.clientHeight);
        c.yaw += (e.clientX - prev.x) * sensitivity;
        c.pitch = clamp(c.pitch + (e.clientY - prev.y) * sensitivity, -MAX_PITCH, MAX_PITCH);
        if (Math.abs(c.yaw) > 2 * Math.PI) c.yaw %= 2 * Math.PI;
        draw();
      } else if (pointers.size === 2) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist > 0 && dist > 0) {
          const c = camera.current;
          c.fov = clamp(2 * Math.atan(Math.tan(c.fov / 2) * (pinchDist / dist)), MIN_FOV, MAX_FOV);
          draw();
        }
        pinchDist = dist;
        return;
      }
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };
    const onPointerEnd = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchDist = 0;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const c = camera.current;
      c.fov = clamp(2 * Math.atan(Math.tan(c.fov / 2) * Math.exp(e.deltaY * 0.0012)), MIN_FOV, MAX_FOV);
      draw();
    };
    // Keyboard support (canvas is focusable): arrows look around, +/- zoom.
    const onKeyDown = (e: KeyboardEvent) => {
      const c = camera.current;
      const step = 6 * DEG;
      switch (e.key) {
        case "ArrowLeft":
          c.yaw -= step;
          break;
        case "ArrowRight":
          c.yaw += step;
          break;
        case "ArrowUp":
          c.pitch = clamp(c.pitch + step, -MAX_PITCH, MAX_PITCH);
          break;
        case "ArrowDown":
          c.pitch = clamp(c.pitch - step, -MAX_PITCH, MAX_PITCH);
          break;
        case "+":
        case "=":
          c.fov = clamp(2 * Math.atan(Math.tan(c.fov / 2) / 1.15), MIN_FOV, MAX_FOV);
          break;
        case "-":
          c.fov = clamp(2 * Math.atan(Math.tan(c.fov / 2) * 1.15), MIN_FOV, MAX_FOV);
          break;
        default:
          return;
      }
      e.preventDefault();
      draw();
    };
    const onContextLost = (e: Event) => e.preventDefault();
    const onContextRestored = () => draw();

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerEnd);
    canvas.addEventListener("pointercancel", onPointerEnd);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    api.current = { draw };

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerEnd);
      canvas.removeEventListener("pointercancel", onPointerEnd);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      api.current = null;
    };
  }, [url]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="img"
        aria-label="Interactive 360 degree panorama — drag to look around, scroll to zoom"
        className="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ display: status === "error" ? "none" : "block" }}
      />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white/80">
          Loading 360° panorama…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/80">
          The 360° panorama could not be loaded on this device. Please enjoy the regular photos below.
        </div>
      )}
    </div>
  );
}
