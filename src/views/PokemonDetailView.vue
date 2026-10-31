<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFavoritos } from '../composables/useFavoritos'

const route = useRoute()
const { esFavorito, alternarFavorito } = useFavoritos()

const pokemon = ref(null)
const cargando = ref(true)
const error = ref(false)

async function cargarPokemon() {
  cargando.value = true
  error.value = false
  pokemon.value = null

  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${route.params.id}`)

    if (!respuesta.ok) {
      throw new Error('No se encontró el Pokémon')
    }

    pokemon.value = await respuesta.json()
  } catch (e) {
    error.value = true
    console.error('Error al cargar el Pokémon:', e)
  } finally {
    cargando.value = false
  }
}

watch(() => route.params.id, cargarPokemon, { immediate: true })

const imagenPokemon = () => {
  return (
    pokemon.value?.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.value?.sprites?.front_default ||
    ''
  )
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
</script>

<template>
  <main class="detalle">
    <RouterLink to="/" class="volver"> ← Volver a la Pokédex </RouterLink>

    <p v-if="cargando" class="mensaje">Cargando información del Pokémon...</p>

    <section v-else-if="error" class="mensaje">
      <h1>No se pudo cargar el Pokémon</h1>
      <p>Comprobá tu conexión e intentá nuevamente.</p>
      <button @click="cargarPokemon">Reintentar</button>
    </section>

    <section v-else-if="pokemon" class="contenido">
      <header class="encabezado">
        <p class="numero">N.º {{ String(pokemon.id).padStart(3, '0') }}</p>

        <h1>{{ capitalizar(pokemon.name) }}</h1>

        <div class="tipos">
          <span v-for="tipo in pokemon.types" :key="tipo.type.name">
            {{ capitalizar(tipo.type.name) }}
          </span>
        </div>
      </header>

      <button class="boton-favorito" @click="alternarFavorito(pokemon)">
        {{ esFavorito(pokemon.id) ? '❤️ Quitar de favoritos' : '🤍 Agregar a favoritos' }}
      </button>

      <div class="informacion">
        <div class="imagen">
          <img v-if="imagenPokemon()" :src="imagenPokemon()" :alt="capitalizar(pokemon.name)" />
          <p v-else>Imagen no disponible</p>
        </div>

        <section class="datos">
          <h2>Información general</h2>

          <div class="dato">
            <span>Altura</span>
            <strong>{{ pokemon.height / 10 }} m</strong>
          </div>

          <div class="dato">
            <span>Peso</span>
            <strong>{{ pokemon.weight / 10 }} kg</strong>
          </div>

          <h2>Habilidades</h2>

          <ul>
            <li v-for="habilidad in pokemon.abilities" :key="habilidad.ability.name">
              {{ capitalizar(habilidad.ability.name.replaceAll('-', ' ')) }}
              <span v-if="habilidad.is_hidden">(Oculta)</span>
            </li>
          </ul>
        </section>
      </div>

      <section class="estadisticas">
        <h2>Estadísticas base</h2>

        <div v-for="estadistica in pokemon.stats" :key="estadistica.stat.name" class="estadistica">
          <div class="estadistica-texto">
            <span>
              {{ capitalizar(estadistica.stat.name.replaceAll('-', ' ')) }}
            </span>
            <strong>{{ estadistica.base_stat }}</strong>
          </div>

          <div class="barra">
            <div
              class="progreso"
              :style="{
                width: (Math.min(estadistica.base_stat, 255) / 255) * 100 + '%',
              }"
            ></div>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.detalle {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 20px 40px;
}

.volver {
  display: inline-block;
  margin-bottom: 24px;
  color: #d62839;
  text-decoration: none;
  font-weight: bold;
}

.volver:hover {
  text-decoration: underline;
}

.encabezado {
  text-align: center;
  margin-bottom: 24px;
}

.encabezado h1 {
  font-size: 2.5rem;
  margin: 8px 0 16px;
  text-transform: capitalize;
}

.numero {
  color: #777;
  font-weight: bold;
}

.tipos {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.tipos span {
  background: #e63946;
  color: white;
  padding: 7px 16px;
  border-radius: 20px;
  text-transform: capitalize;
}

.informacion {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
}

.imagen {
  background: #f4f5f7;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 280px;
}

.imagen img {
  width: 100%;
  max-width: 350px;
  object-fit: contain;
}

.datos {
  background: #f4f5f7;
  color: #222;
  padding: 24px;
  border-radius: 16px;
}

.datos h2,
.estadisticas h2 {
  margin-top: 0;
}

.dato {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #ddd;
}

.datos ul {
  padding-left: 20px;
  line-height: 1.8;
  text-transform: capitalize;
}

.datos li span {
  color: #777;
  font-size: 0.85rem;
}

.estadisticas {
  margin-top: 28px;
  padding: 24px;
  background: #f4f5f7;
  color: #222;
  border-radius: 16px;
}

.estadistica {
  margin: 18px 0;
}

.estadistica-texto {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
  text-transform: capitalize;
}

.barra {
  height: 12px;
  background: #ddd;
  border-radius: 10px;
  overflow: hidden;
}

.progreso {
  height: 100%;
  background: #e63946;
  border-radius: 10px;
  transition: width 0.4s;
}

.mensaje {
  text-align: center;
  padding: 40px 12px;
}

.mensaje button {
  padding: 10px 16px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .informacion {
    grid-template-columns: 1fr;
  }

  .encabezado h1 {
    font-size: 2rem;
  }

  .imagen {
    min-height: 220px;
  }

  .imagen img {
    max-width: 260px;
  }

  .datos,
  .estadisticas {
    padding: 18px;
  }
}

.boton-favorito {
  display: block;
  margin: 0 auto 24px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: #e63946;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.boton-favorito:hover {
  background: #c92d3a;
}
</style>
