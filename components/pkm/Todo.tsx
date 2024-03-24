import PkmItem from './PkmItem'

export default function Todo(props: {
  todoItem: { content: string; name: string; summary: string }
}) {
  return (
    <PkmItem>
      <div className="text-lg line-clamp-1">{props.todoItem.name}</div>
      <div className="text-sm line-clamp-4">{props.todoItem.summary}</div>
    </PkmItem>
  )
}
