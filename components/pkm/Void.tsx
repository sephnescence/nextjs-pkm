import PkmItem from './PkmItem'

export default function Void(props: {
  voidItem: { content: string; name: string; summary: string }
}) {
  return (
    <PkmItem>
      <div className="text-lg line-clamp-1">{props.voidItem.name}</div>
      <div className="text-sm line-clamp-4">{props.voidItem.summary}</div>
    </PkmItem>
  )
}
