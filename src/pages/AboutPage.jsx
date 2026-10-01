/**
 * AboutPage — Describes what Bloom is and how it works.
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center justify-center">
      <div
        className="window-panel rounded-3xl max-w-xl w-full p-8 modal-enter text-center"
      >
        {/* Logo */}
        <div className="text-6xl mb-4">🌸</div>

        <h1
          className="text-4xl font-serif italic tracking-tight text-white mb-2"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.05em' }}
        >
          Bloom
        </h1>
        <p className="text-white/40 text-xs mb-8 tracking-widest">ver. 1.1</p>

        <p className="text-white/70 text-base leading-relaxed mb-6">
          Bloom is a mood-based greeting card generator that selects the perfect
          flower — or Pokémon card — to express exactly how you feel.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: '📝', title: 'Paper', desc: 'Classic & timeless' },
            { icon: '✨', title: 'Metallic', desc: 'Shiny & special' },
            { icon: '⚡', title: 'Pokémon', desc: 'Fun & unique' },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="glass rounded-2xl p-4 flex flex-col items-center gap-1"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-white/80 text-sm font-medium">{title}</span>
              <span className="text-white/40 text-xs">{desc}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-white/50 text-sm">
          <p>🌹 Pick your mood → get your flower → customize your card → share it</p>
        </div>
      </div>
    </div>
  );
}
