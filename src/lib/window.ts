import { useState, useEffect } from 'react';

function getWindowDimensions() {
    if (typeof window === 'undefined') {
        const width = 0;
        const height = 0;
        return { width, height };
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