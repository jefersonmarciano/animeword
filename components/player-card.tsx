"use client"

import Image from "next/image"
import type { Player } from "@/context/game-context"

interface PlayerCardProps {
  player: Player
  isCurrentPlayer: boolean
}

export default function PlayerCard({ player, isCurrentPlayer }: PlayerCardProps) {
  return (
    <div
      className={`bg-card p-4 rounded-lg border ${isCurrentPlayer ? "border-yellow-500" : "border-transparent"} relative`}
    >
      {isCurrentPlayer && <div className="crown">👑</div>}

      <div className="flex flex-col items-center">
        <div className="player-avatar mb-2">
          <Image
            src={player.avatar || "/placeholder.svg"}
            alt={`Avatar do ${player.name}`}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>

        <h3 className="font-medium mb-2">{player.name}</h3>

        <div className="player-score">{player.score}</div>
      </div>
    </div>
  )
}
