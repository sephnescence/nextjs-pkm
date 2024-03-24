import PkmItem from './PkmItem'

export default function Epiphany(props: {
  epiphanyItem: { content: string; name: string; summary: string }
}) {
  return (
    <PkmItem>
      <div className="text-lg line-clamp-1">{props.epiphanyItem.name}</div>
      <div className="text-sm line-clamp-4">{props.epiphanyItem.summary}</div>
    </PkmItem>
  )
}
