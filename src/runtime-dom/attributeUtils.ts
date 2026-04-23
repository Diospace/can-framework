import { reactive } from '../reactivity/index';

/**
 * Extracts all attributes from an HTMLElement and returns them as a reactive props object.
 * It automatically handles type conversion for booleans, numbers, and JSON-formatted strings.
 * 
 * @param el The element to extract attributes from.
 * @returns A reactive object containing the parsed attributes.
 */
export function extractAttributesAsProps(el: HTMLElement): any {
    const props: Record<string, any> = {};
    const attributes = el.attributes;

    for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        props[attr.name] = parseAttributeValue(attr.value);
    }

    return reactive(props);
}

/**
 * Parses a string attribute value into its corresponding JavaScript type.
 * Handles booleans (including empty strings for boolean attributes), numbers, 
 * and JSON-formatted strings for objects or arrays.
 */
export function parseAttributeValue(value: string | null): any {
    if (value === null) return undefined;
    if (value === 'true' || value === '') return true;
    if (value === 'false') return false;

    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') return num;

    if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
        try { return JSON.parse(value); } catch { return value; }
    }

    return value;
}