"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CinematicImage } from "./components/cinematic-image";
import { CreatorPortrait } from "./components/creator-portrait";
import { Logo } from "./components/logo";
import { MovieDiscovery } from "./components/movie-discovery";

type IconName =
  | "search"
  | "plus"
  | "heart"
  | "message"
  | "bookmark"
  | "arrow"
  | "play"
  | "check"
  | "close";

type Post = {
  id: number;
  name: string;
  initials: string;
  avatar: string;
  role: string;
  time: string;
  topic: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
  following: boolean;
  discussion: boolean;
  artwork: string;
  artworkAlt: string;
  replies?: string[];
};

type Course = {
  id: string;
  category: string;
  title: string;
  detail: string;
  lessons: string;
  duration: string;
  artwork: string;
};

const initialPosts: Post[] = [
  {
    id: 1,
    name: "Amara Okafor",
    initials: "AO",
    avatar: "bg-[#7d594d]",
    role: "Director · Lagos",
    time: "18 min ago",
    topic: "SCENE BREAKDOWN",
    title: "What the frame leaves outside",
    body: "Wong Kar-wai keeps placing characters at the edge of the frame, or behind something. It makes every conversation feel like we’re catching a private moment. What’s a scene where framing did more for you than the dialogue?",
    likes: 28,
    comments: 12,
    following: true,
    discussion: true,
    artwork: "/fellas-scene-street.svg",
    artworkAlt: "Original noir illustration of a rain-darkened city street",
  },
  {
    id: 2,
    name: "Theo Bennett",
    initials: "TB",
    avatar: "bg-[#566b68]",
    role: "Editor · London",
    time: "1 hr ago",
    topic: "EDITING NOTES",
    title: "The cut that changed how I think about rhythm",
    body: "Rewatched the opening of Baby Driver with a notebook. Every cut lands on a beat, but the pauses are what make it breathe. Put together a tiny breakdown of the first two minutes for anyone learning to edit to music.",
    likes: 46,
    comments: 8,
    following: false,
    discussion: false,
    artwork: "/fellas-scene-cut.svg",
    artworkAlt: "Original abstract study of light, shadow and editing rhythm",
  },
  {
    id: 3,
    name: "Priya Nair",
    initials: "PN",
    avatar: "bg-[#725e83]",
    role: "Screenwriter · Mumbai",
    time: "3 hrs ago",
    topic: "WRITING FROM THE FRAME",
    title: "A small exercise for writing better scene endings",
    body: "Try ending a scene one beat earlier than feels comfortable. Let the audience do the last bit of emotional work. I’ve been doing this with my short-film group and the pages feel much more alive.",
    likes: 19,
    comments: 5,
    following: true,
    discussion: false,
    artwork: "/fellas-scene-window.svg",
    artworkAlt: "Original illustration of a quiet room lit by a tall window",
  },
];

const creators = [
  {
    name: "Amara Okafor",
    initials: "AO",
    role: "Director",
    location: "Lagos",
    line: "Drawn to the things a character doesn’t say.",
    art: "amara" as const,
  },
  {
    name: "Theo Bennett",
    initials: "TB",
    role: "Editor",
    location: "London",
    line: "Finding the heartbeat between two cuts.",
    art: "theo" as const,
  },
  {
    name: "Priya Nair",
    initials: "PN",
    role: "Screenwriter",
    location: "Mumbai",
    line: "Writing the moment after the reveal.",
    art: "priya" as const,
  },
  {
    name: "Eli Park",
    initials: "EP",
    role: "Cinematographer",
    location: "Seoul",
    line: "Chasing the last light on an ordinary street.",
    art: "eli" as const,
  },
];

const scenes = [
  {
    film: "IN THE MOOD FOR LOVE",
    label: "FRAMING · 04:12",
    title: "A frame within a feeling",
    detail: "Negative space, narrow hallways, and what stays unsaid.",
    search: "framing",
    artwork: "/fellas-scene-street.svg",
    alt: "Original noir city illustration for a discussion about framing",
  },
  {
    film: "BABY DRIVER",
    label: "EDITING · 02:06",
    title: "When a cut finds the beat",
    detail: "A closer look at movement, music, and the pause between them.",
    search: "editing",
    artwork: "/fellas-scene-cut.svg",
    alt: "Original abstract image about editing rhythm",
  },
  {
    film: "A WRITER’S EXERCISE",
    label: "STORY · 01:38",
    title: "Leave before the answer",
    detail: "An ending can open a door instead of closing one.",
    search: "scene endings",
    artwork: "/fellas-scene-window.svg",
    alt: "Original illustration of a room and a bright window",
  },
];

const courses: Course[] = [
  {
    id: "visual-language",
    category: "THE LANGUAGE OF FILM",
    title: "Reading the Frame",
    detail: "Learn to see what a shot is really saying.",
    lessons: "8 chapters",
    duration: "2h 15m",
    artwork: "/fellas-scene-street.svg",
  },
  {
    id: "light-and-shadow",
    category: "CINEMATOGRAPHY",
    title: "Light, Shadow & Story",
    detail: "Shape a scene with the light you have.",
    lessons: "6 chapters",
    duration: "1h 40m",
    artwork: "/fellas-scene-window.svg",
  },
  {
    id: "story-editing",
    category: "EDITING",
    title: "The Art of the Cut",
    detail: "Build emotion one cut at a time.",
    lessons: "7 chapters",
    duration: "1h 55m",
    artwork: "/fellas-scene-cut.svg",
  },
];

const iconContent: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4 4" />
    </>
  ),
  plus: <path d="M12 5v14m-7-7h14" />,
  heart: (
    <path d="M20.8 8.8c0 4.2-8.8 10-8.8 10s-8.8-5.8-8.8-10a4.7 4.7 0 0 1 8.8-2.3 4.7 4.7 0 0 1 8.8 2.3z" />
  ),
  message: (
    <>
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.6-3.2A7.5 7.5 0 1 1 20 11.5Z" />
      <path d="M8.5 11.5h7m-7 3h4" />
    </>
  ),
  bookmark: (
    <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z" />
  ),
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  play: <path d="m9 6 10 6-10 6z" />,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m18 6-12 12M6 6l12 12" />,
};

function Icon({
  name,
  size = 17,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconContent[name]}
    </svg>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold text-white ring-1 ring-white/15 ${color}`}
    >
      {initials}
    </span>
  );
}

function PostCard({
  post,
  featured = false,
  liked,
  saved,
  commentsOpen,
  onLike,
  onSave,
  onToggleComments,
  onAddComment,
}: {
  post: Post;
  featured?: boolean;
  liked: boolean;
  saved: boolean;
  commentsOpen: boolean;
  onLike: () => void;
  onSave: () => void;
  onToggleComments: () => void;
  onAddComment: (comment: string) => void;
}) {
  const [comment, setComment] = useState("");

  function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedComment = comment.trim();
    if (!trimmedComment) return;
    onAddComment(trimmedComment);
    setComment("");
  }

  return (
    <article
      id={`post-${post.id}`}
      className={`grid gap-5 border-t border-white/[0.12] py-7 sm:gap-8 ${
        featured
          ? "lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-10"
          : "md:grid-cols-[minmax(190px,0.7fr)_minmax(0,1.3fr)]"
      }`}
    >
      <div
        className={`group relative isolate overflow-hidden bg-[#181a1d] ${
          featured ? "aspect-[1.38] sm:aspect-[1.55]" : "aspect-[16/10]"
        }`}
      >
        <CinematicImage
          src={post.artwork}
          alt={post.artworkAlt}
          className="transition-transform duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <span className="absolute bottom-4 left-4 text-[9px] font-medium tracking-[0.2em] text-white/85">
          {post.topic}
        </span>
        <span className="absolute right-4 top-4 text-[10px] tracking-[0.18em] text-white/60">
          F / {String(post.id).padStart(2, "0")}
        </span>
      </div>

      <div className={`flex min-w-0 flex-col ${featured ? "justify-center" : ""}`}>
        <div className="flex items-center gap-3">
          <Avatar initials={post.initials} color={post.avatar} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[#eeece8]">
              {post.name}
            </p>
            <p className="mt-1 truncate text-[10px] text-[#85878a]">
              {post.role} <span className="px-1 text-[#57595d]">·</span>{" "}
              {post.time}
            </p>
          </div>
          <button
            type="button"
            aria-label={`${saved ? "Remove saved" : "Save"} ${post.name}'s post`}
            aria-pressed={saved}
            onClick={onSave}
            className={`p-2 transition hover:text-white ${
              saved ? "text-[#f4f0e9]" : "text-[#85878a]"
            }`}
          >
            <Icon name="bookmark" size={16} />
          </button>
        </div>

        <h3
          className={`mt-5 font-serif leading-[1.15] tracking-[-0.025em] text-[#f3f1ed] ${
            featured
              ? "text-[27px] sm:text-[34px]"
              : "text-[23px] sm:text-[26px]"
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#a2a3a5]">
          {post.body}
        </p>

        <div className="mt-5 flex items-center gap-5 border-t border-white/[0.08] pt-3">
          <button
            type="button"
            aria-label={`${liked ? "Unlike" : "Like"} post`}
            aria-pressed={liked}
            onClick={onLike}
            className={`inline-flex items-center gap-2 text-[11px] transition ${
              liked ? "text-[#e7a19a]" : "text-[#85878a] hover:text-[#e7a19a]"
            }`}
          >
            <Icon name="heart" size={15} />
            {post.likes + (liked ? 1 : 0)}
          </button>
          <button
            type="button"
            aria-expanded={commentsOpen}
            onClick={onToggleComments}
            className="inline-flex items-center gap-2 text-[11px] text-[#85878a] transition hover:text-white"
          >
            <Icon name="message" size={15} />
            {post.comments} replies
          </button>
          <span className="ml-auto text-[9px] tracking-[0.15em] text-[#696b6e]">
            {post.discussion ? "OPEN DISCUSSION" : "FIELD NOTE"}
          </span>
        </div>

        {commentsOpen && (
          <div className="mt-4 border-l border-white/15 pl-4">
            <p className="text-[11px] leading-5 text-[#8f9193]">
              Join the conversation with a thoughtful reply.
            </p>
            {post.replies?.map((reply, index) => (
              <p
                key={`${post.id}-${index}`}
                className="mt-3 text-xs leading-5 text-[#d0cfcc]"
              >
                {reply}
              </p>
            ))}
            <form onSubmit={submitComment} className="mt-3 flex gap-3">
              <label className="sr-only" htmlFor={`reply-${post.id}`}>
                Write a reply
              </label>
              <input
                id={`reply-${post.id}`}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Add to the conversation..."
                className="min-w-0 flex-1 border-b border-white/15 bg-transparent py-2 text-xs text-white outline-none placeholder:text-[#686a6d] focus:border-white/55"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="text-xs text-[#e2ded7] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Reply
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Films");
  const [feedTab, setFeedTab] = useState("For you");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [openComments, setOpenComments] = useState<number[]>([]);
  const [progress, setProgress] = useState(3);
  const [joinedCourses, setJoinedCourses] = useState<string[]>([
    "visual-language",
  ]);
  const [followedCreators, setFollowedCreators] = useState<string[]>([
    "Amara Okafor",
    "Priya Nair",
  ]);
  const [notice, setNotice] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTab =
        feedTab === "Following"
          ? post.following
          : feedTab === "Discussions"
            ? post.discussion
            : true;
      const matchesQuery =
        !normalizedQuery ||
        `${post.name} ${post.topic} ${post.title} ${post.body}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
  }, [feedTab, posts, query]);

  function navigate(label: string, target: string) {
    setActiveNav(label);
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleNumber(
    id: number,
    current: number[],
    update: (next: number[]) => void,
  ) {
    update(
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  function searchPosts(value: string) {
    setQuery(value);
    if (value && !query) navigate("Community", "community");
  }

  function addPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedDraft = draft.trim();
    if (!trimmedDraft) return;

    setPosts((current) => [
      {
        id: Date.now(),
        name: "Maya Chen",
        initials: "MC",
        avatar: "bg-[#52575d]",
        role: "Filmmaker in progress",
        time: "Just now",
        topic: "COMMUNITY NOTE",
        title: "A thought from my notebook",
        body: trimmedDraft,
        likes: 0,
        comments: 0,
        following: true,
        discussion: true,
        artwork: "/fellas-scene-window.svg",
        artworkAlt: "Original scene illustration for a community note",
        replies: [],
      },
      ...current,
    ]);
    setDraft("");
    setComposerOpen(false);
    setFeedTab("For you");
    setQuery("");
    setNotice("Your note is now in the community feed.");
    navigate("Community", "community");
  }

  function joinCourse(courseId: string, courseTitle: string) {
    setJoinedCourses((current) =>
      current.includes(courseId) ? current : [...current, courseId],
    );
    setNotice(`Added “${courseTitle}” to your learning plan.`);
  }

  function toggleFollow(name: string) {
    const following = followedCreators.includes(name);
    setFollowedCreators((current) =>
      following ? current.filter((creator) => creator !== name) : [...current, name],
    );
    setPosts((current) =>
      current.map((post) =>
        post.name === name ? { ...post, following: !following } : post,
      ),
    );
    setNotice(`${following ? "Unfollowed" : "Following"} ${name}.`);
  }

  function exploreScene(search: string) {
    setFeedTab("For you");
    setQuery(search);
    navigate("Community", "community");
  }

  const navItems = [
    { label: "Films", target: "movies" },
    { label: "Community", target: "community" },
    { label: "Creators", target: "creators" },
    { label: "Learn", target: "learn" },
    { label: "Collaborate", target: "collaborate" },
    { label: "Scenes", target: "cinema" },
    { label: "Saved", target: "library" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#eeece8]">
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0b0c0e]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-7 lg:px-10">
          <a
            href="#home"
            aria-label="FELLAS home"
            onClick={(event) => {
              event.preventDefault();
              navigate("Films", "home");
            }}
            className="shrink-0"
          >
            <span className="sm:hidden">
              <Logo compact />
            </span>
            <span className="hidden sm:block">
              <Logo />
            </span>
          </a>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 xl:flex"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                aria-current={activeNav === item.label ? "location" : undefined}
                onClick={() => navigate(item.label, item.target)}
                className={`text-[11px] transition ${
                  activeNav === item.label
                    ? "text-white"
                    : "text-[#8b8d90] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <label className="relative hidden w-[190px] lg:block">
              <span className="sr-only">Search the community</span>
              <Icon
                name="search"
                size={15}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#77797c]"
              />
              <input
                value={query}
                onChange={(event) => searchPosts(event.target.value)}
                placeholder="Search the conversation"
                className="h-9 w-full border-b border-white/15 bg-transparent pl-6 pr-2 text-[11px] text-white outline-none placeholder:text-[#6f7174] focus:border-white/60"
              />
            </label>
            <button
              type="button"
              onClick={() => setMobileSearchOpen((open) => !open)}
              aria-label={mobileSearchOpen ? "Close search" : "Search"}
              className="p-2 text-[#a1a2a4] transition hover:text-white lg:hidden"
            >
              <Icon name={mobileSearchOpen ? "close" : "search"} size={18} />
            </button>
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="hidden items-center gap-2 border-b border-white/45 py-2 text-[11px] text-[#e5e2dc] transition hover:border-white hover:text-white sm:flex"
            >
              <Icon name="plus" size={15} />
              Share a thought
            </button>
            <button
              type="button"
              aria-label="Share a thought"
              onClick={() => setComposerOpen(true)}
              className="flex h-9 w-9 items-center justify-center text-[#e5e2dc] transition hover:text-white sm:hidden"
            >
              <Icon name="plus" size={19} />
            </button>
          </div>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex gap-6 overflow-x-auto border-t border-white/[0.06] px-4 py-3 text-[11px] xl:hidden sm:px-7 lg:px-10"
        >
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-current={activeNav === item.label ? "location" : undefined}
              onClick={() => navigate(item.label, item.target)}
              className={`shrink-0 transition ${
                activeNav === item.label
                  ? "text-white"
                  : "text-[#8b8d90] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {mobileSearchOpen && (
          <div className="border-t border-white/[0.06] px-4 py-3 lg:hidden">
            <label className="relative block">
              <span className="sr-only">Search the community</span>
              <Icon
                name="search"
                size={15}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#77797c]"
              />
              <input
                autoFocus
                value={query}
                onChange={(event) => searchPosts(event.target.value)}
                placeholder="Search ideas, people, films..."
                className="h-9 w-full border-b border-white/15 bg-transparent pl-6 pr-2 text-xs text-white outline-none placeholder:text-[#6f7174] focus:border-white/60"
              />
            </label>
          </div>
        )}
      </header>

      <main>
        <section
          id="home"
          aria-labelledby="hero-heading"
          className="relative isolate flex min-h-[380px] scroll-mt-32 items-end overflow-hidden border-b border-white/[0.08] sm:min-h-[450px] lg:min-h-[min(500px,60vh)]"
        >
          <CinematicImage
            src="/fellas-cinematic-hero.svg"
            alt="Original cinematic landscape: a lone figure facing a vast, illuminated doorway beneath a deep night sky"
            className="z-0 object-[62%_center]"
            preload
          />
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(7,8,10,0.94)_0%,rgba(7,8,10,0.76)_38%,rgba(7,8,10,0.12)_100%)]" />
          <div className="absolute inset-0 z-10 bg-[linear-gradient(0deg,#0b0c0e_0%,rgba(11,12,14,0.12)_42%,rgba(11,12,14,0.18)_100%)]" />

          <div className="relative z-20 mx-auto w-full max-w-[1440px] px-4 pb-8 pt-20 sm:px-7 sm:pb-12 lg:px-10 lg:pb-14">
            <div className="max-w-[760px] animate-cinema-reveal">
              <p className="mb-5 text-[10px] font-medium tracking-[0.24em] text-[#d1d1cf]">
                FELLAS PRESENTS · A WORLD IN EVERY FRAME
              </p>
              <h1
                id="hero-heading"
                className="font-serif text-[clamp(3rem,7vw,6.4rem)] leading-[0.94] tracking-[-0.055em] text-[#f2f0eb]"
              >
                Explore the
                <br />
                <span className="italic text-[#c9c7c2]">world of cinema.</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[#c0c1c2] sm:text-base">
                Discover films. Explore the minds behind them. Find your next
                obsession.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <button
                  type="button"
                  onClick={() => navigate("Films", "movies")}
                  className="group inline-flex items-center gap-3 border-b border-white/70 pb-2 text-xs font-medium text-white transition hover:border-white"
                >
                  Explore films
                  <Icon
                    name="arrow"
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("Creators", "creators")}
                  className="text-xs text-[#b8b9bb] transition hover:text-white"
                >
                  Meet the creators
                </button>
              </div>
            </div>
            <p className="mt-10 text-[9px] tracking-[0.2em] text-white/50 sm:mt-12">
              FELLAS <span className="px-2 text-white/25">/</span> MEET. CREATE.
              COLLABORATE.
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-16 right-8 z-20 hidden text-right text-[9px] leading-5 tracking-[0.16em] text-white/55 lg:block">
            WATCH CLOSER · THINK DEEPER
            <br />
            35° 41&apos; 22&quot; N — SOMEWHERE IN BETWEEN
          </div>
        </section>

        <MovieDiscovery />

        <section
          id="community"
          aria-labelledby="community-heading"
          className="scroll-mt-32"
        >
          <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-7 sm:py-24 lg:px-10">
            <div className="grid gap-8 pb-9 md:grid-cols-[1fr_auto] md:items-end">
              <div className="max-w-3xl">
                <p className="mb-4 text-[9px] tracking-[0.22em] text-[#85878a]">
                  02 <span className="px-2 text-white/30">/</span> OPEN
                  CONVERSATIONS
                </p>
                <h2
                  id="community-heading"
                  className="font-serif text-4xl leading-[1.08] tracking-[-0.04em] text-[#f0efec] sm:text-5xl"
                >
                  The scene ends.
                  <br />
                  <span className="italic text-[#a9aaac]">
                    The conversation doesn&apos;t.
                  </span>
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#929497]">
                  A place for the details you noticed, the questions you kept,
                  and the ideas that grew after the credits.
                </p>
              </div>
              <button
                type="button"
                id="collaborate"
                onClick={() => setComposerOpen(true)}
                className="group inline-flex items-center gap-3 justify-self-start border-b border-white/30 pb-2 text-xs text-[#e7e5df] transition hover:border-white md:justify-self-end"
              >
                Start a conversation
                <Icon
                  name="plus"
                  size={15}
                  className="transition-transform group-hover:rotate-90"
                />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/[0.12] py-3">
              <div className="flex items-center gap-5 sm:gap-7">
                {["For you", "Following", "Discussions"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFeedTab(tab)}
                    className={`relative py-1 text-[11px] transition ${
                      feedTab === tab
                        ? "text-white"
                        : "text-[#77797c] hover:text-[#deddda]"
                    }`}
                  >
                    {tab}
                    {feedTab === tab && (
                      <span className="absolute -bottom-[13px] left-0 right-0 h-px bg-[#ece9e3]" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-5">
                <label className="relative hidden w-[210px] sm:block">
                  <span className="sr-only">Search discussions</span>
                  <Icon
                    name="search"
                    size={14}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-[#737578]"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search films, ideas, people"
                    className="h-7 w-full border-b border-white/10 bg-transparent pl-5 text-[10px] text-white outline-none placeholder:text-[#67696c] focus:border-white/40"
                  />
                </label>
                <span className="text-[9px] tracking-[0.14em] text-[#686a6d]">
                  {filteredPosts.length} NOTES
                </span>
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div>
                {filteredPosts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    featured={index === 0}
                    liked={likedPosts.includes(post.id)}
                    saved={savedPosts.includes(post.id)}
                    commentsOpen={openComments.includes(post.id)}
                    onLike={() =>
                      toggleNumber(post.id, likedPosts, setLikedPosts)
                    }
                    onSave={() =>
                      toggleNumber(post.id, savedPosts, setSavedPosts)
                    }
                    onToggleComments={() =>
                      toggleNumber(post.id, openComments, setOpenComments)
                    }
                    onAddComment={(comment) => {
                      setPosts((current) =>
                        current.map((item) =>
                          item.id === post.id
                            ? {
                                ...item,
                                comments: item.comments + 1,
                                replies: [...(item.replies ?? []), comment],
                              }
                            : item,
                        ),
                      );
                      setNotice("Your reply has been added.");
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="border-b border-white/[0.12] py-16 text-center">
                <p className="font-serif text-2xl text-[#d8d6d2]">
                  Nothing in this frame yet.
                </p>
                <p className="mt-2 text-xs text-[#85878a]">
                  Try another search or open up a new conversation.
                </p>
              </div>
            )}
          </div>
        </section>

        <section
          id="creators"
          aria-labelledby="creators-heading"
          className="scroll-mt-32 border-y border-white/[0.08] bg-[#111315]"
        >
          <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-7 sm:py-24 lg:px-10">
            <div className="mb-10 max-w-2xl">
              <p className="mb-4 text-[9px] tracking-[0.22em] text-[#85878a]">
                03 <span className="px-2 text-white/30">/</span> PEOPLE BEHIND
                THE FRAME
              </p>
              <h2
                id="creators-heading"
                className="font-serif text-4xl leading-[1.08] tracking-[-0.04em] text-[#f0efec] sm:text-5xl"
              >
                Good work is
                <br />
                <span className="italic text-[#a9aaac]">never made alone.</span>
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              {creators.slice(0, 1).map((creator) => {
                const isFollowing = followedCreators.includes(creator.name);
                return (
                  <article
                    key={creator.name}
                    className="group relative isolate min-h-[430px] overflow-hidden bg-[#1a1c20] sm:min-h-[500px]"
                  >
                    <CreatorPortrait
                      variant={creator.art}
                      name={creator.name}
                      className="absolute inset-0 z-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/10 to-black/5" />
                    <div className="absolute left-5 top-5 z-20 text-[9px] tracking-[0.18em] text-white/70">
                      CREATOR STUDY <span className="px-1">/</span> 001
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-8">
                      <p className="text-[10px] tracking-[0.16em] text-white/65">
                        {creator.role.toUpperCase()} · {creator.location.toUpperCase()}
                      </p>
                      <h3 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
                        {creator.name}
                      </h3>
                      <p className="mt-2 max-w-sm text-xs leading-5 text-white/75">
                        {creator.line}
                      </p>
                      <button
                        type="button"
                        aria-pressed={isFollowing}
                        onClick={() => toggleFollow(creator.name)}
                        className="mt-5 border-b border-white/50 pb-1.5 text-[11px] text-white transition hover:border-white"
                      >
                        {isFollowing
                          ? "Following"
                          : `Follow ${creator.name.split(" ")[0]}`}
                      </button>
                    </div>
                  </article>
                );
              })}

              <div className="flex flex-col justify-center">
                <p className="mb-2 text-[9px] tracking-[0.18em] text-[#77797c]">
                  PEOPLE TO KNOW
                </p>
                {creators.slice(1).map((creator, index) => {
                  const isFollowing = followedCreators.includes(creator.name);
                  return (
                    <article
                      key={creator.name}
                      className="grid grid-cols-[76px_minmax(0,1fr)] items-center gap-4 border-t border-white/[0.12] py-5 sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:gap-5"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1c20]">
                        <CreatorPortrait
                          variant={creator.art}
                          name={creator.name}
                          className="h-full w-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] tracking-[0.14em] text-[#8d8f91]">
                          00{index + 2} <span className="px-1">/</span>{" "}
                          {creator.role.toUpperCase()} ·{" "}
                          {creator.location.toUpperCase()}
                        </p>
                        <h3 className="mt-1 font-serif text-xl text-[#f0efec]">
                          {creator.name}
                        </h3>
                        <p className="mt-1 text-[11px] leading-5 text-[#929497]">
                          {creator.line}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-pressed={isFollowing}
                        onClick={() => toggleFollow(creator.name)}
                        className="col-start-2 justify-self-start border-b border-white/25 pb-1 text-[10px] text-[#cfced0] transition hover:border-white sm:col-start-auto sm:justify-self-end"
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </article>
                  );
                })}
                <p className="mt-5 text-[10px] leading-5 text-[#74767a]">
                  Directors, editors, writers, and the people who make every
                  frame matter.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="cinema"
          aria-labelledby="cinema-heading"
          className="scroll-mt-32"
        >
          <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-7 sm:py-24 lg:px-10">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-4 text-[9px] tracking-[0.22em] text-[#85878a]">
                  04 <span className="px-2 text-white/30">/</span> LOOK AGAIN
                </p>
                <h2
                  id="cinema-heading"
                  className="font-serif text-4xl tracking-[-0.04em] text-[#f0efec] sm:text-5xl"
                >
                  Scenes that stay with us.
                </h2>
              </div>
              <p className="max-w-xs text-xs leading-5 text-[#929497]">
                Enter a moment. Notice what others missed. Find the conversation
                waiting inside it.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <button
                type="button"
                onClick={() => exploreScene(scenes[0].search)}
                className="group text-left"
              >
                <div className="relative aspect-[1.22] overflow-hidden bg-[#1a1c20] sm:aspect-[1.55]">
                  <CinematicImage
                    src={scenes[0].artwork}
                    alt={scenes[0].alt}
                    className="transition-transform duration-700 group-hover:scale-[1.03]"
                    objectPosition="center 60%"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
                  <p className="absolute left-5 top-5 text-[9px] tracking-[0.18em] text-white/75">
                    SCENE NOTES <span className="px-1">/</span> 01
                  </p>
                  <p className="absolute bottom-5 left-5 text-[9px] tracking-[0.18em] text-white/75">
                    {scenes[0].film} <span className="px-1">·</span>{" "}
                    {scenes[0].label}
                  </p>
                </div>
                <h3 className="mt-5 font-serif text-2xl text-[#f1efeb] transition group-hover:text-white sm:text-3xl">
                  {scenes[0].title}
                </h3>
                <p className="mt-2 max-w-lg text-xs leading-5 text-[#929497]">
                  {scenes[0].detail}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] text-[#d8d6d2]">
                  Find the discussion
                  <Icon
                    name="arrow"
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </button>

              <div className="flex flex-col justify-between">
                {scenes.slice(1).map((scene, index) => (
                  <button
                    key={scene.title}
                    type="button"
                    onClick={() => exploreScene(scene.search)}
                    className="group grid grid-cols-[minmax(110px,0.85fr)_minmax(0,1.15fr)] gap-4 border-t border-white/[0.12] py-5 text-left sm:gap-5"
                  >
                    <div className="relative aspect-[1.2] overflow-hidden bg-[#1a1c20]">
                      <CinematicImage
                        src={scene.artwork}
                        alt={scene.alt}
                        className="transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[8px] tracking-[0.13em] text-[#85878a]">
                        0{index + 2} <span className="px-1">/</span> {scene.film}
                      </p>
                      <h3 className="mt-2 font-serif text-lg leading-tight text-[#eeece8] sm:text-xl">
                        {scene.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-[10px] leading-5 text-[#898b8e]">
                        {scene.detail}
                      </p>
                      <span className="mt-3 text-[8px] tracking-[0.15em] text-[#77797c]">
                        {scene.label}
                      </span>
                    </div>
                  </button>
                ))}
                <div className="border-t border-white/[0.12] pt-5">
                  <p className="text-[10px] leading-5 text-[#74767a]">
                    Original artwork, open interpretations. The images here are
                    visual studies, not frames from the films.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="learn"
          aria-labelledby="learn-heading"
          className="scroll-mt-32 border-y border-white/[0.08] bg-[#111315]"
        >
          <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-7 sm:py-24 lg:px-10">
            <div className="grid gap-10 border-b border-white/[0.12] pb-10 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="mb-4 text-[9px] tracking-[0.22em] text-[#85878a]">
                  05 <span className="px-2 text-white/30">/</span> THE CRAFT
                </p>
                <h2
                  id="learn-heading"
                  className="font-serif text-4xl leading-[1.08] tracking-[-0.04em] text-[#f0efec] sm:text-5xl"
                >
                  Keep looking.
                  <br />
                  <span className="italic text-[#a9aaac]">Keep making.</span>
                </h2>
                <p className="mt-4 max-w-lg text-xs leading-6 text-[#929497]">
                  Small, thoughtful paths into the decisions behind a film —
                  built for curious people, not a curriculum checklist.
                </p>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-5 border-l border-white/20 pl-5 md:min-w-[280px] md:justify-end">
                <div>
                  <p className="text-[9px] tracking-[0.15em] text-[#85878a]">
                    BACK IN THE EDIT ROOM
                  </p>
                  <p className="mt-2 font-serif text-xl text-[#eeece8]">
                    Reading the Frame
                  </p>
                  <p className="mt-1 text-[10px] text-[#85878a]">
                    Lesson {Math.min(progress + 1, 8)} of 8 · The shape of a shot
                  </p>
                  <p className="mt-2 text-[9px] text-[#686a6d]">
                    {progress} chapters explored
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setProgress((current) => Math.min(current + 1, 8))}
                  disabled={progress === 8}
                  className="group inline-flex items-center gap-2 border-b border-white/35 pb-1.5 text-[10px] text-[#e2e0dc] transition hover:border-white disabled:cursor-default disabled:opacity-55"
                >
                  {progress === 8 ? "Path complete" : "Continue"}
                  <Icon name={progress === 8 ? "check" : "arrow"} size={14} />
                </button>
              </div>
            </div>

            <div className="mt-2">
              {courses.map((course, index) => {
                const isJoined = joinedCourses.includes(course.id);
                return (
                  <article
                    key={course.id}
                    className="grid gap-4 border-b border-white/[0.12] py-5 sm:grid-cols-[84px_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                  >
                    <div className="relative hidden aspect-[4/3] overflow-hidden bg-[#1a1c20] sm:block">
                      <CinematicImage src={course.artwork} alt="" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] tracking-[0.16em] text-[#85878a]">
                        0{index + 1} <span className="px-1">/</span>{" "}
                        {course.category}
                      </p>
                      <h3 className="mt-1.5 font-serif text-xl text-[#f0efec]">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-[10px] text-[#8c8e91]">
                        {course.detail} <span className="px-1">·</span>{" "}
                        {course.lessons} <span className="px-1">·</span>{" "}
                        {course.duration}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-pressed={isJoined}
                      onClick={() => joinCourse(course.id, course.title)}
                      className="inline-flex items-center gap-2 justify-self-start text-[10px] text-[#d8d6d2] transition hover:text-white sm:justify-self-end"
                    >
                      {isJoined ? (
                        <>
                          <Icon name="check" size={13} /> In your practice
                        </>
                      ) : (
                        <>
                          Explore this path <Icon name="arrow" size={13} />
                        </>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="library"
          aria-labelledby="library-heading"
          className="scroll-mt-32"
        >
          <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-7 sm:py-20 lg:px-10">
            <div className="grid gap-7 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="mb-4 text-[9px] tracking-[0.22em] text-[#85878a]">
                  A PRIVATE NOTEBOOK
                </p>
                <h2
                  id="library-heading"
                  className="font-serif text-3xl tracking-[-0.03em] text-[#f0efec]"
                >
                  Scenes and ideas
                  <br />
                  <span className="italic text-[#a9aaac]">to return to.</span>
                </h2>
                <p className="mt-3 max-w-sm text-xs leading-5 text-[#85878a]">
                  Save the conversations you want to keep close.
                </p>
              </div>
              <div className="border-t border-white/[0.12]">
                {savedPosts.length ? (
                  posts
                    .filter((post) => savedPosts.includes(post.id))
                    .map((post) => (
                      <div
                        key={post.id}
                        className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.12] py-4"
                      >
                        <div>
                          <p className="text-[8px] tracking-[0.16em] text-[#85878a]">
                            {post.topic} <span className="px-1">/</span>{" "}
                            {post.name}
                          </p>
                          <p className="mt-1 font-serif text-lg text-[#e9e7e3]">
                            {post.title}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${post.name}'s post from saved notes`}
                          onClick={() =>
                            toggleNumber(post.id, savedPosts, setSavedPosts)
                          }
                          className="text-[10px] text-[#85878a] transition hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="py-5 text-xs text-[#85878a]">
                    Nothing saved just yet. Bookmark a post that stays with you.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.1]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-5 px-4 py-8 sm:px-7 lg:px-10">
          <div>
            <p className="font-serif text-2xl tracking-[0.08em] text-[#f2f0eb]">
              FELLAS
            </p>
            <p className="mt-1 text-[9px] tracking-[0.14em] text-[#85878a]">
              Where Cinema People Belong.
            </p>
          </div>
          <p className="text-[9px] tracking-[0.16em] text-[#737578]">
            MEET. CREATE. COLLABORATE.
          </p>
        </div>
      </footer>

      {composerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setComposerOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="composer-heading"
            className="w-full max-w-lg border border-white/15 bg-[#111315] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] tracking-[0.2em] text-[#898b8e]">
                  YOUR NOTEBOOK, OPEN
                </p>
                <h2
                  id="composer-heading"
                  className="mt-2 font-serif text-2xl text-[#f0efed]"
                >
                  Share a thought
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close composer"
                onClick={() => setComposerOpen(false)}
                className="p-2 text-[#8a8c8f] hover:text-white"
              >
                <Icon name="close" size={17} />
              </button>
            </div>
            <form onSubmit={addPost}>
              <label className="sr-only" htmlFor="post-draft">
                What are you thinking about?
              </label>
              <textarea
                id="post-draft"
                autoFocus
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={500}
                rows={5}
                placeholder="A scene you can’t stop thinking about, a question from set, something you learned..."
                className="mt-5 w-full resize-none border border-white/[0.12] bg-[#0b0c0e] p-4 text-sm leading-6 text-white outline-none placeholder:text-[#686a6d] focus:border-white/45"
              />
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-[10px] text-[#77797c]">
                  Good conversations start with curiosity.
                </p>
                <span className="text-[10px] text-[#77797c]">
                  {draft.length}/500
                </span>
              </div>
              <button
                type="submit"
                disabled={!draft.trim()}
                className="mt-5 inline-flex items-center gap-2 border-b border-white/50 pb-2 text-xs text-white transition hover:border-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Share with the community <Icon name="arrow" size={14} />
              </button>
            </form>
          </section>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[60] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 border border-white/15 bg-[#16181a] px-4 py-3 text-xs text-[#e7e2d9] shadow-xl"
        >
          {notice}
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
            className="ml-1 p-1 text-[#85878a] hover:text-white"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
