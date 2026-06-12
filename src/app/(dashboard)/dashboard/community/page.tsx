'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import OrgPrivacyNote from '@/components/OrgPrivacyNote';
import {
  Users, Lock, UserPlus, Heart, Flame, Sparkles, GraduationCap, Lightbulb, Target, Send, CheckCircle2,
} from 'lucide-react';

type Friend = {
  id: number;
  name: string;
  initials: string;
  color: string;
  headline: string;
  streak: number;
};

const FRIENDS: Friend[] = [
  { id: 1, name: 'Maya Okafor', initials: 'MO', color: '#1d4ed8', headline: 'Exploring a move into product management', streak: 12 },
  { id: 2, name: 'Tom Bradley', initials: 'TB', color: '#15803d', headline: 'Working towards a senior leadership role', streak: 4 },
  { id: 3, name: 'Priya Shah', initials: 'PS', color: '#c2410c', headline: 'Building confidence for salary negotiations', streak: 7 },
];

const SUGGESTED: Friend[] = [
  { id: 4, name: 'Ben Carter', initials: 'BC', color: '#7e22ce', headline: 'New to Vernon — started this week', streak: 1 },
  { id: 5, name: 'Aiko Tanaka', initials: 'AT', color: '#0369a1', headline: 'Navigating a career pivot into tech', streak: 9 },
];

const GROUP_PROMPT = {
  question: "What's one small brave thing you've done for your career this month?",
  context: "Like your reflection prompts, group prompts are written by Vernon's coaching team. There's no need for a polished answer — just something real.",
};

type GroupResponse = {
  id: number;
  friendId: number | 'you';
  text: string;
  cheers: number;
  cheered: boolean;
};

const INITIAL_RESPONSES: GroupResponse[] = [
  { id: 1, friendId: 1, text: "I asked my manager directly why I wasn't picked for the last project. Awkward, but the answer actually helped.", cheers: 4, cheered: false },
  { id: 2, friendId: 3, text: 'Reached out to someone two levels up just to ask about their career path — they said yes to a coffee chat!', cheers: 6, cheered: true },
];

type FeedItem = {
  id: number;
  friendId: number;
  icon: LucideIcon;
  text: string;
  timestamp: string;
  cheers: number;
  cheered: boolean;
};

const INITIAL_FEED: FeedItem[] = [
  { id: 1, friendId: 2, icon: Flame, text: 'hit a 7-day reflection streak', timestamp: '2h ago', cheers: 3, cheered: false },
  { id: 2, friendId: 1, icon: GraduationCap, text: 'completed the "Strengths in Action" workshop', timestamp: 'Yesterday', cheers: 5, cheered: true },
  { id: 3, friendId: 3, icon: Lightbulb, text: 'published a reflection: "What does success look like to you beyond the job title?"', timestamp: '2 days ago', cheers: 2, cheered: false },
  { id: 4, friendId: 2, icon: Target, text: 'tried the Real-World Practice check-in and focused on networking', timestamp: '3 days ago', cheers: 1, cheered: false },
];

const COMMUNITY_TAG = { bg: '#fdf2f8', color: '#be185d' };

function FriendAvatar({ friend, size = 36 }: { friend: Friend; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: friend.color, fontSize: size * 0.38 }}
    >
      {friend.initials}
    </div>
  );
}

export default function CommunityPage() {
  const [friends, setFriends] = useState<Friend[]>(FRIENDS);
  const [suggested, setSuggested] = useState<Friend[]>(SUGGESTED);
  const [showFind, setShowFind] = useState(false);

  const [responses, setResponses] = useState<GroupResponse[]>(INITIAL_RESPONSES);
  const [responseText, setResponseText] = useState('');
  const [privateSaved, setPrivateSaved] = useState(false);

  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED);

  const friendById = (id: number) => friends.find((f) => f.id === id) ?? suggested.find((f) => f.id === id);
  const youPublished = responses.some((r) => r.friendId === 'you');

  const addFriend = (friend: Friend) => {
    setSuggested((prev) => prev.filter((f) => f.id !== friend.id));
    setFriends((prev) => [...prev, friend]);
  };

  const toggleResponseCheer = (id: number) => {
    setResponses((prev) => prev.map((r) => (
      r.id === id ? { ...r, cheered: !r.cheered, cheers: r.cheers + (r.cheered ? -1 : 1) } : r
    )));
  };

  const toggleFeedCheer = (id: number) => {
    setFeed((prev) => prev.map((f) => (
      f.id === id ? { ...f, cheered: !f.cheered, cheers: f.cheers + (f.cheered ? -1 : 1) } : f
    )));
  };

  const handlePublish = () => {
    if (!responseText.trim()) return;
    setResponses((prev) => [...prev, { id: 0, friendId: 'you', text: responseText.trim(), cheers: 0, cheered: false }]);
    setPrivateSaved(false);
  };

  const handleSavePrivately = () => {
    if (!responseText.trim()) return;
    setPrivateSaved(true);
    setResponseText('');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: 'var(--foreground)' }}>
          <Users size={22} style={{ color: 'var(--primary)' }} />
          Community
        </h1>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Swap encouragement and see how others are putting their plans into practice.
        </p>
      </div>

      {/* Privacy note */}
      <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'var(--surface-muted)' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface)' }}>
          <Lock size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Private by default. </span>
          Your reflections and activity stay between you and your coach. Nothing appears here unless you choose to publish it — like a response to the group prompt below.
        </p>
      </div>

      <OrgPrivacyNote shared="that you're active in the community and your streak — not who you connect with or what you post" />

      {/* Your circle */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
            Your circle <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({friends.length})</span>
          </h2>
          <button
            onClick={() => setShowFind((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: '#e8f4f8', color: 'var(--primary)' }}
          >
            <UserPlus size={14} /> Find people
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {friends.map((f) => (
            <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-muted)' }}>
              <FriendAvatar friend={f} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{f.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{f.headline}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: '#c2410c' }}>
                <Flame size={12} /> {f.streak}
              </div>
            </div>
          ))}
        </div>

        {showFind && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>People you might know</p>
            {suggested.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>You&apos;re connected with everyone we&apos;ve suggested so far.</p>
            ) : (
              <div className="space-y-2">
                {suggested.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-muted)' }}>
                    <FriendAvatar friend={f} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{f.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{f.headline}</p>
                    </div>
                    <button
                      onClick={() => addFriend(f)}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-white flex-shrink-0"
                      style={{ background: 'var(--primary)' }}
                    >
                      <UserPlus size={12} /> Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Group prompt */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--surface)' }}>
        <div>
          <span
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium mb-3"
            style={{ background: COMMUNITY_TAG.bg, color: COMMUNITY_TAG.color }}
          >
            <Sparkles size={12} /> Group prompt · This week
          </span>
          <h2 className="text-lg font-bold leading-snug mb-2" style={{ color: 'var(--foreground)' }}>
            {GROUP_PROMPT.question}
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{GROUP_PROMPT.context}</p>
        </div>

        <div className="space-y-3">
          {responses.map((r) => {
            const friend = r.friendId === 'you' ? null : friendById(r.friendId);
            return (
              <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-muted)' }}>
                {friend ? (
                  <FriendAvatar friend={friend} size={32} />
                ) : (
                  <div
                    className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                    style={{ width: 32, height: 32, background: 'var(--primary)', fontSize: 12 }}
                  >
                    You
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
                    {friend ? friend.name : 'You'}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>{r.text}</p>
                </div>
                <button
                  onClick={() => toggleResponseCheer(r.id)}
                  className="flex items-center gap-1 text-xs font-medium flex-shrink-0"
                  style={{ color: r.cheered ? '#dc2626' : 'var(--text-muted)' }}
                >
                  <Heart size={14} fill={r.cheered ? '#dc2626' : 'none'} /> {r.cheers}
                </button>
              </div>
            );
          })}
        </div>

        {!youPublished && (
          <div className="pt-2 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
            <textarea
              value={responseText}
              onChange={(e) => { setResponseText(e.target.value); setPrivateSaved(false); }}
              placeholder="Share a small brave thing you've done recently..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none leading-relaxed"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
            <div className="flex items-center justify-between flex-wrap gap-2">
              {privateSaved ? (
                <p className="text-xs font-medium flex items-center gap-1" style={{ color: '#16a34a' }}>
                  <CheckCircle2 size={12} /> Saved to your reflections — only visible to you
                </p>
              ) : (
                <button
                  onClick={handleSavePrivately}
                  disabled={!responseText.trim()}
                  className="text-xs font-medium disabled:opacity-50"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Keep private
                </button>
              )}
              <button
                onClick={handlePublish}
                disabled={!responseText.trim()}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white disabled:opacity-50"
                style={{ background: COMMUNITY_TAG.color }}
              >
                <Send size={12} /> Publish to your circle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Circle activity feed */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)' }}>
        <h2 className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Circle activity</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          A little encouragement goes a long way — react to celebrate what your circle is up to.
        </p>
        <div className="space-y-3">
          {feed.map((item) => {
            const friend = friendById(item.friendId);
            if (!friend) return null;
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-muted)' }}>
                <FriendAvatar friend={friend} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                    <span className="font-semibold">{friend.name}</span> {item.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Icon size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.timestamp}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFeedCheer(item.id)}
                  className="flex items-center gap-1 text-xs font-medium flex-shrink-0"
                  style={{ color: item.cheered ? '#dc2626' : 'var(--text-muted)' }}
                >
                  <Heart size={14} fill={item.cheered ? '#dc2626' : 'none'} /> {item.cheers}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
