import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
  return (
    <div className="bg-black/50 w-full h-full flex justify-center items-center">
      <div>
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
      </div>
    </div>
  )
}

export default SignUpPage
