'use client'
import React from 'react';
import Link from 'next/link';
import TextRing from '@/components/text-ring';

export default function NotFound() {
    return (
        <div className='containerV' style={{ height: 'calc(60vh)', inset: '0' }}>
            <TextRing
                text={'404 - This page could not be found!'}
                fontSize={1.5}
                characterWidth={1.2}
                offsetAngle={70}
                blankEnd={20}
            />
            <h2 style={{ fontFamily: 'monospace', marginTop: '80px' }}>
                Go back to the <Link href="/">home page</Link>
            </h2>
        </div>
    );
}
