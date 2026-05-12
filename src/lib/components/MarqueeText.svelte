<!--
  MarqueeText.svelte
  Pattern GSAP: loop infinito con repeat: -1 + ease: 'none'.

  Questo componente mostra la tecnica per creare un testo scorrevole senza
  interruzioni visibili (seamless). Il trucco è duplicare il contenuto e
  spostare il contenitore di esattamente il 50% della sua larghezza.

  Perché il 50%? Perché il contenuto è duplicato, quindi il "giro completo"
  corrisponde alla metà della larghezza totale del track. Quando l'animazione
  riparte da capo, la posizione visiva è identica → seamless loop.

  ease: 'none' è fondamentale — qualsiasi ease creerebbe accelerazioni
  percettibili al punto di loop.

  Per riutilizzare:
  1. Crea un .track con i tuoi elementi ripetuti 2 volte
  2. Usa gsap.to('.track', { xPercent: -50, repeat: -1, duration: N, ease: 'none' })
  3. Più è lunga la stringa, più alto dovrebbe essere il duration
-->

<script>
	import { gsap } from '$lib/animations/gsap-utils.js';

	// Le discipline olimpiche invernali di Milano Cortina 2026
	const discipline = [
		'Sci Alpino', 'Snowboard', 'Biathlon', 'Bob',
		'Curling', 'Hockey su Ghiaccio', 'Pattinaggio Artistico',
		'Pattinaggio di Velocità', 'Short Track', 'Skeleton',
		'Slittino', 'Salto con gli Sci', 'Combinata Nordica',
		'Sci di Fondo', 'Freestyle', 'Sci Alpinismo'
	];

	// Separiamo con un simbolo decorativo per il look editoriale
	const separator = ' · ';
	const testo = discipline.join(separator) + separator;

	let track;
	let wrapper;

	$effect(() => {
		const ctx = gsap.context(() => {

			// PATTERN PRINCIPALE: loop infinito.
			// xPercent: -50 → sposta il track del 50% della sua larghezza totale.
			// Funziona perché il track contiene il testo DUE volte:
			//   [TESTO ORIGINALE][TESTO DUPLICATO]
			// Quando il primo testo esce a sinistra, il duplicato lo sostituisce visivamente.
			gsap.to(track, {
				xPercent: -50,
				repeat: -1,        // -1 = infinito
				duration: 35,      // più lento = più elegante
				ease: 'none',      // FONDAMENTALE: velocità costante, nessuna ease
			});

		}, wrapper);

		return () => ctx.revert();
	});
</script>

<div class="marquee-wrapper" bind:this={wrapper}>
	<!-- Il track contiene il testo due volte per il seamless loop -->
	<div class="marquee-track" bind:this={track}>
		<!-- Prima copia -->
		<span class="marquee-text">{testo}</span>
		<!-- Seconda copia identica — necessaria per il seamless loop -->
		<span class="marquee-text" aria-hidden="true">{testo}</span>
	</div>
</div>

<style>
	.marquee-wrapper {
		padding: var(--space-lg) 0;
		background: var(--color-blue-ice);
		overflow: hidden;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	/* Il track è largo il doppio del necessario (contiene 2x il testo) */
	.marquee-track {
		display: flex;
		white-space: nowrap;
		/* width: max-content assicura che non vada a capo */
		width: max-content;
	}

	.marquee-text {
		font-family: var(--font-display);
		font-size: clamp(1rem, 2.5vw, 1.8rem);
		color: var(--color-bg-dark);
		letter-spacing: -0.01em;
		/* padding-right per lo spazio prima del loop */
		padding-right: 2rem;
	}
</style>
