import { SignedIn, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import PkmIcon from '../icons/PkmIcon'
import BuildingOffice2Icon from '../icons/BuildingOffice2Icon'

const TopNav = () => {
  return (
    <SignedIn>
      <div className="mx-4 my-4 absolute top-0 right-0 flex">
        <div className="mr-4">
          <Link href="/reception">
            <PkmIcon className="w-8 h-8" />
          </Link>
        </div>
        <div className="mr-4 bg-indigo-900 rounded-full">
          <Link href="/suites">
            <BuildingOffice2Icon className="w-8 h-8" style={{ scale: '0.5' }} />
          </Link>
        </div>
        <div className="mr-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </SignedIn>
  )
}

export default TopNav
