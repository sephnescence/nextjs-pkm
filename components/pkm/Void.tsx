import ArchiveBoxXMarkIcon from '../icons/ArchiveBoxXMarkIcon'
import PkmItem from './PkmItem'

export default function Void(props: {
  voidItem: { content: string; name: string; summary: string }
}) {
  return (
    <PkmItem>
      <div className="flex-none">
        <ArchiveBoxXMarkIcon />
      </div>
      <div className="flex-initial ml-2">
        <div className="flex-none">{props.voidItem.name}</div>
        <div className="flex-none">{props.voidItem.summary}</div>
      </div>
    </PkmItem>
  )
}
