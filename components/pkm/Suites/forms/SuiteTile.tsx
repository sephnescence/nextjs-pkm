import ArchiveBoxXMarkIcon from '@/components/icons/ArchiveBoxXMarkIcon'
import BellAlertIcon from '@/components/icons/BellAlertIcon'
import BoltIcon from '@/components/icons/BoltIcon'
import InboxStackIcon from '@/components/icons/InboxStackIcon'
import LightbulbIcon from '@/components/icons/LightbulbIcon'
import Link from 'next/link'

type SuiteTileProps = {
  id: string
  name: string
  description: string
}

const SuiteTile = ({ id, name, description }: SuiteTileProps) => {
  return (
    <div
      key={id}
      className="bg-indigo-900 rounded-xl p-4 m-1 hover:ring-1 hover:ring-indigo-500 min-h-48"
    >
      <Link href={`/suite/${id}`}>
        <div className="h-28 mb-2">
          <div className="text-lg mb-2 line-clamp-1">{name}</div>
          <div className="text-sm line-clamp-4">{description}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <div className="bg-indigo-950 h-8 m-1 py-1 px-3 rounded-lg hover:ring-1 hover:ring-indigo-500 hover:bg-violet-900">
            <button
              type="button"
              className="flex rounded-lg focus:outline-offset-1 focus:outline-indigo-600"
              disabled={true}
            >
              <InboxStackIcon />
              <div className="ml-2 flex-grow text-center center">NYI</div>
            </button>
          </div>
          <div className="bg-indigo-950 h-8 m-1 py-1 px-3 rounded-lg hover:ring-1 hover:ring-indigo-500 hover:bg-violet-900">
            <button
              type="button"
              className="flex rounded-lg focus:outline-offset-1 focus:outline-indigo-600"
              disabled={true}
            >
              <LightbulbIcon />
              <div className="ml-2 flex-grow text-center center">NYI</div>
            </button>
          </div>
          <div className="bg-indigo-950 h-8 m-1 py-1 px-3 rounded-lg hover:ring-1 hover:ring-indigo-500 hover:bg-violet-900">
            <button
              type="button"
              className="flex rounded-lg focus:outline-offset-1 focus:outline-indigo-600"
              disabled={true}
            >
              <BoltIcon />
              <div className="ml-2 flex-grow text-center center">NYI</div>
            </button>
          </div>
          <div className="bg-indigo-950 h-8 m-1 py-1 px-3 rounded-lg hover:ring-1 hover:ring-indigo-500 hover:bg-violet-900">
            <button
              type="button"
              className="flex rounded-lg focus:outline-offset-1 focus:outline-indigo-600"
              disabled={true}
            >
              <BellAlertIcon />
              <div className="ml-2 flex-grow text-center center">NYI</div>
            </button>
          </div>
          <div className="bg-indigo-950 h-8 m-1 py-1 px-3 rounded-lg hover:ring-1 hover:ring-indigo-500 hover:bg-violet-900">
            <button
              type="button"
              className="flex rounded-lg focus:outline-offset-1 focus:outline-indigo-600"
              disabled={true}
            >
              <ArchiveBoxXMarkIcon />
              <div className="ml-2 flex-grow text-center center">NYI</div>
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default SuiteTile
