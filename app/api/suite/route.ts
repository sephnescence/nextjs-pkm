'use server'

import { storeSuite } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const suiteArgs = (await request.json()) || ''

  if (!suiteArgs.name) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          name: 'Name is required',
        },
      },
    })
  }

  if (!suiteArgs.description) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          description: 'description is required',
        },
      },
    })
  }

  const newSuite = await storeSuite({
    userId: user.id,
    name: suiteArgs.name,
    description: suiteArgs.description,
  })

  if (!newSuite) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'An unexpected error occurred. Please try again.',
        },
      },
    })
  }

  return NextResponse.json({
    success: true,
    redirect: '/suites',
  })
}
