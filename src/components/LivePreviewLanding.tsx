'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Editable } from '@/components/Editable'

const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN ?? 'http://localhost:3000'

type HeroData = {
  heading?: string | null
  subheading?: string | null
  ctaText?: string | null
  ctaLink?: string | null
}

type AboutData = {
  title?: string | null
  description?: string | null
  highlightText?: string | null
}

type WhySectionData = {
  title?: string | null
  heading?: string | null
  description?: string | null
  image?: any
}

type HomePageBlock = {
  blockType: 'homePage'
  hero?: HeroData
  about?: AboutData
  why?: WhySectionData
}

type AboutPageBlock = {
  blockType: 'aboutPage'
  title?: string | null
  description?: string | null
  highlightText?: string | null
}

type ContactPageBlock = {
  blockType: 'contactPage'
  email?: string | null
  phone?: string | null
  address?: string | null
}

type ServicesPageBlock = {
  blockType: 'servicesPage'
  sectionTitle?: string | null
  servicesList?: Array<{
    title?: string | null
    description?: string | null
    icon?: string | null
  }> | null
}

type PageBlock = HomePageBlock | AboutPageBlock | ContactPageBlock | ServicesPageBlock

type LandingPageData = {
  id: string | number
  title?: string | null
  layout?: PageBlock[] | null
}

const sectionStyles = {
  hero: {
    width: '100%',
    minHeight: '100dvh',
    height: '100vh',
    padding: '18px',
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  about: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingTop: '120px',
  },
  contact: { width: '100%', padding: 80, backgroundColor: '#ffffff' },
}

// Listens for Payload's live preview postMessage and re-renders with the latest document.


export function LivePreviewLanding({ initialPage }: { initialPage: LandingPageData }) {
  const [data, setData] = useState<LandingPageData>(initialPage)
  const readySent = useRef(false)

  useEffect(() => {
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
        setData((prev) => ({
          ...prev,
          ...msg.data,
          layout: Array.isArray(msg.data.layout) ? msg.data.layout : prev.layout,
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

  const page = data
  const layout = page?.layout ?? []

  return (
    <main>
      {layout.map((block: PageBlock, index: number) => {
        switch (block.blockType) {
          case 'homePage': {
            const hero = block.hero ?? {}
            const about = block.about ?? {}
            const why = block.why ?? {}

            const basePath = `layout.${index}`
            return (
              <article key={index} data-page-type="home" style={{ width: '100%' }}>
                {/* Hero section */}
                <section style={sectionStyles.hero}>
                  <div
                    style={{
                      position: 'relative',
                      height: '100%',
                      width: '100%',
                      overflow: 'hidden',
                      borderRadius: '12px',
                    }}
                  >
                    <div
                      style={{ position: 'absolute', inset: 0, height: '100%', width: '100%' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '0 12px',
                        background: 'linear-gradient(180deg, #BC2302 0%, #650D00 100%)',
                      }}
                    >
                      <h1
                        style={{
                          maxWidth: '906px',
                          width: '100%',
                          color: '#ffffff',
                          fontSize: 'clamp(28px, 5vw, 56px)',
                          fontWeight: 500,
                          lineHeight: 1.2,
                        }}
                      >
                        <Editable
                          collectionSlug="pages"
                          docID={String(page.id)}
                          fieldPath={`${basePath}.hero.heading`}
                          adminOrigin={ADMIN_ORIGIN}
                        >
                          {hero.heading ?? ''}
                        </Editable>
                      </h1>
                      {hero.subheading != null && hero.subheading !== '' && (
                        <p
                          style={{
                            marginTop: '20px',
                            maxWidth: '600px',
                            color: '#dd9999',
                            fontSize: '18px',
                            opacity: 0.9,
                          }}
                        >
                          <Editable
                            collectionSlug="pages"
                            docID={String(page.id)}
                            fieldPath={`${basePath}.hero.subheading`}
                            adminOrigin={ADMIN_ORIGIN}
                          >
                            {hero.subheading}
                          </Editable>
                        </p>
                      )}
                      {hero.ctaText != null && hero.ctaText !== '' && (
                        <button
                          style={{
                            marginTop: '36px',
                            borderRadius: '6px',
                            backgroundColor: '#ffffff',
                            padding: '18px 36px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '20px',
                          }}
                        >
                          <Editable
                            collectionSlug="pages"
                            docID={String(page.id)}
                            fieldPath={`${basePath}.hero.ctaText`}
                            adminOrigin={ADMIN_ORIGIN}
                          >
                            {hero.ctaText}
                          </Editable>
                        </button>
                      )}
                    </div>
                  </div>
                </section>
                {/* About section (same page) */}
                <section style={sectionStyles.about}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '1400px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '80px',
                      padding: '0 80px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontSize: 'clamp(48px, 6vw, 90px)',
                          fontWeight: 600,
                          margin: 0,
                          lineHeight: 1.1,
                          color: '#a01f1f',
                        }}
                      >
                        <Editable
                          collectionSlug="pages"
                          docID={String(page.id)}
                          fieldPath={`${basePath}.about.title`}
                          adminOrigin={ADMIN_ORIGIN}
                        >
                          {about.title ?? ''}
                        </Editable>
                      </h2>
                    </div>
                    <div style={{ flex: 1.2 }}>
                      <p
                        style={{
                          fontSize: '22px',
                          lineHeight: 1.9,
                          margin: 0,
                          whiteSpace: 'pre-line' as const,
                          color: '#2b2b2b',
                        }}
                      >
                        <Editable
                          collectionSlug="pages"
                          docID={String(page.id)}
                          fieldPath={`${basePath}.about.description`}
                          adminOrigin={ADMIN_ORIGIN}
                        >
                          {about.description ?? ''}
                        </Editable>
                      </p>
                      <p
                        style={{
                          marginTop: '24px',
                          fontSize: '22px',
                          fontWeight: 600,
                          color: '#ff4d00',
                        }}
                      >
                        <Editable
                          collectionSlug="pages"
                          docID={String(page.id)}
                          fieldPath={`${basePath}.about.highlightText`}
                          adminOrigin={ADMIN_ORIGIN}
                        >
                          {about.highlightText ?? ''}
                        </Editable>
                      </p>
                    </div>
                  </div>
                </section>
                {/* Why Section */}
                {(why.title || why.heading || why.description || why.image) && (
                  <section
                    style={{
                      width: '100%',
                      padding: '140px 80px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '1600px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '120px',
                      }}
                    >
                      {/* LEFT CONTENT */}
                      <div style={{ flex: 1.1 }}>
                        {why.title && (
                          <h2
                            style={{
                              fontSize: 'clamp(48px, 4vw, 68px)',
                              fontWeight: 600,
                              margin: '0 0 50px 0',
                              color: '#ff4d00',
                              lineHeight: 1.05,
                              letterSpacing: '-1px',
                            }}
                          >
                            <Editable
                              collectionSlug="pages"
                              docID={String(page.id)}
                              fieldPath={`${basePath}.why.title`}
                              adminOrigin={ADMIN_ORIGIN}
                            >
                              {why.title}
                            </Editable>
                          </h2>
                        )}

                        {why.heading && (
                          <h3
                            style={{
                              fontSize: 'clamp(26px, 2.5vw, 36px)',
                              fontWeight: 600,
                              margin: '0 0 20px 0',
                              color: '#0f172a',
                            }}
                          >
                            <Editable
                              collectionSlug="pages"
                              docID={String(page.id)}
                              fieldPath={`${basePath}.why.heading`}
                              adminOrigin={ADMIN_ORIGIN}
                            >
                              {why.heading}
                            </Editable>
                          </h3>
                        )}

                        {why.description && (
                          <p
                            style={{
                              fontSize: '20px',
                              lineHeight: 1.8,
                              color: '#475569',
                              maxWidth: '600px',
                              whiteSpace: 'pre-line',
                            }}
                          >
                            <Editable
                              collectionSlug="pages"
                              docID={String(page.id)}
                              fieldPath={`${basePath}.why.description`}
                              adminOrigin={ADMIN_ORIGIN}
                            >
                              {why.description}
                            </Editable>
                          </p>
                        )}
                      </div>

                      {/* RIGHT IMAGE */}
                      <div style={{ flex: 1.4 }}>
                        <div
                          style={{
                            width: '100%',
                            height: '520px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.25)',
                            background: !why.image?.url
                              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                              : undefined,
                          }}
                        >
                          {why.image?.url && (
                            <img
                              src={why.image.url}
                              alt={why.image.alt || 'Why section image'}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </article>
            )
          }

          case 'aboutPage': {
            const basePath = `layout.${index}`
            return (
              <article key={index} data-page-type="about" style={{ width: '100%' }}>
                <section style={sectionStyles.about}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '1400px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '80px',
                      padding: '0 80px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontSize: 'clamp(42px, 5vw, 72px)',
                          fontWeight: 600,
                          margin: '0 0 60px 0',
                          lineHeight: 1.1,
                          color: '#ff4d00',
                          whiteSpace: 'normal',
                          maxWidth: '700px',
                        }}
                      >
                        <Editable
                          collectionSlug="pages"
                          docID={String(page.id)}
                          fieldPath={`${basePath}.title`}
                          adminOrigin={ADMIN_ORIGIN}
                        >
                          {block.title ?? ''}
                        </Editable>
                      </h2>
                    </div>
                    <div style={{ flex: 1.2 }}>
                      <p
                        style={{
                          fontSize: '22px',
                          lineHeight: 1.9,
                          margin: 0,
                          whiteSpace: 'pre-line' as const,
                          color: '#2b2b2b',
                        }}
                      >
                        <Editable
                          collectionSlug="pages"
                          docID={String(page.id)}
                          fieldPath={`${basePath}.description`}
                          adminOrigin={ADMIN_ORIGIN}
                        >
                          {block.description ?? ''}
                        </Editable>
                      </p>
                      {block.highlightText && (
                        <p
                          style={{
                            marginTop: '24px',
                            fontSize: '22px',
                            fontWeight: 600,
                            color: '#ff4d00',
                          }}
                        >
                          <Editable
                            collectionSlug="pages"
                            docID={String(page.id)}
                            fieldPath={`${basePath}.highlightText`}
                            adminOrigin={ADMIN_ORIGIN}
                          >
                            {block.highlightText}
                          </Editable>
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </article>
            )
          }

          case 'contactPage': {
            const basePath = `layout.${index}`
            return (
              <article key={index} data-page-type="contact" style={{ width: '100%' }}>
                <section style={sectionStyles.contact}>
                  <h2>Contact Us</h2>
                  <p>
                    Email:{' '}
                    <Editable
                      collectionSlug="pages"
                      docID={String(page.id)}
                      fieldPath={`${basePath}.email`}
                      adminOrigin={ADMIN_ORIGIN}
                    >
                      {block.email ?? ''}
                    </Editable>
                  </p>
                  {block.phone && <p>Phone: {block.phone}</p>}
                  {block.address && <p>{block.address}</p>}
                </section>
              </article>
            )
          }

          case 'servicesPage': {
            const basePath = `layout.${index}`
            const list = block.servicesList ?? []
            return (
              <article key={index} data-page-type="services" style={{ width: '100%' }}>
                <section style={{ ...sectionStyles.about, padding: 80 }}>
                  <div style={{ width: '100%', maxWidth: '1400px', padding: '0 80px' }}>
                    <h2
                      style={{
                        fontSize: 'clamp(36px, 4vw, 56px)',
                        fontWeight: 600,
                        margin: '0 0 48px',
                        color: '#a01f1f',
                      }}
                    >
                      <Editable
                        collectionSlug="pages"
                        docID={String(page.id)}
                        fieldPath={`${basePath}.sectionTitle`}
                        adminOrigin={ADMIN_ORIGIN}
                      >
                        {block.sectionTitle ?? 'Services'}
                      </Editable>
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {list.map((item, i) => (
                        <div
                          key={i}
                          style={{ padding: 16, border: '1px solid #eee', borderRadius: 8 }}
                        >
                          <strong>
                            <Editable
                              collectionSlug="pages"
                              docID={String(page.id)}
                              fieldPath={`${basePath}.servicesList.${i}.title`}
                              adminOrigin={ADMIN_ORIGIN}
                            >
                              {item.title ?? ''}
                            </Editable>
                          </strong>
                          <p style={{ margin: '8px 0 0', color: '#555' }}>
                            <Editable
                              collectionSlug="pages"
                              docID={String(page.id)}
                              fieldPath={`${basePath}.servicesList.${i}.description`}
                              adminOrigin={ADMIN_ORIGIN}
                            >
                              {item.description ?? ''}
                            </Editable>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </article>
            )
          }

          default:
            return null
        }
      })}
    </main>
  )
}
