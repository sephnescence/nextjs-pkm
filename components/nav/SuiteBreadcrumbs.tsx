import Link from 'next/link'

type BreadcrumbsProps = {
  suiteId: string
  suiteName: string
}

const SuiteBreadcrumbs = ({ suiteId, suiteName }: BreadcrumbsProps) => {
  return (
    <div className="flex gap-2">
      <Link href={`/suites`}>Suites</Link>
      <Link href={`/suite/${suiteId}/dashboard`}>&gt; {suiteName}</Link>
    </div>
  )
}

export default SuiteBreadcrumbs
