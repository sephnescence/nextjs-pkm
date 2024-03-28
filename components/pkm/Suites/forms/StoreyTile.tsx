'use client'

import ArchiveBoxXMarkIcon from '@/components/icons/ArchiveBoxXMarkIcon'
import BellAlertIcon from '@/components/icons/BellAlertIcon'
import BoltIcon from '@/components/icons/BoltIcon'
import InboxStackIcon from '@/components/icons/InboxStackIcon'
import LightbulbIcon from '@/components/icons/LightbulbIcon'
import Link from 'next/link'
import SuiteItemSummary from './SuiteItemSummary'
import KeyIcon from '@/components/icons/KeyIcon'

type StoreyTileProps = {
  suiteId: string
  storeyId: string
  name: string
  description: string
}

const StoreyTile = ({
  suiteId,
  storeyId,
  name,
  description,
}: StoreyTileProps) => {
  const href = `/suite/${suiteId}/storey/${storeyId}/dashboard`
  return (
    <div
      key={`${suiteId}-${storeyId}`}
      className="bg-indigo-900 rounded-xl p-4 m-1 hover:ring-1 hover:ring-indigo-500 min-h-48"
    >
      <Link href={href}>
        <div className="h-28 mb-2">
          <div className="text-lg mb-2 line-clamp-1">{name}</div>
          <div className="text-sm line-clamp-4">{description}</div>
        </div>
      </Link>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <SuiteItemSummary
          href={`${href}?tab=spaces`}
          icon={<KeyIcon />}
          iconText="NYI"
        />
        <SuiteItemSummary
          href={`${href}?tab=epiphany`}
          icon={<InboxStackIcon />}
          iconText="NYI"
        />
        <SuiteItemSummary
          href={`${href}?tab=inbox`}
          icon={<LightbulbIcon />}
          iconText="NYI"
        />
        <SuiteItemSummary
          href={`${href}?tab=passing-thought`}
          icon={<BoltIcon />}
          iconText="NYI"
        />
        <SuiteItemSummary
          href={`${href}?tab=todo`}
          icon={<BellAlertIcon />}
          iconText="NYI"
        />
        <SuiteItemSummary
          href={`${href}?tab=void`}
          icon={<ArchiveBoxXMarkIcon />}
          iconText="NYI"
        />
      </div>
    </div>
  )
}

export default StoreyTile
