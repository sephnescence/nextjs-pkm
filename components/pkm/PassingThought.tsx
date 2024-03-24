import PkmItem from './PkmItem'

export default function PassingThought(props: {
  passingThoughtItem: { content: string; name: string; summary: string }
}) {
  return (
    <PkmItem>
      <div className="text-lg line-clamp-1">
        {props.passingThoughtItem.name}
      </div>
      <div className="text-sm line-clamp-4">
        {props.passingThoughtItem.summary}
      </div>
    </PkmItem>
  )
}
