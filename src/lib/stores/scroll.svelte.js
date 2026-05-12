/**
 * scroll.svelte.js
 * Store globale per tracciare il progresso dello scroll.
 *
 * Pattern usato: Svelte 5 Runes con stato reattivo condiviso.
 * Questo modulo esporta uno stato "rune-based" che può essere importato
 * in qualsiasi componente e osservato con $derived o direttamente nel template.
 *
 * Nota: i file .svelte.js possono usare le runes fuori dai componenti.
 * Questo è uno dei vantaggi di Svelte 5 rispetto agli store di Svelte 4.
 */

// $state crea uno stato reattivo a livello di modulo.
// Qualsiasi componente che importa queste variabili le osserva automaticamente.
let scrollY = $state(0);
let scrollProgress = $state(0); // da 0 a 1 rispetto all'altezza totale della pagina

/**
 * Inizializza il listener dello scroll.
 * Va chiamato una volta sola nel layout o nella pagina principale.
 * Restituisce una funzione di cleanup per rimuovere il listener.
 */
export function initScrollStore() {
	function onScroll() {
		scrollY = window.scrollY;
		const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
		scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
	}

	window.addEventListener('scroll', onScroll, { passive: true });

	return () => {
		window.removeEventListener('scroll', onScroll);
	};
}

// Getter per accedere ai valori reattivi dall'esterno
export function getScrollY() {
	return scrollY;
}

export function getScrollProgress() {
	return scrollProgress;
}
