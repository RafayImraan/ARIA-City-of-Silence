import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface Props {
  url: string;
  roomId: string;
  compact?: boolean;
}

export default function JoinQrPanel({ url, roomId, compact = false }: Props) {
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(url, {
      width: compact ? 144 : 220,
      margin: 1,
      color: {
        dark: '#f4ecdc',
        light: '#0b0f16',
      },
    }).then((dataUrl) => {
      if (active) setQrUrl(dataUrl);
    });

    return () => {
      active = false;
    };
  }, [compact, url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="story-panel">
      <p className="editorial-kicker" style={{ color: 'rgba(255,183,64,0.54)' }}>
        Audience Join
      </p>
      <div className="editorial-rule mt-4 max-w-[160px]" />
      <div className={`mt-5 ${compact ? 'grid grid-cols-[140px_minmax(0,1fr)] gap-4 items-center' : 'grid md:grid-cols-[220px_minmax(0,1fr)] gap-6 items-center'}`}>
        <div className="muted-surface p-3 flex items-center justify-center min-h-[160px]">
          {qrUrl ? (
            <img src={qrUrl} alt="Audience join QR code" className={`${compact ? 'h-36 w-36' : 'h-[220px] w-[220px]'} rounded-[14px]`} />
          ) : (
            <div className="h-36 w-36 rounded-[14px] bg-white/5 animate-pulse" />
          )}
        </div>
        <div>
          <p className="font-serif text-[16px] leading-8" style={{ color: 'rgba(226,221,211,0.78)' }}>
            Ask the room to scan the code and join the vote instantly.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] mt-4" style={{ color: 'rgba(255,255,255,0.34)' }}>
            Room {roomId}
          </p>
          <p className="font-mono text-[10px] mt-3 break-all" style={{ color: 'rgba(255,183,64,0.54)' }}>
            {url}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={handleCopy} className="btn-ghost">
              {copied ? 'Copied' : 'Copy Join Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
