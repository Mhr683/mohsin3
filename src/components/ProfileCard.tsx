import React from 'react';
import {
  ExternalLink,
  MapPin,
  Building,
  Link2,
  Calendar,
  BookOpen,
  Users,
  UserCheck,
  Code2,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { GitHubUser } from '../types';

interface ProfileCardProps {
  user: GitHubUser;
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onRefresh,
  onLogout,
  isRefreshing,
}) => {
  const formattedJoinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      id="github-profile-card"
      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all"
    >
      {/* Top Banner accent */}
      <div className="h-20 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 sm:h-24" />

      <div className="relative px-5 pb-6 sm:px-8">
        {/* Avatar & Action Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-12 flex items-end gap-4 sm:-mt-14">
            <img
              id="user-profile-avatar"
              src={user.avatar_url}
              alt={user.name || user.login}
              className="h-24 w-24 rounded-2xl border-4 border-white bg-white object-cover shadow-md ring-1 ring-zinc-200 sm:h-28 sm:w-28"
            />
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
                  {user.name || user.login}
                </h2>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                  Active
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-500">@{user.login}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="profile-refresh-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50"
              title="Refresh GitHub Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <a
              id="profile-view-github-link"
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50"
            >
              <span>View Profile</span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
            </a>
            <button
              id="profile-disconnect-btn"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-4 text-sm leading-relaxed text-zinc-700">
            {user.bio}
          </p>
        )}

        {/* Metadata Details */}
        <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-zinc-500">
          {user.company && (
            <div className="flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-zinc-400" />
              <span>{user.company}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              <span>{user.location}</span>
            </div>
          )}
          {user.blog && (
            <div className="flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-zinc-400" />
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {user.blog}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>Joined {formattedJoinedDate}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3.5 text-center sm:text-left">
            <div className="flex items-center justify-center gap-1.5 text-zinc-500 sm:justify-start">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium">Repositories</span>
            </div>
            <div className="mt-1 text-xl font-bold text-zinc-900">{user.public_repos}</div>
          </div>

          <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3.5 text-center sm:text-left">
            <div className="flex items-center justify-center gap-1.5 text-zinc-500 sm:justify-start">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Followers</span>
            </div>
            <div className="mt-1 text-xl font-bold text-zinc-900">{user.followers}</div>
          </div>

          <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3.5 text-center sm:text-left">
            <div className="flex items-center justify-center gap-1.5 text-zinc-500 sm:justify-start">
              <UserCheck className="h-4 w-4" />
              <span className="text-xs font-medium">Following</span>
            </div>
            <div className="mt-1 text-xl font-bold text-zinc-900">{user.following}</div>
          </div>

          <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3.5 text-center sm:text-left">
            <div className="flex items-center justify-center gap-1.5 text-zinc-500 sm:justify-start">
              <Code2 className="h-4 w-4" />
              <span className="text-xs font-medium">Public Gists</span>
            </div>
            <div className="mt-1 text-xl font-bold text-zinc-900">{user.public_gists}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
