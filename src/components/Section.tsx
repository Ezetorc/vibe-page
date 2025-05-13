import { ReactNode } from 'react'
import { Nav } from './Nav'

export function Section (props: { children: ReactNode; className?: string }) {
  return (
    <>
      <section
        className={`${props.className} animate-appear-from-top pb-nav w-[clamp(320px,100vw,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen`}
      >
        {props.children}
      </section>

      <Nav />
    </>
  )
}
