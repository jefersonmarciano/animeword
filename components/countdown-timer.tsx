"use client"

import { useState, useEffect } from "react"

export default function CountdownTimer() {
  const [count, setCount] = useState(5)

  useEffect(() => {
    if (count <= 0) return

    const timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [count])

  if (count <= 0) return null

  return (
    <div className="countdown-overlay">
      <div className="countdown-number">{count}</div>
    </div>
  )
}
