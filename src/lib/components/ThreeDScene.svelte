<!--
  ThreeDScene.svelte
  Pattern GSAP: ScrollTrigger con scrub:true + CSS sticky.

  Layout a due fasi sincronizzato con il movimento del modello 3D:
  - Fase 1: modello TOP-RIGHT  → testo a SINISTRA  (.text-block--left)
  - Fase 2: modello BOTTOM-LEFT → testo a DESTRA   (.text-block--right)

  I testi stanno sempre sul lato opposto al cristallo, lasciandogli spazio.

  Il movimento del canvas è puro CSS transform (x/y) — non è la camera 3D che si muove,
  ma il <div> che contiene il canvas riposizionato nella pagina 2D via GSAP scrub.

  Per riutilizzare:
  - Crea una sezione con height: NxVH e un figlio position:sticky
  - Usa ScrollTrigger con scrub su un timeline per animare elementi dentro il sticky
-->

<script>
	import { Canvas } from '@threlte/core';
	import Mascot from './Mascot.svelte';
	import { gsap, ScrollTrigger } from '$lib/animations/gsap-utils.js';

	let section;       // il wrapper esterno (300vh)
	let stickyEl;      // il contenitore sticky (100vh)
	let canvasWrapper; // il div del canvas Threlte che si muove
	let textBlock1;    // blocco sinistra — visibile con modello a destra
	let textBlock2;    // blocco destra  — visibile con modello a sinistra

	$effect(() => {
		const ctx = gsap.context(() => {

			// PATTERN PRINCIPALE: ScrollTrigger + scrub + timeline
			// scrub: 1.5 → smoothing di 1.5s (più alto = più inertia)
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					start: 'top top',
					end:   'bottom bottom',
					scrub: 1.5,
					// markers: true,  // ← decommenta per debug
				}
			});

			// Canvas: da top-right (posizione CSS) verso bottom-left
			tl.fromTo(canvasWrapper,
				{ x: 0,       y: 0 },
				{ x: '-50vw', y: '35vh', ease: 'none', duration: 2 }
			);

			// TextBlock1 (sinistra): esce nella prima metà
			tl.fromTo(textBlock1,
				{ opacity: 1, y: 0 },
				{ opacity: 0, y: -40, ease: 'none', duration: 1 },
				0
			);

			// TextBlock2 (destra): entra nella seconda metà
			tl.fromTo(textBlock2,
				{ opacity: 0, y: 40 },
				{ opacity: 1, y: 0, ease: 'none', duration: 1 },
				1
			);

		}, section);

		return () => ctx.revert();
	});
</script>

<section class="scene-section" bind:this={section}>

	<div class="scene-sticky" bind:this={stickyEl}>

		<!-- Testo fase 1: a sinistra, mentre il modello è in alto a destra -->
		<div class="text-block text-block--left" bind:this={textBlock1}>
			<p class="section-label">
				<span class="deco-line"></span>
				Il simbolo dei giochi
			</p>
			<h2 class="scene-heading">Il Cristallo<br />Olimpico</h2>
			<p class="scene-body">
				Milano Cortina 2026 ha scelto il cristallo come simbolo della sua identità.
				La sua struttura geometrica perfetta richiama le montagne alpine,
				mentre la sua trasparenza evoca la purezza del ghiaccio e della neve.
			</p>
			<p class="scene-body">
				Ogni sfaccettatura riflette la diversità degli atleti — provenienti da
				<strong>90 nazioni</strong> — che si incontrano nelle Alpi italiane per competere
				alla ricerca dell'eccellenza olimpica.
			</p>
		</div>

		<!-- Testo fase 2: a destra, mentre il modello è in basso a sinistra.
		     opacity:0 inline perché GSAP parte da questo valore nel fromTo. -->
		<div class="text-block text-block--right" bind:this={textBlock2} style="opacity:0;">
			<p class="section-label section-label--right">
				La mascotte
				<span class="deco-line"></span>
			</p>
			<h2 class="scene-heading">Tina<br />e Milo</h2>
			<p class="scene-body">
				Tina e Milo, le due martore delle Alpi italiane, sono le mascotte ufficiali
				dei Giochi. Rappresentano la vivacità, la tenacia e lo spirito di squadra
				che caratterizzano lo sport olimpico.
			</p>
			<p class="scene-body">
				Nate dal disegno del designer Lazzeroni, incarnano il legame profondo tra
				gli italiani e il territorio montano — un legame che ha radici millenarie.
			</p>
		</div>

		<!-- Canvas 3D: parte in alto a destra, GSAP lo sposta in basso a sinistra -->
		<div class="canvas-wrapper" bind:this={canvasWrapper}>
			<Canvas>
				<Mascot />
			</Canvas>
		</div>

	</div>
</section>

<style>
	.scene-section {
		height: 300vh;
		position: relative;
		background: var(--color-bg-dark);
	}

	.scene-sticky {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
	}

	/* Base comune a entrambi i blocchi testo */
	.text-block {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		max-width: 480px;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		z-index: 2;
	}

	/* Fase 1: testo a sinistra — il modello è a destra */
	.text-block--left {
		left: var(--container-pad);
	}

	/* Fase 2: testo a destra — il modello è arrivato a sinistra.
	   text-align: right crea l'asimmetria editoriale e "punta" verso il modello. */
	.text-block--right {
		right: var(--container-pad);
		text-align: right;
	}

	/* Label con deco-line a destra: inverto l'ordine con row-reverse */
	.section-label--right {
		justify-content: flex-end;
	}

	.scene-heading {
		font-size: clamp(2.5rem, 5vw, 5rem);
		color: var(--color-white);
		line-height: 0.95;
	}

	.scene-body {
		font-size: clamp(0.9rem, 1.2vw, 1.05rem);
		color: rgba(255, 255, 255, 0.65);
		line-height: 1.8;
	}

	.scene-body strong {
		color: var(--color-blue-ice);
		font-weight: 600;
	}

	/* Canvas: parte top-right, GSAP applica transform per spostarlo */
	.canvas-wrapper {
		position: absolute;
		top: 5vh;
		right: 3vw;
		width: 44vw;
		height: 60vh;
		will-change: transform;
	}

	.canvas-wrapper :global(canvas) {
		width: 100% !important;
		height: 100% !important;
	}

	@media (max-width: 900px) {
		.text-block--left,
		.text-block--right {
			position: relative;
			top: auto;
			transform: none;
			right: auto;
			left: auto;
			text-align: left;
			max-width: 100%;
			padding: var(--space-md) var(--container-pad);
		}
		.scene-sticky {
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: var(--space-md);
		}
		.canvas-wrapper {
			position: relative;
			top: auto;
			right: auto;
			width: 90vw;
			height: 50vw;
			margin: 0 auto;
		}
	}
</style>
