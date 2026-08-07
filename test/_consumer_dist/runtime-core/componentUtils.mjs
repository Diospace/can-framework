export function createComponent(Constructor, props) {
    const instance = new Constructor();
    if (props) {
        // Assign props to the instance. 
        instance.props = props;
    }
    return instance;
}
//# sourceMappingURL=componentUtils.mjs.map