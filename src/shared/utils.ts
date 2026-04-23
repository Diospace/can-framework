/**
 * An empty function that does nothing. Used as a default callback.
 */
export const NOOP = () => {};

/**
 * Merges properties from source objects into a target object.
 */
export const extend = Object.assign;

const escapeRE = /["'&<>]/;

export function escapeHtml(string: unknown): string {
    const str = String(string);
    const match = escapeRE.exec(str);

    if (!match) {
        return str;
    }

    let html = '';
    let escaped;
    let index;
    let lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escaped = '&quot;';
                break;
            case 38: // &
                escaped = '&amp;';
                break;
            case 39: // '
                escaped = '&#39;';
                break;
            case 60: // <
                escaped = '&lt;';
                break;
            case 62: // >
                escaped = '&gt;';
                break;
            default:
                continue;
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escaped;
    }

    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}