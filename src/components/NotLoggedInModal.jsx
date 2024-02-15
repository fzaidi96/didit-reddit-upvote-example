import Link from "next/link";

export default function NotLoggedInModal() {

    return (
        <div className="modal">
            <p>You need to be logged in to vote</p>
            <Link href="/">close</Link>
        </div>
    )}

