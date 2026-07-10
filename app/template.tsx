'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'

let introPassed = false

export default function Template({ children }: { children: React.ReactNode }) {
  const [curtain, setCurtain] = useState(false)

  useEffect(() => {
    if (introPassed) {
      setCurtain(true)
    } else {
      introPassed = true
    }
  }, [])

  return (
    <>
      {children}
      {curtain && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center bg-onyx"
          initial={{ y: 0 }}
          animate={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => setCurtain(false)}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_46%_46%_at_50%_50%,rgba(201,168,76,0.16),transparent_70%)]" />
          <div className="rule-gold absolute inset-x-0 bottom-0 h-px" />
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.55, ease: 'easeIn' }}
          >
            <Image src="/laye-emblem.png" alt="" width={497} height={461} className="h-16 w-auto" />
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
