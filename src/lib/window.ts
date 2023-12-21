import { useState, useEffect } from 'react';

function getWindowDimensions() {
    if (typeof window === 'undefined') {
        return { width: 0, height: 0 };
    }
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const resize = () => setWindowDimensions(getWindowDimensions());
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return windowDimensions;
}