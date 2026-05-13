<!--
  Hero.svelte
  Pattern GSAP: gsap.timeline() con sequenza complessa + split manuale del testo.

  Questo è il componente più ricco di animazioni. Mostra come:
  1. Dividere una stringa in caratteri singoli via JS (senza plugin SplitText a pagamento)
  2. Orchestrare più animazioni in sequenza con gsap.timeline()
  3. Usare gsap.context() per scopare le animazioni al componente (best practice Svelte)

  Split del testo manuale: ogni lettera diventa un <span class="char">.
  Il contenitore padre ha overflow: hidden → le lettere "entrano da sotto" invisibilmente.

  Per riutilizzare:
  - Copia la funzione splitInChars()
  - Usa .chars { display: inline-block } per permettere la trasformazione Y
  - Anima con gsap.from(spans, { yPercent: 110, stagger: 0.03 })
-->

<script>
	import { gsap } from '$lib/animations/gsap-utils.js';

	let section;
	let titleLine1;   // "MILANO ·"
	let titleLine1b;  // "CORTINA"
	let titleLine2;   // "2026"
	let subtitle;
	let scrollIndicator;
	let blob;

	/**
	 * Divide una stringa in <span> per ogni carattere (spazi inclusi).
	 * Restituisce l'array di elementi span per l'animazione GSAP.
	 *
	 * Perché non usare SplitText? È un plugin a pagamento ($150/anno).
	 * Questo approccio manuale copre il 90% dei casi d'uso didattico.
	 */
	function splitInChars(el) {
		const testo = el.textContent;
		el.textContent = '';
		el.setAttribute('aria-label', testo); // accessibilità: lettori schermo leggono il testo originale

		return testo.split('').map((char) => {
			const span = document.createElement('span');
			span.className = 'char';
			// Lo spazio non trasla, ma serve come separatore visivo
			span.textContent = char === ' ' ? ' ' : char; //   = non-breaking space
			el.appendChild(span);
			return span;
		});
	}

	$effect(() => {
		// gsap.context() scopa tutte le animazioni all'elemento `section`.
		// Quando il componente viene smontato, ctx.revert() annulla tutto automaticamente.
		// Questo previene memory leak e animazioni orfane — FONDAMENTALE in SvelteKit.
		const ctx = gsap.context(() => {

			// Split del testo nelle tre righe del titolo
			const chars1  = splitInChars(titleLine1);
			const chars1b = splitInChars(titleLine1b);
			const chars2  = splitInChars(titleLine2);

			// PATTERN PRINCIPALE: gsap.timeline() per orchestrare la sequenza
			// Il timeline esegue le animazioni in ordine, con overlap tramite "<" e offset numerici.
			const tl = gsap.timeline({ delay: 0.2 });

			// Step 1a: "MILANO ·" entra dal basso, lettera per lettera
			tl.from(chars1, {
				yPercent: 110,
				opacity: 0,
				duration: 0.8,
				stagger: 0.025,
				ease: 'power4.out'
			});

			// Step 1b: "CORTINA" parte leggermente sovrapposta, stessa estetica
			tl.from(chars1b, {
				yPercent: 110,
				opacity: 0,
				duration: 0.8,
				stagger: 0.025,
				ease: 'power4.out'
			}, '<-0.3');

			// Step 2: "2026" — lettere più rade, stagger più largo
			tl.from(chars2, {
				yPercent: 110,
				opacity: 0,
				duration: 1,
				stagger: 0.06,
				ease: 'power4.out'
			}, '<-0.3');

			// Step 3: il sottotitolo fa un semplice fade + salita
			tl.from(subtitle, {
				y: 30,
				opacity: 0,
				duration: 0.8,
				ease: 'power3.out'
			}, '-=0.4');

			// Step 4: l'indicatore di scroll compare per ultimo
			tl.from(scrollIndicator, {
				y: 20,
				opacity: 0,
				duration: 0.6,
				ease: 'power2.out'
			}, '-=0.4');

			// Step 5: il blob di sfondo si rivela con un fade lento
			tl.from(blob, {
				opacity: 0,
				scale: 0.8,
				duration: 2,
				ease: 'power2.out'
			}, 0); // "0" = inizia all'inizio del timeline (parallelo agli altri)

		}, section);

		return () => {
			// Cleanup: annulla tutte le animazioni del context quando il componente viene smontato
			ctx.revert();
		};
	});
</script>

<section class="hero" bind:this={section}>

	<!-- Background blob animato in CSS — non GSAP, per non sovraccaricare -->
	<div class="hero-blob" bind:this={blob}></div>
	<div class="hero-grid-overlay"></div>

	<div class="hero-content container">
		<!-- Label sezione -->
		<p class="section-label hero-label">Olimpiadi Invernali</p>

		<!-- Titolo spezzato in due righe per il split diversificato -->
		<!-- overflow: hidden nasconde le lettere che animano da yPercent: 110 -->
		<h1 class="hero-title">
			<span class="title-line" bind:this={titleLine1}>MILANO ·</span>
			<span class="title-line" bind:this={titleLine1b}>CORTINA</span>
			<span class="title-line title-year" bind:this={titleLine2}>2026</span>
		</h1>

		<!-- Sottotitolo -->
		<p class="hero-subtitle" bind:this={subtitle}>
			6 – 22 febbraio 2026<br />
			<span class="subtitle-desc">Olimpiadi e Paralimpiadi Invernali</span>
		</p>
	</div>

	<!-- Indicatore scroll in basso -->
	<div class="scroll-indicator" bind:this={scrollIndicator}>
		<span class="scroll-line"></span>
		<span class="scroll-text section-label">Scorri</span>
	</div>

</section>

<style>
	.hero {
		position: relative;
		height: 100vh;
		min-height: 600px;
		display: flex;
		align-items: center;
		overflow: hidden;
		background: var(--color-bg-dark);
	}

	/* Blob di sfondo: gradiente radiale animato con CSS puro.
	   Non è GSAP intenzionalmente — mostra agli studenti che non tutto
	   deve essere animato con JavaScript. */
	.hero-blob {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 80% 60% at 70% 40%, rgba(91, 192, 248, 0.08) 0%, transparent 60%),
			radial-gradient(ellipse 50% 40% at 20% 70%, rgba(230, 57, 70, 0.05) 0%, transparent 50%);
		animation: blob-drift 12s ease-in-out infinite alternate;
		pointer-events: none;
	}

	@keyframes blob-drift {
		0%   { transform: scale(1) translate(0, 0); }
		50%  { transform: scale(1.05) translate(2%, -3%); }
		100% { transform: scale(0.98) translate(-1%, 2%); }
	}

	/* Griglia decorativa leggera in background */
	.hero-grid-overlay {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
		background-size: 80px 80px;
		pointer-events: none;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		width: 100%;
	}

	.hero-label {
		margin-bottom: var(--space-md);
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.hero-label::before {
		content: '';
		display: inline-block;
		width: 32px;
		height: 1px;
		background: var(--color-blue-ice);
	}

	.hero-title {
		display: flex;
		flex-direction: column;
		gap: 0.1em;
		margin-bottom: var(--space-md);
	}

	/* overflow: hidden è cruciale per il trucco del "reveal da sotto" */
	.title-line {
		display: block;
		overflow: hidden;
		font-family: var(--font-display);
		/* clamp: scala tra 3rem (mobile) e 10rem (desktop wide) */
		font-size: clamp(3rem, 10vw, 10rem);
		line-height: 0.9;
		letter-spacing: -0.03em;
		color: var(--color-white);
	}

	.title-year {
		font-size: clamp(5rem, 18vw, 18rem);
		line-height: 0.85;
		/* Il colore è trasparente ma con stroke per un effetto outline */
		color: transparent;
		-webkit-text-stroke: 1px rgba(255, 255, 255, 0.25);
	}

	/* I char singoli DEVONO essere inline-block per accettare transform Y */
	:global(.hero .char) {
		display: inline-block;
	}

	.hero-subtitle {
		font-size: clamp(1rem, 1.5vw, 1.25rem);
		color: rgba(255, 255, 255, 0.7);
		max-width: 400px;
		line-height: 1.6;
	}

	.subtitle-desc {
		font-size: 0.85em;
		color: rgba(255, 255, 255, 0.45);
		letter-spacing: 0.05em;
	}

	.scroll-indicator {
		position: absolute;
		bottom: var(--space-lg);
		left: var(--container-pad);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
	}

	.scroll-line {
		width: 1px;
		height: 60px;
		background: linear-gradient(to bottom, rgba(91, 192, 248, 0.8), transparent);
		animation: scroll-pulse 2s ease-in-out infinite;
	}

	@keyframes scroll-pulse {
		0%, 100% { opacity: 0.4; transform: scaleY(1); }
		50%       { opacity: 1;   transform: scaleY(1.1); }
	}

	.scroll-text {
		writing-mode: vertical-rl;
		letter-spacing: 0.2em;
	}
</style>
