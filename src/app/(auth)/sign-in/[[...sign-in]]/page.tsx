import { SignIn, SignedOut } from "@clerk/nextjs";

export default function SignUpPage() {
    return <SignedOut><SignIn /></SignedOut>
}