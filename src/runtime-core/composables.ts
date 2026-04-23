import { onUnmounted } from './apiLifecycle';
import { signal, shallowSignal, isSignal } from '../reactivity/signal';
import { effect } from '../reactivity/effect';
import { computed } from '../reactivity/computed';
import type { Signal } from '../reactivity/signal';
import { animate, AnimeParams, AnimationInstance } from './animation';

export function useEventListener(target: EventTarget, event: string, callback: EventListenerOrEventListenerObject) {
    target.addEventListener(event, callback);
    
    onUnmounted(() => {
        target.removeEventListener(event, callback);
    });
}

export function useAsyncState<T>(promise: Promise<T>, initialState: T) {
    const state = shallowSignal(initialState);
    const isReady = signal(false);
    const isLoading = signal(true);
    const error = signal<any>(null);

    promise
        .then((data) => {
            state.value = data;
            isReady.value = true;
        })
        .catch((e) => {
            error.value = e;
        })
        .finally(() => {
            isLoading.value = false;
        });

    return { state, isReady, isLoading, error };
}

let idCounter = 0;
export function useId() {
    return `can-id-${idCounter++}`;
}

export function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S) {
    const state = signal(initialState);
    const dispatch = (action: A) => {
        state.value = reducer(state.value, action);
    };
    return [state, dispatch] as const;
}

export function useToggle(initialValue: boolean = false) {
    const value = signal(initialValue);
    const toggle = () => value.value = !value.value;
    return [value, toggle] as const;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
    // Check for window to support SSR
    const storage = typeof window !== 'undefined' ? window.localStorage : null;
    const stored = storage ? storage.getItem(key) : null;
    const data = signal<T>(stored ? JSON.parse(stored) : initialValue);

    if (storage) {
        effect(() => {
            storage.setItem(key, JSON.stringify(data.value));
        });
    }
    return data;
}

export function useTitle(initialTitle?: string) {
    const title = signal(initialTitle || (typeof document !== 'undefined' ? document.title : ''));
    
    if (typeof document !== 'undefined') {
        effect(() => {
            document.title = title.value;
        });
    }
    return title;
}

export function useWindowSize() {
    if (typeof window === 'undefined') {
        return { width: signal(0), height: signal(0) };
    }
    const width = signal(window.innerWidth);
    const height = signal(window.innerHeight);

    useEventListener(window, 'resize', () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
    });

    return { width, height };
}

/**
 * Composable for orchestrating animations using the internal engine.
 * Automatically cancels animation on component unmount to prevent leaks.
 */
export function useAnimate(params: AnimeParams): AnimationInstance {
    const instance = animate({
        ...params,
        autoplay: params.autoplay !== false
    });

    onUnmounted(() => {
        instance.animations.forEach(a => a.cancel());
    });

    return instance;
}

export function useInterval(fn: () => void, delay: number) {
    const id = setInterval(fn, delay);
    onUnmounted(() => clearInterval(id));
}

export function useTimeout(fn: () => void, delay: number) {
    const id = setTimeout(fn, delay);
    onUnmounted(() => clearTimeout(id));
}

export function useFetch<T>(url: string, options: RequestInit = {}) {
    const data = shallowSignal<T | null>(null);
    const error = signal<any>(null);
    const isFetching = signal(false);

    let controller: AbortController | null = null;

    const execute = async () => {
        isFetching.value = true;
        error.value = null;
        
        if (controller) controller.abort();
        if (typeof AbortController !== 'undefined') {
            controller = new AbortController();
        }

        try {
            const fetchOptions = { ...options, signal: controller?.signal };
            const res = await fetch(url, fetchOptions);
            if (!res.ok) throw new Error(res.statusText);
            data.value = await res.json();
        } catch (e: any) {
            if (e.name !== 'AbortError') {
                error.value = e;
            }
        } finally {
            isFetching.value = false;
        }
    };

    execute();

    onUnmounted(() => {
        if (controller) controller.abort();
    });

    return { data, error, isFetching, execute };
}

export function useOnClickOutside(target: HTMLElement | (() => HTMLElement | null), handler: (event: Event) => void) {
    useEventListener(window, 'click', (event) => {
        const el = typeof target === 'function' ? target() : target;
        if (!el || el === event.target || (event.composedPath && event.composedPath().includes(el))) {
            return;
        }
        handler(event);
    });
}

export function useMediaQuery(query: string) {
    const matches = signal(false);
    
    if (typeof window !== 'undefined' && window.matchMedia) {
        const media = window.matchMedia(query);
        matches.value = media.matches;
        
        const listener = () => matches.value = media.matches;
        media.addEventListener('change', listener);
        onUnmounted(() => media.removeEventListener('change', listener));
    }
    
    return matches;
}

export function useDebounce<T>(value: Signal<T>, delay: number): Signal<T> {
    const debounced = signal(value.value);
    let timeout: any;

    effect(() => {
        const val = value.value;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            debounced.value = val;
        }, delay);
    });

    onUnmounted(() => clearTimeout(timeout));

    return debounced;
}

export function useThrottle<T>(value: Signal<T>, duration: number): Signal<T> {
    const throttled = signal(value.value);
    let lastRun = 0;
    let timeout: any;

    effect(() => {
        const val = value.value;
        const now = Date.now();
        
        if (now - lastRun >= duration) {
            throttled.value = val;
            lastRun = now;
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                throttled.value = val;
                lastRun = Date.now();
            }, duration - (now - lastRun));
        }
    });

    onUnmounted(() => clearTimeout(timeout));

    return throttled;
}

export function useClipboard() {
    const text = signal('');
    const isSupported = typeof navigator !== 'undefined' && 'clipboard' in navigator;

    const copy = async (txt: string) => {
        if (!isSupported) return;
        try {
            await navigator.clipboard.writeText(txt);
            text.value = txt;
        } catch (e) {
            console.error('Clipboard copy failed', e);
        }
    };

    return { text, copy, isSupported };
}

export function useOnline() {
    const isOnline = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);
    
    if (typeof window !== 'undefined') {
        useEventListener(window, 'online', () => isOnline.value = true);
        useEventListener(window, 'offline', () => isOnline.value = false);
    }
    
    return isOnline;
}

export function useDocumentVisibility() {
    const visibility = signal(typeof document !== 'undefined' ? document.visibilityState : 'visible');

    if (typeof document !== 'undefined') {
        useEventListener(document, 'visibilitychange', () => {
            visibility.value = document.visibilityState;
        });
    }

    return visibility;
}

export function useCssVar(prop: string, target?: HTMLElement | (() => HTMLElement | null)) {
    const variable = signal('');
    
    const getEl = () => {
        if (!target) return typeof document !== 'undefined' ? document.documentElement : null;
        return typeof target === 'function' ? target() : target;
    };

    if (typeof window !== 'undefined') {
        const el = getEl();
        if (el) {
            variable.value = getComputedStyle(el).getPropertyValue(prop).trim();
        }
        
        effect(() => {
            const element = getEl();
            if (element) element.style.setProperty(prop, variable.value);
        });
    }

    return variable;
}

export function useMouse() {
    const x = signal(0);
    const y = signal(0);

    if (typeof window !== 'undefined') {
        useEventListener(window, 'mousemove', (e: any) => {
            x.value = e.pageX;
            y.value = e.pageY;
        });
    }

    return { x, y };
}

export function usePreferredDark(): any {
    const isDark = useMediaQuery('(prefers-color-scheme: dark)');
    return computed(() => isDark.value);
}

export function useScriptTag(src: string) {
    const isLoading = signal(true);
    const error = signal(false);
    
    if (typeof document !== 'undefined') {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => isLoading.value = false;
        script.onerror = () => {
            isLoading.value = false;
            error.value = true;
        };
        document.head.appendChild(script);
        
        onUnmounted(() => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        });
    }
    
    return { isLoading, error };
}

export function useFavicon(href: string | Signal<string>) {
    const url = isSignal(href) ? href : signal(href);
    
    if (typeof document !== 'undefined') {
        effect(() => {
            let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
            if (!link) {
                link = document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                document.head.appendChild(link);
            }
            link.href = url.value;
        });
    }
}

export function useFocus(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>) {
    const focused = signal(false);
    let cleanup: (() => void) | null = null;

    effect(() => {
        if (cleanup) cleanup();

        let el: HTMLElement | null;
        if (isSignal(target)) el = target.value;
        else if (typeof target === 'function') el = target();
        else el = target;

        if (el) {
            const onFocus = () => focused.value = true;
            const onBlur = () => focused.value = false;

            el.addEventListener('focus', onFocus);
            el.addEventListener('blur', onBlur);

            cleanup = () => {
                el!.removeEventListener('focus', onFocus);
                el!.removeEventListener('blur', onBlur);
            };
        }
    });

    onUnmounted(() => {
        if (cleanup) cleanup();
    });

    return { focused };
}

export function useHover(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>) {
    const isHovered = signal(false);
    let cleanup: (() => void) | null = null;

    effect(() => {
        if (cleanup) cleanup();
        
        let el: HTMLElement | null;
        if (isSignal(target)) el = target.value;
        else if (typeof target === 'function') el = target();
        else el = target;

        if (el) {
            const enter = () => isHovered.value = true;
            const leave = () => isHovered.value = false;
            
            el.addEventListener('mouseenter', enter);
            el.addEventListener('mouseleave', leave);
            
            cleanup = () => {
                el!.removeEventListener('mouseenter', enter);
                el!.removeEventListener('mouseleave', leave);
            };
        }
    });

    onUnmounted(() => {
        if (cleanup) cleanup();
    });

    return { isHovered };
}

export function useGeolocation(options: PositionOptions = {}) {
    const coords = signal({
        latitude: Infinity,
        longitude: Infinity,
        accuracy: 0,
        altitude: null as number | null,
        altitudeAccuracy: null as number | null,
        heading: null as number | null,
        speed: null as number | null
    });
    const locatedAt = signal<number | null>(null);
    const error = signal<GeolocationPositionError | null>(null);

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        const watcherId = navigator.geolocation.watchPosition(
            (position) => {
                locatedAt.value = position.timestamp;
                coords.value = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                    heading: position.coords.heading,
                    speed: position.coords.speed
                };
                error.value = null;
            },
            (err) => {
                error.value = err;
            },
            options
        );

        onUnmounted(() => navigator.geolocation.clearWatch(watcherId));
    }

    return { coords, locatedAt, error };
}

export function useKeyModifier(key: string) {
    const state = signal(false);
    if (typeof window !== 'undefined') {
        useEventListener(window, 'keydown', (e: any) => {
            if (e.key === key) state.value = true;
        });
        useEventListener(window, 'keyup', (e: any) => {
            if (e.key === key) state.value = false;
        });
    }
    return state;
}

export function useDraggable(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>) {
    const x = signal(0);
    const y = signal(0);
    const isDragging = signal(false);
    
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    if (typeof window !== 'undefined') {
        const onMove = (e: MouseEvent) => {
            if (!isDragging.value) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            x.value = initialX + dx;
            y.value = initialY + dy;
        };

        const onUp = () => {
            isDragging.value = false;
        };

        useEventListener(window, 'mousemove', onMove as any);
        useEventListener(window, 'mouseup', onUp);

        let cleanup: (() => void) | null = null;

        effect(() => {
            if (cleanup) cleanup();
            
            let el: HTMLElement | null;
            if (isSignal(target)) el = target.value;
            else if (typeof target === 'function') el = target();
            else el = target;

            if (el) {
                const onDown = (e: MouseEvent) => {
                    isDragging.value = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    initialX = x.value;
                    initialY = y.value;
                    e.preventDefault();
                };
                
                el.addEventListener('mousedown', onDown);
                
                cleanup = () => {
                    el!.removeEventListener('mousedown', onDown);
                };
            }
        });
        
        onUnmounted(() => {
            if (cleanup) cleanup();
        });
    }

    return { x, y, isDragging };
}

export function useDropZone(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>, onDrop: (files: File[] | null) => void) {
    const isOverDropZone = signal(false);
    let cleanup: (() => void) | null = null;

    effect(() => {
        if (cleanup) cleanup();
        
        let el: HTMLElement | null;
        if (isSignal(target)) el = target.value;
        else if (typeof target === 'function') el = target();
        else el = target;

        if (el) {
            const onDragOver = (e: DragEvent) => {
                e.preventDefault();
                isOverDropZone.value = true;
            };
            const onDragLeave = () => {
                isOverDropZone.value = false;
            };
            const onDropHandler = (e: DragEvent) => {
                e.preventDefault();
                isOverDropZone.value = false;
                const files = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : null;
                onDrop(files);
            };

            el.addEventListener('dragover', onDragOver);
            el.addEventListener('dragleave', onDragLeave);
            el.addEventListener('drop', onDropHandler);

            cleanup = () => {
                el!.removeEventListener('dragover', onDragOver);
                el!.removeEventListener('dragleave', onDragLeave);
                el!.removeEventListener('drop', onDropHandler);
            };
        }
    });

    onUnmounted(() => {
        if (cleanup) cleanup();
    });

    return { isOverDropZone };
}

export function useVirtualList<T>(
    list: Signal<T[]>,
    options: { itemHeight: number, containerHeight: number | Signal<number>, overscan?: number }
): any {
    const scrollTop = signal(0);
    const { itemHeight, overscan = 5 } = options;
    
    const containerH = isSignal(options.containerHeight) 
        ? options.containerHeight 
        : signal(options.containerHeight);

    const visibleItems = computed(() => {
        const items = list.value;
        const count = items.length;
        const visibleCount = Math.ceil(containerH.value / itemHeight);
        const start = Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan);
        const end = Math.min(count, Math.floor(scrollTop.value / itemHeight) + visibleCount + overscan);
        
        return items.slice(start, end).map((item, index) => ({
            item,
            index: start + index,
            style: `position: absolute; top: ${(start + index) * itemHeight}px; height: ${itemHeight}px; width: 100%;`
        }));
    });

    const totalHeight = computed(() => list.value.length * itemHeight);

    return { scrollTop, visibleItems, totalHeight };
}

export function useMutationObserver(
    target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>,
    callback: MutationCallback,
    options: MutationObserverInit = {}
) {
    let observer: MutationObserver | null = null;

    effect(() => {
        if (observer) observer.disconnect();

        let el: HTMLElement | null;
        if (isSignal(target)) el = target.value;
        else if (typeof target === 'function') el = target();
        else el = target;

        if (el) {
            observer = new MutationObserver(callback);
            observer.observe(el, options);
        }
    });

    onUnmounted(() => {
        if (observer) observer.disconnect();
    });
}

export function useIdle(timeout: number = 60000) {
    const idle = signal(false);
    const lastActive = signal(Date.now());
    let timer: any;

    const reset = () => {
        idle.value = false;
        lastActive.value = Date.now();
        clearTimeout(timer);
        timer = setTimeout(() => idle.value = true, timeout);
    };

    if (typeof window !== 'undefined') {
        const events = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];
        events.forEach(event => useEventListener(window, event, reset));
        useEventListener(document, 'visibilitychange', reset);
        
        reset();
    }
    
    onUnmounted(() => clearTimeout(timer));

    return { idle, lastActive };
}

export function useShare() {
    const isSupported = typeof navigator !== 'undefined' && 'share' in navigator;
    
    const share = async (data: ShareData) => {
        if (isSupported) {
            try {
                await navigator.share(data);
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    };

    return { share, isSupported };
}

export function useFullscreen(target?: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>) {
    const isFullscreen = signal(false);
    
    const getEl = () => {
        if (!target) return typeof document !== 'undefined' ? document.documentElement : null;
        if (isSignal(target)) return target.value;
        if (typeof target === 'function') return target();
        return target;
    };

    const enter = async () => {
        const el = getEl();
        if (el) await el.requestFullscreen();
    };

    const exit = async () => {
        if (document.fullscreenElement) await document.exitFullscreen();
    };

    const toggle = async () => {
        if (isFullscreen.value) await exit();
        else await enter();
    };

    if (typeof document !== 'undefined') {
        useEventListener(document, 'fullscreenchange', () => {
            const el = getEl();
            isFullscreen.value = document.fullscreenElement === el;
        });
    }

    return { isFullscreen, enter, exit, toggle };
}

export function useScroll(target?: HTMLElement | (() => HTMLElement | null)) {
    const x = signal(0);
    const y = signal(0);

    const getEl = () => {
        if (!target) return typeof window !== 'undefined' ? window : null;
        return typeof target === 'function' ? target() : target;
    };

    if (typeof window !== 'undefined') {
        const el = getEl();
        if (el) {
            const update = () => {
                if (el === window) {
                    x.value = window.scrollX;
                    y.value = window.scrollY;
                } else {
                    x.value = (el as HTMLElement).scrollLeft;
                    y.value = (el as HTMLElement).scrollTop;
                }
            };
            
            update();
            useEventListener(el, 'scroll', update);
        }
    }

    return { x, y };
}

export function useIntersectionObserver(
    target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>,
    options: IntersectionObserverInit = {}
) {
    const isIntersecting = signal(false);
    
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        let observer: IntersectionObserver;

        effect(() => {
            if (observer) observer.disconnect();
            
            let el: HTMLElement | null;
            if (isSignal(target)) el = target.value;
            else if (typeof target === 'function') el = target();
            else el = target;

            if (el) {
                observer = new IntersectionObserver((entries) => {
                    isIntersecting.value = entries[0].isIntersecting;
                }, options);
                observer.observe(el);
            }
        });

        onUnmounted(() => {
            if (observer) observer.disconnect();
        });
    }

    return { isIntersecting };
}

export function useElementSize(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>) {
    const width = signal(0);
    const height = signal(0);

    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
        let observer: ResizeObserver;

        effect(() => {
            if (observer) observer.disconnect();
            
            let el: HTMLElement | null;
            if (isSignal(target)) el = target.value;
            else if (typeof target === 'function') el = target();
            else el = target;

            if (el) {
                width.value = el.offsetWidth;
                height.value = el.offsetHeight;

                observer = new ResizeObserver((entries) => {
                    width.value = entries[0].contentRect.width;
                    height.value = entries[0].contentRect.height;
                });
                observer.observe(el);
            }
        });

        onUnmounted(() => {
            if (observer) observer.disconnect();
        });
    }

    return { width, height };
}

export function useSpeechRecognition(options: { lang?: string, continuous?: boolean, interimResults?: boolean } = {}) {
    const isListening = signal(false);
    const result = signal('');
    const error = signal<any>(null);

    let recognition: any = null;

    if (typeof window !== 'undefined') {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.lang = options.lang || 'en-US';
            recognition.continuous = options.continuous ?? false;
            recognition.interimResults = options.interimResults ?? true;

            recognition.onstart = () => isListening.value = true;
            recognition.onend = () => isListening.value = false;
            recognition.onerror = (e: any) => error.value = e;
            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((r: any) => r[0].transcript)
                    .join('');
                result.value = transcript;
            };
        }
    }

    const start = () => {
        if (recognition) {
            result.value = '';
            recognition.start();
        }
    };

    const stop = () => {
        if (recognition) recognition.stop();
    };

    return { isListening, result, error, start, stop, isSupported: !!recognition };
}

export function useNetwork() {
    const isSupported = typeof navigator !== 'undefined' && 'connection' in navigator;
    const connection = isSupported ? (navigator as any).connection : null;

    const state = signal({
        online: typeof navigator !== 'undefined' ? navigator.onLine : true,
        saveData: connection ? connection.saveData : false,
        downlink: connection ? connection.downlink : 0,
        effectiveType: connection ? connection.effectiveType : undefined,
        rtt: connection ? connection.rtt : 0
    });

    if (isSupported) {
        const update = () => {
            state.value = {
                online: navigator.onLine,
                saveData: connection.saveData,
                downlink: connection.downlink,
                effectiveType: connection.effectiveType,
                rtt: connection.rtt
            };
        };

        connection.addEventListener('change', update);
        window.addEventListener('online', update);
        window.addEventListener('offline', update);

        onUnmounted(() => {
            connection.removeEventListener('change', update);
            window.removeEventListener('online', update);
            window.removeEventListener('offline', update);
        });
    }

    return state;
}

export function useFps() {
    const fps = signal(0);
    
    if (typeof window !== 'undefined') {
        let lastTime = performance.now();
        let frames = 0;

        const loop = () => {
            const now = performance.now();
            frames++;
            if (now >= lastTime + 1000) {
                fps.value = Math.round((frames * 1000) / (now - lastTime));
                frames = 0;
                lastTime = now;
            }
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
    }

    return fps;
}

export function useMemory() {
    const memory = signal<{ jsHeapSizeLimit: number, totalJSHeapSize: number, usedJSHeapSize: number } | null>(null);
    const isSupported = typeof performance !== 'undefined' && 'memory' in performance;

    if (isSupported) {
        const update = () => {
            const { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } = (performance as any).memory;
            memory.value = {
                jsHeapSizeLimit,
                totalJSHeapSize,
                usedJSHeapSize
            };
        };
        
        useInterval(update, 1000);
        update();
    }

    return { memory, isSupported };
}

export function useBattery() {
    const battery = signal({
        charging: false,
        chargingTime: 0,
        dischargingTime: 0,
        level: 1
    });
    
    const isSupported = typeof navigator !== 'undefined' && 'getBattery' in navigator;

    if (isSupported) {
        (navigator as any).getBattery().then((bat: any) => {
            const update = () => {
                battery.value = {
                    charging: bat.charging,
                    chargingTime: bat.chargingTime,
                    dischargingTime: bat.dischargingTime,
                    level: bat.level
                };
            };
            
            bat.addEventListener('chargingchange', update);
            bat.addEventListener('chargingtimechange', update);
            bat.addEventListener('dischargingtimechange', update);
            bat.addEventListener('levelchange', update);
            
            update();
        });
    }

    return { battery, isSupported };
}

export function useWakeLock() {
    const isActive = signal(false);
    let sentinel: any = null;
    const isSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

    const request = async () => {
        if (!isSupported) return;
        try {
            sentinel = await (navigator as any).wakeLock.request('screen');
            isActive.value = true;
            sentinel.addEventListener('release', () => {
                isActive.value = false;
                sentinel = null;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const release = async () => {
        if (sentinel) {
            await sentinel.release();
            sentinel = null;
            isActive.value = false;
        }
    };

    return { isActive, request, release, isSupported };
}

export function useCarousel(count: number | Signal<number>, options: { autoplay?: boolean, interval?: number, loop?: boolean } = {}) {
    const index = signal(0);
    const { autoplay = false, interval = 3000, loop = true } = options;
    let timer: any = null;

    const getCount = () => isSignal(count) ? count.value : count;

    const next = () => {
        const len = getCount();
        if (len === 0) return;
        if (loop) {
            index.value = (index.value + 1) % len;
        } else {
            index.value = Math.min(index.value + 1, len - 1);
        }
    };

    const prev = () => {
        const len = getCount();
        if (len === 0) return;
        if (loop) {
            index.value = (index.value - 1 + len) % len;
        } else {
            index.value = Math.max(index.value - 1, 0);
        }
    };

    const goTo = (i: number) => {
        const len = getCount();
        if (i >= 0 && i < len) {
            index.value = i;
        }
    };

    if (isSignal(count)) {
        effect(() => {
            const len = count.value;
            if (index.value >= len && len > 0) {
                index.value = len - 1;
            }
        });
    }

    let pause = () => {};
    let resume = () => {};

    if (autoplay) {
        const start = () => {
            if (timer) clearInterval(timer);
            timer = setInterval(next, interval);
        };
        const stop = () => {
            if (timer) clearInterval(timer);
            timer = null;
        };

        start();
        onUnmounted(stop);
        
        pause = stop;
        resume = start;
    }

    return { index, next, prev, goTo, pause, resume };
}

export function useSwipe(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>, options: { threshold?: number } = {}) {
    const { threshold = 50 } = options;
    const direction = signal<'left' | 'right' | 'up' | 'down' | null>(null);
    const isSwiping = signal(false);
    
    let startX = 0;
    let startY = 0;

    if (typeof window !== 'undefined') {
        const onTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping.value = true;
            direction.value = null;
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (!isSwiping.value) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > threshold) {
                    direction.value = diffX > 0 ? 'left' : 'right';
                }
            } else {
                if (Math.abs(diffY) > threshold) {
                    direction.value = diffY > 0 ? 'up' : 'down';
                }
            }
            isSwiping.value = false;
        };

        useEventListener(target as any, 'touchstart', onTouchStart as any);
        useEventListener(target as any, 'touchend', onTouchEnd as any);
    }

    return { direction, isSwiping };
}

export function useWebP() {
    const isSupported = signal(false);
    if (typeof document !== 'undefined') {
        const elem = document.createElement('canvas');
        if (!!(elem.getContext && elem.getContext('2d'))) {
            isSupported.value = elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
        }
    }
    return isSupported;
}

export function useParallax(target: HTMLElement | (() => HTMLElement | null) | Signal<HTMLElement | null>) {
    const tilt = signal(0);
    const roll = signal(0);
    const source = signal({ x: 0, y: 0 });
    
    let cleanup: (() => void) | null = null;

    effect(() => {
        if (cleanup) cleanup();

        let el: HTMLElement | null;
        if (isSignal(target)) el = target.value;
        else if (typeof target === 'function') el = target();
        else el = target;

        if (el) {
            const onMove = (e: MouseEvent) => {
                const rect = el!.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Normalize -0.5 to 0.5
                const nX = (x / rect.width) - 0.5;
                const nY = (y / rect.height) - 0.5;

                tilt.value = nY * 20;  // Max 10 deg tilt
                roll.value = -nX * 20; // Max 10 deg roll
                source.value = { x: nX, y: nY };
            };

            const onLeave = () => {
                tilt.value = 0;
                roll.value = 0;
                source.value = { x: 0, y: 0 };
            };

            el.addEventListener('mousemove', onMove);
            el.addEventListener('mouseleave', onLeave);

            cleanup = () => {
                el!.removeEventListener('mousemove', onMove);
                el!.removeEventListener('mouseleave', onLeave);
            };
        }
    });

    onUnmounted(() => {
        if (cleanup) cleanup();
    });

    return { tilt, roll, source };
}

export function useSound(src: string, options: { volume?: number, loop?: boolean } = {}) {
    const isPlaying = signal(false);
    let audio: HTMLAudioElement | null = null;

    if (typeof window !== 'undefined') {
        audio = new Audio(src);
        audio.volume = options.volume ?? 1;
        audio.loop = options.loop ?? false;

        audio.addEventListener('play', () => isPlaying.value = true);
        audio.addEventListener('pause', () => isPlaying.value = false);
        audio.addEventListener('ended', () => isPlaying.value = false);
    }

    const play = () => {
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.warn('Audio play failed', e));
        }
    };

    const pause = () => audio?.pause();
    
    const stop = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    };

    onUnmounted(() => {
        if (audio) {
            audio.pause();
            audio = null;
        }
    });

    return { play, pause, stop, isPlaying };
}
