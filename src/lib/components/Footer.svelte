<!--
  Footer.svelte
  Pattern GSAP: gsap.from() con ScrollTrigger applicato a SplitTextReveal.

  Il footer usa il componente SplitTextReveal per la frase principale,
  dimostrando come riutilizzare un componente di animazione in contesti diversi.
  Il resto usa scroll reveal standard con stagger.

  Design: minimale, tutto il peso visivo è nel testo grande.
-->

<script>
	import { gsap } from '$lib/animations/gsap-utils.js';
	import SplitTextReveal from './SplitTextReveal.svelte';

	let footer;

	$effect(() => {
		const ctx = gsap.context(() => {
			// Reveal del contenuto secondario (links, crediti)
			gsap.from('.footer-meta > *', {
				scrollTrigger: {
					trigger: footer,
					start: 'top 85%'
				},
				y: 20,
				opacity: 0,
				duration: 0.6,
				stagger: 0.08,
				ease: 'power2.out'
			});
		}, footer);

		return () => ctx.revert();
	});
</script>

<footer class="footer" bind:this={footer}>
	<div class="container">

		<!-- Frase principale con SplitTextReveal — pattern riutilizzato dall'Hero -->
		<div class="footer-headline">
			<SplitTextReveal
				testo="Insieme verso l'eccellenza olimpica."
				grande={true}
			/>
		</div>

		<div class="footer-meta">
			<!-- Logo / titolo -->
			<div class="footer-brand">
				<span class="brand-mc">MILANO · CORTINA</span>
				<span class="brand-year">2026</span>
			</div>

			<!-- Link rapidi -->
			<nav class="footer-nav" aria-label="Link footer">
				<a href="https://milano-cortina-2026.com" class="footer-link" target="_blank" rel="noopener">
					Sito Ufficiale
				</a>
				<a href="#numeri" class="footer-link">I Numeri</a>
				<a href="#discipline" class="footer-link">Discipline</a>
				<a href="#timeline" class="footer-link">Timeline</a>
			</nav>

			<!-- Crediti progetto didattico -->
			<div class="footer-credits">
				<p class="credits-line">
					Progetto didattico · Svelte 5 + GSAP + Threlte
				</p>
				<p class="credits-line">
					Patterns: timeline · ScrollTrigger · quickTo · scrub · loop
				</p>
			</div>
		</div>

		<!-- Separatore e copyright -->
		<div class="footer-bottom">
			<span class="footer-copy">
				© 2025 Progetto didattico Digital Design. Non affiliato con il CIO o il CONI.
			</span>
			<span class="footer-stack">
				Built with SvelteKit · GSAP · Threlte · Three.js
			</span>
		</div>

	</div>
</footer>

<style>
	.footer {
		padding: var(--space-2xl) 0 var(--space-lg);
		background: var(--color-bg-dark);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.footer-headline {
		margin-bottom: var(--space-xl);
		max-width: 900px;
	}

	.footer-meta {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: var(--space-xl);
		padding-bottom: var(--space-xl);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		margin-bottom: var(--space-lg);
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.brand-mc {
		font-family: var(--font-display);
		font-size: 1.2rem;
		color: var(--color-white);
		letter-spacing: -0.02em;
	}

	.brand-year {
		font-family: var(--font-ui);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		color: var(--color-blue-ice);
	}

	.footer-nav {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.footer-link {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.5);
		text-decoration: none;
		transition: color 0.2s ease;
		width: fit-content;
	}

	.footer-link:hover {
		color: var(--color-white);
	}

	.footer-credits {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.credits-line {
		font-size: 0.75rem;
		color: var(--color-gray-400);
		line-height: 1.5;
	}

	.footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-md);
	}

	.footer-copy,
	.footer-stack {
		font-size: 0.72rem;
		color: rgba(255, 255, 255, 0.25);
		letter-spacing: 0.02em;
	}

	@media (max-width: 768px) {
		.footer-meta {
			grid-template-columns: 1fr;
			gap: var(--space-lg);
		}
		.footer-bottom {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
