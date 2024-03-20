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
        <div className="mx-4 md:mx-0 mt-16 md:mt-0 mb-4 md:mb-0">
          <div className="grid grid-cols-1 xl:grid-cols-6 xl:min-h-screen">
            <div className="xl:grid-cols-1 hidden xl:block pl-4 pr-2 py-4">
              {/* Suites will go here */}
            </div>
            <div className="xl:col-span-4 px-2 py-4">{children}</div>
            <div className="hidden xl:block grid-cols-1 pl-2 pr-4 py-4"></div>
          </div>
        </div>
      </SignedIn>
    </>
  )
}
