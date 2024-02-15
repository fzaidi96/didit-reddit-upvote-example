import { db } from "@/db";
import auth from "../app/middleware";
import { revalidatePath } from "next/cache";
import { VoteButton } from "./VoteButton";
import { redirect } from "next/navigation";

export async function Vote({ postId, votes }) {
  
  async function upvote() {
    "use server";
    const session = await auth();
    if(session) {
      console.log("Upvote", postId, "by user", session.user.id);
      try {
        await db.query(
          "INSERT INTO votes (user_id, post_id, vote, vote_type) VALUES ($1, $2, $3, $4)",
          [session.user.id, postId, 1, "post"]
        );
      }
      catch (error) {
        console.log(error);
      }
      revalidatePath("/");
      revalidatePath(`/post/${postId}`);
    }
    else {
      redirect("/error");
    }
  }

  async function downvote() {
    "use server";
    const session = await auth();
    if(session) {
      console.log("Upvote", postId, "by user", session.user.id);
      try {
        await db.query(
          "INSERT INTO votes (user_id, post_id, vote, vote_type) VALUES ($1, $2, $3, $4)",
          [session.user.id, postId, 1, "post"]
        );
      }
      catch (error) {
        console.log(error);
      }
      revalidatePath("/");
      revalidatePath(`/post/${postId}`);
    }
    else {
      redirect("/error");
    }
  }

  return (
    <>
      {votes} votes
      <div className="flex space-x-3">
        <form action={upvote}>
          <VoteButton label="Upvote" />
        </form>
        <form action={downvote}>
          <VoteButton label="Downvote" />
        </form>
      </div>
    </>
  );
}
// Paul helped me with the error message by sharing his code. I wanted to use a modal but by doing {!session && <NotLoggedInModal />} but I believe the modals wouldn't appear because the up and down vote functions are use server? 