import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
    </div>
  )
}
