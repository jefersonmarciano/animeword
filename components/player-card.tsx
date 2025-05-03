"use client";

import { useState } from "react";
import Image from "next/image";
import type { Player } from "@/context/game-context";
import AvatarSelectorModal from "./avatar-selector-modal";

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  isCurrentUser?: boolean;
  onChangeAvatar?: (playerId: number, avatar: string) => void;
}

export default function PlayerCard({
  player,
  isCurrentPlayer,
  isCurrentUser,
  onChangeAvatar,
}: PlayerCardProps) {
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleAvatarClick = () => {
    if (onChangeAvatar) {
      setShowAvatarModal(true);
    }
  };

  const handleSelectAvatar = (avatar: string) => {
    if (onChangeAvatar) {
      onChangeAvatar(player.id, avatar);
    }
  };

  return (
    <div
      className={`bg-card p-4 rounded-lg border ${
        isCurrentPlayer ? "border-yellow-500" : "border-border"
      } relative shadow-sm`}
    >
      {isCurrentPlayer && <div className="crown">👑</div>}

      <div className="flex flex-col items-center">
        <div
          className={`player-avatar mb-2 ${
            onChangeAvatar ? "cursor-pointer" : ""
          }`}
          onClick={handleAvatarClick}
          title={onChangeAvatar ? "Clique para mudar o avatar" : ""}
        >
          <Image
            src={player.avatar || "/placeholder.svg"}
            alt={`Avatar do ${player.name}`}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>

        <h3 className="font-medium mb-2 text-center">{player.name}</h3>

        <div className="player-score">{player.score}</div>
      </div>

      {onChangeAvatar && (
        <AvatarSelectorModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          onSelect={handleSelectAvatar}
          currentAvatar={player.avatar}
        />
      )}
    </div>
  );
}
