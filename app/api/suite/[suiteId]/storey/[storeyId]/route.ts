'use server'

import { storeSpace } from '@/repositories/space'
import { getStoreyForUser, updateStorey } from '@/repositories/storey'
import { getSuiteForUser } from '@/repositories/suite'
import { getUserAuth } from '@/utils/auth'
import { NextResponse } from 'next/server'

type StoreyGetParams = {
  params: {
    suiteId: string
    storeyId: string
  }
}

type StoreyPatchParams = {
  params: {
    suiteId: string
    storeyId: string
  }
}

type SpacePostParams = {
  params: {
    suiteId: string
    storeyId: string
  }
}

// Get a Storey
export const GET = async (
  request: Request,
  { params: { suiteId, storeyId } }: StoreyGetParams,
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

  return NextResponse.json({
    success: true,
    storey: {
      name: existingStorey.name,
      description: existingStorey.description,
      content: existingStorey.content,
    },
    suite: {
      name: existingSuite.name,
      description: existingSuite.description,
      content: existingSuite.content,
    },
  })
}

// Update a Storey
export const PATCH = async (
  request: Request,
  { params: { suiteId, storeyId } }: StoreyPatchParams,
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

  const updatedStorey = await updateStorey({
    name: storeyArgs.name,
    description: storeyArgs.description,
    suiteId,
    storeyId,
    userId: user.id,
  })

  if (!updatedStorey) {
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
    redirect: `/suites/${suiteId}/dashboard`,
  })
}

// Create a Space
export const POST = async (
  request: Request,
  { params: { suiteId, storeyId } }: SpacePostParams,
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

  const spaceArgs = (await request.json()) || ''

  if (!spaceArgs.name) {
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

  if (!spaceArgs.description) {
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

  if (!spaceArgs.content) {
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

  const newSpace = await storeSpace({
    userId: user.id,
    storeyId,
    name: spaceArgs.name,
    description: spaceArgs.description,
    content: spaceArgs.content,
  })

  if (!newSpace || !newSpace.space || !newSpace.success) {
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
    redirect: `/suite/${suiteId}/storey/${storeyId}/space/${newSpace.space.id}`,
  })
}
