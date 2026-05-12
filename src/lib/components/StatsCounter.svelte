<!--
  StatsCounter.svelte
  Pattern GSAP: counter animato con onUpdate + ScrollTrigger.

  Questo componente mostra come animare valori numerici da 0 a N.
  GSAP non anima i numeri direttamente nel DOM, ma anima un oggetto JS intermedio
  e poi aggiorna il DOM tramite il callback onUpdate.

  Pattern chiave:
    gsap.to(oggetto, {
      valore: N,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => { elemento.textContent = Math.round(oggetto.valore) }
    })

  ScrollTrigger fa partire ogni counter quando entra nella viewport.

  Per riutilizzare:
  1. Crea un array di { label, valore, suffisso } da mostrare
  2. Per ogni elemento, usa gsap.to() con onUpdate per aggiornare il testo
  3. Usa stagger dentro un ScrollTrigger per un effetto a cascata
-->

<script>
	import { gsap, ScrollTrigger } from '$lib/animations/gsap-utils.js';

	// Dati dei contatori — modifica questi valori per adattarli al tuo progetto
	const stats = [
		{ label: 'Atleti',      valore: 2900, suffisso: '+' },
		{ label: 'Nazioni',     valore: 90,   suffisso: '' },
		{ label: 'Discipline',  valore: 116,  suffisso: '' },
		{ label: 'Sedi',        valore: 13,   suffisso: '' }
	];

	let section;
	let valueEls = [];  // array di riferimenti agli elementi DOM dei valori

	$effect(() => {
		const ctx = gsap.context(() => {

			// Animazione di entrata dell'intestazione
			gsap.from('.stats-header > *', {
				scrollTrigger: {
					trigger: section,
					start: 'top 75%'
				},
				y: 30,
				opacity: 0,
				duration: 0.7,
				stagger: 0.12,
				ease: 'power3.out'
			});

			// Animazione di entrata delle card con stagger
			gsap.from('.stat-card', {
				scrollTrigger: {
					trigger: section,
					start: 'top 65%'
				},
				y: 50,
				opacity: 0,
				duration: 0.8,
				stagger: 0.15,
				ease: 'power3.out'
			});

			// PATTERN PRINCIPALE: counter animato per ogni statistica.
			// Usiamo un oggetto intermedio `proxy` perché GSAP anima proprietà
			// di oggetti JS, non direttamente il DOM.
			stats.forEach((stat, i) => {
				const el = valueEls[i];
				if (!el) return;

				// Oggetto proxy: GSAP modificherà proxy.valore da 0 a stat.valore
				const proxy = { valore: 0 };

				gsap.to(proxy, {
					scrollTrigger: {
						trigger: section,
						start: 'top 60%',
						// once: true → il counter non si resetta quando si scrolla indietro
						once: true
					},
					valore: stat.valore,
					duration: 2.5,
					delay: i * 0.15,         // stagger manuale per i counter
					ease: 'power3.out',
					onUpdate: () => {
						// Aggiorniamo il DOM a ogni frame dell'animazione
						el.textContent = Math.round(proxy.valore).toLocaleString('it-IT') + stat.suffisso;
					}
				});
			});

		}, section);

		return () => ctx.revert();
	});
</script>

<section class="stats-section" id="numeri" bind:this={section}>
	<div class="container">

		<div class="stats-header">
			<p class="section-label">
				<span class="deco-line"></span>
				In numeri
			</p>
			<h2 class="stats-title">I Numeri dei Giochi</h2>
		</div>

		<div class="stats-grid">
			{#each stats as stat, i}
				<div class="stat-card">
					<!-- bind:this con array: salva il riferimento all'elemento per indice -->
					<div
						class="stat-value"
						bind:this={valueEls[i]}
					>
						0{stat.suffisso}
					</div>
					<div class="stat-label">{stat.label}</div>
					<div class="stat-line"></div>
				</div>
			{/each}
		</div>

		<!-- Didascalia esplicativa -->
		<p class="stats-note">
			Dati aggiornati alla vigilia dei Giochi · Fonte: CIO
		</p>

	</div>
</section>

<style>
	.stats-section {
		padding: var(--space-2xl) 0;
		background: var(--color-bg-dark);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.stats-header {
		margin-bottom: var(--space-xl);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.stats-title {
		font-size: clamp(2rem, 4vw, 3.5rem);
		color: var(--color-white);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.06);
		margin-bottom: var(--space-lg);
	}

	.stat-card {
		background: var(--color-bg-dark);
		padding: var(--space-xl) var(--space-lg);
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: clamp(3rem, 6vw, 6rem);
		line-height: 1;
		color: var(--color-white);
		/* Previene il layout shift durante l'animazione del numero */
		font-variant-numeric: tabular-nums;
	}

	.stat-label {
		font-family: var(--font-ui);
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-gray-400);
	}

	/* Lineetta decorativa colorata sotto ogni stat */
	.stat-line {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: transparent;
		transition: background 0.3s ease;
	}

	.stat-card:nth-child(1) .stat-line { background: var(--color-blue-ice); }
	.stat-card:nth-child(2) .stat-line { background: rgba(91, 192, 248, 0.5); }
	.stat-card:nth-child(3) .stat-line { background: rgba(91, 192, 248, 0.3); }
	.stat-card:nth-child(4) .stat-line { background: rgba(91, 192, 248, 0.15); }

	.stats-note {
		font-size: 0.75rem;
		color: var(--color-gray-400);
		letter-spacing: 0.05em;
	}

	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
