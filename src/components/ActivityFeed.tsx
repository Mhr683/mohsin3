import React from 'react';
import { GitCommit, Star, GitFork, GitPullRequest, Tag, AlertCircle, Activity } from 'lucide-react';
import { GitHubActivityEvent } from '../types';

interface ActivityFeedProps {
  activity: GitHubActivityEvent[];
  isLoading: boolean;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  return `${Math.floor(diffInMonths / 12)}y ago`;
}

function getEventDescription(event: GitHubActivityEvent): {
  icon: React.ReactNode;
  title: string;
  detail?: string;
} {
  switch (event.type) {
    case 'PushEvent': {
      const count = event.payload.commits?.length || 1;
      const firstMsg = event.payload.commits?.[0]?.message;
      return {
        icon: <GitCommit className="h-3.5 w-3.5 text-blue-600" />,
        title: `Pushed ${count} commit${count > 1 ? 's' : ''} to ${event.repo.name}`,
        detail: firstMsg ? `"${firstMsg.split('\n')[0]}"` : undefined,
      };
    }
    case 'WatchEvent':
      return {
        icon: <Star className="h-3.5 w-3.5 text-amber-500" />,
        title: `Starred repository ${event.repo.name}`,
      };
    case 'ForkEvent':
      return {
        icon: <GitFork className="h-3.5 w-3.5 text-purple-600" />,
        title: `Forked ${event.repo.name}`,
      };
    case 'CreateEvent':
      return {
        icon: <Tag className="h-3.5 w-3.5 text-emerald-600" />,
        title: `Created ${event.payload.ref_type || 'ref'} in ${event.repo.name}`,
        detail: event.payload.ref ? `Reference: ${event.payload.ref}` : undefined,
      };
    case 'PullRequestEvent':
      return {
        icon: <GitPullRequest className="h-3.5 w-3.5 text-emerald-600" />,
        title: `${event.payload.action || 'Opened'} pull request in ${event.repo.name}`,
      };
    case 'IssuesEvent':
      return {
        icon: <AlertCircle className="h-3.5 w-3.5 text-rose-500" />,
        title: `${event.payload.action || 'Updated'} issue in ${event.repo.name}`,
        detail: event.payload.issue?.title,
      };
    default:
      return {
        icon: <Activity className="h-3.5 w-3.5 text-zinc-500" />,
        title: `Activity in ${event.repo.name} (${event.type.replace('Event', '')})`,
      };
  }
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activity, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-zinc-200 bg-white p-4 space-y-2"
          >
            <div className="h-4 w-1/3 rounded bg-zinc-200" />
            <div className="h-3 w-2/3 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    );
  }

  if (activity.length === 0) {
    return (
      <div
        id="no-activity-found"
        className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-10 text-center"
      >
        <Activity className="mx-auto h-7 w-7 text-zinc-400" />
        <h3 className="mt-2 text-sm font-semibold text-zinc-800">No recent public activity</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Recent commits, stars, and pull requests will appear here once recorded on GitHub.
        </p>
      </div>
    );
  }

  return (
    <div id="activity-feed-list" className="space-y-2.5">
      {activity.map((event) => {
        const info = getEventDescription(event);
        return (
          <div
            key={event.id}
            className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm transition hover:border-zinc-300"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
              {info.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-zinc-900 leading-snug">
                  {info.title}
                </p>
                <span className="shrink-0 text-[10px] text-zinc-400">
                  {formatRelativeTime(event.created_at)}
                </span>
              </div>
              {info.detail && (
                <p className="mt-1 truncate font-mono text-[11px] text-zinc-600">
                  {info.detail}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
