import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { masterPhotographers, type MasterWork } from '../data/masterWorks'

const formatTitle = (work: MasterWork, index: number) =>
  work.title === '未知'
    ? `作品名未知 · 《${work.series ?? '系列未知'}》 · ${String(index + 1).padStart(2, '0')}`
    : work.title

export const Master = () => {
  const [activeId, setActiveId] = useState(masterPhotographers[0].id)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [failedImages, setFailedImages] = useState<string[]>([])
  const openerRef = useRef<HTMLElement | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const photographer =
    masterPhotographers.find(person => person.id === activeId) ??
    masterPhotographers[0]
  const selected =
    selectedIndex === null ? null : photographer.works[selectedIndex]
  const photographerNumber = masterPhotographers.indexOf(photographer) + 1

  const openWork = (index: number) => {
    if (
      selectedIndex === null &&
      document.activeElement instanceof HTMLElement
    ) {
      openerRef.current = document.activeElement
    }
    setRevealed(false)
    setSelectedIndex(index)
  }

  const showNext = (direction: number) => {
    setSelectedIndex(current =>
      current === null
        ? null
        : (current + direction + photographer.works.length) %
          photographer.works.length
    )
    setRevealed(false)
  }

  const markFailed = (path: string) =>
    setFailedImages(current =>
      current.includes(path) ? current : [...current, path]
    )

  const isOpen = selectedIndex !== null
  const workCount = photographer.works.length
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const appRoot = document.getElementById('root')
    const wasInert = appRoot?.inert ?? false
    document.body.style.overflow = 'hidden'
    if (appRoot) appRoot.inert = true
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setSelectedIndex(null)
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        const direction = event.key === 'ArrowLeft' ? -1 : 1
        setSelectedIndex(current =>
          current === null
            ? null
            : (current + direction + workCount) % workCount
        )
        setRevealed(false)
      } else if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href]'
        )
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            !dialogRef.current?.contains(document.activeElement))
        ) {
          event.preventDefault()
          last.focus()
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !dialogRef.current?.contains(document.activeElement))
        ) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (appRoot) appRoot.inert = wasInert
      openerRef.current?.focus()
    }
  }, [isOpen, workCount])

  return (
    <div className="bg-[#faf9f6] text-[#20201e]">
      <header className="border-b border-[#dedcd5] px-5 pt-28 pb-9 sm:px-9 lg:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium tracking-[0.25em] text-[#74736f] uppercase">
            <span>FRAMESPACE / STUDY ROOM</span>
            <span>EST. 2026 · VOL. 01</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="mb-4 font-serif text-sm tracking-[0.35em]">
                摄影阅览室
              </p>
              <h1 className="font-serif text-[clamp(3.6rem,8vw,7.5rem)] leading-[0.93] font-light tracking-[-0.075em]">
                大师之作
              </h1>
            </div>
            <p className="max-w-[19rem] border-l border-[#b8b3a9] pl-5 text-sm leading-7 text-[#68655f]">
              展示一些摄影大师作品，后续会增加更新
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-[minmax(0,1fr)] lg:grid-cols-[248px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-[#dedcd5] lg:border-r lg:border-b-0">
          <div className="lg:sticky lg:top-20 lg:px-7 lg:py-12 xl:px-10">
            <p className="hidden text-[11px] tracking-[0.22em] text-[#87837b] uppercase lg:mb-8 lg:block">
              INDEX / 摄影师
            </p>
            <div className="flex gap-1 overflow-x-auto px-5 py-4 [scrollbar-width:none] sm:px-9 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:py-0">
              {masterPhotographers.map((person, index) => (
                <button
                  key={person.id}
                  type="button"
                  aria-current={person.id === activeId ? 'true' : undefined}
                  onClick={() => {
                    setActiveId(person.id)
                    setSelectedIndex(null)
                    document
                      .getElementById('master-heading')
                      ?.scrollIntoView({ block: 'start' })
                  }}
                  className={`group flex shrink-0 items-center gap-3 rounded-sm px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#20201e] motion-reduce:transition-none lg:w-full lg:gap-4 lg:border-b lg:border-[#e7e4dc] lg:px-0 lg:py-4 ${
                    person.id === activeId
                      ? 'bg-[#20201e] text-white lg:bg-transparent lg:text-[#20201e]'
                      : 'text-[#76736c] hover:text-[#20201e]'
                  }`}
                >
                  <span className="font-serif text-xs tabular-nums opacity-60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-medium whitespace-nowrap lg:text-base">
                    {person.name}
                  </span>
                  {person.id === activeId && (
                    <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-[#b39a6b] lg:block" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section
          className="min-w-0 px-5 pt-9 pb-24 sm:px-9 lg:px-12 lg:pt-10 xl:px-16"
          aria-labelledby="master-heading"
        >
          <div className="mb-8 border-b border-[#dedcd5] pb-6">
            <div>
              <span className="mb-4 block text-[11px] tracking-[0.24em] text-[#857e72] uppercase">
                NO. {String(photographerNumber).padStart(2, '0')} /{' '}
                {photographer.category}
              </span>
              <h2
                id="master-heading"
                className="scroll-mt-28 font-serif text-4xl tracking-[-0.04em] sm:text-5xl"
              >
                {photographer.name}
              </h2>
              <p className="mt-2 font-serif text-sm tracking-[0.04em] text-[#8c877f] italic">
                {photographer.latin}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#69655d]">
                {photographer.intro}
              </p>
            </div>
          </div>
          <div className="mb-6 flex items-center justify-between text-[11px] tracking-[0.16em] text-[#8c877f] uppercase">
            <span>CONTACT SHEET / 作品索引</span>
            <span>
              {String(photographer.works.length).padStart(2, '0')} FRAMES
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 md:gap-y-10 xl:gap-x-7">
            {photographer.works.map((work, index) => (
              <button
                key={work.id}
                type="button"
                onClick={() => openWork(index)}
                aria-label={`查看 ${formatTitle(work, index)}`}
                className="group min-w-0 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#20201e]"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#eae8e2] p-2 sm:p-4">
                  {failedImages.includes(work.thumb) ? (
                    <span className="text-xs text-[#6e6961]">图片加载失败</span>
                  ) : (
                    <img
                      src={work.thumb}
                      alt={work.alt}
                      width={work.width}
                      height={work.height}
                      loading="lazy"
                      decoding="async"
                      onError={() => markFailed(work.thumb)}
                      className="max-h-full max-w-full object-contain motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.035]"
                    />
                  )}
                  <span
                    className="absolute right-2 bottom-2 hidden bg-[#20201e] p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={15} />
                  </span>
                </div>
                <span className="mt-3 flex items-baseline gap-2 border-t border-[#c5c0b6] pt-2 text-xs text-[#8d877d] tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                  <span className="min-w-0 truncate text-[13px] text-[#3d3b36]">
                    {formatTitle(work, index)}
                  </span>
                </span>
                <span className="mt-1 block pl-6 text-[11px] text-[#aaa49a]">
                  {work.year}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {selected &&
        createPortal(
          <div
            ref={dialogRef}
            className="fixed inset-0 z-[80] overflow-y-auto bg-[#171715] text-[#efeee9]"
            role="dialog"
            aria-modal="true"
            aria-label={`${photographer.name}作品查看`}
          >
            <div className="flex min-h-full flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 px-5 py-4 sm:px-9">
                <span className="text-[11px] tracking-[0.2em] text-white/55 uppercase">
                  FRAMESPACE / FRAME{' '}
                  {String((selectedIndex ?? 0) + 1).padStart(2, '0')} —{' '}
                  {String(photographer.works.length).padStart(2, '0')}
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  aria-label="关闭观片层"
                  className="flex items-center gap-2 px-2 py-1 text-xs tracking-wider transition-colors hover:text-[#d4b684] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
                >
                  关闭 <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="flex min-h-[45vh] grow items-center justify-center px-5 py-5 sm:px-14">
                {failedImages.includes(selected.image) ? (
                  <div className="flex aspect-[4/3] w-full max-w-2xl items-center justify-center border border-white/20 text-sm text-white/60">
                    图片加载失败，请从下方来源查看原图。
                  </div>
                ) : (
                  <img
                    key={selected.image}
                    src={selected.image}
                    width={selected.width}
                    height={selected.height}
                    alt={selected.alt}
                    onError={() => markFailed(selected.image)}
                    className="max-h-[min(68vh,800px)] max-w-full object-contain shadow-2xl"
                  />
                )}
              </div>
              <div className="grid gap-6 border-t border-white/15 px-5 py-6 sm:px-9 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="mb-2 text-[11px] tracking-[0.2em] text-[#c4aa80] uppercase">
                    {revealed
                      ? `${photographer.latin} · ${selected.year}`
                      : '先看图 / 观察构图'}
                  </p>
                  {revealed ? (
                    <div id="frame-details">
                      <h3 className="font-serif text-xl leading-snug sm:text-2xl">
                        {formatTitle(selected, selectedIndex ?? 0)}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                        {selected.observation}
                      </p>
                      <a
                        href={selected.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs text-[#c4aa80] underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        出处：{selected.source}{' '}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  ) : (
                    <p id="frame-details" className="text-sm text-white/60">
                      先让画面说话，再揭晓作品信息与看点。
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setRevealed(current => !current)}
                    aria-expanded={revealed}
                    aria-controls="frame-details"
                    className="mt-4 border-b border-white/40 pb-1 text-xs text-white/80 transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {revealed ? '先看图 · 隐藏文字' : '揭晓作品信息'}
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => showNext(-1)}
                    aria-label="上一张作品"
                    className="flex h-11 w-14 items-center justify-center border border-white/30 transition-colors hover:border-white hover:bg-white hover:text-[#171715] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <ArrowLeft size={20} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showNext(1)}
                    aria-label="下一张作品"
                    className="flex h-11 w-14 items-center justify-center border border-white/30 transition-colors hover:border-white hover:bg-white hover:text-[#171715] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <ArrowRight size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
