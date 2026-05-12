# Milano Cortina 2026 — GSAP Showcase Didattico

Progetto Svelte 5 + GSAP + Threlte per studenti di Digital Design.  
Una single page a tema Olimpiadi Invernali che mostra i principali pattern GSAP in contesti reali.

---

## Avvio rapido

```bash
npm install
npm run dev
```

Il progetto sarà disponibile su `http://localhost:5173` (o la porta successiva libera).

Per la build di produzione:

```bash
npm run build
npm run preview
```

---

## Stack

| Tecnologia | Versione | Ruolo |
|---|---|---|
| SvelteKit | 2.x | Framework SSR/SPA |
| Svelte | 5.x | UI con runes (`$state`, `$effect`, `$props`) |
| GSAP | 3.15+ | Animazioni (ScrollTrigger gratis dal 2025) |
| Threlte | 8.x | Scena 3D dichiarativa su Three.js |
| Three.js | 0.184+ | Geometrie e materiali 3D |
| Vite | 6.x | Bundler |

---

## Mappa dei pattern GSAP

Ogni componente isola un pattern specifico — copia quello che ti serve.

### `Hero.svelte` — `gsap.timeline()` + split manuale del testo

Il pattern più complesso: una timeline orchestrata con `.from()`, stagger, e overlap (`<-0.3`).  
Il testo viene diviso in `<span class="char">` via JavaScript (senza plugin SplitText a pagamento).

```javascript
// Pattern chiave
const tl = gsap.timeline({ delay: 0.2 })
tl.from(chars, { yPercent: 110, opacity: 0, stagger: 0.025, ease: 'power4.out' })
tl.from(subtitle, { y: 30, opacity: 0 }, '-=0.4')
```

### `Navbar.svelte` — `gsap.to()` + scroll listener

Alternativa leggera a ScrollTrigger per transizioni a soglia singola.

```javascript
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    gsap.to(navbar, { backgroundColor: 'rgba(10,10,10,0.92)', duration: 0.4 })
  }
})
```

### `StatsCounter.svelte` — Counter animato con `onUpdate`

GSAP anima un oggetto proxy intermediario, non il DOM direttamente.

```javascript
const proxy = { valore: 0 }
gsap.to(proxy, {
  valore: 2900,
  scrollTrigger: { trigger, start: 'top 60%', once: true },
  onUpdate: () => { elemento.textContent = Math.round(proxy.valore) }
})
```

### `ThreeDScene.svelte` — `ScrollTrigger` con `scrub` + CSS sticky

Un `<div>` contenitore è `position: sticky` via CSS, mentre ScrollTrigger scrub muove il canvas 3D.  
Insegna la differenza tra `pin: true` (JavaScript) e `position: sticky` (CSS nativo).

```javascript
gsap.timeline({
  scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1.5 }
})
.fromTo(canvasWrapper, { x: 0, y: 0 }, { x: '-50vw', y: '35vh', ease: 'none', duration: 2 })
.fromTo(textBlock1, { opacity: 1 }, { opacity: 0, duration: 1 }, 0)
.fromTo(textBlock2, { opacity: 0 }, { opacity: 1, duration: 1 }, 1)
```

### `MarqueeText.svelte` — Loop infinito `repeat: -1`

Il contenuto è duplicato (`testo + testo`), e `xPercent: -50` crea il seamless loop.

```javascript
gsap.to(track, { xPercent: -50, repeat: -1, duration: 35, ease: 'none' })
```

### `DisciplineCards.svelte` — `gsap.quickTo()` effetto magnetico

`quickTo` crea una funzione riutilizzabile per aggiornare frequentemente un valore animato.  
Più performante di `gsap.to()` ripetuto in ogni `mousemove`.

```javascript
const xTo = gsap.quickTo(card, 'x', { duration: 0.5, ease: 'power3.out' })
card.addEventListener('mousemove', (e) => { xTo(offsetX) })
card.addEventListener('mouseleave', () => { gsap.to(card, { x: 0, ease: 'elastic.out(1, 0.5)' }) })
```

### `Timeline.svelte` — ScrollTrigger stagger sequenziale

Il pattern più comune per animazioni "reveal on scroll" di liste.

```javascript
gsap.from('.timeline-item', {
  scrollTrigger: { trigger: '.timeline-list', start: 'top 75%' },
  x: -60, opacity: 0, stagger: 0.12, ease: 'power3.out'
})
```

### `SplitTextReveal.svelte` — Componente riusabile per reveal di testo

Versione componentizzata e riusabile dello split per parole (non lettere).

### `ParallaxImage.svelte` — ScrollTrigger `scrub` per parallax

```javascript
gsap.fromTo(img,
  { yPercent: -15 },
  { yPercent: 15, ease: 'none', scrollTrigger: { trigger: wrapper, scrub: 1 } }
)
```

---

## Note sulla parte 3D (Threlte)

### Struttura della scena

Il componente 3D è diviso in due file:

- **`ThreeDScene.svelte`** — gestisce il layout HTML, il canvas container, e le animazioni GSAP dello scroll
- **`Mascot.svelte`** — il contenuto della scena Three.js (luci, geometrie, loop di animazione)

`Mascot.svelte` non è usabile standalone: vive sempre dentro un `<Canvas>` di Threlte.

### Modello 3D

Non vengono usati file `.glb` esterni. Il modello è costruito con primitive Three.js:

- `IcosahedronGeometry(1, 1)` — cristallo a 80 facce con `MeshPhysicalMaterial` iridescente
- `TorusGeometry` × 3 — anelli orbitanti con `MeshStandardMaterial` emissivo

### Loop di animazione

In Threlte 8, il loop di animazione si implementa con `useTask` (non più `useFrame`):

```javascript
import { useTask } from '@threlte/core'

useTask((delta) => {
  if (crystalMesh) crystalMesh.rotation.y += delta * 0.5
})
```

`delta` è il tempo in secondi dall'ultimo frame — moltiplicare sempre per delta per animazioni frame-rate independent.

### Differenza chiave: movimento 3D vs. movimento 2D

Il canvas Threlte si **sposta sulla pagina** (transform CSS 2D via GSAP), non la camera 3D.  
Questo è intenzionale: la camera resta ferma, il modello ruota su se stesso, ma la "finestra" sul 3D si sposta nella pagina 2D come qualsiasi elemento HTML.

---

## Struttura del progetto

```
src/
├── routes/
│   └── +page.svelte           # Composizione della pagina
├── lib/
│   ├── components/
│   │   ├── Hero.svelte              # timeline() + split testo
│   │   ├── Navbar.svelte            # gsap.to() + scroll listener
│   │   ├── Countdown.svelte         # $state/$effect (timer reattivo)
│   │   ├── StatsCounter.svelte      # counter con onUpdate
│   │   ├── ThreeDScene.svelte       # ScrollTrigger scrub + sticky
│   │   ├── Mascot.svelte            # Threlte: geometrie + useTask
│   │   ├── MarqueeText.svelte       # repeat: -1 loop
│   │   ├── DisciplineCards.svelte   # quickTo() + stagger reveal
│   │   ├── Timeline.svelte          # stagger sequenziale
│   │   ├── SplitTextReveal.svelte   # componente riusabile reveal
│   │   ├── ParallaxImage.svelte     # scrub parallax
│   │   └── Footer.svelte            # SplitTextReveal + links
│   ├── animations/
│   │   └── gsap-utils.js            # registrazione plugin, helper config
│   └── stores/
│       └── scroll.svelte.js         # store rune-based per scroll progress
├── app.css                          # design system, palette, tipografia
└── app.html
```

---

## Pattern GSAP + Svelte 5: regole fondamentali

1. **Sempre `gsap.context(callback, root)`** — scopa le animazioni all'elemento root, previene memory leak
2. **Sempre `return () => ctx.revert()`** dentro `$effect` — cleanup quando il componente viene smontato
3. **`$effect` solo nel browser** — GSAP non funziona in SSR (Node.js), ma `$effect` viene eseguito solo lato client
4. **`useTask` per il loop 3D in Threlte 8** — sostituisce `useFrame` delle versioni precedenti
5. **ScrollTrigger gratis** — dal 2025 non serve più la licenza Club GSAP per ScrollTrigger
