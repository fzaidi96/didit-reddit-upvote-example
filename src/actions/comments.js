"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveComment({ postId, parentCommentId }, formData) {
  const session = await auth();
  if(!session) {
    redirect("/error");
  }

  await db.query(
    "INSERT INTO comments (user_id, post_id, parent_comment_id, body) VALUES ($1, $2, $3, $4)",
    [session.user.id, postId, parentCommentId, formData.get("comment")]
  );

  revalidatePath(`/post/${postId}`);
  return { success: true };
}
