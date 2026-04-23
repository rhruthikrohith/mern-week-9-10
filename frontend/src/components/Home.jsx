import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

const categories = ["All", "Technology", "Programming", "AI", "Web Development"];

const sampleArticles = [
  {
    id: 1,
    title: "The Future of Artificial Intelligence",
    category: "AI",
    excerpt: "Exploring how AI is reshaping industries, from healthcare to finance, and what lies ahead in the next decade.",
    author: "Alex Johnson",
    date: "Apr 20, 2026",
    readTime: "5 min read",
    emoji: "🤖",
  },
  {
    id: 2,
    title: "Mastering React in 2026",
    category: "Programming",
    excerpt: "A deep dive into the latest React patterns, Server Components, and best practices for modern web apps.",
    author: "Sara Williams",
    date: "Apr 18, 2026",
    readTime: "7 min read",
    emoji: "⚛️",
  },
  {
    id: 3,
    title: "Web Development Trends to Watch",
    category: "Web Development",
    excerpt: "From edge computing to WebAssembly — the trends that will define web development this year.",
    author: "Mike Chen",
    date: "Apr 15, 2026",
    readTime: "4 min read",
    emoji: "🌐",
  },
  {
    id: 4,
    title: "Understanding Cloud Architecture",
    category: "Technology",
    excerpt: "How modern cloud infrastructure works and why it matters for every developer building at scale.",
    author: "Priya Sharma",
    date: "Apr 12, 2026",
    readTime: "6 min read",
    emoji: "☁️",
  },
  {
    id: 5,
    title: "TypeScript Tips for Large Codebases",
    category: "Programming",
    excerpt: "Advanced TypeScript patterns that keep your codebase maintainable as it grows beyond 100k lines.",
    author: "David Kim",
    date: "Apr 10, 2026",
    readTime: "8 min read",
    emoji: "🔷",
  },
  {
    id: 6,
    title: "Building with Large Language Models",
    category: "AI",
    excerpt: "Practical guide to integrating LLMs into your product — prompting, fine-tuning, and deployment.",
    author: "Nina Patel",
    date: "Apr 8, 2026",
    readTime: "9 min read",
    emoji: "🧠",
  },
];

const stats = [
  { label: "Articles Published", value: "1,200+", emoji: "📝" },
  { label: "Active Authors", value: "340+", emoji: "✍️" },
  { label: "Monthly Readers", value: "50K+", emoji: "👥" },
  { label: "Topics Covered", value: "20+", emoji: "🏷️" },
];

function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const [animatedStats, setAnimatedStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedStats(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const filtered = sampleArticles.filter((a) => {
    const matchCategory = activeCategory === "All" || a.category === activeCategory;
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (currentUser?.role === "AUTHOR") navigate("/author-profile");
      else navigate("/user-profile");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 px-4 rounded-3xl mt-6 mb-16">
        {/* decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Welcome to MyBlog
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Ideas Worth
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {" "}Reading
            </span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Discover articles on technology, programming, AI, and web development — written by passionate authors for curious minds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              {isAuthenticated ? "Go to Profile →" : "Get Started Free →"}
            </button>
            <button
              onClick={() => document.getElementById("articles").scrollIntoView({ behavior: "smooth" })}
              className="border border-slate-500 hover:border-slate-300 text-slate-300 hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
            >
              Browse Articles
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center transition-all duration-700 ${
              animatedStats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="text-3xl mb-2">{stat.emoji}</div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ── ARTICLES ── */}
      <section id="articles" className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Latest Articles</h2>
            <p className="text-slate-500 mt-1">Stay up to date with the latest in tech</p>
          </div>
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(3); }}
              className="pl-9 pr-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-56"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(3); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-slate-800 text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">No articles found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(0, visibleCount).map((article) => (
                <div
                  key={article.id}
                  className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col"
                  onClick={() => navigate(isAuthenticated ? "/user-profile" : "/login")}
                >
                  <div className="text-4xl mb-4">{article.emoji}</div>
                  <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{article.excerpt}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400">
                    <span>✍️ {article.author}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {visibleCount < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((v) => v + 3)}
                  className="border border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-800 font-medium px-8 py-2.5 rounded-full transition-all duration-200"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── CTA BANNER ── */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-3xl p-12 text-center mb-16">
          <div className="text-4xl mb-4">✍️</div>
          <h2 className="text-3xl font-bold mb-3">Start Writing Today</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Join hundreds of authors sharing their knowledge. Create your account and publish your first article.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
            >
              Create Account →
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </section>
      )}

    </div>
  );
}

export default Home;