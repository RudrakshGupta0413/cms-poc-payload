'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Editable } from '@/components/Editable'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from 'lexical'
import type { Post } from '@/payload-types'

const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN ?? 'http://localhost:3000'

export function LivePreviewPost({ initialPost }: { initialPost: Post }) {
  const [post, setPost] = useState<Post>(initialPost)
  const [mounted, setMounted] = useState(false)
  const readySent = useRef(false)

  useEffect(() => {
    setMounted(true)
    const isPreview =
      typeof window !== 'undefined' &&
      (new URLSearchParams(window.location.search).has('livePreview') || window.self !== window.top)

    if (!isPreview) return

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== ADMIN_ORIGIN) return
      const msg = event.data
      if (!msg || typeof msg !== 'object' || msg.type !== 'payload-live-preview') return
      if (msg.ready !== undefined) return
      if (msg.data && typeof msg.data === 'object') {
        setPost((prev) => ({
          ...prev,
          ...msg.data,
        }))
      }
    }

    window.addEventListener('message', handleMessage)
    if (!readySent.current) {
      readySent.current = true
      window.parent.postMessage({ type: 'payload-live-preview', ready: true }, ADMIN_ORIGIN)
    }
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  if (!mounted) {
    return (
      <article style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>{post.title}</h1>

        {post.publishedAt && (
          <time
            dateTime={post.publishedAt}
            style={{ color: '#666', display: 'block', marginBottom: '20px' }}
          >
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        )}

        <div style={{ marginTop: '20px' }}>
          <RichText data={post.content as SerializedEditorState} />
        </div>
      </article>
    )
  }

  return (
    <article style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>
        <Editable
          collectionSlug="posts"
          docID={String(post.id)}
          fieldPath="title"
          adminOrigin={ADMIN_ORIGIN}
        >
          {post.title}
        </Editable>
      </h1>

      {post.publishedAt && (
        <time
          dateTime={post.publishedAt}
          style={{ color: '#666', display: 'block', marginBottom: '20px' }}
        >
          {new Date(post.publishedAt).toLocaleDateString()}
        </time>
      )}

      <div style={{ marginTop: '20px' }}>
        <Editable
          collectionSlug="posts"
          docID={String(post.id)}
          fieldPath="content"
          adminOrigin={ADMIN_ORIGIN}
        >
          <RichText data={post.content as SerializedEditorState} />
        </Editable>
      </div>
    </article>
  )
}
