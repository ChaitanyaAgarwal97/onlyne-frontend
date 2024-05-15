import { SignUp, SignedOut } from "@clerk/nextjs";

export default function Page() {
    return <SignedOut><SignUp /></SignedOut>
}