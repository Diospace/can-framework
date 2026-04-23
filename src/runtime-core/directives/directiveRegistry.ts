import { Directive } from './baseDirective';

const globalDirectives = new Map<string, Directive>();

export function registerDirective(name: string, directive: Directive) {
    globalDirectives.set(name, directive);
}

export function getDirective(name: string): Directive | undefined {
    return globalDirectives.get(name);
}
