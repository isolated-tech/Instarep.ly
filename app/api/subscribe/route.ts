import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const apiKey = process.env.KIT_API_KEY
    const tagName = process.env.KIT_TAG_NAME || 'instareply-waitlist'

    if (!apiKey) {
      console.error('Missing Kit.com API key')
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      )
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey,
    }

    // Step 1: Create subscriber using Kit.com API v4
    console.log('Creating subscriber:', email)
    const subscriberResponse = await fetch(
      'https://api.kit.com/v4/subscribers',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email_address: email,
          state: 'active',
        }),
      }
    )

    const subscriberData = await subscriberResponse.json()
    console.log('Subscriber response status:', subscriberResponse.status)
    console.log('Subscriber response data:', subscriberData)

    if (!subscriberResponse.ok) {
      console.error('Kit.com API error (subscriber):', subscriberData)
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: subscriberResponse.status }
      )
    }

    // Step 2: Create or get the tag
    // If tag exists, this returns the existing tag with its ID
    console.log('Creating/getting tag:', tagName)
    const tagResponse = await fetch(
      'https://api.kit.com/v4/tags',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: tagName,
        }),
      }
    )

    const tagData = await tagResponse.json()
    console.log('Tag response status:', tagResponse.status)
    console.log('Tag response data:', tagData)

    if (!tagResponse.ok && tagResponse.status !== 200) {
      console.error('Kit.com API error (tag):', tagData)
      // Don't fail the whole request if tagging fails
      console.warn('Subscriber created but tagging failed')
      return NextResponse.json(
        { success: true, message: 'Successfully subscribed!' },
        { status: 200 }
      )
    }

    const tagId = tagData.tag?.id

    if (!tagId) {
      console.error('No tag ID returned:', tagData)
      // Subscriber was created, so still return success
      return NextResponse.json(
        { success: true, message: 'Successfully subscribed!' },
        { status: 200 }
      )
    }

    // Step 3: Tag the subscriber by email address
    console.log('Tagging subscriber with tag ID:', tagId)
    const tagSubscriberResponse = await fetch(
      `https://api.kit.com/v4/tags/${tagId}/subscribers`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email_address: email,
        }),
      }
    )

    console.log('Tag subscriber response status:', tagSubscriberResponse.status)

    if (!tagSubscriberResponse.ok) {
      const tagSubscriberData = await tagSubscriberResponse.json()
      console.error('Kit.com API error (tag subscriber):', tagSubscriberData)
      // Don't fail the whole request if tagging fails
      console.warn('Subscriber created but tagging failed')
    } else {
      const tagSubscriberData = await tagSubscriberResponse.json()
      console.log('Tag subscriber response data:', tagSubscriberData)
    }

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
