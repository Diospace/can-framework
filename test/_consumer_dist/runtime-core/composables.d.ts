import type { Signal } from '../reactivity/signal';
import { AnimeParams, AnimationInstance } from './animation';
export declare function useEventListener(target: EventTarget, event: string, callback: EventListenerOrEventListenerObject): void;
export declare function useAsyncState<T>(promise: Promise<T>, initialState: T): {
    state: Signal<T>;
    isReady: Signal<boolean>;
    isLoading: Signal<boolean>;
    error: Signal<any>;
};
export declare function useId(): string;
export declare function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): readonly [Signal<S>, (action: A) => void];
export declare function useToggle(initialValue?: boolean): readonly [Signal<boolean>, () => boolean];
export declare function useLocalStorage<T>(key: string, initialValue: T): Signal<T>;
export declare function useTitle(initialTitle?: string): Signal<string>;
export declare function useWindowSize(): {
    width: Signal<number>;
    height: Signal<number>;
};
/**
 * Composable for orchestrating animations using the internal engine.
 * Automatically cancels animation on component unmount to prevent leaks.
 */
export declare function useAnimate(params: AnimeParams): AnimationInstance;
export declare function useInterval(fn: () => void, delay: number): void;
export declare function useTimeout(fn: () => void, delay: number): void;
export declare function useFetch<T>(url: string, options?: RequestInit): {
    data: Signal<T | null>;
    error: Signal<any>;
    isFetching: Signal<boolean>;
    execute: () => Promise<void>;
};
export declare function useOnClickOutside(target: HTMLElement | (() => HTMLElement | null), handler: (event: Event) => void): void;
export declare function useMediaQuery(query: string): Signal<boolean>;
export declare function useDebounce<T>(value: Signal<T>, delay: number): Signal<T>;
export declare function useThrottle<T>(value: Signal<T>, duration: number): Signal<T>;
export declare function useClipboard(): {
    text: Signal<string>;
    copy: (txt: string) => Promise<void>;
    isSupported: boolean;
};
export declare function useOnline(): Signal<boolean>;
export declare function useDocumentVisibility(): Signal<DocumentVisibilityState>;
export declare function useCssVar(prop: string, target?: HTMLElement | (() => HTMLElement | null)): Signal<string>;
export declare function useMouse(): {
    x: Signal<number>;
    y: Signal<number>;
};
export declare function usePreferredDark(): any;
export declare function useScriptTag(src: string): {
    isLoading: Signal<boolean>;
    error: Signal<boolean>;
};
export declare function useFavicon(href: string | Signal<string>): void;
export declare function useFocus(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>): {
    focused: Signal<boolean>;
};
export declare function useHover(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>): {
    isHovered: Signal<boolean>;
};
export declare function useGeolocation(options?: PositionOptions): {
    coords: Signal<{
        latitude: number;
        longitude: number;
        accuracy: number;
        altitude: number | null;
        altitudeAccuracy: number | null;
        heading: number | null;
        speed: number | null;
    }>;
    locatedAt: Signal<number | null>;
    error: Signal<GeolocationPositionError | null>;
};
export declare function useKeyModifier(key: string): Signal<boolean>;
export declare function useDraggable(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>): {
    x: Signal<number>;
    y: Signal<number>;
    isDragging: Signal<boolean>;
};
export declare function useDropZone(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>, onDrop: (files: File[] | null) => void): {
    isOverDropZone: Signal<boolean>;
};
export declare function useVirtualList<T>(list: Signal<T[]>, options: {
    itemHeight: number;
    containerHeight: number | Signal<number>;
    overscan?: number;
}): any;
export declare function useMutationObserver(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>, callback: MutationCallback, options?: MutationObserverInit): void;
export declare function useIdle(timeout?: number): {
    idle: Signal<boolean>;
    lastActive: Signal<number>;
};
export declare function useShare(): {
    share: (data: ShareData) => Promise<boolean>;
    isSupported: boolean;
};
export declare function useFullscreen(target?: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>): {
    isFullscreen: Signal<boolean>;
    enter: () => Promise<void>;
    exit: () => Promise<void>;
    toggle: () => Promise<void>;
};
export declare function useScroll(target?: HTMLElement | (() => HTMLElement | null)): {
    x: Signal<number>;
    y: Signal<number>;
};
export declare function useIntersectionObserver(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>, options?: IntersectionObserverInit): {
    isIntersecting: Signal<boolean>;
};
export declare function useElementSize(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>): {
    width: Signal<number>;
    height: Signal<number>;
};
export declare function useSpeechRecognition(options?: {
    lang?: string;
    continuous?: boolean;
    interimResults?: boolean;
}): {
    isListening: Signal<boolean>;
    result: Signal<string>;
    error: Signal<any>;
    start: () => void;
    stop: () => void;
    isSupported: boolean;
};
export declare function useNetwork(): Signal<{
    online: boolean;
    saveData: any;
    downlink: any;
    effectiveType: any;
    rtt: any;
}>;
export declare function useFps(): Signal<number>;
export declare function useMemory(): {
    memory: Signal<{
        jsHeapSizeLimit: number;
        totalJSHeapSize: number;
        usedJSHeapSize: number;
    } | null>;
    isSupported: boolean;
};
export declare function useBattery(): {
    battery: Signal<{
        charging: boolean;
        chargingTime: number;
        dischargingTime: number;
        level: number;
    }>;
    isSupported: boolean;
};
export declare function useWakeLock(): {
    isActive: Signal<boolean>;
    request: () => Promise<void>;
    release: () => Promise<void>;
    isSupported: boolean;
};
export declare function useCarousel(count: number | Signal<number>, options?: {
    autoplay?: boolean;
    interval?: number;
    loop?: boolean;
}): {
    index: Signal<number>;
    next: () => void;
    prev: () => void;
    goTo: (i: number) => void;
    pause: () => void;
    resume: () => void;
};
export declare function useSwipe(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>, options?: {
    threshold?: number;
}): {
    direction: Signal<"left" | "right" | "up" | "down" | null>;
    isSwiping: Signal<boolean>;
};
export declare function useWebP(): Signal<boolean>;
export declare function useParallax(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>): {
    tilt: Signal<number>;
    roll: Signal<number>;
    source: Signal<{
        x: number;
        y: number;
    }>;
};
export declare function useSound(src: string, options?: {
    volume?: number;
    loop?: boolean;
}): {
    play: () => void;
    pause: () => void | undefined;
    stop: () => void;
    isPlaying: Signal<boolean>;
};
//# sourceMappingURL=composables.d.ts.map