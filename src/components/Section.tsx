export function Section ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`${className} pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen`}
    >
      {children}
    </section>
  )
}
