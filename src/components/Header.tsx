import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import React from 'react'

export async function Header() {
  const payload = await getPayload({ config })
  const header = await payload.findGlobal({
    slug: 'header',
  })

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid #eee',
      }}
    >
      <Link
        href="/"
        style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#ffffff' }}
      >
        MyCMS
      </Link>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0 }}>
          {header.navItems?.map((item, i) => {
            const { link } = item
            let href = ''

            if (link.type === 'page' && link.page && typeof link.page === 'object') {
              href = `/${link.page.slug}`
            } else if (link.type === 'post' && link.post && typeof link.post === 'object') {
              href = `/posts/${link.post.slug}`
            } else if (link.type === 'blogList') {
              href = '/posts'
            } else {
              href = link.url || ''
            }

            if (!href) return null

            return (
              <li key={i}>
                <Link href={href} style={{ textDecoration: 'none', color: '#ffffff' }}>
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
