import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Ban, Check, Crosshair, Eraser, LayoutGrid, MousePointer2, Pencil, Radio, RotateCcw, Shield, Swords, Trash2 } from 'lucide-react'
import './styles.css'

const workspaces = [
  { id: 'draft', label: 'Draft Planner', icon: Swords },
]

const heroAssetOverrides = {
  'Adam Warlock': 'lord-adam.png',
  'Cloak & Dagger': 'lord-cloak-dagger.png',
  'Luna Snow': 'lord-luna.png',
}

const heroRoster = [
  ['Adam Warlock', 'Strategist'], ['Angela', 'Vanguard'], ['Black Cat', 'Duelist'], ['Black Panther', 'Duelist'],
  ['Black Widow', 'Duelist'], ['Blade', 'Duelist'], ['Captain America', 'Vanguard'], ['Cloak & Dagger', 'Strategist'],
  ['Cyclops', 'Duelist'], ['Daredevil', 'Duelist'], ['Deadpool', 'Duelist'], ['Deadpool', 'Strategist'], ['Deadpool', 'Vanguard'], ['Devil Dinosaur', 'Vanguard'], ['Doctor Strange', 'Vanguard'],
  ['Elsa Bloodstone', 'Duelist'], ['Emma Frost', 'Vanguard'], ['Gambit', 'Strategist'], ['Gorr the God Butcher', 'Duelist'],
  ['Groot', 'Vanguard'], ['Hawkeye', 'Duelist'], ['Hela', 'Duelist'], ['Hulk', 'Vanguard'], ['Human Torch', 'Duelist'],
  ['Invisible Woman', 'Strategist'], ['Iron Fist', 'Duelist'], ['Iron Man', 'Duelist'], ['Jeff the Land Shark', 'Strategist'],
  ['Jubilee', 'Strategist'], ['Loki', 'Strategist'], ['Luna Snow', 'Strategist'], ['Magik', 'Duelist'], ['Magneto', 'Vanguard'],
  ['Mantis', 'Strategist'], ['Mister Fantastic', 'Duelist'], ['Moon Knight', 'Duelist'], ['Namor', 'Duelist'], ['Peni Parker', 'Vanguard'],
  ['Phoenix', 'Duelist'], ['Psylocke', 'Duelist'], ['Rocket Raccoon', 'Strategist'], ['Rogue', 'Vanguard'], ['Scarlet Witch', 'Duelist'],
  ['Spider-Man', 'Duelist'], ['Squirrel Girl', 'Duelist'], ['Star-Lord', 'Duelist'], ['Storm', 'Duelist'], ['The Hood', 'Vanguard'],
  ['The Punisher', 'Duelist'], ['The Thing', 'Vanguard'], ['Thor', 'Vanguard'], ['Ultron', 'Strategist'], ['Venom', 'Vanguard'],
  ['White Fox', 'Strategist'], ['Winter Soldier', 'Duelist'], ['Wolverine', 'Duelist'],
].map(([name, role], index) => ({ id: `${slugify(name)}-${slugify(role)}-${index}`, name, role, tone: heroTone(role), asset: heroAssetName(name) }))

function heroAssetName(name) {
  return heroAssetOverrides[name] || `lord-${slugify(name)}.png`
}

function assetUrl(folder, file) {
  return `${import.meta.env.BASE_URL}assets/${folder ? `${folder}/` : ''}${file}`
}

function slugify(name) {
  return name.toLowerCase().replaceAll('&', 'and').replaceAll(' ', '-').replaceAll(/[^a-z0-9-]/g, '')
}

function heroTone(role) {
  if (role.includes('Vanguard')) return 'steel'
  if (role.includes('Strategist')) return 'ice'
  return 'violet'
}

const draftFormats = {
  mrc: {
    label: 'MRC SEASON 10',
    phases: [
      ['your', 'ban'],
      ['enemy', 'ban'], ['enemy', 'save'],
      ['your', 'save'], ['your', 'ban'],
      ['enemy', 'ban'], ['enemy', 'save'],
      ['your', 'save'], ['your', 'ban'],
      ['enemy', 'ban'],
      ['enemy', 'ban'],
      ['your', 'ban'],
    ],
  },
}

function createDraftPhases(draft) {
  const slots = { your: { ban: 0, save: 0 }, enemy: { ban: 0, save: 0 } }
  return draft.phases.map(([team, type], index) => {
    const slot = slots[team][type]
    slots[team][type] += 1
    return { label: `${team === 'your' ? 'YOUR' : 'ENEMY'} ${type === 'ban' ? 'BAN' : 'SAVE'}`, team, type, slot, index }
  })
}

function DraftLanding() {
  const [actions, setActions] = useState([])
  const [roleFilter, setRoleFilter] = useState('All')
  const draft = draftFormats.mrc
  const phases = createDraftPhases(draft)
  const resetDraft = () => {
    setActions([])
  }

  const placeHero = (hero, team, type, slot, placementId = null) => {
    if (!hero) return
    setActions((currentActions) => [
      ...currentActions.filter((action) => action.id !== placementId && !(action.team === team && action.type === type && action.slot === slot)),
      { id: placementId || `${hero.id}-${Date.now()}-${Math.random()}`, heroId: hero.id, hero: hero.name, role: hero.role, asset: hero.asset, team, type, slot },
    ])
  }

  const readDragData = (event) => {
    try {
      return JSON.parse(event.dataTransfer.getData('application/json'))
    } catch {
      return { heroId: event.dataTransfer.getData('text/plain') }
    }
  }

  const dropHero = (event, team, type, slot) => {
    event.preventDefault()
    const dragData = readDragData(event)
    const source = actions.find((action) => action.id === dragData.placementId)
    const hero = source || heroRoster.find((item) => item.id === dragData.heroId)
    placeHero(hero, team, type, slot, dragData.placementId)
  }

  const removeHero = (event) => {
    event.preventDefault()
    const dragData = readDragData(event)
    if (!dragData.placementId) return
    setActions((currentActions) => currentActions.filter((action) => action.id !== dragData.placementId))
  }

  const teamActions = (team, type) => Array.from({ length: type === 'composition' ? 6 : Math.max(...phases.filter((item) => item.team === team && item.type === type).map((item) => item.slot), -1) + 1 }, (_, slot) => actions.find((action) => action.team === team && action.type === type && action.slot === slot))
  const visibleHeroes = roleFilter === 'All' ? heroRoster : heroRoster.filter((hero) => hero.role.includes(roleFilter))

  return (
    <section className="draft-room">
      <div className="draft-toolbar">
        <div>
          <h2>Refrigerator <span>Deluxe</span></h2>
        </div>
        <div className="toolbar-actions">
          <span className="format-badge">MRC SEASON 10</span>
          <button className="icon-button" onClick={resetDraft} type="button" title="Reset draft"><RotateCcw size={16} /></button>
        </div>
      </div>

      <div className="draft-columns">
        <DraftSide title="TEAM 1" accent="blue" team="your" bans={teamActions('your', 'ban')} saves={teamActions('your', 'save')} composition={teamActions('your', 'composition')} onDrop={dropHero} />
        <div className="picker-panel">
          <div className="picker-heading"><div><span className="eyebrow">HERO POOL</span><strong>DRAG TO PLAN</strong></div><span className="phase-counter">{actions.length} / {phases.length}</span></div>
          <div className="hero-grid" onDragOver={(event) => event.preventDefault()} onDrop={removeHero}>
            <div className="role-filters">{['All', 'Duelist', 'Strategist', 'Vanguard'].map((role) => <button className={roleFilter === role ? 'active' : ''} key={role} onClick={() => setRoleFilter(role)} type="button">{role}</button>)}</div>
            {visibleHeroes.map((hero) => <button className="hero-choice" draggable onDragStart={(event) => event.dataTransfer.setData('application/json', JSON.stringify({ heroId: hero.id }))} key={hero.id} type="button"><span className={`hero-token ${hero.tone}`}><img src={assetUrl('heroes', hero.asset)} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />{hero.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><b>{hero.name}</b><small>{hero.role}</small></span></button>)}
          </div>
          <div className="picker-hint">DRAG HEROES TO ANY BAN OR SAVE SLOT // DROP BACK HERE TO REMOVE</div>
        </div>
        <DraftSide title="TEAM 2" accent="red" team="enemy" bans={teamActions('enemy', 'ban')} saves={teamActions('enemy', 'save')} composition={teamActions('enemy', 'composition')} onDrop={dropHero} />
      </div>
    </section>
  )
}

function DraftSide({ title, accent, team, bans, saves, composition, onDrop }) {
  const lane = (type, items, icon, label) => <div className={`side-group ${type === 'composition' ? 'composition-panel' : ''}`}><label>{icon} {label}</label><div className={`action-slots ${type}`}>{items.map((item, slot) => <div className={`action-chip drop-slot ${item ? 'filled' : ''}`} style={type === 'composition' ? { backgroundImage: `url(${assetUrl('', 'frame.webp')})` } : undefined} draggable={Boolean(item)} onDragStart={(event) => item && event.dataTransfer.setData('application/json', JSON.stringify({ placementId: item.id }))} key={`${type}-${slot}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, team, type, slot)}><span className="action-icon">{item ? <><img src={assetUrl('heroes', item.asset)} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />{type !== 'composition' && item.hero.slice(0, 2).toUpperCase()}</> : String(slot + 1).padStart(2, '0')}</span>{item ? <><b>{item.hero}</b><small>{item.role}</small></> : `DROP ${type === 'composition' ? 'HERO' : type.toUpperCase()}`}</div>)}</div></div>
  return <section className={`draft-side ${accent}`}><div className="side-heading"><span>{title}</span><i /></div>{lane('ban', bans, <Ban size={13} />, 'BANS')} {lane('save', saves, <Check size={13} />, 'SAVES')} {lane('composition', composition, <Swords size={13} />, `WHAT ${title} WILL RUN`)}</section>
}

const mapModes = {
  domination: [
    ['Hellfire Gala: Krakoa', 'hellfire-gala-krakoa'], ['Hydra Charteris Base: Hell\'s Heaven', 'hydra-charteris-base-hells-heaven'],
    ["Intergalactic Empire of Wakanda: Birnin T'Challa", 'birnin-tchalla'], ['Klyntar: Celestial Husk', 'klyntar-celestial-husk'], ['Yggsgard: Royal Palace', 'yggsgard'],
  ],
  convoy: [
    ['Empire of Eternal Night: Midtown', 'empire-of-eternal-night-midtown'], ['Hellfire Gala: Arakko', 'hellfire-gala-arakko'],
    ['Museum of Contemplation', 'museum-of-contemplation'], ['Thebes', 'thebes'], ['Tokyo 2099: Spider-Islands', 'spider-islands'], ['Yggsgard: Yggdrasill Path', 'yggdrasill-path'],
  ],
  convergence: [
    ['Empire of Eternal Night: Central Park', 'empire-of-eternal-night-central-park'], ["Intergalactic Empire of Wakanda: Hall of Djalia", 'hall-of-djalia'],
    ["K'un-Lun: Heart of Heaven", 'kun-lun-heart-of-heaven'], ['Klyntar: Symbiotic Surface', 'klyntar-symbiotic-surface'], ['Lower Manhattan', 'lower-manhattan'], ['Tokyo 2099: Shin-Shibuya', 'tokyo-2099'],
  ],
}

const mapPresets = Object.entries(mapModes).flatMap(([mode, maps]) => maps.map(([name, id]) => ({ id, name, mode, subtitle: mode.toUpperCase(), asset: `${id}.webp` })))

const mapStages = {
  'hellfire-gala-krakoa': ['Cradle', 'Grove', 'Throne Room'],
  'hydra-charteris-base-hells-heaven': ['Hell\'s Heaven', 'Hydra Base', 'Charteris Core'],
  'birnin-tchalla': ['Birnin T\'Challa', 'Warrior Falls', 'Royal Court'],
  'klyntar-celestial-husk': ['Celestial Husk', 'Symbiote Chamber', 'Knull\'s Maw'],
  yggsgard: ['Royal Palace', 'Bifrost Garden', 'Throne Hall'],
}

mapPresets.forEach((map) => { map.stages = mapStages[map.id] || ['Main Stage'] })

function MapLanding() {
  const [activeMode, setActiveMode] = useState('domination')
  const [activeMap, setActiveMap] = useState(mapModes.domination[0][1])
  const [activeStage, setActiveStage] = useState(0)
  const [tool, setTool] = useState('select')
  const [heroes, setHeroes] = useState([])
  const [strokes, setStrokes] = useState([])
  const [currentStroke, setCurrentStroke] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [penColor, setPenColor] = useState('#ef4b3f')
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
    setStrokes([...strokes, { points: currentStroke, color: penColor }])
    setCurrentStroke(null)
  }

  const startDrag = (event, heroId) => {
    if (tool !== 'select') return
    event.stopPropagation()
    setDragging(heroId)
  }

  const addHero = (event) => {
    event.preventDefault()
    const hero = heroRoster.find((item) => item.name === event.dataTransfer.getData('text/plain'))
    if (!hero) return
    const point = boardPoint(event)
    setHeroes([...heroes, { ...hero, x: Math.max(4, Math.min(96, point.x)), y: Math.max(6, Math.min(94, point.y)), id: `${hero.name}-${Date.now()}` }])
  }

  const moveHero = (event) => {
    if (!dragging) return
    const point = boardPoint(event)
    setHeroes(heroes.map((hero) => hero.id === dragging ? { ...hero, x: Math.max(4, Math.min(96, point.x)), y: Math.max(6, Math.min(94, point.y)) } : hero))
  }

  const clearBoard = () => {
    setStrokes([])
    setHeroes([])
  }

  const points = (stroke) => stroke.map((point) => `${point.x},${point.y}`).join(' ')
  const visibleMaps = mapPresets.filter((map) => map.mode === activeMode)
  const selectedMap = mapPresets.find((map) => map.id === activeMap) || visibleMaps[0]

  const changeMode = (mode) => {
    setActiveMode(mode)
    setActiveMap(mapModes[mode][0][1])
    setActiveStage(0)
  }

  const changeMap = (mapId) => {
    setActiveMap(mapId)
    setActiveStage(0)
  }

  return (
    <section className="map-room">
      <div className="map-toolbar">
        <div><h2>Map <span>planner</span></h2></div>
        <div className="map-actions">
          <button className={`tool-button ${tool === 'select' ? 'active' : ''}`} onClick={() => setTool('select')} type="button" title="Select and move heroes"><MousePointer2 size={16} /></button>
          <button className={`tool-button ${tool === 'draw' ? 'active' : ''}`} onClick={() => setTool('draw')} type="button" title="Draw strategy lines"><Pencil size={16} /></button>
          <button className="tool-button" onClick={() => setStrokes([])} type="button" title="Erase strategy lines"><Eraser size={16} /></button>
          <label className="color-button" title="Choose pen color"><input type="color" value={penColor} onChange={(event) => setPenColor(event.target.value)} aria-label="Pen color" /><span style={{ backgroundColor: penColor }} /></label>
          <button className="tool-button" onClick={clearBoard} type="button" title="Reset board"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="map-layout">
        <aside className="map-rail">
          <div className="rail-label hero-rail-label">HERO BANK</div>
          <div className="hero-palette">{heroRoster.map((hero) => <button className="palette-hero" draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', hero.name)} key={hero.name} type="button" title={`Drag ${hero.name} onto the map`}><span className={`hero-token ${hero.tone}`}><img src={assetUrl('heroes', hero.asset)} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />{hero.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><b>{hero.name}</b></button>)}</div>
          <div className="rail-label">GAME MODE</div>
          <div className="mode-filters">{Object.keys(mapModes).map((mode) => <button className={activeMode === mode ? 'active' : ''} key={mode} onClick={() => changeMode(mode)} type="button">{mode}</button>)}</div>
          <div className="rail-label">{activeMode.toUpperCase()} MAPS</div>
          {visibleMaps.map((map) => <button className={`map-choice ${activeMap === map.id ? 'active' : ''}`} key={map.id} onClick={() => changeMap(map.id)} type="button"><span className={`map-thumb ${map.id}`} style={{ backgroundImage: `url(${assetUrl('maps', map.asset)})` }} /><span><b>{map.name}</b><small>{map.subtitle}</small></span></button>)}
          <div className="rail-label stage-label">STAGES</div>
          <div className="stage-filters">{selectedMap.stages.map((stage, index) => <button className={activeStage === index ? 'active' : ''} key={stage} onClick={() => setActiveStage(index)} type="button"><b>{String(index + 1).padStart(2, '0')}</b>{stage}</button>)}</div>
          <div className="map-legend"><span className="legend-line" /> DRAWING<span className="legend-dot" /> HERO TOKEN</div>
        </aside>
        <div className="board-wrap">
          <div className="board-meta"><span><span className="signal-dot cyan-dot" /> {selectedMap.name} // {selectedMap.stages[activeStage]}</span><span>{tool === 'draw' ? 'DRAW MODE' : 'SELECT MODE'}</span></div>
          <div className={`tactical-board ${activeMap}`} style={{ backgroundImage: `url(${assetUrl('maps', selectedMap.asset)})` }} ref={boardRef} onDragOver={(event) => event.preventDefault()} onDrop={addHero} onPointerMove={moveHero} onPointerUp={() => setDragging(null)} onPointerLeave={() => setDragging(null)}>
            <div className="board-grid" />
            <div className="map-terrain terrain-a" /><div className="map-terrain terrain-b" /><div className="map-terrain terrain-c" />
            <svg className={`draw-layer ${tool === 'draw' ? 'drawing' : ''}`} viewBox="0 0 100 100" preserveAspectRatio="none" onPointerDown={beginDraw} onPointerMove={continueDraw} onPointerUp={finishDraw}>
              {strokes.map((stroke, index) => <polyline key={index} points={points(stroke.points)} fill="none" stroke={stroke.color} strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />)}
              {currentStroke && <polyline points={points(currentStroke)} fill="none" stroke={penColor} strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
            {heroes.map((hero) => <button className={`board-hero ${hero.tone}`} key={hero.id} style={{ left: `${hero.x}%`, top: `${hero.y}%` }} onPointerDown={(event) => startDrag(event, hero.id)} type="button" title={hero.name}><span><img src={assetUrl('heroes', hero.asset)} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} />{hero.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><small>{hero.name}</small></button>)}
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
  const ActiveLanding = DraftLanding

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><Shield size={19} strokeWidth={2.5} /></div>
          <div>
            <div className="brand-name">REFRIGERATOR DELUXE</div>
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
            <div><span className="eyebrow">REFRIGERATOR DELUXE</span><span className="heading-divider">/</span><span className="workspace-name">UCSD MARVEL RIVALS STRATEGY TOOL</span></div>
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