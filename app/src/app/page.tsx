import Hero from "@/components/Hero";
import { Particles } from "@/components/magicui/particles";
import WalletConnectButton from "@/components/WalletConnectButton";
import Link from "next/link";

export default function Home() {
  const color = "#ffffff";

  return (
    <div className="relative overflow-hidden">
      <Particles
        className="absolute inset-0 z-50"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
      <Hero />
      <main className="relative bg-gradient-to-b from-[#151515] via-[#292929] to-[#151515]">
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#1B1B1B] via-[#1B1B1B] to-transparent backdrop-blur-md"></div>
        <section id="services" className="container mx-auto px-4 py-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Why Choose Unmask?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Decentralized",
                description:
                  "No central authority can censor or manipulate your report",
              },
              {
                title: "Anonymous",
                description:
                  "Protect your identity while speaking out against injustice",
              },
              {
                title: "Immutable",
                description:
                  "Once posted, your reports are permanently stored on the blockchain",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-20 p-6 rounded-lg"
              >
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ol className="space-y-6">
                {[
                  "Connect your wallet to create an account",
                  "Write your report or upload evidence",
                  "Submit to the blockchain",
                  "Your post is now live and immutable",
                ].map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                      {index + 1}
                    </span>
                    <span className="text-xl">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white bg-opacity-20 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Join the Movement</h3>
              <p className="text-lg mb-6">
                Be part of a global community dedicated to exposing injustices
                and driving positive change. Your voice can make a difference.
              </p>
              <WalletConnectButton />
            </div>
          </div>
        </section>
      </main>

      <footer className="px-4 py-8 border-t border-white border-opacity-20 bg-black">
        <div className="max-w-screen-xl mx-auto w-full">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">Unmask</h4>
              <p>
                Empowering voices, exposing truths, and driving change through
                decentralized reporting.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["About", "How It Works", "FAQs", "Contact"].map(
                  (link, index) => (
                    <li key={index}>
                      <Link href="#" className="hover:underline">
                        {link}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                {["Twitter", "Telegram", "Discord", "GitHub"].map(
                  (social, index) => (
                    <li key={index}>
                      <Link href="#" className="hover:underline">
                        {social}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            © {new Date().getFullYear()} Unmask. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
