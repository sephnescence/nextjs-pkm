import Link from 'next/link'

type BreadcrumbsProps = {
  suiteId: string
  suiteName: string
  storeyId: string
  storeyName: string
  spaceId: string
  spaceName: string
}

const SpaceBreadcrumbs = ({
  suiteId,
  suiteName,
  storeyId,
  storeyName,
  spaceId,
  spaceName,
}: BreadcrumbsProps) => {
  return (
    <div className="flex gap-2 line-clamp-1 overflow-x-scroll">
      <Link className="" href={`/suites`}>
        Suites
      </Link>
      <Link className="hidden md:block" href={`/suite/${suiteId}/dashboard`}>
        &gt;&nbsp;{suiteName}
      </Link>
      <Link className="md:hidden" href={`/suite/${suiteId}/dashboard`}>
        &gt;&nbsp;...
      </Link>
      <Link
        className=""
        href={`/suite/${suiteId}/storey/${storeyId}/dashboard`}
      >
        &gt;&nbsp;{storeyName}
      </Link>
      <Link
        className=""
        href={`/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/dashboard`}
      >
        &gt;&nbsp;{spaceName}
      </Link>
    </div>
  )
}

export default SpaceBreadcrumbs
