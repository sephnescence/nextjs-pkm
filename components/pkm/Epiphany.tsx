import LightbulbIcon from '../icons/LightbulbIcon'
import PkmItem from './PkmItem'

export default function Epiphany(props: {
  epiphanyItem: { content: string; name: string; summary: string }
}) {
  return (
    <PkmItem>
      <div className="flex-none">
        <LightbulbIcon />
      </div>
      <div className="flex-initial ml-2">
        <div className="flex-none">{props.epiphanyItem.name}</div>
        <div className="flex-none">{props.epiphanyItem.summary}</div>
      </div>
    </PkmItem>
  )
}
