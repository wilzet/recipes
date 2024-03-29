import type { Metadata } from 'next';
import '@/css/index.css';
import TextRing from '@/components/text-ring';

export const metadata: Metadata = {
    title: 'Recipes',
    description: 'Web app for storing recipes',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="theme-color" content="#000000"/>
                <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png"/>
                <link rel="manifest" href="/favicon/manifest.json"/>
            </head>
            <body>
                <div style={{ margin: '10px 20px 0px 20px' }}>
                    <h1>Meal-accounting-tool</h1>
                    
                    {children}
                </div>
                
                <footer>
                    <div className='containerH'>
                        <a href={'https://github.com/wilzet/recipes'} target='_blank' style={{ display: 'flex', justifyContent: 'center' }}>
                            <TextRing
                                text={'wilzet * recipes * GitHub * '}
                                fontSize={1.1}
                                characterWidth={1.3}
                                offsetAngle={45}
                                style={{ fontSize: '0.8rem', fontWeight: 'bolder' }}
                            />
                        </a>
                    </div>
                </footer>
            </body>
        </html>
    );
}
