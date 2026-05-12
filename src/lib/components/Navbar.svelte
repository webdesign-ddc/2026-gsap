<!--
  Navbar.svelte
  Pattern GSAP: gsap.to() triggerato da un event listener sullo scroll.

  Questo componente mostra come reagire allo scroll SENZA ScrollTrigger,
  usando un semplice event listener e gsap.to() per transizioni fluide.
  È l'alternativa leggera a ScrollTrigger quando serve solo una soglia.

  Per riutilizzare:
  1. Copia il pattern $effect con window.addEventListener('scroll', ...)
  2. Adatta i valori di gsap.to() alle tue proprietà CSS
  3. Ricorda sempre di rimuovere il listener nel return del $effect (cleanup)
-->

<script>
	import { gsap } from '$lib/animations/gsap-utils.js';
	import { onMount } from 'svelte';

	let navbar;
	let isScrolled = $state(false);

	$effect(() => {
		// Animazione di entrata della navbar al mount della pagina
		// La navbar scende dall'alto con un leggero delay rispetto all'hero
		gsap.from(navbar, {
			y: -80,
			opacity: 0,
			duration: 1,
			delay: 0.5,
			ease: 'power3.out'
		});

		// Pattern: gsap.to() triggerato da scroll listener.
		// Usiamo passive: true per performance ottimale (non blocchiamo lo scroll).
		function onScroll() {
			const soglia = 80; // px da cui scatta la transizione

			if (window.scrollY > soglia && !isScrolled) {
				isScrolled = true;

				// Anima le proprietà numeriche con GSAP
				gsap.to(navbar, {
					backgroundColor: 'rgba(10, 10, 10, 0.92)',
					borderBottomColor: 'rgba(91, 192, 248, 0.15)',
					paddingTop: '12px',
					paddingBottom: '12px',
					duration: 0.4,
					ease: 'power2.inOut'
				});

			} else if (window.scrollY <= soglia && isScrolled) {
				isScrolled = false;

				// Ritorna allo stato trasparente
				gsap.to(navbar, {
					backgroundColor: 'rgba(10, 10, 10, 0)',
					borderBottomColor: 'rgba(91, 192, 248, 0)',
					paddingTop: '20px',
					paddingBottom: '20px',
					duration: 0.4,
					ease: 'power2.inOut'
				});
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true });

		// Cleanup fondamentale: se non rimuoviamo il listener, rimane attivo
		// anche dopo che il componente viene smontato → memory leak!
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<nav class="navbar" bind:this={navbar}>
	<div class="container nav-inner">
		<a href="/" class="nav-logo">
			<span class="logo-mc">MC</span>
			<span class="logo-year">2026</span>
		</a>

		<ul class="nav-links">
			<li><a href="#countdown">Countdown</a></li>
			<li><a href="#numeri">I Numeri</a></li>
			<li><a href="#discipline">Discipline</a></li>
			<li><a href="#timeline">Timeline</a></li>
		</ul>

		<a href="#discipline" class="nav-cta">
			Scopri i Giochi
		</a>
	</div>
</nav>

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 20px 0;
		background-color: rgba(10, 10, 10, 0);
		border-bottom: 1px solid rgba(91, 192, 248, 0);
		/* backdrop-filter gestito da CSS perché GSAP non può animare filtri blur */
		backdrop-filter: blur(0px);
		transition: backdrop-filter 0.4s ease;
	}

	/* Quando JS aggiunge la classe .scrolled, il blur CSS scatta */
	:global(.navbar.scrolled) {
		backdrop-filter: blur(20px);
	}

	.nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
	}

	.nav-logo {
		display: flex;
		align-items: baseline;
		gap: 6px;
		text-decoration: none;
	}

	.logo-mc {
		font-family: var(--font-display);
		font-size: 1.5rem;
		color: var(--color-white);
		letter-spacing: -0.05em;
	}

	.logo-year {
		font-family: var(--font-ui);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-blue-ice);
		letter-spacing: 0.1em;
	}

	.nav-links {
		display: flex;
		list-style: none;
		gap: var(--space-md);
	}

	.nav-links a {
		font-family: var(--font-ui);
		font-size: 0.85rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.6);
		text-decoration: none;
		letter-spacing: 0.05em;
		transition: color 0.2s ease;
	}

	.nav-links a:hover {
		color: var(--color-white);
	}

	.nav-cta {
		font-family: var(--font-ui);
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-bg-dark);
		background: var(--color-blue-ice);
		padding: 8px 20px;
		border-radius: 2px;
		text-decoration: none;
		transition: background 0.2s ease, transform 0.2s ease;
	}

	.nav-cta:hover {
		background: var(--color-white);
		transform: translateY(-1px);
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}
	}
</style>
