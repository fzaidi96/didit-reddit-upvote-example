import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import Tiptap from "@/components/TipTap";
import { Vote } from "@/components/Vote";
import { db } from "@/db";

export async function generateMetadata({params}) {
  const postId = params.postId
  const { rows: posts } = await db.query(`SELECT title FROM posts WHERE id = $1`, [postId]);

  if (posts.length === 0) {
    return {
      title: "Post not found | didit"
    };
  }

  return {
    title: `${posts[0].title} | didit`,
  };
}

export default async function SinglePostPage({ params }) {
  const postId = params.postId;

  const { rows: posts } = await db.query(
    `SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, 
    COALESCE(SUM(votes.vote), 0) AS vote_total
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN votes ON votes.post_id = posts.id
    WHERE posts.id = $1
    GROUP BY posts.id, users.name
    LIMIT 1;`,
    [postId]
  );
  const post = posts[0];

  const { rows: votes } = await db.query(
    `SELECT *, users.name from votes
     JOIN users on votes.user_id = users.id`
  );

  return (
    <div className="max-w-screen-lg mx-auto pt-10">
      <h1 className="text-2xl">
        {post.title}
      </h1>
      <Tiptap />
      {/* removed post votes from the title  so easier to read for user*/}
      <p className="text-zinc-400 border-b border-zinc-800 mb-4">
        Posted by {post.name}
      </p>
      <main className="whitespace-pre-wrap">{post.body}</main>

      <h2>Votes</h2>
      <Vote postId={post.id} votes={post.vote_total} />

      <CommentForm postId={post.id} />
      <CommentList postId={post.id} />

      {/* <ul>
        {votes.map((vote) => (
          <li key={vote.id} className="text-zinc-400">
            <span className="text-white">{vote.name}</span> votes{" "}
            <span className="text-white">{vote.vote}</span>{" "}
            <small>{new Date(vote.created_at).toUTCString()}</small>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
