import AssetVaultAndCTA from "@/components/AssetVaultAndCTA";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import EcosystemMatrix from "@/components/EcosystemMatrix"
import ArtifactAcquisitionEngine from "@/components/ArtifactAcquisitionEngine";
import DirectiveGateway from "@/components/DirectiveGateway";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <Hero />
      <AssetVaultAndCTA/>
      <EcosystemMatrix />
      <ArtifactAcquisitionEngine />
      <DirectiveGateway />
    </div>
  );
}
