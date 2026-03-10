"use client";

import { useState } from "react";
import CaseBattleLobby from "./CaseBattleLobby";
import CaseBattleGame from "./CaseBattleGame";

interface CaseBattleProps {
  isBR: boolean;
  onBack: () => void;
}

export default function CaseBattle({ isBR, onBack }: CaseBattleProps) {
  const [activeBattle, setActiveBattle] = useState<number | null>(null);

  if (activeBattle !== null) {
    return (
      <CaseBattleGame
        battleId={activeBattle}
        players={[]}
        winnerId={0}
        isBR={isBR}
        onClose={() => setActiveBattle(null)}
      />
    );
  }

  return (
    <CaseBattleLobby
      isBR={isBR}
      onJoinBattle={(id) => setActiveBattle(id)}
      onCreateBattle={() => {
        // Mock: cria e entra na batalha #99
        setActiveBattle(99);
      }}
      onBack={onBack}
    />
  );
}
