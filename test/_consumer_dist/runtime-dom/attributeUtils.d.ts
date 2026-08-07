/**
 * Extracts all attributes from an HTMLElement and returns them as a reactive props object.
 * It automatically handles type conversion for booleans, numbers, and JSON-formatted strings.
 *
 * @param el The element to extract attributes from.
 * @returns A reactive object containing the parsed attributes.
 */
export declare function extractAttributesAsProps(el: HTMLElement): any;
/**
 * Parses a string attribute value into its corresponding JavaScript type.
 * Handles booleans (including empty strings for boolean attributes), numbers,
 * and JSON-formatted strings for objects or arrays.
 */
export declare function parseAttributeValue(value: string | null): any;
//# sourceMappingURL=attributeUtils.d.ts.map