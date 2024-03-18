import InboxStackIcon from '../icons/InboxStackIcon'
import PkmItem from './PkmItem'

export default function Inbox(props: {
  inboxItem: { content: string; name: string; summary: string }
}) {
  return (
    <PkmItem>
      <div className="flex-none">
        <InboxStackIcon />
      </div>
      <div className="flex-initial ml-2">
        <div className="flex-none">{props.inboxItem.name}</div>
        <div className="flex-none">{props.inboxItem.summary}</div>
      </div>
    </PkmItem>
  )
}
