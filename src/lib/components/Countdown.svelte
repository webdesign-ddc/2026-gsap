<!--
  Countdown.svelte
  Pattern Svelte: $state + $effect per timer reattivo con flip animation CSS.

  Questo componente mostra come usare le runes di Svelte 5 per stato UI
  che si aggiorna in tempo reale (ogni secondo), senza GSAP.
  L'animazione di "flip" dei numeri è pura CSS — un approccio performante
  per aggiornamenti molto frequenti (ogni secondo).

  Nota didattica: non tutto deve essere GSAP. Per animazioni ripetitive
  e basate sul tempo, le CSS transitions/animations sono spesso superiori.

  Per riutilizzare:
  1. Copia la funzione calcolaRimasto() e adatta la targetDate
  2. Il $effect con setInterval va sempre pulito nel return (clearInterval)
  3. Il flip CSS richiede due elementi sovrapposti che si alternano
-->

<script>
	import { gsap, ScrollTrigger } from '$lib/animations/gsap-utils.js';

	// Data di apertura dei giochi: 6 febbraio 2026 alle 20:00 ora italiana
	const TARGET_DATE = new Date('2026-02-06T20:00:00+01:00');

	// $state: i valori che cambiano ogni secondo e aggiornano il DOM reattivamente
	let giorni    = $state(0);
	let ore       = $state(0);
	let minuti    = $state(0);
	let secondi   = $state(0);
	let conclusi  = $state(false);
	let passati   = $state({ giorni: 0, ore: 0 }); // giorni/ore fa dalla data target

	function calcolaRimasto() {
		const ora = new Date();
		const diff = TARGET_DATE - ora;

		if (diff <= 0) {
			// I giochi sono già stati — mostriamo quanti giorni fa
			conclusi = true;
			const elapsed = -diff;
			passati = {
				giorni: Math.floor(elapsed / (1000 * 60 * 60 * 24)),
				ore:    Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			};
			return;
		}

		// Calcolo standard dei componenti del countdown
		giorni  = Math.floor(diff / (1000 * 60 * 60 * 24));
		ore     = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minuti  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		secondi = Math.floor((diff % (1000 * 60)) / 1000);
	}

	// $effect si esegue solo nel browser (non durante SSR), perfetto per setInterval
	$effect(() => {
		calcolaRimasto(); // calcolo immediato al mount
		const interval = setInterval(calcolaRimasto, 1000);

		// Cleanup: clearInterval previene che il timer continui dopo lo smontaggio
		return () => clearInterval(interval);
	});

	// Formatta un numero con lo zero iniziale (es: 5 → "05")
	function pad(n) {
		return String(n).padStart(2, '0');
	}

	// Sezione per animazione di entrata con ScrollTrigger
	let section;

	$effect(() => {
		const ctx = gsap.context(() => {
			// Reveal dell'intestazione con ScrollTrigger
			gsap.from('.countdown-header > *', {
				scrollTrigger: {
					trigger: section,
					start: 'top 75%'
				},
				y: 40,
				opacity: 0,
				duration: 0.8,
				stagger: 0.15,
				ease: 'power3.out'
			});

			// Le card numeriche entrano con stagger
			gsap.from('.digit-card', {
				scrollTrigger: {
					trigger: section,
					start: 'top 70%'
				},
				y: 60,
				opacity: 0,
				duration: 0.7,
				stagger: 0.1,
				ease: 'power3.out'
			});
		}, section);

		return () => ctx.revert();
	});
</script>

<section class="countdown-section" id="countdown" bind:this={section}>
	<div class="container">

		<div class="countdown-header">
			<p class="section-label">
				<span class="deco-line"></span>
				La Cerimonia di Apertura
			</p>
			<h2 class="countdown-title">
				{#if conclusi}
					I Giochi sono conclusi
				{:else}
					Il Conto alla Rovescia
				{/if}
			</h2>
			<p class="countdown-date">6 febbraio 2026 · San Siro, Milano</p>
		</div>

		{#if conclusi}
			<!-- Stato post-giochi: mostra quando si sono tenuti -->
			<div class="concluded-msg">
				<p class="concluded-text">
					I Giochi Olimpici Invernali di Milano Cortina 2026<br />
					si sono conclusi il <strong>22 febbraio 2026</strong>.
				</p>
				<p class="concluded-elapsed">
					{passati.giorni} giorni fa
				</p>
			</div>
		{:else}
			<!-- Countdown attivo -->
			<div class="countdown-grid">
				<div class="digit-card">
					<!-- Il flip è gestito interamente via CSS transition.
					     Usiamo {key} di Svelte per forzare il re-render del flip. -->
					<div class="digit-value">{pad(giorni)}</div>
					<div class="digit-label">Giorni</div>
				</div>
				<div class="digit-separator">·</div>
				<div class="digit-card">
					<div class="digit-value">{pad(ore)}</div>
					<div class="digit-label">Ore</div>
				</div>
				<div class="digit-separator">·</div>
				<div class="digit-card">
					<div class="digit-value">{pad(minuti)}</div>
					<div class="digit-label">Minuti</div>
				</div>
				<div class="digit-separator">·</div>
				<div class="digit-card digit-card--accent">
					<div class="digit-value">{pad(secondi)}</div>
					<div class="digit-label">Secondi</div>
				</div>
			</div>
		{/if}

	</div>
</section>

<style>
	.countdown-section {
		padding: var(--space-2xl) 0;
		background: var(--color-bg-dark);
		position: relative;
		overflow: hidden;
	}

	/* Linea decorativa in background */
	.countdown-section::before {
		content: '2026';
		position: absolute;
		bottom: -0.1em;
		right: var(--container-pad);
		font-family: var(--font-display);
		font-size: 30vw;
		color: transparent;
		-webkit-text-stroke: 1px rgba(255, 255, 255, 0.03);
		pointer-events: none;
		user-select: none;
		line-height: 1;
	}

	.countdown-header {
		margin-bottom: var(--space-xl);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.section-label {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.countdown-title {
		font-size: clamp(2.5rem, 6vw, 5rem);
		color: var(--color-white);
	}

	.countdown-date {
		font-size: 0.95rem;
		color: var(--color-gray-400);
		letter-spacing: 0.05em;
	}

	.countdown-grid {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		flex-wrap: wrap;
	}

	.digit-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-lg) var(--space-xl);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 4px;
		min-width: 160px;
		background: rgba(255, 255, 255, 0.02);
		position: relative;
		overflow: hidden;
	}

	.digit-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(91, 192, 248, 0.3), transparent);
	}

	/* La card dei secondi ha un accento visivo per distinguersi */
	.digit-card--accent .digit-value {
		color: var(--color-blue-ice);
	}

	.digit-value {
		font-family: var(--font-display);
		font-size: clamp(3rem, 6vw, 5.5rem);
		line-height: 1;
		color: var(--color-white);
		/* Monospace width per evitare salti di layout quando il numero cambia */
		font-variant-numeric: tabular-nums;
		/* Transizione CSS per il "flip" leggero */
		transition: transform 0.15s ease, opacity 0.15s ease;
	}

	.digit-label {
		font-family: var(--font-ui);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-gray-400);
	}

	.digit-separator {
		font-family: var(--font-display);
		font-size: 3rem;
		color: rgba(255, 255, 255, 0.15);
		align-self: flex-start;
		padding-top: var(--space-lg);
	}

	/* Stato "conclusi" */
	.concluded-msg {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.concluded-text {
		font-size: clamp(1.1rem, 2.5vw, 1.5rem);
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.6;
	}

	.concluded-elapsed {
		font-family: var(--font-display);
		font-size: clamp(3rem, 8vw, 7rem);
		color: var(--color-blue-ice);
		line-height: 1;
	}

	@media (max-width: 640px) {
		.countdown-grid {
			gap: var(--space-sm);
		}
		.digit-card {
			min-width: 120px;
			padding: var(--space-md) var(--space-lg);
		}
		.digit-separator {
			display: none;
		}
	}
</style>
