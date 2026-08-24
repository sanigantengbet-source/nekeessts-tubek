'use client';

import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Play,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CommentSection } from './CommentSection';
import { YouTubePlayer } from './YouTubePlayer';
import { Video } from '@/types';

export const WatchPage: React.FC = () => {
  const {
    activeVideo,
    videos,
    playVideoById,
    subscribedChannelIds,
    toggleSubscribe,
    likedVideoIds,
    dislikedVideoIds,
    toggleLikeVideo,
    toggleDislikeVideo,
    watchLaterIds,
    toggleWatchLater,
    setShareModalVideo,
    sponsorBlockSettings,
  } = useApp();

  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);

  if (!activeVideo) return null;

  const isSubscribed = subscribedChannelIds.includes(activeVideo.channelId);
  const isLiked = likedVideoIds.includes(activeVideo.id);
  const isDisliked = dislikedVideoIds.includes(activeVideo.id);
  const isSaved = watchLaterIds.includes(activeVideo.id);

  // Related videos (exclude currently active video)
  const relatedVideos = videos.filter((v) => v.id !== activeVideo.id);

  const formatViews = (views: number): string => {
    return new Intl.NumberFormat().format(views);
  };

  const handleVideoEnded = () => {
    if (isAutoplay && relatedVideos.length > 0) {
      playVideoById(relatedVideos[0].id);
    }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto p-3 sm:p-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* MAIN COLUMN: Video Player & Details */}
        <div className="flex-1 min-w-0">
          {/* Integrated SponsorBlock YouTube Player */}
          <YouTubePlayer
            video={activeVideo}
            settings={sponsorBlockSettings}
            onEnded={handleVideoEnded}
          />

          {/* Video Title */}
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-4 leading-snug">
            {activeVideo.title}
          </h1>

          {/* Channel & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pb-3 border-b border-gray-200 dark:border-[#272727]">
            {/* Channel Info & Subscribe Button */}
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeVideo.channelAvatar}
                alt={activeVideo.channelTitle}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-[#383838]"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activeVideo.channelTitle || 'YT')}&backgroundColor=e11d48,2563eb,d97706`;
                }}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {activeVideo.channelTitle}
                  </span>
                  {activeVideo.verified && (
                    <CheckCircle2 className="w-4 h-4 text-gray-500 fill-gray-400/20" />
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activeVideo.subscriberCount} subscribers
                </span>
              </div>

              <button
                id="watch-subscribe-btn"
                onClick={() => toggleSubscribe(activeVideo.channelId)}
                className={`ml-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs ${
                  isSubscribed
                    ? 'bg-gray-100 dark:bg-[#272727] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333]'
                    : 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Action Buttons (Like, Dislike, Share, Save) */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {/* Like / Dislike pill */}
              <div className="flex items-center rounded-full bg-gray-100 dark:bg-[#272727] p-0.5 border border-gray-200 dark:border-[#383838]">
                <button
                  id="watch-like-btn"
                  onClick={() => toggleLikeVideo(activeVideo.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-l-full text-xs font-semibold transition-colors hover:bg-gray-200 dark:hover:bg-[#333] ${
                    isLiked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
                  <span>{activeVideo.likes}</span>
                </button>
                <div className="w-px h-5 bg-gray-300 dark:bg-[#3e3e3e]" />
                <button
                  id="watch-dislike-btn"
                  onClick={() => toggleDislikeVideo(activeVideo.id)}
                  className={`px-3 py-1.5 rounded-r-full text-xs font-semibold transition-colors hover:bg-gray-200 dark:hover:bg-[#333] ${
                    isDisliked ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* Share Button */}
              <button
                id="watch-share-btn"
                onClick={() => setShareModalVideo(activeVideo)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#333] border border-gray-200 dark:border-[#383838] text-xs font-semibold text-gray-800 dark:text-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              {/* Save / Watch Later */}
              <button
                id="watch-save-btn"
                onClick={() => toggleWatchLater(activeVideo.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-200 dark:border-[#383838] text-xs font-semibold transition-colors ${
                  isSaved
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200'
                    : 'bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-800 dark:text-gray-200'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Description Card */}
          <div
            id="watch-video-description-card"
            className="mt-4 p-4 rounded-2xl bg-gray-100 dark:bg-[#202020] text-xs sm:text-sm text-gray-800 dark:text-gray-200 transition-all cursor-pointer hover:bg-gray-200/70 dark:hover:bg-[#262626]"
            onClick={() => setIsDescExpanded(!isDescExpanded)}
          >
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-2">
              <span>{formatViews(activeVideo.views)} views</span>
              <span>•</span>
              <span>{activeVideo.uploadedAt}</span>
              <span className="px-2 py-0.5 bg-gray-200 dark:bg-[#303030] rounded-md text-xs font-mono">
                #{activeVideo.category}
              </span>
            </div>

            <p className={`whitespace-pre-line leading-relaxed ${isDescExpanded ? '' : 'line-clamp-3'}`}>
              {activeVideo.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {activeVideo.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  #{tag.replace(/\s+/g, '')}
                </span>
              ))}
            </div>

            <button
              id="watch-toggle-desc-btn"
              className="mt-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
            >
              {isDescExpanded ? (
                <>
                  Show less <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  ...more <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Comments Section Component */}
          <CommentSection videoId={activeVideo.id} commentsCount={activeVideo.commentsCount} />
        </div>

        {/* RIGHT SIDEBAR: Up Next / Related Videos */}
        <div className="w-full lg:w-96 shrink-0 space-y-3">
          {/* Autoplay header */}
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Up next</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Autoplay</span>
              <button
                id="watch-toggle-autoplay-btn"
                onClick={() => setIsAutoplay(!isAutoplay)}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  isAutoplay ? 'bg-blue-600' : 'bg-gray-300 dark:bg-[#404040]'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.75 ${
                    isAutoplay ? 'right-0.75' : 'left-0.75'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Related Video Cards list */}
          <div className="space-y-3">
            {relatedVideos.map((video) => (
              <div
                key={video.id}
                id={`related-video-${video.id}`}
                onClick={() => playVideoById(video.id)}
                className="flex gap-3 group cursor-pointer p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#202020] transition-colors"
              >
                {/* Mini thumbnail */}
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (video.youtubeId && !target.src.includes('hqdefault')) {
                        target.src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
                      } else {
                        target.src = `https://picsum.photos/seed/${encodeURIComponent(video.title || video.id)}/640/360`;
                      }
                    }}
                  />
                  <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-white text-[10px] font-semibold rounded-sm">
                    {video.duration}
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 flex flex-col justify-start">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    <span className="truncate">{video.channelTitle}</span>
                    {video.verified && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {new Intl.NumberFormat().format(video.views)} views • {video.uploadedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
