import Link from 'next/link'

type BreadcrumbsProps = {
  suiteId: string
  suiteName: string
  storeyId: string
  storeyName: string
}

const StoreyBreadcrumbs = ({
  suiteId,
  suiteName,
  storeyId,
  storeyName,
}: BreadcrumbsProps) => {
  return (
    <div className="flex gap-2">
      <Link href={`/suites`}>Suites</Link>
      <Link href={`/suite/${suiteId}/dashboard`}>&gt; {suiteName}</Link>
      <Link href={`/suite/${suiteId}/storey/${storeyId}/dashboard`}>
        &gt; {storeyName}
      </Link>
    </div>
  )
}

export default StoreyBreadcrumbs
