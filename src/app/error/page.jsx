import { LoginButton } from "@/components/LoginButton";

export default async function ErrorMessafe () {
  return (
    <div className="max-w-screen-lg mx-auto p-4 mt-10">
    You need to <LoginButton /> to vote
    </div>
  );
}