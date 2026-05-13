<!--
  +page.svelte — Pagina principale
  Milano Cortina 2026: Showcase didattico GSAP + Svelte 5 + Threlte

  Mappa dei pattern GSAP per componente:
  ┌─────────────────────┬────────────────────────────────────────────┐
  │ Componente          │ Pattern GSAP                               │
  ├─────────────────────┼────────────────────────────────────────────┤
  │ Hero                │ gsap.timeline() + split manuale del testo  │
  │ Navbar              │ gsap.to() + scroll listener                │
  │ Countdown           │ $state/$effect (niente GSAP — CSS puro)    │
  │ StatsCounter        │ counter con onUpdate + ScrollTrigger        │
  │ ThreeDScene/Mascot  │ ScrollTrigger scrub + useFrame (Threlte)   │
  │ MarqueeText         │ repeat: -1 + ease: 'none' (loop infinito)  │
  │ DisciplineCards     │ gsap.quickTo() magnetic + stagger reveal   │
  │ Timeline            │ ScrollTrigger stagger sequenziale          │
  │ SplitTextReveal     │ gsap.from() + ScrollTrigger (riusabile)    │
  │ Footer              │ SplitTextReveal + scroll reveal            │
  └─────────────────────┴────────────────────────────────────────────┘
-->

<script>
	import Navbar           from '$lib/components/Navbar.svelte';
	import Hero             from '$lib/components/Hero.svelte';
	import Countdown        from '$lib/components/Countdown.svelte';
	import StatsCounter     from '$lib/components/StatsCounter.svelte';
	import ThreeDScene      from '$lib/components/ThreeDScene.svelte';
	import MarqueeText      from '$lib/components/MarqueeText.svelte';
	import DisciplineCards  from '$lib/components/DisciplineCards.svelte';
	import Timeline         from '$lib/components/Timeline.svelte';
	import ParallaxImage    from '$lib/components/ParallaxImage.svelte';
	import Footer           from '$lib/components/Footer.svelte';

	// Importiamo gsap-utils per assicurarci che ScrollTrigger sia registrato
	// prima che qualsiasi componente figlio lo usi. Questo è importante perché
	// i componenti figli importano da gsap-utils ma l'ordine di inizializzazione
	// in SvelteKit potrebbe variare.
	import '$lib/animations/gsap-utils.js';
</script>

<svelte:head>
	<title>Milano Cortina 2026 — GSAP Showcase</title>
</svelte:head>

<!-- Navbar fissa: sta fuori dal flusso per posizionarsi sopra tutto -->
<Navbar />

<main>
	<!-- 1. HERO — La prima cosa che l'utente vede. Timeline GSAP complessa. -->
	<Hero />

	<!-- 2. COUNTDOWN — Timer reattivo con runes Svelte 5 -->
	<Countdown />

	<!-- 3. STATS — Counter animati da 0 a N con ScrollTrigger -->
	<StatsCounter />

	<!-- 4. 3D SCENE — La sezione più complessa: Threlte + ScrollTrigger scrub -->
	<ThreeDScene />

	<!-- 5. MARQUEE — Loop infinito di discipline olimpiche -->
	<MarqueeText />

	<!-- 6. PARALLAX — Immagine decorativa con parallax scrolling -->
	<ParallaxImage
		alt="Panorama alpino delle sedi olimpiche"
		aspect="40vh"
	/>

	<!-- 7. DISCIPLINE CARDS — Griglia con effetto magnetico quickTo -->
	<DisciplineCards />

	<!-- 8. TIMELINE — Sequenza degli eventi con stagger -->
	<Timeline />

	<!-- 9. FOOTER — SplitTextReveal + links -->
	<Footer />
</main>

<style>
	main {
		/* Assicura che la pagina inizi sotto la navbar fissa (altezza ~60px) */
		padding-top: 0;
	}
</style>
