import { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { examples } from './catalog'
import './viewer.css'

function Viewer() {
  const initial = new URLSearchParams(location.search).get('example')
  const selected = examples.find(example => example.id === initial) ?? examples[0]
  const name = selected.id
  const [phone, setPhone] = useState(false)
  const [still, setStill] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const motionOverride = useRef(false)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [revision, replay] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [height, setHeight] = useState(460)
  const [ready, setReady] = useState(false)
  const [staticScene, setStaticScene] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const iframe = useRef<HTMLIFrameElement>(null)
  const visible = useRef(false)
  const transportDisabled = !ready || still || staticScene
  const source = useMemo(() => `?embed=${name}&still=${still ? 1 : 0}`, [name, still])
  const send = (data: object) => iframe.current?.contentWindow?.postMessage({ type: 'stageshow:control', ...data }, location.origin)
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { if (!motionOverride.current) setStill(preference.matches) }
    preference.addEventListener('change', change)
    return () => preference.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== iframe.current?.contentWindow || event.data?.type !== 'stageshow:status') return
      if (Number.isFinite(event.data.elapsed)) setElapsed(event.data.elapsed)
      if (typeof event.data.staticScene === 'boolean') setStaticScene(event.data.staticScene)
      if (Number.isFinite(event.data.height)) setHeight(Math.max(1, event.data.height))
      if (event.data.error || event.data.ready) {
        window.parent.postMessage({ type: 'ui-lab:stageshow-preview', ready: !event.data.error }, location.origin)
      }
      if (event.data.error) { setError(String(event.data.error)); setReady(false); setPlaying(false) }
      else if (event.data.ready) { setReady(true); send({ playing: playing && !still, speed, visible: visible.current }) }
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [playing, speed, still])
  useEffect(() => { send({ playing: playing && !still, speed }) }, [playing, speed, still])
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting
      send({ visible: visible.current })
    })
    if (iframe.current) observer.observe(iframe.current)
    return () => observer.disconnect()
  }, [name, revision, still])
  useEffect(() => {
    setReady(false); setStaticScene(false); setElapsed(0); setError(null)
  }, [name, revision, still])
  return <main className="pg" data-reduced-motion={still || undefined}>
    <section className="pg-preview" aria-label="Example preview">
      <div className="pg-toolbar"><div className="pg-segment" aria-label="Preview width"><button aria-pressed={!phone} onClick={() => setPhone(false)}>Desktop</button><button aria-pressed={phone} onClick={() => setPhone(true)}>Phone</button></div><label className="pg-still"><input type="checkbox" checked={still} onChange={e => { motionOverride.current = true; setStill(e.target.checked) }} />Reduced motion</label></div>
      <div className="pg-canvas" data-phone={phone || undefined}><iframe key={`${name}-${revision}-${still}`} ref={iframe} title={selected.name} src={source} style={{ height }} onLoad={() => send({ playing: playing && !still, speed, visible: visible.current })} /></div>
      {error && <p role="alert">Preview stopped: {error}. Check the console, fix the example, then select Replay.</p>}
      <div className="pg-transport"><div className="pg-buttons">
        <button className="pg-play" data-playing={playing || undefined} disabled={transportDisabled} onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pause' : 'Play'}>
          <svg className="pg-play-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path className="pg-play-icon-left" d={playing ? 'M4 3L6.5 3L6.5 13L4 13Z' : 'M5 3L9 5.5L9 10.5L5 13Z'} />
            <path className="pg-play-icon-right" d={playing ? 'M9.5 3L12 3L12 13L9.5 13Z' : 'M9 5.5L13 8L13 8L9 10.5Z'} />
          </svg>
          <span className="pg-play-label" aria-hidden="true"><span className="pg-play-word">Play</span><span className="pg-pause-word">Pause</span></span>
        </button>
        <button disabled={transportDisabled} onClick={() => { setPlaying(false); send({ step: true }) }} title="Advance one frame">Step</button><button onClick={() => replay(n => n + 1)}>Replay</button>
      </div><div className="pg-time"><output aria-label="Current time">{((still || staticScene ? 0 : elapsed) / 1000).toFixed(2)}<span>s</span></output><select aria-label="Playback speed" value={speed} disabled={transportDisabled} onChange={e => setSpeed(Number(e.target.value))}><option value={0.25}>¼×</option><option value={0.5}>½×</option><option value={1}>1×</option><option value={2}>2×</option></select></div></div>
    </section>
    <footer className="pg-footer"><span>{still ? 'The reduced-motion poster is shown.' : staticScene ? 'This example is static.' : 'Pause playback to step through individual frames.'}</span></footer>
  </main>
}
export function mount() { createRoot(document.getElementById('root')!).render(<Viewer />) }
