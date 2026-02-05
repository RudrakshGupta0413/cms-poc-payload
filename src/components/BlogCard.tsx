'use client'

import Link from 'next/link'
import React from 'react'
import type { Post } from '@/payload-types'

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <article
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid #e2e8f0',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)'
          e.currentTarget.style.boxShadow =
            '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow =
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '12px' }}>
            {post.publishedAt && (
              <time
                dateTime={post.publishedAt}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#B32202',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            )}
          </div>

          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}
          >
            {post.title}
          </h2>

          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              color: '#1e293b',
              fontWeight: '600',
            }}
          >
            <span>Read Article</span>
            <svg
              style={{ marginLeft: '8px', width: '20px', height: '20px' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  )
}
