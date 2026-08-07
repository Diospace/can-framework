declare module "*.can" {
    const component: any;
    export { component as App };
    export { component as CanApp };
    export default component;
}