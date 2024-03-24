import PkmItem from './PkmItem'

export default function Inbox(props: {
  inboxItem: { content: string; name: string; summary: string }
}) {
  return (
    <PkmItem>
      <div className="text-lg line-clamp-1">{props.inboxItem.name}</div>
      <div className="text-sm line-clamp-4">{props.inboxItem.summary}</div>
    </PkmItem>
  )
}
