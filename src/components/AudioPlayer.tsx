"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 상세 페이지 진입 시 자동재생을 시도한다. 브라우저의 자동재생 정책(특히 Chrome)은
 * 사용자 상호작용 없이는 소리 있는 오디오 재생을 막을 수 있는데, 그 경우 조용히
 * 실패시키고 안내 문구만 보여준다 — 재생 버튼은 플레이어에 그대로 남아있어 수동 재생 가능.
 */
export function AudioPlayer({ src, title }: { src: string; title?: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => setAutoplayBlocked(true));
  }, []);

  return (
    <div className="flex flex-col gap-1">
      {title && (
        <span className="flex items-center gap-1 truncate text-xs text-neutral-400">
          <span aria-hidden>🎵</span>
          {title}
        </span>
      )}
      <audio ref={audioRef} controls src={src} className="w-full" />
      {autoplayBlocked && (
        <p className="text-xs text-neutral-400">브라우저 설정으로 자동재생이 막혔어요. 재생 버튼을 눌러주세요.</p>
      )}
    </div>
  );
}
