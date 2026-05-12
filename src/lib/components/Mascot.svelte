<!--
  Mascot.svelte
  Scena Threlte: i 5 cerchi olimpici in 3D con colori ufficiali.

  Costruito con primitive Three.js:
  - TorusGeometry: ogni cerchio è un toro orientato verticalmente (rotation.x = PI/2)
  - MeshStandardMaterial: metalness leggero per un po' di lustro senza perdere i colori
  - PerspectiveCamera: Threlte aggiorna automaticamente l'aspect ratio al resize del canvas

  Perché FOV=60?
  Durante la rotazione Y, il modello proietta una larghezza maggiore di quella frontale
  (i bordi del toro si sommano alla profondità Z del gruppo inclinato).
  Con FOV=60 + camera a z=5 il frustum è abbastanza ampio da contenere il modello
  in qualsiasi angolo di rotazione senza mai clipparlo.

  Responsive: Threlte aggiorna automaticamente camera.aspect quando il canvas
  viene ridimensionato (via ResizeObserver → updateCamera interno). Non serve gestirlo
  manualmente con useTask — sarebbe ridondante.

  Per riutilizzare:
  - Aggiungi un po' di inclinazione al T.Group (rotation.x) per senso di profondità
  - FOV generoso (55–65) previene il clipping durante rotazioni Y
-->

<script>
	import { T, useTask } from '@threlte/core';

	// Colori ufficiali CIO per i 5 cerchi
	const RINGS = [
		{ color: '#0081C8' }, // 1 — Blu
		{ color: '#FCB131' }, // 2 — Giallo
		{ color: '#000000' }, // 3 — Nero
		{ color: '#00A651' }, // 4 — Verde
		{ color: '#EE334E' }, // 5 — Rosso
	];

	// Geometria: raggio anello, spessore tubo, spaziatura
	const R  = 0.62;   // raggio del toro (centro → centro del tubo)
	const TK = 0.068;  // raggio del tubo (spessore visivo)
	const SX = 0.55;   // spaziatura orizzontale tra centri (< 2R = sovrapposizione olimpica)
	const SY = 0.32;   // offset verticale tra le due file

	// 5 posizioni [x, y, z]
	const positions = [
		[-SX * 2, +SY, -0.12], // 1 — Blu
		[-SX,     -SY, 0.12], // 2 — Giallo
		[0,       +SY, 0], // 3 — Nero
		[+SX,     -SY, 0.22], // 4 — Verde
		[+SX * 2, +SY, -0.12], // 5 — Rosso
	];

	// Riferimento al gruppo per la rotazione
	let groupRef;

	useTask((delta) => {
		if (groupRef) groupRef.rotation.y += delta * 0.35;
	});
</script>

<!--
	FOV=60 + z=5: visuale ampia che contiene il modello anche agli angoli più estremi.
	Threlte aggiorna automaticamente camera.aspect al resize (non serve farlo manualmente).
-->
<T.PerspectiveCamera makeDefault fov={60} position={[0, 0, 5]} near={0.1} far={50} />

<!-- Luci: ambient per base + directional per ombre morbide + point frontale -->
<T.AmbientLight intensity={0.65} />
<T.DirectionalLight position={[4, 5, 6]} intensity={1.8} color="#ffffff" />
<T.PointLight position={[0, 0, 5]} intensity={0.8} color="#ffffff" />

<!--
	rotation.x={0.14} = ~8° di inclinazione: dà profondità senza aumentare troppo
	la larghezza proiettata durante la rotazione Y (era 12° = 0.21, causa del clipping).
-->
<T.Group bind:ref={groupRef} rotation.x={0.14}>

	{#each RINGS as ring, i}
		<T.Mesh position={positions[i]}>
			<T.TorusGeometry args={[R, TK, 24, 120]} />
			<T.MeshStandardMaterial
				color={ring.color}
				metalness={0.25}
				roughness={0.45}
			/>
		</T.Mesh>
	{/each}

</T.Group>
