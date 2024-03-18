export default function PkmItem(props: { children: React.ReactNode }) {
  return (
    <div className="flex bg-indigo-950 hover:bg-violet-900 p-4 mb-2 rounded-2xl items-center">
      {props.children}
    </div>
  )
}
