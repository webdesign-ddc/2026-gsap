<!--
  DisciplineCards.svelte
  Pattern GSAP: gsap.quickTo() per effetto magnetico + ScrollTrigger stagger reveal.

  Questo componente mostra DUE pattern:
  1. ScrollTrigger stagger: le card appaiono a cascata quando entrano nella viewport
  2. gsap.quickTo(): le card seguono il cursore con un effetto magnetico levigato

  gsap.quickTo() crea una funzione che anima rapidamente un valore target.
  È più performante di gsap.to() usato ripetutamente in un mousemove listener,
  perché riutilizza la stessa animazione invece di crearne una nuova ogni evento.

  Pattern quickTo:
    const xTo = gsap.quickTo(elemento, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(elemento, 'y', { duration: 0.4, ease: 'power3.out' })
    elemento.addEventListener('mousemove', (e) => { xTo(valore_x); yTo(valore_y) })

  Per riutilizzare:
  1. Crea le quickTo functions per x e y in $effect
  2. Nel mousemove, chiama xTo() e yTo() con l'offset dal centro della card
  3. Nel mouseleave, anima di ritorno a 0 con gsap.to()
-->

<script>
	import { gsap, ScrollTrigger } from '$lib/animations/gsap-utils.js';

	// Dati delle discipline — in un progetto reale potrebbero venire da un'API o da un CMS
	const discipline = [
		{
			nome: 'Sci Alpino',
			desc: 'Discesa, Slalom, SuperG, Combinata',
			colore: '#1a3a5c',
			icona: '⛷️',
			sedi: 'Bormio · Santa Caterina'
		},
		{
			nome: 'Snowboard',
			desc: 'Halfpipe, Slopestyle, Cross, PGS',
			colore: '#0d2d1a',
			icona: '🏂',
			sedi: 'Livigno'
		},
		{
			nome: 'Pattinaggio Artistico',
			desc: 'Singolo, Coppie, Danza su Ghiaccio',
			colore: '#2a1a4a',
			icona: '⛸️',
			sedi: 'Verona Arena'
		},
		{
			nome: 'Hockey su Ghiaccio',
			desc: 'Torneo Maschile e Femminile',
			colore: '#3a1a0d',
			icona: '🏒',
			sedi: 'Milano · Cortina'
		},
		{
			nome: 'Biathlon',
			desc: 'Sprint, Individuale, Staffetta',
			colore: '#1a2a0d',
			icona: '🎿',
			sedi: 'Anterselva'
		},
		{
			nome: 'Curling',
			desc: 'Doppio Misto, Maschile, Femminile',
			colore: '#1a1a3a',
			icona: '🥌',
			sedi: 'Torre Pellice'
		},
		{
			nome: 'Bob e Skeleton',
			desc: 'Bob a 2, Bob a 4, Skeleton',
			colore: '#2a1a1a',
			icona: '🛷',
			sedi: 'Cortina d\'Ampezzo'
		},
		{
			nome: 'Pattinaggio Velocità',
			desc: 'Tutte le distanze · Short Track',
			colore: '#0d1a2a',
			icona: '🏃',
			sedi: 'Baselga di Piné'
		}
	];

	let section;

	// quickTo functions per ogni card — create in $effect e mantenute per tutto il ciclo di vita
	let quickToFunctions = [];

	$effect(() => {
		const ctx = gsap.context(() => {

			// Pattern 1: ScrollTrigger stagger reveal
			// Le card appaiono a cascata con uno stagger di 0.08s tra l'una e l'altra
			gsap.from('.discipline-card', {
				scrollTrigger: {
					trigger: section,
					start: 'top 70%',
				},
				y: 60,
				opacity: 0,
				duration: 0.7,
				stagger: 0.08,
				ease: 'power3.out'
			});

			// Pattern 2: gsap.quickTo() per effetto magnetico su hover
			// Usiamo section.querySelectorAll (non document) per scopare al componente
			const cards = section.querySelectorAll('.discipline-card');

			cards.forEach((card) => {
				// quickTo crea una funzione che anima `x` o `y` rapidamente
				// duration e ease qui definiscono il "feeling" del magnete
				const xTo = gsap.quickTo(card, 'x', { duration: 0.5, ease: 'power3.out' });
				const yTo = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' });

				// Salviamo le funzioni per il cleanup
				quickToFunctions.push({ card, xTo, yTo });

				function onMouseMove(e) {
					// Calcoliamo l'offset del cursore dal centro della card
					// L'effetto è moltiplicato per 0.12 (12%) → movimento sottile, non esagerato
					const rect = card.getBoundingClientRect();
					const centerX = rect.left + rect.width / 2;
					const centerY = rect.top + rect.height / 2;
					const offsetX = (e.clientX - centerX) * 0.12;
					const offsetY = (e.clientY - centerY) * 0.12;

					xTo(offsetX);
					yTo(offsetY);
				}

				function onMouseLeave() {
					// Al mouseleave: ritorno elastico al centro (x:0, y:0)
					// Usiamo gsap.to() invece di quickTo per poter specificare un ease diverso
					gsap.to(card, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
				}

				function onMouseEnter() {
					// Al mouseenter: leggero scale-up per indicare interattività
					gsap.to(card, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
				}

				function onMouseLeaveScale() {
					gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
				}

				card.addEventListener('mousemove', onMouseMove);
				card.addEventListener('mouseenter', onMouseEnter);
				card.addEventListener('mouseleave', onMouseLeave);
				card.addEventListener('mouseleave', onMouseLeaveScale);
			});

		}, section);

		return () => {
			quickToFunctions = [];
			ctx.revert();
		};
	});
</script>

<section class="discipline-section" id="discipline" bind:this={section}>
	<div class="container">

		<div class="discipline-header">
			<p class="section-label">
				<span class="deco-line"></span>
				Le discipline
			</p>
			<h2 class="discipline-title">Sport<br />ai Giochi</h2>
			<p class="discipline-subtitle">
				116 eventi in 15 discipline distribuite su 13 sedi olimpiche
				tra Milano, Cortina, le Alpi e la Pianura Padana.
			</p>
		</div>

		<div class="discipline-grid">
			{#each discipline as sport}
				<div
					class="discipline-card"
					style="--card-color: {sport.colore};"
				>
					<div class="card-icon">{sport.icona}</div>
					<div class="card-content">
						<h3 class="card-title">{sport.nome}</h3>
						<p class="card-desc">{sport.desc}</p>
						<p class="card-sedi">{sport.sedi}</p>
					</div>
					<!-- Elemento decorativo che si rivela sull'hover via CSS -->
					<div class="card-arrow">→</div>
				</div>
			{/each}
		</div>

	</div>
</section>

<style>
	.discipline-section {
		padding: var(--space-2xl) 0;
		background: var(--color-bg-light);
	}

	.discipline-header {
		margin-bottom: var(--space-xl);
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto;
		gap: var(--space-sm) var(--space-xl);
		align-items: start;
	}

	.discipline-header .section-label {
		grid-column: 1;
		color: var(--color-gray-700);
	}

	.discipline-title {
		grid-column: 1;
		font-size: clamp(2.5rem, 5vw, 5rem);
		color: var(--color-bg-dark);
		line-height: 0.9;
	}

	.discipline-subtitle {
		grid-column: 2;
		grid-row: 1 / 3;
		align-self: end;
		font-size: clamp(0.9rem, 1.2vw, 1.1rem);
		color: var(--color-gray-700);
		max-width: 400px;
		line-height: 1.7;
	}

	.discipline-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-sm);
	}

	/* will-change: transform per ottimizzare il compositing durante quickTo */
	.discipline-card {
		background: var(--card-color, #1a1a2e);
		border-radius: 4px;
		padding: var(--space-lg) var(--space-md);
		cursor: pointer;
		position: relative;
		overflow: hidden;
		will-change: transform;
		transition: background 0.3s ease;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		min-height: 240px;
	}

	/* Shine effect in background */
	.discipline-card::before {
		content: '';
		position: absolute;
		top: -50%;
		right: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(ellipse at 70% 30%, rgba(91, 192, 248, 0.06) 0%, transparent 60%);
		pointer-events: none;
	}

	.card-icon {
		font-size: 2rem;
		line-height: 1;
	}

	.card-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.card-title {
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 1.8vw, 1.5rem);
		color: var(--color-white);
		letter-spacing: -0.02em;
	}

	.card-desc {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.5;
	}

	.card-sedi {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-blue-ice);
		margin-top: auto;
		padding-top: var(--space-sm);
	}

	.card-arrow {
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.2);
		transition: color 0.2s ease, transform 0.2s ease;
		align-self: flex-end;
	}

	.discipline-card:hover .card-arrow {
		color: var(--color-blue-ice);
		transform: translateX(4px);
	}

	@media (max-width: 900px) {
		.discipline-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.discipline-header {
			grid-template-columns: 1fr;
		}
		.discipline-subtitle {
			grid-column: 1;
			grid-row: auto;
		}
	}

	@media (max-width: 480px) {
		.discipline-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
