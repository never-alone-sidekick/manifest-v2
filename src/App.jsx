import React, { useState, useEffect, useCallback } from 'react'
import Scene from './components/Scene'
import { fetchFeaturedUser, fetchUserPosts, isApiConfigured } from './utils/api'

const DEMO_USER = {
  objectId: 'demo-user',
  username: 'Cheryl Lynn',
  bio: 'Progress not perfection. Single mother of two trying to get my life together for my kids.',
  sobrietyDate: { __type: 'Date', iso: '2025-07-11T06:00:00.000Z' },
  proPic: null,
  createdAt: '2019-09-11T06:32:07.575Z',
}

const DEMO_POSTS = [
  { objectId: 'p1', content: 'One day at a time. You\'re never alone in this fight.', commentCount: 47, createdAt: '2025-01-15T10:00:00Z' },
  { objectId: 'p2', content: 'Grateful for another sober morning. The sunrise hits different now.', commentCount: 23, createdAt: '2025-02-20T08:00:00Z' },
  { objectId: 'p3', content: '60 days today! Never thought I\'d see this.', commentCount: 89, createdAt: '2025-03-10T14:00:00Z' },
  { objectId: 'p4', content: 'My kids saw me sober for the first time in years.', commentCount: 156, createdAt: '2025-04-05T12:00:00Z' },
  { objectId: 'p5', content: 'To anyone struggling right now \u2014 keep going. It gets better.', commentCount: 12, createdAt: '2025-05-01T09:00:00Z' },
  { objectId: 'p6', content: 'Community meeting tonight changed my perspective completely.', commentCount: 34, createdAt: '2025-06-15T18:00:00Z' },
  { objectId: 'p7', content: '6 months! The longest I\'ve ever been clean.', commentCount: 201, createdAt: '2025-07-11T07:00:00Z' },
]

export default function App() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState('Mapping stellar coordinates...')
  const [error, setError] = useState(null)
  const [hoveredPost, setHoveredPost] = useState(null)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    if (!isApiConfigured()) {
      setLoadingMsg('No API keys \u2014 loading demo universe...')
      await sleep(800)
      setUser(DEMO_USER)
      setPosts(DEMO_POSTS)
      setFadeOut(true)
      setTimeout(() => setLoading(false), 600)
      return
    }

    try {
      setLoadingMsg('Scanning the Sober Sidekick universe...')
      const userData = await fetchFeaturedUser()
      if (!userData) throw new Error('No user found')

      setLoadingMsg(`Found ${userData.username} \u2014 loading their story...`)
      await sleep(400)

      const userPosts = await fetchUserPosts(userData.objectId, 15)
      setLoadingMsg(`${userPosts.length} posts found \u2014 rendering solar system...`)
      await sleep(400)

      setUser(userData)
      setPosts(userPosts)
      setFadeOut(true)
      setTimeout(() => setLoading(false), 600)
    } catch (err) {
      console.error('Failed to load:', err)
      setError(err.message)
      setLoadingMsg('API error \u2014 loading demo universe...')
      await sleep(600)
      setUser(DEMO_USER)
      setPosts(DEMO_POSTS)
      setFadeOut(true)
      setTimeout(() => setLoading(false), 600)
    }
  }

  const handlePlanetHover = useCallback((post, event) => {
    setHoveredPost(post)
  }, [])

  const handlePlanetUnhover = useCallback(() => {
    setHoveredPost(null)
  }, [])

  const soberDays = user?.sobrietyDate
    ? Math.floor((Date.now() - new Date(user.sobrietyDate.iso || user.sobrietyDate)) / 86400000)
    : null

  const totalComments = posts.reduce((sum, p) => sum + (p.commentCount || 0), 0)

  return (
    <>
      {loading && (
        <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
          <h1>MANIFEST</h1>
          <div className="spinner" />
          <div className="msg">{loadingMsg}</div>
          {error && <div className="error">\u26A0 {error}</div>}
        </div>
      )}

      {user && (
        <Scene
          user={user}
          posts={posts}
          onPlanetHover={handlePlanetHover}
          onPlanetUnhover={handlePlanetUnhover}
          onPlanetClick={(post) => setHoveredPost(post)}
        />
      )}

      <div className="vignette" />

      <div className="hud">
        <h2>MANIFEST</h2>
        <div className="tagline">YOU'RE NEVER ALONE</div>
      </div>

      {user && !loading && (
        <div className="info-panel">
          <div className="card">
            <div className="user-header">
              {user.proPic?.url ? (
                <img className="avatar" src={user.proPic.url} alt={user.username} />
              ) : (
                <div className="avatar-placeholder">
                  {(user.username || '?')[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="username">{user.username}</div>
                {soberDays !== null && soberDays > 0 && (
                  <div className="sober-days">{soberDays} days sober</div>
                )}
                {user.bio && <div className="bio">{user.bio}</div>}
              </div>
            </div>
            <div className="stats">
              <div className="stat">
                <strong>{posts.length}</strong>
                posts
              </div>
              <div className="stat">
                <strong>{totalComments}</strong>
                comments received
              </div>
              <div className="stat">
                <strong>{soberDays || '\u2014'}</strong>
                days sober
              </div>
            </div>
          </div>
        </div>
      )}

      {hoveredPost && (
        <div className="planet-label" style={{ left: '50%', bottom: '200px' }}>
          <div className="post-text">{hoveredPost.content}</div>
          <div className="post-meta">
            \uD83D\uDCAC {hoveredPost.commentCount || 0} comments
            {hoveredPost.channelName && ` \u00B7 ${hoveredPost.channelName}`}
          </div>
        </div>
      )}
    </>
  )
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}