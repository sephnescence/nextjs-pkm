import { auth } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  const { userId } = auth()

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-5xl mb-4">Personal Knowledge Management</h1>
        <p className="text-2xl text-blue-400 mb-4">Your journey starts here</p>
        <div>
          <Link href={userId ? '/dashboard' : '/sign-in'}>
            <button
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
              type="button"
            >
              Get started
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
