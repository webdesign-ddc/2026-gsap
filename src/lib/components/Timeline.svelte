<!--
  Timeline.svelte
  Pattern GSAP: ScrollTrigger stagger sequenziale con animazione a cascata.

  Questo componente mostra come usare stagger dentro un ScrollTrigger:
  ogni elemento della timeline entra con un ritardo progressivo,
  creando un effetto "a cascata" che guida l'attenzione dell'utente.

  La combinazione ScrollTrigger + stagger è uno dei pattern più usati nel web design
  moderno: semplice da implementare, efficace visivamente, leggibile nel codice.

  Pattern chiave:
    gsap.from('.item', {
      scrollTrigger: { trigger, start: 'top 70%' },
      x: -60, opacity: 0,
      stagger: 0.12,
      ease: 'power3.out'
    })

  Per riutilizzare:
  1. Applica una classe comune a tutti gli elementi da animare
  2. Usa gsap.from() con stagger + un singolo ScrollTrigger sul contenitore
  3. Aggiusta stagger: il valore dipende da quanti elementi ci sono e quanto sono distanziati
-->

<script>
	import { gsap, ScrollTrigger } from '$lib/animations/gsap-utils.js';

	// Eventi chiave dei Giochi Olimpici Invernali Milano Cortina 2026
	const eventi = [
		{
			data:  '6 feb 2026',
			giorno: 'Giorno 1',
			titolo: 'Cerimonia di Apertura',
			luogo: 'Stadio San Siro, Milano',
			desc: 'La fiamma olimpica illumina San Siro davanti a 80.000 spettatori.',
			highlight: true
		},
		{
			data: '7 feb 2026',
			giorno: 'Giorno 2',
			titolo: 'Prime Medaglie d\'Oro',
			luogo: 'Bormio · Anterselva',
			desc: 'Prima discesa libera maschile e prime gare di biathlon.'
		},
		{
			data: '9 feb 2026',
			giorno: 'Giorno 4',
			titolo: 'Halfpipe Snowboard',
			luogo: 'Livigno',
			desc: 'Il circo bianco del freestyle si esibisce sulle piste di Livigno.'
		},
		{
			data: '12 feb 2026',
			giorno: 'Giorno 7',
			titolo: 'Hockey — Fase a Gironi',
			luogo: 'Palazzo del Ghiaccio, Milano',
			desc: 'Il torneo di hockey entra nel vivo con le prime sfide decisive.'
		},
		{
			data: '15 feb 2026',
			giorno: 'Giorno 10',
			titolo: 'Pattinaggio Artistico',
			luogo: 'Verona Arena',
			desc: 'Lo spettacolo del pattinaggio artistico nella magnifica arena romana.'
		},
		{
			data: '18 feb 2026',
			giorno: 'Giorno 13',
			titolo: 'Sci Alpino — Slalom',
			luogo: 'Cortina d\'Ampezzo',
			desc: 'La Tofana ospita le finali dello slalom maschile e femminile.'
		},
		{
			data: '22 feb 2026',
			giorno: 'Giorno 17',
			titolo: 'Cerimonia di Chiusura',
			luogo: 'Stadio San Siro, Milano',
			desc: 'La fiamma si spegne. Milano Cortina 2026 passa il testimone a Salt Lake City.',
			highlight: true
		}
	];

	let section;

	$effect(() => {
		const ctx = gsap.context(() => {

			// Animazione dell'intestazione
			gsap.from('.timeline-header > *', {
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

			// PATTERN PRINCIPALE: stagger su ScrollTrigger
			// Gli elementi .timeline-item appaiono a cascata da sinistra
			gsap.from('.timeline-item', {
				scrollTrigger: {
					trigger: '.timeline-list',
					start: 'top 75%',
					// end: 'bottom 20%'  // toggleActions funziona nel range start→end
				},
				x: -60,
				opacity: 0,
				duration: 0.7,
				stagger: 0.12,    // ogni elemento parte 120ms dopo il precedente
				ease: 'power3.out'
			});

			// La linea verticale si "riempie" dall'alto verso il basso con scrub
			gsap.from('.timeline-progress', {
				scrollTrigger: {
					trigger: '.timeline-list',
					start: 'top 60%',
					end: 'bottom 40%',
					scrub: 1
				},
				scaleY: 0,
				transformOrigin: 'top center',
				ease: 'none'
			});

			// PATTERN: ScrollTrigger.create() per ogni item — illumina il pallino
			// quando la progress bar lo raggiunge durante lo scroll.
			//
			// start: 'top 58%' è calibrato per matchare il momento in cui la barra
			// cresce fino a quel punto. La transizione CSS sul ::before smussa
			// il cambio colore anche se c'è un piccolo sfasamento di timing.
			//
			// onEnter     → dot si illumina (scrollando verso il basso)
			// onLeaveBack → dot si spegne  (scrollando verso l'alto)
			const items = section.querySelectorAll('.timeline-item');
			items.forEach((item) => {
				ScrollTrigger.create({
					trigger: item,
					start: 'top 58%',
					onEnter:     () => item.classList.add('dot-active'),
					onLeaveBack: () => item.classList.remove('dot-active'),
				});
			});

		}, section);

		return () => ctx.revert();
	});
</script>

<section class="timeline-section" id="timeline" bind:this={section}>
	<div class="container">

		<div class="timeline-header">
			<p class="section-label">
				<span class="deco-line"></span>
				Il programma
			</p>
			<h2 class="timeline-title">Tappe<br />dei Giochi</h2>
		</div>

		<div class="timeline-layout">
			<!-- Linea verticale decorativa con progress animato -->
			<div class="timeline-track">
				<div class="timeline-progress"></div>
			</div>

			<!-- Lista degli eventi -->
			<ol class="timeline-list">
				{#each eventi as evento}
					<li class="timeline-item" class:timeline-item--highlight={evento.highlight}>
						<div class="item-meta">
							<span class="item-giorno">{evento.giorno}</span>
							<span class="item-data">{evento.data}</span>
						</div>
						<div class="item-content">
							<h3 class="item-titolo">{evento.titolo}</h3>
							<p class="item-luogo">
								<span class="pin">◎</span>
								{evento.luogo}
							</p>
							<p class="item-desc">{evento.desc}</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>

	</div>
</section>

<style>
	.timeline-section {
		padding: var(--space-2xl) 0;
		background: var(--color-bg-dark);
		border-top: 1px solid rgba(255, 255, 255, 0.05);
	}

	.timeline-header {
		margin-bottom: var(--space-xl);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.timeline-title {
		font-size: clamp(2.5rem, 5vw, 5rem);
		color: var(--color-white);
	}

	.timeline-layout {
		display: grid;
		grid-template-columns: 40px 1fr;
		gap: 0 var(--space-lg);
	}

	/* Traccia verticale della timeline */
	.timeline-track {
		position: relative;
		grid-row: 1 / -1;
	}

	.timeline-track::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		bottom: 0;
		width: 1px;
		background: rgba(255, 255, 255, 0.08);
		transform: translateX(-50%);
	}

	/* La progress bar che si anima con scrub */
	.timeline-progress {
		position: absolute;
		top: 0;
		left: 50%;
		bottom: 0;
		width: 1px;
		background: var(--color-blue-ice);
		transform: translateX(-50%);
		/* scaleY parte da 0, animato da GSAP */
		transform-origin: top center;
	}

	.timeline-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.timeline-item {
		display: grid;
		grid-template-columns: 160px 1fr;
		gap: var(--space-lg);
		padding: var(--space-lg) 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		position: relative;
	}

	/* Pallino sulla linea temporale — stato di default: hollow (spento).
	   Il colore blu arriva solo via .dot-active, aggiunto da ScrollTrigger. */
	.timeline-item::before {
		content: '';
		position: absolute;
		left: calc(-1 * var(--space-lg) - 22px);
		top: calc(var(--space-lg) + 2px);
		width: 10px;
		height: 10px;
		background: var(--color-bg-dark);
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.4);
		z-index: 1;
		/* La transizione rende il cambio colore fluido anche se il trigger
		   non è perfettamente sincronizzato con la barra di progresso */
		transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
	}

	/* Pallino illuminato: aggiunto da JS via classList.add('dot-active').
	   :global(.dot-active) serve perché Svelte non vede le classi aggiunte
	   dinamicamente con JS — senza :global verrebbe rimossa come "inutilizzata". */
	.timeline-item:global(.dot-active)::before {
		background: var(--color-blue-ice);
		border-color: var(--color-blue-ice);
		box-shadow: 0 0 14px rgba(91, 192, 248, 0.6);
	}

	/* Highlight (apertura/chiusura): pallino più grande per enfatizzare */
	.timeline-item--highlight::before {
		width: 14px;
		height: 14px;
		left: calc(-1 * var(--space-lg) - 24px);
		top: calc(var(--space-lg) + 0px);
	}

	.item-meta {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		padding-top: 3px;
	}

	.item-giorno {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-blue-ice);
	}

	.item-data {
		font-size: 0.85rem;
		color: var(--color-gray-400);
	}

	.item-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.item-titolo {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2vw, 1.8rem);
		color: var(--color-white);
		letter-spacing: -0.02em;
	}

	.timeline-item--highlight .item-titolo {
		color: var(--color-blue-ice);
	}

	.item-luogo {
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		color: var(--color-gray-400);
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.pin {
		color: var(--color-red);
		font-size: 0.7rem;
	}

	.item-desc {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.6;
		max-width: 560px;
	}

	@media (max-width: 640px) {
		.timeline-layout {
			grid-template-columns: 20px 1fr;
			gap: 0 var(--space-md);
		}
		.timeline-item {
			grid-template-columns: 1fr;
			gap: var(--space-xs);
		}
		.item-meta {
			flex-direction: row;
			align-items: center;
			gap: var(--space-sm);
		}
	}
</style>
