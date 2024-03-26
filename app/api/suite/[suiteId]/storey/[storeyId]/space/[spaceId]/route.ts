'use server'

import { getSpaceForUser, updateSpace } from '@/repositories/space'
import { getStoreyForUser } from '@/repositories/storey'
import { getSuiteForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type SpaceGetParams = {
  params: {
    suiteId: string
    storeyId: string
    spaceId: string
  }
}

type SpacePatchParams = {
  params: {
    suiteId: string
    storeyId: string
    spaceId: string
  }
}

// Get a Space
export const GET = async (
  request: Request,
  { params: { suiteId, storeyId, spaceId } }: SpaceGetParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingSuite = await getSuiteForUser(suiteId, user.id)

  if (!existingSuite) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  const existingStorey = await getStoreyForUser(suiteId, storeyId, user.id)

  if (!existingStorey) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  const existingSpace = await getSpaceForUser(storeyId, spaceId, user.id)

  if (!existingSpace) {
    return NextResponse.json({
      success: false,
      redirect: '/',
    })
  }

  return NextResponse.json({
    success: true,
    space: {
      name: existingSpace.name,
      description: existingSpace.description,
      content: existingSpace.content,
    },
    storey: {
      name: existingSpace.name,
      description: existingSpace.description,
      content: existingSpace.content,
    },
    suite: {
      name: existingSuite.name,
      description: existingSuite.description,
      content: existingSuite.content,
    },
  })
}

// Update a Space
export const PATCH = async (
  request: Request,
  { params: { suiteId, storeyId, spaceId } }: SpacePatchParams,
) => {
  const user = await getUserAuth()

  if (!user) {
    return NextResponse.json({
      success: true,
      redirect: '/',
    })
  }

  const existingSuite = await getSuiteForUser(suiteId, user.id)

  if (!existingSuite) {
    return NextResponse.json({
      success: false,
      error: 'Suite not found',
    })
  }

  const existingStorey = await getStoreyForUser(suiteId, storeyId, user.id)

  if (!existingStorey) {
    return NextResponse.json({
      success: false,
      error: 'Storey not found',
    })
  }

  const existingSpace = await getSpaceForUser(storeyId, spaceId, user.id)

  if (!existingSpace) {
    return NextResponse.json({
      success: false,
      error: 'Space not found',
    })
  }

  const storeyArgs = (await request.json()) || ''

  if (!storeyArgs.name) {
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

  if (!storeyArgs.description) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          description: 'Description is required',
        },
      },
    })
  }

  if (!storeyArgs.content) {
    return NextResponse.json({
      success: false,
      errors: {
        fieldErrors: {
          general: 'There were validation errors',
          content: 'Content is required',
        },
      },
    })
  }

  const updatedSpace = await updateSpace({
    name: storeyArgs.name,
    description: storeyArgs.description,
    content: storeyArgs.content,
    storeyId,
    spaceId,
    userId: user.id,
  })

  if (!updatedSpace) {
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
    redirect: `/suite/${suiteId}/storey/${storeyId}/space/${spaceId}/view`,
  })
}
