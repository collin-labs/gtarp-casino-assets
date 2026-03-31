import { CasinoProvider } from "@/contexts/CasinoContext";
import BlackoutCasino from "@/components/casino/BlackoutCasino";

export default function Page() {
  return (
    <CasinoProvider>
      <BlackoutCasino />
    </CasinoProvider>
  );
}
