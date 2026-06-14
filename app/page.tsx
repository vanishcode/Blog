import { allPosts } from "@/.contentlayer/generated";
import Link from "next/link";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  const posts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section>
      <div className="card">
        <ul className="m-0 p-0 list-none">
          {posts.map((post, idx) => (
            <li
              key={post._id}
              className={
                idx === posts.length - 1
                  ? "py-5"
                  : "py-5 border-b border-line"
              }
            >
              <Link
                href={post.slug}
                className="group flex items-baseline gap-3 sm:gap-4"
              >
                <div className="font-semibold text-ink group-hover:text-accent transition-colors min-w-0 flex-1">
                  {post.title}
                </div>
                <span className="text-[12px] text-muted whitespace-nowrap shrink-0">
                  {formatDate(post.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
