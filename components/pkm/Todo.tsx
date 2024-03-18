import BellAlertIcon from '../icons/BellAlertIcon'
import PkmItem from './PkmItem'

export default function Todo(props: {
  todoItem: { content: string; name: string; summary: string }
}) {
  return (
    <PkmItem>
      <div className="flex-none">
        <BellAlertIcon />
      </div>
      <div className="flex-initial ml-2">
        <div className="flex-none">{props.todoItem.name}</div>
        <div className="flex-none">{props.todoItem.summary}</div>
      </div>
    </PkmItem>
  )
}
