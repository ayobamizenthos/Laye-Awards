import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_45%_at_50%_40%,rgba(201,168,76,0.14),transparent_70%)]"
      />
      <div className="relative">
        <p className="font-display text-[28vw] font-medium leading-none text-gilded sm:text-[16rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
          This page isn&apos;t on the programme.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-ink-soft">
          The page you were looking for has moved, or never took the stage.
        </p>
        <div className="mt-9 flex justify-center">
          <Button href="/" withArrow>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
