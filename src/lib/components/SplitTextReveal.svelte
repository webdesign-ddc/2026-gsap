<!--
  SplitTextReveal.svelte
  Componente riusabile per il reveal di testo con split manuale.

  Pattern GSAP: gsap.from() con ScrollTrigger — reveal on scroll.

  Questo è il componente più "libreria" del progetto: accetta una stringa come prop
  e la anima automaticamente all'entrata della viewport. Può essere usato
  ovunque nella pagina per ottenere il reveal coerente.

  Split per PAROLE (non lettere): più adatto per testi lunghi, evita overhead
  di centinaia di span per frase. Per titoli brevi, usa la split per lettere
  come in Hero.svelte.

  Per riutilizzare:
  1. Importa <SplitTextReveal testo="Il tuo testo qui" />
  2. Passagli `grande={true}` per la variante titolo
  3. Passa `delay={0.2}` per ritardare l'entrata
  4. Opzionale: passa `startTrigger` per personalizzare il punto di start di ScrollTrigger

  Props:
  - testo: string — il testo da animare
  - grande: boolean — stile titolo vs. body
  - delay: number — delay dell'animazione (default 0)
-->

<script>
	import { gsap, ScrollTrigger } from '$lib/animations/gsap-utils.js';

	// $props() è la sintassi Svelte 5 per le props del componente
	let { testo = '', grande = false, delay = 0 } = $props();

	let container;

	$effect(() => {
		if (!container || !testo) return;

		// Split per parole: ogni parola diventa uno span
		// Più efficiente della split per lettere su testi lunghi
		const parole = testo.split(' ');
		container.textContent = '';
		container.setAttribute('aria-label', testo); // accessibilità

		const spans = parole.map((parola, i) => {
			const wrapper = document.createElement('span');
			wrapper.className = 'word-wrapper';

			const span = document.createElement('span');
			span.className = 'word';
			span.textContent = parola;

			wrapper.appendChild(span);
			container.appendChild(wrapper);

			// Lo spazio va FUORI dal wrapper, non dentro.
			// Il wrapper ha overflow:hidden — uno spazio al suo interno verrebbe clippato.
			// Come nodo di testo tra i wrapper, viene renderizzato normalmente tra elementi inline.
			if (i < parole.length - 1) {
				container.appendChild(document.createTextNode(' '));
			}

			return span;
		});

		// Pattern: gsap.from() con ScrollTrigger — reveal on scroll
		// È il pattern di animazione più comune nel web design moderno
		const ctx = gsap.context(() => {
			gsap.from(spans, {
				scrollTrigger: {
					trigger: container,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				},
				yPercent: 110,      // parte da sotto l'overflow del .word-wrapper
				opacity: 0,
				duration: 0.8,
				delay,
				stagger: 0.04,
				ease: 'power4.out'
			});
		}, container);

		return () => ctx.revert();
	});
</script>

<!-- Il contenitore deve avere overflow: hidden per nascondere le parole pre-animazione -->
<span
	class="split-reveal"
	class:split-reveal--grande={grande}
	bind:this={container}
>
	{testo}
</span>

<style>
	.split-reveal {
		display: block;
		font-family: var(--font-ui);
		font-size: clamp(1rem, 1.5vw, 1.2rem);
		color: inherit;
		line-height: 1.6;
	}

	.split-reveal--grande {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 4rem);
		line-height: 0.95;
		letter-spacing: -0.02em;
	}

	/* word-wrapper è il "contenitore" di ogni parola con overflow hidden.
	   Questo è il trucco: la parola (.word) anima da yPercent: 110
	   ma rimane invisibile fuori dal wrapper → effetto "sale da sotto". */
	:global(.split-reveal .word-wrapper) {
		display: inline-block;
		overflow: hidden;
		vertical-align: bottom;
	}

	:global(.split-reveal .word) {
		display: inline-block;
	}
</style>
