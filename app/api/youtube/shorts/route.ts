import { NextRequest, NextResponse } from 'next/server';
import YouTube from 'youtube-sr';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '#shorts viral trending';

  try {
    const results = await YouTube.search(q, {
      limit: 25,
      type: 'video',
    });

    const formatted = (results || [])
      .filter((item: any) => item && item.id && item.title)
      .map((item: any) => {
        const videoId = item.id;
        const thumb =
          item.thumbnail?.url ||
          (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : 'https://picsum.photos/480/854');

        return {
          id: `short-yt-${videoId}`,
          youtubeId: videoId,
          title: item.title,
          description: item.description || `YouTube Short: ${item.title}`,
          channelTitle: item.channel?.name || 'Creator',
          channelId: item.channel?.id || `c-${item.channel?.name?.replace(/\s+/g, '-').toLowerCase() || videoId}`,
          channelAvatar:
            item.channel?.icon?.url ||
            `https://picsum.photos/seed/${encodeURIComponent(item.channel?.name || videoId || 'shortcreator')}/100/100`,
          subscriberCount: item.channel?.subscribers || '500K',
          verified: Boolean(item.channel?.verified),
          thumbnailUrl: thumb,
          views: typeof item.views === 'number' ? item.views : 320000,
          likes: Math.floor((item.views || 100000) * 0.08) || 12000,
          dislikes: 24,
          uploadedAt: item.uploadedAt || 'Trending',
          duration: item.durationFormatted || '0:50',
          category: 'Shorts',
          tags: ['Shorts', 'Viral', item.channel?.name || 'Trending'],
          commentsCount: Math.floor((item.views || 100000) * 0.005) || 350,
        };
      });

    return NextResponse.json({ results: formatted, count: formatted.length });
  } catch (error) {
    console.error('Error fetching YouTube shorts:', error);
    return NextResponse.json({ error: 'Failed to fetch shorts', results: [] }, { status: 500 });
  }
}
