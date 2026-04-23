import { nextTick } from './scheduler'; // Use the unified scheduler's nextTick
import { signal, Signal } from '../reactivity/signal'; // Keep reactivity imports
import { effect } from '../reactivity/effect';
import { onUnmounted } from './apiLifecycle';

export async function enter(el: HTMLElement, transitionClass: string) {
    el.classList.add(transitionClass + '-enter-from');
    el.classList.add(transitionClass + '-enter-active');
    
    await nextTick();
    
    el.classList.remove(transitionClass + '-enter-from');
    el.classList.add(transitionClass + '-enter-to');
    
    el.addEventListener('transitionend', () => {
        el.classList.remove(transitionClass + '-enter-active');
        el.classList.remove(transitionClass + '-enter-to');
    }, { once: true });
}

export async function leave(el: HTMLElement, transitionClass: string, done?: () => void) {
    return new Promise<void>(resolve => {
        el.classList.add(transitionClass + '-leave-from');
        el.classList.add(transitionClass + '-leave-active');
        
        nextTick(() => {
            el.classList.remove(transitionClass + '-leave-from');
            el.classList.add(transitionClass + '-leave-to');
        });

        el.addEventListener('transitionend', () => {
            if (done) done();
            resolve();
        }, { once: true });
    });
}

export type PlaybackDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

// --- Anime.js v4 inspired implementation ---

export interface AnimeParams {
    targets: string | HTMLElement | NodeList | HTMLElement[];
    duration?: number;
    delay?: number | ((el: any, i: number, l: number) => number);
    endDelay?: number | ((el: any, i: number, l: number) => number);
    easing?: string | ((t: number) => number);
    loop?: boolean | number;
    direction?: PlaybackDirection;
    autoplay?: boolean;
    update?: (anim: AnimationInstance) => void;
    complete?: () => void;
    [key: string]: any;
}

export interface AnimationInstance {
    play: () => void;
    pause: () => void;
    restart: () => void;
    reverse: () => void;
    seek: (time: number) => void;
    finished: Promise<void>;
    animations: Animation[];
    currentTime: number;
    duration: number;
    paused: boolean;
}

class Engine {
    private animations: Set<AnimationInstance> = new Set();
    private rafId: number | null = null;

    add(anim: AnimationInstance) {
        this.animations.add(anim);
        if (!this.rafId) this.tick();
    }

    remove(anim: AnimationInstance) {
        this.animations.delete(anim);
        if (this.animations.size === 0 && this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    private tick = () => {
        this.rafId = requestAnimationFrame(this.tick);
        // In a real engine, we would update time-based animations here if not using WAAPI directly.
        // Since we wrap WAAPI, this loop might be used for callbacks or custom tweening.
    };
}

/**
 * Cubic Bezier solver for JS-based easing.
 */
function bezier(x1: number, y1: number, x2: number, y2: number) {
    const cx = 3.0 * x1;
    const bx = 3.0 * (x2 - x1) - cx;
    const ax = 1.0 - cx - bx;
    const cy = 3.0 * y1;
    const by = 3.0 * (y2 - y1) - cy;
    const ay = 1.0 - cy - by;

    const getX = (t: number) => ((ax * t + bx) * t + cx) * t;
    const getY = (t: number) => ((ay * t + by) * t + cy) * t;

    return (x: number) => {
        if (x1 === y1 && x2 === y2) return x;
        // Newton-Raphson iteration to find t for a given x
        let t = x;
        for (let i = 0; i < 8; i++) {
            const currentX = getX(t) - x;
            if (Math.abs(currentX) < 1e-7) break;
            const derivative = (3.0 * ax * t + 2.0 * bx) * t + cx;
            if (Math.abs(derivative) < 1e-7) break;
            t -= currentX / derivative;
        }
        return getY(t);
    };
}

const presetEasings: Record<string, (t: number) => number> = {
    'linear': (t) => t,
    'ease': bezier(0.25, 0.1, 0.25, 1.0),
    'ease-in': bezier(0.42, 0.0, 1.0, 1.0),
    'ease-out': bezier(0.0, 0.0, 0.58, 1.0),
    'ease-in-out': bezier(0.42, 0.0, 0.58, 1.0)
};

/**
 * Parses an easing string into a function. 
 * Supports cubic-bezier(x1, y1, x2, y2) and standard keywords.
 */
function parseEasing(easing: string | ((t: number) => number)): (t: number) => number {
    if (typeof easing === 'function') return easing;
    if (presetEasings[easing]) return presetEasings[easing];
    
    if (easing.startsWith('cubic-bezier')) {
        const parts = easing.match(/cubic-bezier\(([^)]+)\)/);
        if (parts) {
            const [x1, y1, x2, y2] = parts[1].split(',').map(v => parseFloat(v.trim()));
            return bezier(x1, y1, x2, y2);
        }
    }
    
    return presetEasings['linear'];
}

/**
 * Internal helper to convert HSL color values to RGB.
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns [r, g, b] (0-255)
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}

/**
 * Internal helper to parse hex and rgb/rgba color strings into numeric arrays.
 * Now also supports HSL/HSLA and converts them to RGBA.
 */
function parseColor(color: string): number[] {
    if (color.startsWith('#')) {
        let h = color.slice(1);
        if (h.length === 3) h = h.split('').map(s => s + s).join('');
        return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
    }
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) return [parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3]), rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1];
    const hslaMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
    if (hslaMatch) {
        const h = parseInt(hslaMatch[1]);
        const s = parseInt(hslaMatch[2]);
        const l = parseInt(hslaMatch[3]);
        const a = hslaMatch[4] ? parseFloat(hslaMatch[4]) : 1;
        const [r, g, b] = hslToRgb(h, s, l);
        return [r, g, b, a];
    }
    return [0, 0, 0, 1]; // Default to black if parsing fails
}

function interpolateColor(from: string, to: string, t: number): string {
    const c1 = parseColor(from);
    const c2 = parseColor(to);
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
    const a = c1[3] + (c2[3] - c1[3]) * t;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function getUnit(val: string | number): string {
    if (typeof val === 'number') return '';
    const split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
    return split ? (split[1] || '') : '';
}

function getCSSValue(el: HTMLElement, prop: string): string {
    const uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    return getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
}

function getRelativeValue(to: string, from: number): string | number {
    const operator = /^(\*=|\+=|-=)/.exec(to);
    if (!operator) return to;
    const u = getUnit(to);
    const x = from;
    const y = parseFloat(to.replace(operator[0], ''));
    switch (operator[0][0]) {
        case '+': return x + y + u;
        case '-': return x - y + u;
        case '*': return x * y + u;
        default: return to;
    }
}

const engine = new Engine();

export function animate(params: AnimeParams) {
    const {
        targets,
        duration = 1000,
        delay = 0,
        endDelay = 0,
        easing = 'linear',
        loop = false,
        direction = 'normal',
        autoplay = true,
        update,
        complete,
        ...properties
    } = params;

    const elements = getTargets(targets);
    const animations: Animation[] = [];
    
    let maxDuration = 0;

    elements.forEach((el, i) => {
        const keyframes = formatKeyframes(el, properties);
        const delayVal = typeof delay === 'function' 
            ? delay(el, i, elements.length) 
            : delay;
        
        const endDelayVal = typeof endDelay === 'function'
            ? endDelay(el, i, elements.length)
            : endDelay;

        const totalDuration = delayVal + duration + endDelayVal;
        if (totalDuration > maxDuration) maxDuration = totalDuration;

        const waapiOptions: KeyframeAnimationOptions = {
            duration,
            delay: delayVal,
            endDelay: endDelayVal,
            easing: typeof easing === 'string' ? easing : 'linear',
            iterations: loop === true ? Infinity : (typeof loop === 'number' ? loop : 1),
            direction,
            fill: 'forwards'
        };

        const animation = el.animate(keyframes, waapiOptions);
        if (!autoplay) animation.pause();
        animations.push(animation);
    });

    const finished = Promise.all(animations.map(a => a.finished));
    
    if (complete) {
        finished.then(() => complete()).catch(() => {}); // Catch cancel errors
    }

    const instance: AnimationInstance = {
        animations,
        finished: finished as unknown as Promise<void>,
        duration: maxDuration,
        get currentTime() {
            return animations[0]?.currentTime as number || 0;
        },
        set currentTime(t: number) {
            animations.forEach(a => a.currentTime = t);
        },
        get paused() {
            return animations[0]?.playState === 'paused';
        },
        play: () => {
            animations.forEach(a => a.play());
            engine.add(instance);
        },
        pause: () => {
            animations.forEach(a => a.pause());
            engine.remove(instance);
        },
        restart: () => {
            animations.forEach(a => { a.cancel(); a.play(); });
            engine.add(instance);
        },
        reverse: () => animations.forEach(a => a.reverse()),
        seek: (time: number) => {
            animations.forEach(a => a.currentTime = time);
        }
    };

    if (autoplay) engine.add(instance);

    return instance;
}

export class Timeline {
    private _duration = 0;
    private _animations: AnimationInstance[] = [];

    add(params: AnimeParams, offset?: number | string) {
        // Simple offset handling (absolute or relative)
        let startTime = this._duration;
        if (typeof offset === 'number') {
            startTime = offset;
        } else if (typeof offset === 'string' && offset.startsWith('-=')) {
            startTime -= parseFloat(offset.slice(2));
        }

        const anim = animate({ ...params, delay: (params.delay as number || 0) + startTime, autoplay: false });
        this._animations.push(anim);
        this._duration = Math.max(this._duration, startTime + anim.duration);
        return this;
    }

    play() {
        this._animations.forEach(a => a.play());
    }

    pause() {
        this._animations.forEach(a => a.pause());
    }
}

/**
 * Advanced stagger helper inspired by Anime.js v3.
 * Supports ranges [start, end] and directions.
 */
export function stagger(val: number | [number, number], options: { start?: number, direction?: 'normal' | 'reverse' } = {}) {
    const { start = 0, direction = 'normal' } = options;
    return (_el: any, i: number, total: number) => {
        const isRange = Array.isArray(val);
        const v1 = isRange ? val[0] : (val as number);
        const v2 = isRange ? val[1] : 0;
        let progress = total > 1 ? i / (total - 1) : 0;
        if (direction === 'reverse') progress = 1 - progress;
        return start + (v1 + (progress * (v2 - v1)));
    };
}

const ANIMATION_KEY = Symbol('c-animate');

export function cAnimate(el: HTMLElement, value: any) {
    const options = typeof value === 'function' ? value() : value;
    if (!options) return;

    // Cleanup previous animations to prevent conflicts during updates
    if ((el as any)[ANIMATION_KEY]) {
        (el as any)[ANIMATION_KEY].forEach((anim: Animation) => anim.cancel());
    }

    const animOptions = { ...options };

    // Resolve targets: String selector -> Children; Missing -> Self
    if (typeof animOptions.targets === 'string') {
        const children = el.querySelectorAll(animOptions.targets);
        animOptions.targets = Array.from(children) as HTMLElement[];
    } else if (!animOptions.targets) {
        animOptions.targets = el;
    }

    // Run animation and store reference for cleanup
    const { animations } = animate(animOptions);
    (el as any)[ANIMATION_KEY] = animations;
}

function getTargets(targets: any): HTMLElement[] {
    if (typeof targets === 'string') return Array.from(document.querySelectorAll(targets)) as HTMLElement[];
    if (targets instanceof HTMLElement) return [targets];
    if (targets instanceof NodeList) return Array.from(targets) as HTMLElement[];
    if (Array.isArray(targets)) return targets;
    return [];
}

/**
 * Formats properties into WAAPI-compatible keyframes, resolving relative values and units.
 *
 * Supports [from, to] array syntax for values.
 */
function formatKeyframes(el: HTMLElement, props: any): Keyframe[] | PropertyIndexedKeyframes {
    // const transforms: string[] = [];
    // const cssProps: any = {};
    const fromFrame: any = {};
    const toFrame: any = {};
    const fromTransforms: string[] = [];
    const toTransforms: string[] = [];

    const transformKeys = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'translate', 'matrix'];
    // CSS properties that are unitless
    const unitlessKeys = ['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'flexGrow', 'flexShrink', 'order'];
  const processValue = (key: string, val: any, isTo: boolean, currentBase?: number) => {
        let result = val;

        // Support color arrays [r, g, b, a?] like Anime v3 by converting to CSS strings
        if (Array.isArray(result) && (result.length === 3 || result.length === 4)) {
            return `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${result[3] ?? 1})`;
        }

        // Handle Relative Values (e.g., '+=100')
        if (typeof result === 'string' && /^(\*=|\+=|-=)/.test(result)) {
            const base = currentBase ?? parseFloat(getCSSValue(el, key) || '0'); // Ensure a numeric base
            result = getRelativeValue(result, base);
        }

        // Handle Units
        if (typeof result === 'number') {
            if (transformKeys.includes(key)) {
                if (key.startsWith('translate') || key.startsWith('perspective') || key.startsWith('skew')) result = result + 'px';
                if (key.startsWith('rotate') || key.startsWith('skew')) result = result + 'deg';
            } else if (!unitlessKeys.includes(key)) {
                result = result + 'px';
            }
        }
        return result;
    };

    for (const key in props) {
        let val: any = props[key];
        const isArray = Array.isArray(val);
        const fromVal = isArray ? val[0] : null;
        const toVal = isArray ? val[1] : val;


   
           const currentCSS = parseFloat(getCSSValue(el, key));

  



        if (transformKeys.includes(key)) {
           
             if (isArray) {
                fromTransforms.push(`${key}(${processValue(key, fromVal, false, currentCSS)})`);
            }
           toTransforms.push(`${key}(${processValue(key, toVal, true, currentCSS)})`);
   
        } else {
          
           if (isArray) {
                fromFrame[key] = processValue(key, fromVal, false, currentCSS);
            }
          toFrame[key] = processValue(key, toVal, true, currentCSS);
   
        }
    }

    if (toTransforms.length > 0) {
        toFrame.transform = toTransforms.join(' ');
        if (fromTransforms.length > 0) {
            fromFrame.transform = fromTransforms.join(' ');
        }
    }

    if (Object.keys(fromFrame).length > 0) {
        return [fromFrame, toFrame];
    }

    return [toFrame];
}

export function useTransition(el: HTMLElement, name: string) {
    return {
        enter: () => enter(el, name),
        leave: () => leave(el, name)
    };
}

export interface SpringOptions {
    stiffness?: number;
    damping?: number;
    mass?: number;
    precision?: number;
}

export function useSpring(source: Signal<number>, options: SpringOptions = {}) {
    const current = signal(source.value);
    
    const {
        stiffness = 170,
        damping = 26,
        mass = 1,
        precision = 0.01
    } = options;

    let velocity = 0;
    let targetVal = source.value;
    let running = false;
    let lastTime = 0;

    const loop = (time: number) => {
        if (!running) return;
        if (!lastTime) lastTime = time;
        
        // Cap delta time to prevent instability on lag spikes
        const delta = Math.min((time - lastTime) / 1000, 0.064); 
        lastTime = time;

        const displacement = current.value - targetVal;
        const springForce = -stiffness * displacement;
        const dampingForce = -damping * velocity;
        const acceleration = (springForce + dampingForce) / mass;

        velocity += acceleration * delta;
        current.value += velocity * delta;

        if (Math.abs(velocity) < precision && Math.abs(current.value - targetVal) < precision) {
            current.value = targetVal;
            running = false;
            velocity = 0;
        } else {
            requestAnimationFrame(loop);
        }
    };

    effect(() => {
        targetVal = source.value;
        if (!running) {
            running = true;
            lastTime = 0;
            requestAnimationFrame(loop);
        }
    });

    return current;
}

export function useMotion(
    target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: number | KeyframeAnimationOptions = {}
) {
    const animation = signal<Animation | null>(null);
    let currentAnim: Animation | null = null;

    effect(() => {
        let el: HTMLElement | null = null;
        if (typeof target === 'function') el = target();
        else if (target && 'value' in target) el = (target as Signal<HTMLElement | null>).value;
        else el = target as HTMLElement;

        if (currentAnim) currentAnim.cancel();

        if (el) {
            const anim = el.animate(keyframes, options);
            currentAnim = anim;
            animation.value = anim;
        } else {
            currentAnim = null;
            animation.value = null;
        }
    });

    onUnmounted(() => {
        if (currentAnim) currentAnim.cancel();
    });

    return {
        animation,
        play: () => animation.value?.play(),
        pause: () => animation.value?.pause(),
        reverse: () => animation.value?.reverse(),
        finish: () => animation.value?.finish(),
        cancel: () => animation.value?.cancel()
    };
}

export function useFrame(fn: (deltaTime: number) => void) {
    let running = true;
    let lastTime = performance.now();

    const loop = (time: number) => {
        if (!running) return;
        const delta = time - lastTime;
        lastTime = time;
        fn(delta);
        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    onUnmounted(() => {
        running = false;
    });
}

export function useTween<T extends number | string>(source: Signal<T>, options: { duration?: number, easing?: string | ((t: number) => number) } = {}) {
    const current = signal<T>(source.value);
    const { duration = 500 } = options;
    const easeFn = parseEasing(options.easing || 'ease-out'); // Default to ease-out (cubic-bezier preset)

    let startVal = source.value as any;
    let endVal = source.value as any;
    let startTime = 0;
    let running = false;

    const loop = (time: number) => {
        if (!running) return;
        if (!startTime) startTime = time;
        
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeFn(progress);

        if (typeof startVal === 'number' && typeof endVal === 'number') {
            current.value = (startVal + (endVal - startVal) * ease) as any;
        } else if (typeof startVal === 'string' && typeof endVal === 'string') {
            // Automatically detect and interpolate color strings
            current.value = interpolateColor(startVal, endVal, ease) as any;
        }

        if (progress < 1) {
            requestAnimationFrame(loop);
        } else {
            running = false;
        }
    };

    effect(() => {
        const newVal = source.value;
        if (newVal !== endVal) {
            startVal = current.value;
            endVal = newVal;
            startTime = 0;
            if (!running) {
                running = true;
                requestAnimationFrame(loop);
            }
        }
    });

    return current;
}