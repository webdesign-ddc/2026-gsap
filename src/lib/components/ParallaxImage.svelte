<!--
  ParallaxImage.svelte
  Pattern GSAP: ScrollTrigger con scrub per effetto parallax multi-layer.

  La sezione dimostra il parallax con DUE livelli che scorrono a velocità diverse:
  - Sfondo (.parallax-bg): si sposta di ±20% — il layer più lento
  - Testo (.parallax-text): si sposta di ±8% in direzione opposta — più rapido e contrario

  Il contrasto visivo tra i due layer rende il depth effect immediatamente percepibile,
  anche senza un'immagine fotografica reale.

  Tecnica: il wrapper ha overflow:hidden e altezza fissa. I layer interni sono più alti
  del wrapper (height: 140%) con posizione assoluta — questo crea il margine di movimento.

  Per riutilizzare:
  1. Crea un wrapper con overflow:hidden e altezza fissa
  2. Un layer di sfondo: position:absolute, height:140%, top:-20%
  3. Anima con ScrollTrigger scrub da yPercent:-20 a yPercent:20
  4. ease:'none' è obbligatorio per scrub lineare
-->

<script>
	import { gsap, ScrollTrigger } from '$lib/animations/gsap-utils.js';

	let { src = '', alt = '', aspect = '50vh' } = $props();

	let wrapper = $state();
	let bgLayer = $state();   // layer di sfondo — si muove lentamente
	let textLayer = $state(); // layer testo — si muove in direzione opposta

	$effect(() => {
		if (!wrapper || !bgLayer) return;

		const ctx = gsap.context(() => {

			// Layer 1 (sfondo): parallax lento, si sposta verso il basso mentre si scende
			gsap.fromTo(bgLayer,
				{ yPercent: -20 },
				{
					yPercent: 20,
					ease: 'none',
					scrollTrigger: {
						trigger: wrapper,
						start: 'top bottom',
						end: 'bottom top',
						scrub: 1
					}
				}
			);

			// Layer 2 (testo): parallax in direzione opposta per creare profondità percepibile.
			// La direzione invertita esagera il senso di depth — tecnica usata spesso
			// per il testo "galleggiante" su sfondi in movimento.
			if (textLayer) {
				gsap.fromTo(textLayer,
					{ yPercent: 8 },
					{
						yPercent: -8,
						ease: 'none',
						scrollTrigger: {
							trigger: wrapper,
							start: 'top bottom',
							end: 'bottom top',
							scrub: 1
						}
					}
				);
			}

		}, wrapper);

		return () => ctx.revert();
	});
</script>

<div
	class="parallax-wrapper"
	style="height: {aspect};"
	bind:this={wrapper}
>

	<!-- Layer di sfondo: immagine reale o visual generativo -->
	{#if src}
		<img
			{src}
			{alt}
			class="parallax-bg parallax-bg--img"
			bind:this={bgLayer}
		/>
	{:else}
		<!-- Placeholder: pattern geometrico + gradiente che si muove visibilmente -->
		<div class="parallax-bg" bind:this={bgLayer}>
			<div class="bg-stripe-pattern"></div>
		</div>
	{/if}

	<!-- Layer testo: si muove in direzione opposta per mostrare il depth effect -->
	<div class="parallax-text-layer" bind:this={textLayer}>
		<blockquote class="parallax-quote">
			<span class="quote-mark">"</span>
			<span class="quote-body">Lo sport non conosce confini —<br />solo traguardi.</span>
			<cite class="quote-source">Milano · Cortina 2026</cite>
		</blockquote>
	</div>

	<!-- Overlay scuro per leggibilità del testo -->
	<div class="parallax-overlay"></div>

</div>

<style>
	.parallax-wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;
		/* Separa visivamente le sezioni adiacenti */
		border-top: 1px solid rgba(255, 255, 255, 0.05);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	/* Il layer di sfondo è più alto del wrapper per avere margine di movimento.
	   top:-20% compensa l'altezza extra centrando il contenuto. */
	.parallax-bg {
		position: absolute;
		top: -20%;
		left: 0;
		width: 100%;
		height: 140%;
		will-change: transform;
		background:
			linear-gradient(135deg, #0d1a2e 0%, #0a0a12 45%, #1a0d10 100%);
	}

	/* Pattern di strisce diagonali — si muovono con lo sfondo, rendendo evidente il parallax */
	.bg-stripe-pattern {
		position: absolute;
		inset: 0;
		background-image:
			repeating-linear-gradient(
				-55deg,
				transparent 0px,
				transparent 40px,
				rgba(91, 192, 248, 0.04) 40px,
				rgba(91, 192, 248, 0.04) 41px
			),
			repeating-linear-gradient(
				35deg,
				transparent 0px,
				transparent 80px,
				rgba(230, 57, 70, 0.03) 80px,
				rgba(230, 57, 70, 0.03) 81px
			);
		/* Raddoppia il pattern per renderlo più visibile durante il parallax */
		background-size: 200% 200%;
	}

	.parallax-bg--img {
		object-fit: cover;
	}

	/* Overlay semitrasparente per la leggibilità della citazione */
	.parallax-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to right,
			rgba(10, 10, 10, 0.7) 0%,
			rgba(10, 10, 10, 0.3) 60%,
			transparent 100%
		);
		pointer-events: none;
	}

	/* Il layer testo si muove in direzione opposta allo sfondo — questo crea
	   la percezione di "profondità" visibile anche senza immagine fotografica */
	.parallax-text-layer {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		padding: 0 var(--container-pad);
		max-width: var(--container-max);
		margin: 0 auto;
		will-change: transform;
		pointer-events: none;
	}

	.parallax-quote {
		max-width: 600px;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.quote-mark {
		font-family: var(--font-display);
		font-size: clamp(4rem, 8vw, 8rem);
		line-height: 0.8;
		color: var(--color-blue-ice);
		opacity: 0.4;
		display: block;
	}

	.quote-body {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3.5vw, 3rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--color-white);
		display: block;
	}

	.quote-source {
		font-family: var(--font-ui);
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-blue-ice);
		font-style: normal;
	}
</style>
