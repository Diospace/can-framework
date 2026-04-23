export function createComponent(Constructor: any, props: any) {
    const instance = new Constructor();
    if (props) {
        // Assign props to the instance. 
        (instance as any).props = props;
    }
    return instance;
}