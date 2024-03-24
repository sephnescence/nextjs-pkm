'use server'

import ArchiveBoxXMarkIcon from '@/components/icons/ArchiveBoxXMarkIcon'
import BellAlertIcon from '@/components/icons/BellAlertIcon'
import BoltIcon from '@/components/icons/BoltIcon'
import InboxStackIcon from '@/components/icons/InboxStackIcon'
import LightbulbIcon from '@/components/icons/LightbulbIcon'
import ListBulletIcon from '@/components/icons/ListBulletIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import { getUserAuth } from '@/utils/auth'
import Epiphany from '@/components/pkm/Epiphany'
import Inbox from '@/components/pkm/Inbox'
import PassingThought from '@/components/pkm/PassingThought'
import Todo from '@/components/pkm/Todo'
import Void from '@/components/pkm/Void'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSuiteDashboardForUser } from '@/repositories/suite'
import SuiteInformationPacketTabGroup from '@/components/pkm/Suites/content/SuiteInformationPacketTabGroup'
import KeyIcon from '@/components/icons/KeyIcon'
import TrashIcon from '@/components/icons/TrashIcon'

export default async function SuiteDashboardIndex({
  params: { suiteId },
}: {
  params: { suiteId: string }
}) {
  const user = await getUserAuth()

  if (!user) {
    return redirect('/')
  }

  const suite = await getSuiteDashboardForUser(suiteId, user.id)

  if (!suite) {
    return redirect('/')
  }
  const suiteInformationPacketTabGroupProps = {
    tabGroupInputName: 'suite',
    tabs: [
      {
        tabName: 'content',
        tabHeader: <KeyIcon />,
        tabContent: <>Content NYI</>,
        tabContentClassName:
          'group-has-[.innsight-tab-group#suite--tab--content:checked]:block',
      },
      {
        tabName: 'epiphany',
        tabHeader: <LightbulbIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  {/* <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/epiphany`}
                    >
                      <LightbulbIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div> */}
                  <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/epiphany/create`}
                    >
                      <LightbulbIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {suite?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmEpiphany'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/epiphany/view/${item.model_id}/${item.history_id}`}
                      >
                        <Epiphany epiphanyItem={item.epiphany_item!} />
                      </Link>
                    </div>
                  )
                })}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#suite--tab--epiphany:checked]:block',
      },
      {
        tabDefaultChecked: true,
        tabName: 'inbox',
        tabHeader: <InboxStackIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  {/* <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/inbox`}
                    >
                      <InboxStackIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div> */}
                  <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/inbox/create`}
                    >
                      <InboxStackIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {suite?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmInbox'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/inbox/view/${item.model_id}/${item.history_id}`}
                      >
                        <Inbox inboxItem={item.inbox_item!} />
                      </Link>
                    </div>
                  )
                })}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#suite--tab--inbox:checked]:block',
      },
      {
        tabName: 'passing-thought',
        tabHeader: <BoltIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  {/* <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/passing-thought`}
                    >
                      <BoltIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div> */}
                  <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-rose-600"
                      href={`/suite/${suiteId}/passing-thought/create`}
                    >
                      <BoltIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {suite?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmPassingThought'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/passing-thought/view/${item.model_id}/${item.history_id}`}
                      >
                        <PassingThought
                          passingThoughtItem={item.passing_thought_item!}
                        />
                      </Link>
                    </div>
                  )
                })}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#suite--tab--passing-thought:checked]:block',
      },
      {
        tabName: 'todo',
        tabHeader: <BellAlertIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  {/* <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/todo`}
                    >
                      <BellAlertIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div> */}
                  <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-cyan-600"
                      href={`/suite/${suiteId}/todo/create`}
                    >
                      <BellAlertIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {suite?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmTodo'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/todo/view/${item.model_id}/${item.history_id}`}
                      >
                        <Todo todoItem={item.todo_item!} />
                      </Link>
                    </div>
                  )
                })}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#suite--tab--todo:checked]:block',
      },
      {
        tabName: 'void',
        tabHeader: <ArchiveBoxXMarkIcon />,
        tabContent: (
          <>
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 left-0 flex">
                  {/* <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href={`/suite/${suiteId}/void`}
                    >
                      <ArchiveBoxXMarkIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div> */}
                  <div className="bg-indigo-950 h-8 mr-2 py-1 px-3 rounded-lg hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-orange-600"
                      href={`/suite/${suiteId}/void/create`}
                    >
                      <ArchiveBoxXMarkIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {suite?.pkm_history
                ?.filter((item) => {
                  return item.model_type === 'PkmVoid'
                })
                .map((item) => {
                  return (
                    <div key={item.model_id}>
                      <Link
                        href={`/suite/${suiteId}/void/view/${item.model_id}/${item.history_id}`}
                      >
                        <Void voidItem={item.void_item!} />
                      </Link>
                    </div>
                  )
                })}
            </div>
          </>
        ),
        tabContentClassName:
          'group-has-[.innsight-tab-group#suite--tab--void:checked]:block',
      },
      {
        tabName: 'trash',
        tabHeader: <TrashIcon />,
        tabContent: <>Trash NYI</>,
        tabContentClassName:
          'group-has-[.innsight-tab-group#suite--tab--trash:checked]:block',
      },
    ],
  }

  return (
    <>
      <p className="text-5xl">
        <Link href={`/suite/view/${suiteId}`}>{suite.name}</Link>
      </p>
      <div className="mt-4 text-xl text-white/60 mb-4">{suite.description}</div>
      <SuiteInformationPacketTabGroup
        suiteInformationPacketTabGroupProps={
          suiteInformationPacketTabGroupProps
        }
      />
    </>
  )
}
