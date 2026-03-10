// ═══════════════════════════════════════════════════════════════
// AUTO PLAY ENGINE — State machine para auto play
// ═══════════════════════════════════════════════════════════════

export interface AutoPlayConfig {
  spins: number;         // -1 = infinito
  stopOnBalanceBelow: number | null;
  stopOnWinAbove: number | null;
  stopOnFreeSpins: boolean;
  stopOnJackpot: boolean;
}

export interface AutoPlayState {
  active: boolean;
  config: AutoPlayConfig | null;
  spinsPlayed: number;
  totalWin: number;
}

const initial: AutoPlayState = {
  active: false, config: null, spinsPlayed: 0, totalWin: 0,
};

export function createAutoPlayEngine() {
  let state = { ...initial };
  let onSpinCallback: (() => void) | null = null;
  let intervalId: ReturnType<typeof setTimeout> | null = null;

  function start(config: AutoPlayConfig, onSpin: () => void) {
    state = { active: true, config, spinsPlayed: 0, totalWin: 0 };
    onSpinCallback = onSpin;
    scheduleNext();
  }

  function scheduleNext() {
    if (!state.active || !onSpinCallback) return;
    // Delay entre spins (1.5s rate limit + margem)
    intervalId = setTimeout(() => {
      if (!state.active) return;
      onSpinCallback?.();
    }, 2000);
  }

  function onSpinComplete(result: {
    totalWin: number;
    balance: number;
    freeSpinsTriggered: boolean;
    jackpotHit: boolean;
  }) {
    if (!state.active || !state.config) return;

    state.spinsPlayed += 1;
    state.totalWin += result.totalWin;

    // Check stop conditions
    const c = state.config;
    let shouldStop = false;
    let reason = "";

    // Spins esgotados
    if (c.spins !== -1 && state.spinsPlayed >= c.spins) {
      shouldStop = true;
      reason = "spins_complete";
    }
    // Saldo abaixo do limite
    if (c.stopOnBalanceBelow !== null && result.balance < c.stopOnBalanceBelow) {
      shouldStop = true;
      reason = "balance_low";
    }
    // Win acima do limite
    if (c.stopOnWinAbove !== null && state.totalWin >= c.stopOnWinAbove) {
      shouldStop = true;
      reason = "win_high";
    }
    // Free spins ativaram
    if (c.stopOnFreeSpins && result.freeSpinsTriggered) {
      shouldStop = true;
      reason = "free_spins";
    }
    // Jackpot ativou
    if (c.stopOnJackpot && result.jackpotHit) {
      shouldStop = true;
      reason = "jackpot";
    }

    if (shouldStop) {
      stop();
      return { stopped: true, reason, spinsPlayed: state.spinsPlayed, totalWin: state.totalWin };
    }

    // Agendar próximo spin
    scheduleNext();
    return { stopped: false, spinsPlayed: state.spinsPlayed, totalWin: state.totalWin };
  }

  function stop() {
    state.active = false;
    if (intervalId) { clearTimeout(intervalId); intervalId = null; }
    onSpinCallback = null;
  }

  function isActive() { return state.active; }
  function getState() { return { ...state }; }

  return { start, stop, onSpinComplete, isActive, getState };
}
