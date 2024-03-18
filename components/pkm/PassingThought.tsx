import BoltIcon from '../icons/BoltIcon'
import PkmItem from './PkmItem'

export default function PassingThought(props: {
  passingThoughtItem: { content: string; name: string; summary: string }
}) {
  return (
    <PkmItem>
      <div className="flex-none">
        <BoltIcon />
      </div>
      <div className="flex-initial ml-2">
        <div className="flex-none">{props.passingThoughtItem.name}</div>
        <div className="flex-none">{props.passingThoughtItem.summary}</div>
      </div>
    </PkmItem>
  )
}
