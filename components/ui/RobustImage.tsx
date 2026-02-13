import React, { useState, useEffect, useRef } from 'react';

interface RobustImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    retryDelay?: number;
    isCircular?: boolean;
}

export const RobustImage: React.FC<RobustImageProps> = ({ 
    src, 
    fallbackSrc = 'https://picsum.photos/400/300', 
    className, 
    retryDelay = 3000,
    isCircular = false,
    ...props 
}) => {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
    const [errorCount, setErrorCount] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setImgSrc(src || fallbackSrc);
        setErrorCount(0);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [src, fallbackSrc]);

    const handleError = () => {
        // Clear previous timeout if any
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Schedule a retry
        timeoutRef.current = setTimeout(() => {
            setErrorCount(prev => prev + 1);
            // Append timestamp to bust cache/force reload if network failed
            const separator = src?.includes('?') ? '&' : '?';
            setImgSrc(`${src}${separator}retry=${Date.now()}`);
        }, retryDelay);
    };

    return (
        <img 
            src={imgSrc} 
            onError={handleError}
            className={`${className} ${isCircular ? 'rounded-full !aspect-square object-cover' : ''} transition-opacity duration-300`}
            loading="eager" // Load immediately, do not lazy load to prevent "cutting"
            {...props}
        />
    );
};