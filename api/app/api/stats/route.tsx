import { feedSourceRepository } from '@/app/lib/repositories/feedSourceRepository';
import { postRepository } from '@/app/lib/repositories/postRepository';
import { getRequestCount } from '@/app/lib/requestCounter';
import { jsonOk, withErrorHandling } from '@/app/lib/apiResponse';
import { corsPreflight } from '@/app/lib/cors';

export const OPTIONS = corsPreflight;

export async function GET() {
  return withErrorHandling(async () => {
    const [totalFeedSources, totalPosts, totalApiRequests] = await Promise.all([
      feedSourceRepository.count(),
      postRepository.count(),
      getRequestCount(),
    ]);

    return jsonOk({ totalFeedSources, totalPosts, totalApiRequests });
  });
}
