'use server'

import ArchiveBoxXMarkIcon from '@/components/icons/ArchiveBoxXMarkIcon'
import BellAlertIcon from '@/components/icons/BellAlertIcon'
import BoltIcon from '@/components/icons/BoltIcon'
import InboxStackIcon from '@/components/icons/InboxStackIcon'
import LightbulbIcon from '@/components/icons/LightbulbIcon'
import ListBulletIcon from '@/components/icons/ListBulletIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import { getUserDashboardByClerkId } from '@/repositories/user'
import { getClerkId } from '@/utils/auth'
import Epiphany from '@/components/pkm/Epiphany'
import Inbox from '@/components/pkm/Inbox'
import PassingThought from '@/components/pkm/PassingThought'
import Todo from '@/components/pkm/Todo'
import Void from '@/components/pkm/Void'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardIndex() {
  const clerkId = await getClerkId()
  if (!clerkId) {
    return redirect('/')
  }

  const loaderData = await getUserDashboardByClerkId(clerkId)

  return (
    <>
      <p className="text-5xl">Dashboard</p>
      <div className="mt-4 text-xl text-white/60 mb-4">
        Monitor your Inbox and quickly assign them to the correct areas
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-2">
          <div className="h-8 mb-2">
            <Link
              className="rounded-lg focus:outline-offset-1 focus:outline-yellow-600"
              href="/dashboard/inbox/create"
            >
              <div className="relative">
                <div className="absolute top-0 right-0 flex bg-indigo-950 h-8 py-1 px-3 rounded-lg hover:ring-1 hover:ring-yellow-500 hover:bg-violet-900">
                  <InboxStackIcon />
                  <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                </div>
              </div>
            </Link>
          </div>
          <div className=""></div>
          {loaderData?.pkm_history
            ?.filter((item) => {
              return item.model_type === 'PkmInbox'
            })
            .map((item) => {
              return (
                <div
                  key={item.model_id}
                  className="rounded-2xl hover:ring-1 hover:ring-yellow-500"
                >
                  <Link
                    className="rounded-2xl focus:outline-offset-1 focus:outline-yellow-600"
                    href={`/dashboard/inbox/view/${item.model_id}/${item.history_id}`}
                  >
                    <Inbox inboxItem={item.inbox_item!} />
                  </Link>
                </div>
              )
            })}
        </div>
        <div className="p-2">
          <div className="mb-8">
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 right-0 flex">
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href="/dashboard/epiphany"
                    >
                      <LightbulbIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div>
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href="/dashboard/epiphany/create"
                    >
                      <LightbulbIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {loaderData?.pkm_history
              ?.filter((item) => {
                return item.model_type === 'PkmEpiphany'
              })
              .map((item) => {
                return (
                  <div
                    key={item.model_id}
                    className="rounded-2xl hover:ring-1 hover:ring-lime-500"
                  >
                    <Link
                      className="rounded-2xl focus:border-red-500 focus:outline-offset-1 focus:outline-lime-600"
                      href={`/dashboard/epiphany/view/${item.model_id}/${item.history_id}`}
                    >
                      <Epiphany epiphanyItem={item.epiphany_item!} />
                    </Link>
                  </div>
                )
              })}
          </div>
          <div className="mb-8">
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 right-0 flex">
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href="/dashboard/passing-thought"
                    >
                      <BoltIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div>
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-rose-600"
                      href="/dashboard/passing-thought/create"
                    >
                      <BoltIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {loaderData?.pkm_history
              ?.filter((item) => {
                return item.model_type === 'PkmPassingThought'
              })
              .map((item) => {
                return (
                  <div
                    key={item.model_id}
                    className="rounded-2xl hover:ring-1 hover:ring-rose-500"
                  >
                    <Link
                      className="rounded-2xl focus:border-red-500 focus:outline-offset-1 focus:outline-rose-600"
                      href={`/dashboard/passing-thought/view/${item.model_id}/${item.history_id}`}
                    >
                      <PassingThought
                        passingThoughtItem={item.passing_thought_item!}
                      />
                    </Link>
                  </div>
                )
              })}
          </div>
          <div className="mb-8">
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 right-0 flex">
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href="/dashboard/todo"
                    >
                      <BellAlertIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div>
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-cyan-600"
                      href="/dashboard/todo/create"
                    >
                      <BellAlertIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {loaderData?.pkm_history
              ?.filter((item) => {
                return item.model_type === 'PkmTodo'
              })
              .map((item) => {
                return (
                  <div
                    key={item.model_id}
                    className="rounded-2xl hover:ring-1 hover:ring-cyan-500"
                  >
                    <Link
                      className="rounded-2xl focus:border-red-500 focus:outline-offset-1 focus:outline-cyan-600"
                      href={`/dashboard/todo/view/${item.model_id}/${item.history_id}`}
                    >
                      <Todo todoItem={item.todo_item!} />
                    </Link>
                  </div>
                )
              })}
          </div>
          <div className="mb-8">
            <div className="h-8 mb-2">
              <div className="relative">
                <div className="absolute top-0 right-0 flex">
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-lime-600"
                      href="/dashboard/void"
                    >
                      <ArchiveBoxXMarkIcon />
                      <ListBulletIcon
                        viewBox="6 -3 12 48"
                        className="w-2 h-6"
                      />
                    </Link>
                  </div>
                  <div className="bg-indigo-950 h-8 ml-2 py-1 px-3 rounded-lg hover:ring-1 hover:ring-lime-500 hover:bg-violet-900">
                    <Link
                      className="flex rounded-lg focus:outline-offset-1 focus:outline-orange-600"
                      href="/dashboard/void/create"
                    >
                      <ArchiveBoxXMarkIcon />
                      <PlusIcon viewBox="6 -3 12 48" className="w-2 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {loaderData?.pkm_history
              ?.filter((item) => {
                return item.model_type === 'PkmVoid'
              })
              .map((item) => {
                return (
                  <div
                    key={item.model_id}
                    className="rounded-2xl hover:ring-1 hover:ring-orange-500"
                  >
                    <Link
                      className="rounded-2xl focus:border-red-500 focus:outline-offset-1 focus:outline-orange-600"
                      href={`/dashboard/void/view/${item.model_id}/${item.history_id}`}
                    >
                      <Void voidItem={item.void_item!} />
                    </Link>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}
