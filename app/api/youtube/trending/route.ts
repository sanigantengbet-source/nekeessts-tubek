import { NextRequest, NextResponse } from 'next/server';
import YouTube from 'youtube-sr';

// Fetch real trending YouTube videos directly from YouTube
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || 'trending indonesia viral video';

  try {
    // 1. Try fetching trending videos via youtube-sr trending() or search()
    let trendingList: any[] = [];

    try {
      if (typeof (YouTube as any).trending === 'function') {
        trendingList = await (YouTube as any).trending();
      }
    } catch {
      // Fallback
    }

    if (!trendingList || trendingList.length === 0) {
      trendingList = await YouTube.search(q, {
        limit: 30,
        type: 'video',
      });
    }

    const formatted = (trendingList || [])
      .filter((item: any) => item && item.id && item.title)
      .map((item: any) => {
        const videoId = item.id;
        const thumb =
          item.thumbnail?.url ||
          (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : 'https://picsum.photos/640/360');

        return {
          id: `yt-${videoId}`,
          youtubeId: videoId,
          title: item.title,
          description: item.description || `Trending YouTube Video: ${item.title}`,
          channelTitle: item.channel?.name || 'YouTube Creator',
          channelId: item.channel?.id || `c-${item.channel?.name?.replace(/\s+/g, '-').toLowerCase() || videoId}`,
          channelAvatar: item.channel?.icon?.url || `https://picsum.photos/seed/${encodeURIComponent(item.channel?.name || videoId || 'creator')}/100/100`,
          subscriberCount: item.channel?.subscribers || '1M+',
          verified: Boolean(item.channel?.verified),
          thumbnailUrl: thumb,
          views: typeof item.views === 'number' ? item.views : 250000,
          likes: Math.floor((item.views || 100000) * 0.05) || 7500,
          dislikes: 12,
          uploadedAt: item.uploadedAt || 'Trending',
          duration: item.durationFormatted || '10:00',
          category: 'Trending',
          tags: ['Trending', item.channel?.name || 'Viral', 'YouTube'],
          commentsCount: Math.floor((item.views || 100000) * 0.003) || 400,
        };
      });

    return NextResponse.json({ results: formatted, count: formatted.length });
  } catch (error) {
    console.error('Error fetching trending YouTube videos:', error);
    return NextResponse.json({ error: 'Failed to fetch trending', results: [] }, { status: 500 });
  }
}
