'use client'

// TODO-APP: support typing for useSelectedLayoutSegment
// @ts-ignore
import { useSelectedLayoutSegments } from 'neer/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  // useSelectedLayoutSegment should not be thrown
  useSelectedLayoutSegments()
  return children
}
