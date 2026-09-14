import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Ban, Check, ChevronDown, Crosshair, Eraser, LayoutGrid, Map, MousePointer2, Pencil, Radio, RotateCcw, Shield, Swords, Trash2 } from 'lucide-react'
import './styles.css'

const workspaces = [
  { id: 'draft', label: 'Draft Room', icon: Swords },
  { id: 'map', label: 'Map Board', icon: Map },
]

const heroRoster = [
  { name: 'Luna Snow', role: 'Strategist', tone: 'ice', asset: 'luna-snow.webp' },
  { name: 'Magneto', role: 'Vanguard', tone: 'steel', asset: 'magneto.webp' },
  { name: 'Psylocke', role: 'Duelist', tone: 'violet', asset: 'psylocke.webp' },
  { name: 'Mantis', role: 'Strategist', tone: 'leaf', asset: 'mantis.webp' },
  { name: 'Doctor Strange', role: 'Vanguard', tone: 'arcane', asset: 'doctor-strange.webp' },
  { name: 'Hela', role: 'Duelist', tone: 'gold', asset: 'hela.webp' },
  { name: 'Groot', role: 'Vanguard', tone: 'bark', asset: 'groot.webp' },
  { name: 'Spider-Man', role: 'Duelist', tone: 'web', asset: 'spider-man.webp' },
  { name: 'Rocket Raccoon', role: 'Strategist', tone: 'ember', asset: 'rocket-raccoon.webp' },
  { name: 'Magik', role: 'Duelist', tone: 'portal', asset: 'magik.webp' },
  { name: 'Star-Lord', role: 'Duelist', tone: 'nova', asset: 'star-lord.webp' },
  { name: 'Punisher', role: 'Duelist', tone: 'smoke', asset: 'punisher.webp' },
]

const draftFormats = {
  championship: {
    label: 'CHAMPIONSHIP S10',
    phases: [
      ['YOUR BAN', 'your', 'ban'], ['ENEMY BAN', 'enemy', 'ban'],
      ['YOUR PICK', 'your', 'pick'], ['ENEMY PICK', 'enemy', 'pick'],
      ['YOUR PICK', 'your', 'pick'], ['ENEMY PICK', 'enemy', 'pick'],
      ['YOUR BAN', 'your', 'ban'], ['ENEMY BAN', 'enemy', 'ban'],
    ],
  },
  ignite: {
    label: 'IGNITE S10',
    phases: [
      ['YOUR BAN', 'your', 'ban'], ['ENEMY BAN', 'enemy', 'ban'],
      ['YOUR PICK', 'your', 'pick'], ['ENEMY PICK', 'enemy', 'pick'],
      ['ENEMY PICK', 'enemy', 'pick'], ['YOUR PICK', 'your', 'pick'],
      ['YOUR BAN', 'your', 'ban'], ['ENEMY BAN', 'enemy', 'ban'],
      ['YOUR PICK', 'your', 'pick'], ['ENEMY PICK', 'enemy', 'pick'],
    ],
  },
}

function DraftLanding() {
  const [format, setFormat] = useState('championship')
  const [activePhase, setActivePhase] = useState(0)
  const [actions, setActions] = useState([])
  const draft = draftFormats[format]
  const phase = draft.phases[activePhase]
  const selectedHeroes = new Set(actions.map((action) => action.hero))

  const resetDraft = () => {
    setActivePhase(0)
    setActions([])
  }

  const changeFormat = (nextFormat) => {
    setFormat(nextFormat)
    setActivePhase(0)
    setActions([])
  }

  const selectHero = (hero) => {
    if (selectedHeroes.has(hero.name)) return
    setActions([...actions, { hero: hero.name, team: phase[1], type: phase[2] }])
    setActivePhase(Math.min(activePhase + 1, draft.phases.length - 1))
  }

  const teamActions = (team, type) => actions.filter((action) => action.team === team && action.type === type)

  return (
    <section className="draft-room">
      <div className="draft-toolbar">
        <div>
          <div className="panel-kicker"><Crosshair size={15} /> COMPETITIVE OPERATIONS</div>
          <h2>Draft <span>room</span></h2>
        </div>
        <div className="toolbar-actions">
          <label className="format-select">FORMAT <ChevronDown size={14} /><select value={format} onChange={(event) => changeFormat(event.target.value)} aria-label="Draft format">
            {Object.entries(draftFormats).map(([id, item]) => <option value={id} key={id}>{item.label}</option>)}
          </select></label>
          <button className="icon-button" onClick={resetDraft} type="button" title="Reset draft"><RotateCcw size={16} /></button>
        </div>
      </div>

      <div className="phase-strip">
        {draft.phases.map(([label, team, type], index) => (
          <button className={`phase-step ${index === activePhase ? 'current' : ''} ${index < actions.length ? 'complete' : ''}`} key={`${label}-${index}`} onClick={() => setActivePhase(index)} type="button">
            <b>{String(index + 1).padStart(2, '0')}</b><span>{type === 'ban' ? <Ban size={12} /> : <Check size={12} />}{label}</span><i />
          </button>
        ))}
      </div>

      <div className="draft-columns">
        <DraftSide title="YOUR TEAM" accent="red" bans={teamActions('your', 'ban')} picks={teamActions('your', 'pick')} />
        <div className="picker-panel">
          <div className="picker-heading"><div><span className="eyebrow">NOW SELECTING</span><strong>{phase[0]}</strong></div><span className="phase-counter">{String(activePhase + 1).padStart(2, '0')} / {String(draft.phases.length).padStart(2, '0')}</span></div>
          <div className="hero-grid">
            {heroRoster.map((hero) => <button className={`hero-choice ${selectedHeroes.has(hero.name) ? 'used' : ''}`} key={hero.name} onClick={() => selectHero(hero)} disabled={selectedHeroes.has(hero.name)} type="button"><span className={`hero-token ${hero.tone}`}>{hero.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><b>{hero.name}</b><small>{hero.role}</small></span></button>)}
                      {heroRoster.map((hero) => <button className={`hero-choice ${selectedHeroes.has(hero.name) ? 'used' : ''}`} key={hero.name} onClick={() => selectHero(hero)} disabled={selectedHeroes.has(hero.name)} type="button"><span className={`hero-token ${hero.tone}`}><img src={`/assets/heroes/${hero.asset}`} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />{hero.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><b>{hero.name}</b><small>{hero.role}</small></span></button>)}
          </div>
          <div className="picker-hint">SELECT A HERO TO LOCK IN {phase[2].toUpperCase()}</div>
        </div>
        <DraftSide title="ENEMY TEAM" accent="cyan" bans={teamActions('enemy', 'ban')} picks={teamActions('enemy', 'pick')} />
      </div>
    </section>
  )
}

function DraftSide({ title, accent, bans, picks }) {
  return <section className={`draft-side ${accent}`}><div className="side-heading"><span>{title}</span><i /></div><div className="side-group"><label><Ban size={13} /> BANS</label><div className="action-slots">{bans.map((action) => <div className="action-chip" key={action.hero}><span>{action.hero.slice(0, 2).toUpperCase()}</span>{action.hero}</div>)}{!bans.length && <div className="empty-slot">OPEN</div>}</div></div><div className="side-group"><label><Check size={13} /> PICKS</label><div className="action-slots picks">{picks.map((action) => <div className="action-chip" key={action.hero}><span>{action.hero.slice(0, 2).toUpperCase()}</span>{action.hero}</div>)}{!picks.length && <div className="empty-slot">OPEN</div>}</div></div></section>
}

const mapPresets = [
  { id: 'tokyo', name: 'TOKYO 2099', subtitle: 'SHIN-SHIBUYA', asset: 'tokyo-2099.webp' },
  { id: 'wakanda', name: 'WAKANDA', subtitle: "BIRNIN T'CHALLA", asset: 'wakanda.webp' },
  { id: 'klyntar', name: 'KLYNTAR', subtitle: 'SYMBIOTE GARDEN', asset: 'klyntar.webp' },
]

const plannerHeroes = [
  { name: 'Luna Snow', tone: 'ice', x: 24, y: 64 },
  { name: 'Magneto', tone: 'steel', x: 41, y: 48 },
  { name: 'Psylocke', tone: 'violet', x: 68, y: 36 },
  { name: 'Groot', tone: 'bark', x: 78, y: 70 },
]

function MapLanding() {
  const [activeMap, setActiveMap] = useState('tokyo')
  const [tool, setTool] = useState('select')
  const [heroes, setHeroes] = useState(plannerHeroes)
  const [strokes, setStrokes] = useState([])
  const [currentStroke, setCurrentStroke] = useState(null)
  const [dragging, setDragging] = useState(null)
  const boardRef = useRef(null)

  const boardPoint = (event) => {
    const board = boardRef.current.getBoundingClientRect()
    return { x: ((event.clientX - board.left) / board.width) * 100, y: ((event.clientY - board.top) / board.height) * 100 }
  }

  const beginDraw = (event) => {
    if (tool !== 'draw') return
    event.currentTarget.setPointerCapture(event.pointerId)
    setCurrentStroke([boardPoint(event)])
  }

  const continueDraw = (event) => {
    if (!currentStroke) return
    setCurrentStroke([...currentStroke, boardPoint(event)])
  }

  const finishDraw = () => {
    if (!currentStroke) return
    setStrokes([...strokes, currentStroke])
    setCurrentStroke(null)
  }

  const startDrag = (event, heroName) => {
    if (tool !== 'select') return
    event.stopPropagation()
    setDragging(heroName)
  }

  const moveHero = (event) => {
    if (!dragging) return
    const point = boardPoint(event)
    setHeroes(heroes.map((hero) => hero.name === dragging ? { ...hero, x: Math.max(4, Math.min(96, point.x)), y: Math.max(6, Math.min(94, point.y)) } : hero))
  }

  const clearBoard = () => {
    setStrokes([])
    setHeroes(plannerHeroes)
  }

  const points = (stroke) => stroke.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <section className="map-room">
      <div className="map-toolbar">
        <div><div className="panel-kicker map-kicker"><LayoutGrid size={15} /> TACTICAL OVERVIEW</div><h2>Map <span>board</span></h2></div>
        <div className="map-actions">
          <button className={`tool-button ${tool === 'select' ? 'active' : ''}`} onClick={() => setTool('select')} type="button" title="Select and move heroes"><MousePointer2 size={16} /></button>
          <button className={`tool-button ${tool === 'draw' ? 'active' : ''}`} onClick={() => setTool('draw')} type="button" title="Draw strategy lines"><Pencil size={16} /></button>
          <button className="tool-button" onClick={() => setStrokes([])} type="button" title="Erase strategy lines"><Eraser size={16} /></button>
          <button className="tool-button" onClick={clearBoard} type="button" title="Reset board"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="map-layout">
        <aside className="map-rail">
          <div className="rail-label">BATTLEFIELDS</div>
          {mapPresets.map((map) => <button className={`map-choice ${activeMap === map.id ? 'active' : ''}`} key={map.id} onClick={() => setActiveMap(map.id)} type="button"><span className={`map-thumb ${map.id}`} style={{ backgroundImage: `url(/assets/maps/${map.asset})` }} /><span><b>{map.name}</b><small>{map.subtitle}</small></span></button>)}
          <div className="map-legend"><span className="legend-line" /> YOUR ROUTE<span className="legend-dot" /> HERO TOKEN</div>
        </aside>
        <div className="board-wrap">
          <div className="board-meta"><span><span className="signal-dot cyan-dot" /> {mapPresets.find((map) => map.id === activeMap).name}</span><span>{tool === 'draw' ? 'DRAW MODE' : 'SELECT MODE'}</span></div>
          <div className={`tactical-board ${activeMap}`} style={{ backgroundImage: `url(/assets/maps/${mapPresets.find((map) => map.id === activeMap).asset})` }} ref={boardRef} onPointerMove={moveHero} onPointerUp={() => setDragging(null)} onPointerLeave={() => setDragging(null)}>
            <div className="board-grid" />
            <div className="map-terrain terrain-a" /><div className="map-terrain terrain-b" /><div className="map-terrain terrain-c" />
            <svg className={`draw-layer ${tool === 'draw' ? 'drawing' : ''}`} viewBox="0 0 100 100" preserveAspectRatio="none" onPointerDown={beginDraw} onPointerMove={continueDraw} onPointerUp={finishDraw}>
              {strokes.map((stroke, index) => <polyline key={index} points={points(stroke)} fill="none" stroke="#ef4b3f" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />)}
              {currentStroke && <polyline points={points(currentStroke)} fill="none" stroke="#56bfd2" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
            {heroes.map((hero) => <button className={`board-hero ${hero.tone}`} key={hero.name} style={{ left: `${hero.x}%`, top: `${hero.y}%` }} onPointerDown={(event) => startDrag(event, hero.name)} type="button" title={hero.name}><span><img src={`/assets/heroes/${hero.name.toLowerCase().replaceAll(' ', '-')}.webp`} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />{hero.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><small>{hero.name}</small></button>)}
            <div className="board-axis axis-x">A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;D&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E</div>
            <div className="board-axis axis-y">1<br />2<br />3<br />4<br />5</div>
          </div>
          <div className="board-footer"><span><strong>{heroes.length}</strong> HEROES ON BOARD</span><span><strong>{strokes.length}</strong> DRAWINGS</span><span className="board-tip">{tool === 'draw' ? 'PRESS + DRAG TO SKETCH' : 'DRAG TOKENS TO REPOSITION'}</span></div>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [activeWorkspace, setActiveWorkspace] = useState('draft')
  const ActiveLanding = activeWorkspace === 'draft' ? DraftLanding : MapLanding

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><Shield size={19} strokeWidth={2.5} /></div>
          <div>
            <div className="brand-name">CITADEL</div>
            <div className="brand-subtitle">UCSD // MARVEL RIVALS</div>
          </div>
        </div>
        <div className="status-cluster"><Radio size={14} /> LIVE WORKSPACE <span /></div>
      </header>

      <div className="content-shell">
        <aside className="sidebar">
          <div className="sidebar-label">OPERATIONS</div>
          <nav aria-label="Workspace navigation">
            {workspaces.map(({ id, label, icon: Icon }) => (
              <button
                className={`nav-item ${activeWorkspace === id ? 'active' : ''}`}
                key={id}
                onClick={() => setActiveWorkspace(id)}
                type="button"
              >
                <Icon size={18} />
                <span>{label}</span>
                {activeWorkspace === id && <i />}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="footer-rule" />
            <div className="version-label">SEASON 10 // READY</div>
          </div>
        </aside>

        <div className="workspace">
          <div className="workspace-heading">
            <div><span className="eyebrow">TRITON COMMAND CENTER</span><span className="heading-divider">/</span><span className="workspace-name">{activeWorkspace === 'draft' ? 'DRAFT ROOM' : 'MAP BOARD'}</span></div>
            <span className="date-stamp">09.14.26</span>
          </div>
          <ActiveLanding />
        </div>
      </div>
    </main>
  )
}

export default App

createRoot(document.getElementById('root')).render(<App />)