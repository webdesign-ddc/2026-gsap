<!--
  Mascot.svelte
  Contenuto della scena Threlte: cristallo iridescente con anelli orbitanti.

  Questo componente vive DENTRO un <Canvas> di Threlte.
  Non è usabile standalone — va importato dentro ThreeDScene.svelte.

  Il modello 3D è costruito interamente con primitive Three.js:
  - IcosahedronGeometry: il cristallo centrale (20 facce, aspetto gemma)
  - TorusGeometry: 3 anelli orbitanti a inclinazioni diverse

  Materiali usati:
  - MeshPhysicalMaterial con iridescence: effetto arcobaleno/iridescente
  - MeshStandardMaterial per gli anelli: metallic + emissive glow

  Per riutilizzare:
  - Importa questo componente dentro un <Canvas> di @threlte/core
  - Modifica le props di geometry/material per cambiare aspetto
  - useFrame() è il loop di animazione — eseguito ogni frame via requestAnimationFrame
-->

<script>
	import { T, useTask } from '@threlte/core';

	// Riferimenti agli oggetti Three.js (settati da bind:ref nei template)
	// Non usiamo $state perché questi valori non pilotano reattività Svelte —
	// vengono letti solo dentro useFrame() che è un loop manuale.
	let crystalMesh;
	let ring1Mesh;
	let ring2Mesh;
	let ring3Mesh;
	let groupRef;

	// useTask: callback eseguita a ogni frame (60fps idealmente). In Threlte 8
	// si chiama useTask (rinominato rispetto a useFrame delle versioni precedenti).
	// `delta` è il tempo in secondi dall'ultimo frame — usalo per animazioni
	// frame-rate independent (moltiplicare velocità × delta invece di usare valori fissi).
	useTask((delta) => {
		// Rotazione del cristallo: lenta sul Y, lentissima sull'X per un moto "galleggiante"
		if (crystalMesh) {
			crystalMesh.rotation.y += delta * 0.5;
			crystalMesh.rotation.x += delta * 0.08;
		}

		// Ogni anello ruota a velocità e direzione diversa per un effetto cinetico
		if (ring1Mesh) ring1Mesh.rotation.z += delta * 0.4;
		if (ring2Mesh) ring2Mesh.rotation.z -= delta * 0.25;
		if (ring3Mesh) ring3Mesh.rotation.y += delta * 0.3;
	});
</script>

<!-- Camera prospettica: makeDefault la rende la camera attiva della scena -->
<T.PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />

<!-- Luci della scena: ambient per base, poi due point light colorati per mood olimpico -->
<T.AmbientLight intensity={0.4} color="#ffffff" />

<!-- Luce direzionale principale (simula il sole) -->
<T.DirectionalLight
	position={[4, 6, 5]}
	intensity={2}
	color="#ffffff"
/>

<!-- Point light blu ghiaccio — riflessa sul cristallo, crea il look "invernale" -->
<T.PointLight
	position={[-4, 3, 4]}
	color="#5BC0F8"
	intensity={8}
	distance={20}
/>

<!-- Point light rosso olimpico — complementare al blu, crea profondità cromatica -->
<T.PointLight
	position={[3, -3, -3]}
	color="#E63946"
	intensity={4}
	distance={15}
/>

<!-- Gruppo radice: tutto il modello può essere trasformato insieme se serve -->
<T.Group bind:ref={groupRef}>

	<!-- CRISTALLO CENTRALE: IcosahedronGeometry con MeshPhysicalMaterial iridescente.
	     IcosahedronGeometry(raggio, dettaglio): dettaglio=1 dà 80 facce (gemma sfaccettata).
	     MeshPhysicalMaterial è il materiale più avanzato di Three.js — supporta
	     transmission (vetro), iridescence (effetto arcobaleno), clearcoat, ecc. -->
	<T.Mesh bind:ref={crystalMesh}>
		<T.IcosahedronGeometry args={[1, 1]} />
		<T.MeshPhysicalMaterial
			color="#DDECFF"
			metalness={0.1}
			roughness={0.05}
			iridescence={1}
			iridescenceIOR={1.5}
			iridescenceThicknessRange={[100, 800]}
			reflectivity={1}
			clearcoat={1}
			clearcoatRoughness={0}
		/>
	</T.Mesh>

	<!-- ANELLO 1: orizzontale (piano XZ), blu ghiaccio emissivo -->
	<T.Mesh bind:ref={ring1Mesh} rotation.x={Math.PI / 2}>
		<T.TorusGeometry args={[1.9, 0.022, 8, 120]} />
		<T.MeshStandardMaterial
			color="#5BC0F8"
			metalness={1}
			roughness={0}
			emissive="#5BC0F8"
			emissiveIntensity={0.6}
		/>
	</T.Mesh>

	<!-- ANELLO 2: inclinato a 45°, bianco (quasi invisibile, fa da struttura) -->
	<T.Mesh bind:ref={ring2Mesh} rotation.x={Math.PI / 4} rotation.z={Math.PI / 6}>
		<T.TorusGeometry args={[2.4, 0.014, 8, 120]} />
		<T.MeshStandardMaterial
			color="#FFFFFF"
			metalness={0.9}
			roughness={0.05}
			emissive="#AACCFF"
			emissiveIntensity={0.2}
		/>
	</T.Mesh>

	<!-- ANELLO 3: verticale (piano XY), rosso olimpico emissivo -->
	<T.Mesh bind:ref={ring3Mesh} rotation.z={Math.PI / 2} rotation.x={Math.PI / 6}>
		<T.TorusGeometry args={[2.8, 0.018, 8, 120]} />
		<T.MeshStandardMaterial
			color="#E63946"
			metalness={1}
			roughness={0}
			emissive="#E63946"
			emissiveIntensity={0.4}
		/>
	</T.Mesh>

</T.Group>
