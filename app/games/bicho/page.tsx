import { CasinoProvider } from "@/contexts/CasinoContext";
import AnimalGameWrapper from "./AnimalGameWrapper";

export const metadata = {
  title: "Jogo do Bicho | Blackout Casino",
  description: "Animal Game - Jogo do Bicho premium para GTA RP",
};

export default function BichoPage() {
  return (
    <CasinoProvider>
      <AnimalGameWrapper />
    </CasinoProvider>
  );
}
