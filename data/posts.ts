import type { Post } from "@/types/post";

// Sample blog-style content used as a temporary stand-in for live RSS data.
// In Assessment 2, this array will be replaced by posts created and sent
// by the RSS Server's admin and API routes once that functionality exists.

export const posts: Post[] = [
  {
    slug: "welcome-to-the-rss-server",
    title: "Welcome to the RSS Server",
    date: "2026-07-14",
    author: "System Notice",
    category: "Announcements",
    summary:
      "An introduction to how this server will let an admin create and categorise posts, ready to be sent out to RSS clients such as the LMS once backend work begins in Assessment 2.",
    body:
      "This post stands in for a real RSS item. In the finished system, each entry in this list will represent one post authored by an admin on this server, tagged with a category, and sent out to whichever RSS clients are subscribed, including the LMS. For now the frontend is wired against static sample data so that layout, navigation, and interaction patterns can be finalised before any admin tooling or sending code is written.",
    readTime: "3 min read",
  },
  {
    slug: "how-feed-cards-will-work",
    title: "How Feed Cards Will Work",
    date: "2026-07-16",
    author: "Frontend Team",
    category: "Design",
    summary:
      "A look at the card layout used for each feed item, and why it was chosen over a plain list for scanability on small screens.",
    body:
      "Each feed card shows a title, a publish date, a short summary, and a read-more control. Cards were chosen over a dense table because they scale better on narrow viewports and let a reader scan headlines quickly, similar to how a lecturer would scan a list of new course announcements between classes.",
    readTime: "4 min read",
  },
  {
    slug: "accessibility-first-navigation",
    title: "Accessibility-First Navigation",
    date: "2026-07-18",
    author: "UX Notes",
    category: "Accessibility",
    summary:
      "Notes on keyboard support, ARIA labelling, and colour contrast decisions made while building the navigation bar and hamburger menu.",
    body:
      "Every interactive control in the navigation, including the hamburger toggle and theme switch, can be reached and operated using the keyboard alone. Focus states are visible, menu state is announced through aria-expanded, and colour choices were checked against WCAG AA contrast thresholds in both light and dark themes.",
    readTime: "5 min read",
  },
  {
    slug: "planning-the-lms-handoff",
    title: "Planning the LMS Handoff",
    date: "2026-07-20",
    author: "Systems Notice",
    category: "Architecture",
    summary:
      "An outline of how posts created and categorised on the RSS Server will eventually be sent out to the LMS as a receiving client.",
    body:
      "Once Assessment 2 introduces the server, an admin will create and categorise posts here, and each one will be queued and sent out to subscribed RSS clients. The LMS is one such client: a receiving frame that displays whatever the server sends, rather than requesting or assembling content itself. The frontend already expects that exact post shape, which is why the sample data in this stand-in matches the fields a real feed item will carry.",
    readTime: "4 min read",
  },
  {
    slug: "dark-mode-and-reading-comfort",
    title: "Dark Mode and Reading Comfort",
    date: "2026-07-21",
    author: "UX Notes",
    category: "Design",
    summary:
      "Why the theme toggle exists, how the preference is stored, and how colours were adjusted so dark mode stays readable.",
    body:
      "Admins and readers alike often work on course content late at night between other tasks, so a dark theme was treated as a first-class option rather than an afterthought. The chosen colour is saved to local storage on toggle and re-applied before the page paints, avoiding a flash of the wrong theme on reload.",
    readTime: "3 min read",
  },
  {
    slug: "what-assessment-two-adds",
    title: "What Assessment 2 Adds",
    date: "2026-07-22",
    author: "System Notice",
    category: "Announcements",
    summary:
      "A short preview of the backend capability that will be layered underneath this frontend in the next assessment.",
    body:
      "Assessment 2 introduces the RSS Server itself: an admin flow for creating and categorising posts, and a sending pipeline that pushes those posts out to subscribed RSS clients on a schedule, replacing the static sample data used here with live content. None of the interface built for Assessment 1 should need to change shape, only its data source.",
    readTime: "3 min read",
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
