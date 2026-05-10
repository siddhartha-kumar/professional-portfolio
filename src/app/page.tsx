import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Metrics } from "@/components/sections/Metrics";
import { Projects } from "@/components/sections/Projects/Projects";
import { Experience } from "@/components/sections/Experience";
import { Stack } from "@/components/sections/Stack";
import { Certifications } from "@/components/sections/Certifications";
import { GitHub } from "@/components/sections/GitHub";
import { Contact } from "@/components/sections/Contact";
import { EasterEggListener } from "@/components/effects/EasterEggListener";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { BootSequence } from "@/components/effects/BootSequence";
import { CinematicEffects } from "@/components/effects/CinematicEffects";
import { GlobalDataBackdrop } from "@/components/effects/GlobalDataBackdrop";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <About />
        <Metrics />
        <Projects />
        <Experience />
        <Stack />
        <Certifications />
        <GitHub />
        <Contact />
      </main>
      <Footer />
      <GlobalDataBackdrop />
      <CinematicEffects />
      <CommandPalette />
      <CustomCursor />
      <BootSequence />
      <EasterEggListener />
    </>
  );
}
