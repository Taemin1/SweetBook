import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

/**
 * 지연 생성: 모듈 import 시점(Next.js 빌드 시 정적 분석 포함)에는 환경변수를
 * 읽지 않고, 실제로 DB에 접근하는 시점(요청 처리 중)에만 클라이언트를 만든다.
 * 이렇게 해야 `docker build` 단계에 SUPABASE_* 값이 없어도 빌드가 깨지지 않는다.
 */
export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경변수(SUPABASE_URL, SUPABASE_ANON_KEY)가 설정되지 않았습니다. " +
        ".env.example을 복사해 .env를 만들고 값을 채워주세요."
    );
  }

  cachedClient = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  return cachedClient;
}
