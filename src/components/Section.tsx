import { SectionProps } from '../models/Props/SectionProps'

export function Section (props: SectionProps) {
  return (
    <section
      className={`${props.className} pb-nav w-[clamp(320px,100vw,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen`}
    >
      {props.children}
    </section>
  )
}
