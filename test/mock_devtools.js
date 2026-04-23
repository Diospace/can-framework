(function() {
    if (typeof window === 'undefined') return;

    // Define the hook expected by the framework
    window.__CAN_DEVTOOLS_HOOK__ = {
        emit(event, payload) {
            const time = new Date().toLocaleTimeString();
            const labelStyle = 'background: #2b2b2b; color: #00d8ff; padding: 2px 5px; border-radius: 3px; font-weight: bold;';
            
            console.groupCollapsed(`%c[Can DevTools] ${event} @ ${time}`, labelStyle);
            console.log('Payload:', payload);
            
            // Special handling for store mutations (Time Travel debugging prep)
            if (event === 'store:mutation') {
                console.log('%cState Snapshot:', 'color: #bada55;', payload.state);
            }

            // Special handling for component updates (Performance)
            if (event === 'component:update') {
                console.log(`Render Duration: ${payload.duration.toFixed(2)}ms`);
            }
            
            console.groupEnd();
        }
    };
    
    console.log('%c[Can DevTools] Mock extension ready. Open console to see events.', 'background: #333; color: #fff; padding: 5px; font-size: 12px;');
})();