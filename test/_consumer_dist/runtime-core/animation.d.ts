import { Signal } from '../reactivity/signal';
export declare function enter(el: HTMLElement, transitionClass: string): Promise<void>;
export declare function leave(el: HTMLElement, transitionClass: string, done?: () => void): Promise<void>;
export type PlaybackDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
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
export declare function animate(params: AnimeParams): AnimationInstance;
export declare class Timeline {
    private _duration;
    private _animations;
    add(params: AnimeParams, offset?: number | string): this;
    play(): void;
    pause(): void;
}
/**
 * Advanced stagger helper inspired by Anime.js v3.
 * Supports ranges [start, end] and directions.
 */
export declare function stagger(val: number | [number, number], options?: {
    start?: number;
    direction?: 'normal' | 'reverse';
}): (_el: any, i: number, total: number) => number;
export declare function cAnimate(el: HTMLElement, value: any): void;
export declare function useTransition(el: HTMLElement, name: string): {
    enter: () => Promise<void>;
    leave: () => Promise<void>;
};
export interface SpringOptions {
    stiffness?: number;
    damping?: number;
    mass?: number;
    precision?: number;
}
export declare function useSpring(source: Signal<number>, options?: SpringOptions): Signal<number>;
export declare function useMotion(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>, keyframes: Keyframe[] | PropertyIndexedKeyframes, options?: number | KeyframeAnimationOptions): {
    animation: Signal<Animation | null>;
    play: () => void | undefined;
    pause: () => void | undefined;
    reverse: () => void | undefined;
    finish: () => void | undefined;
    cancel: () => void | undefined;
};
export declare function useFrame(fn: (deltaTime: number) => void): void;
export declare function useTween<T extends number | string>(source: Signal<T>, options?: {
    duration?: number;
    easing?: string | ((t: number) => number);
}): Signal<T>;
//# sourceMappingURL=animation.d.ts.map