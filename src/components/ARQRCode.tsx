import { AR_QR_CODE_VALUE } from '@/lib/constants';
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface ARQRCodeProps {
  size?: number;
}

export default function ARQRCode({ size = 128 }: ARQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Generate QR code
    QRCode.toCanvas(
      canvasRef.current, 
      AR_QR_CODE_VALUE, 
      {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      },
      (error) => {
        if (error) console.error('Error generating QR code:', error);
      }
    );
  }, [size]);
  
  return (
    <div className="bg-white p-4 rounded-lg inline-block mx-auto">
      <canvas ref={canvasRef} width={size} height={size}></canvas>
    </div>
  );
}
