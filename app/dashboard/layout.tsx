import PkmIcon from '@/components/icons/PkmIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="mx-4 my-4 absolute top-0 right-0 flex">
          <div className="mr-4">
            <Link href="/dashboard">
              <PkmIcon className="w-8 h-8" />
            </Link>
          </div>
          <div className="mr-4 bg-slate-600 rounded-full">
            <Link href="/dashboard/trash">
              <TrashIcon className="w-8 h-8" style={{ scale: '0.5' }} />
            </Link>
          </div>
          <div className="mr-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
        <div className="mx-4 mt-16 md:mt-4 mb-4">{children}</div>
      </SignedIn>
    </>
  )
}
