import { Node } from './ast';

export interface CompilerPlugin {
    name: string;
    transform?: (code: string, id: string) => string | null;
    transformNode?: (node: Node) => void;
    processDirective?: (
        key: string,
        value: string,
        context: {
            varName: string;
            isStatic: boolean;
            locals: string[];
            processExpression: (expr: string, locals: string[]) => string;
        }
    ) => string | null;
}