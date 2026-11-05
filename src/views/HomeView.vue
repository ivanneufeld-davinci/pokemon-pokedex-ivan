<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pokemones = ref([])
const cargando = ref(true)
const error = ref(false)

const tipos = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

const busqueda = ref(typeof route.query.busqueda === 'string' ? route.query.busqueda : '')

const tipoSeleccionado = ref(
  typeof route.query.tipo === 'string' && tipos.includes(route.query.tipo) ? route.query.tipo : '',
)

let temporizadorBusqueda = null

const pokemonesFiltrados = computed(() => {
  return pokemones.value.filter((pokemon) => {
    const coincideNombre = pokemon.name.toLowerCase().includes(busqueda.value.toLowerCase())

    const coincideTipo =
      !tipoSeleccionado.value ||
      pokemon.types.some((tipo) => tipo.type.name === tipoSeleccionado.value)

    return coincideNombre && coincideTipo
  })
})

const totalPaginas = computed(() => {
  return Math.ceil(pokemonesFiltrados.value.length / pokemonesPorPagina)
})

const pokemonesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * pokemonesPorPagina
  const fin = inicio + pokemonesPorPagina

  return pokemonesFiltrados.value.slice(inicio, fin)
})

async function cargarPokemones() {
  cargando.value = true
  error.value = false

  try {
    const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=60')

    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar los Pokémon')
    }

    const datos = await respuesta.json()

    const resultados = await Promise.all(
      datos.results.map(async (pokemon) => {
        const respuestaDetalle = await fetch(pokemon.url)

        if (!respuestaDetalle.ok) {
          throw new Error('Error al obtener un Pokémon')
        }

        return await respuestaDetalle.json()
      }),
    )

    pokemones.value = resultados
  } catch (e) {
    error.value = true
    console.error('Error al cargar Pokémon:', e)
  } finally {
    cargando.value = false
  }
}

watch(busqueda, () => {
  clearTimeout(temporizadorBusqueda)

  temporizadorBusqueda = setTimeout(() => {
    const query = {}

    if (busqueda.value) {
      query.busqueda = busqueda.value
    }

    if (tipoSeleccionado.value) {
      query.tipo = tipoSeleccionado.value
    }

    router.replace({ query })
  }, 400)
})

watch(tipoSeleccionado, () => {
  const query = {}

  if (busqueda.value) {
    query.busqueda = busqueda.value
  }

  if (tipoSeleccionado.value) {
    query.tipo = tipoSeleccionado.value
  }

  router.replace({ query })
})

watch(
  () => route.query,
  (query) => {
    busqueda.value = typeof query.busqueda === 'string' ? query.busqueda : ''

    tipoSeleccionado.value =
      typeof query.tipo === 'string' && tipos.includes(query.tipo) ? query.tipo : ''
  },
)

watch([busqueda, tipoSeleccionado], () => {
  paginaActual.value = 1
})

const paginaActual = ref(1)
const pokemonesPorPagina = 12

onUnmounted(() => {
  clearTimeout(temporizadorBusqueda)
})

onMounted(cargarPokemones)
</script>

<template>
  <main class="pokedex">
    <header class="encabezado">
      <h1>Pokédex</h1>
      <p>¡Descubrí tu próximo Pokémon favorito!</p>
    </header>

    <section class="controles">
      <input
        v-model="busqueda"
        type="search"
        placeholder="Buscar Pokémon por nombre..."
        aria-label="Buscar Pokémon"
      />

      <select v-model="tipoSeleccionado" aria-label="Filtrar por tipo">
        <option value="">Todos los tipos</option>
        <option v-for="tipo in tipos" :key="tipo" :value="tipo">
          {{ tipo.charAt(0).toUpperCase() + tipo.slice(1) }}
        </option>
      </select>
    </section>

    <p v-if="cargando" class="mensaje">Cargando Pokémon...</p>

    <section v-else-if="error" class="mensaje">
      <p>No pudimos cargar los Pokémon.</p>
      <button @click="cargarPokemones">Reintentar</button>
    </section>

    <section v-else-if="pokemonesFiltrados.length" class="rejilla">
      <article v-for="pokemon in pokemonesPaginados" :key="pokemon.id" class="tarjeta">
        <img :src="pokemon.sprites.front_default" :alt="pokemon.name" loading="lazy" />

        <p class="numero">N.º {{ String(pokemon.id).padStart(3, '0') }}</p>

        <h2>{{ pokemon.name }}</h2>

        <div class="etiquetas">
          <span v-for="tipo in pokemon.types" :key="tipo.type.name">
            {{ tipo.type.name }}
          </span>
        </div>

        <RouterLink :to="`/detalle/${pokemon.id}`"> Ver detalles </RouterLink>
      </article>
    </section>

    <nav v-if="totalPaginas > 1" class="paginacion" aria-label="Paginación">
      <button :disabled="paginaActual === 1" @click="paginaActual--">Anterior</button>

      <span> Página {{ paginaActual }} de {{ totalPaginas }} </span>

      <button :disabled="paginaActual === totalPaginas" @click="paginaActual++">Siguiente</button>
    </nav>

    <p v-else class="mensaje">No se encontraron Pokémon con esos criterios.</p>
  </main>
</template>

<style scoped>
.pokedex {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.encabezado {
  text-align: center;
  margin-bottom: 28px;
}

.encabezado h1 {
  font-size: 2.5rem;
  color: #e63946;
  margin-bottom: 8px;
}

.controles {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.controles input,
.controles select {
  flex: 1;
  min-width: 200px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.rejilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  gap: 16px;
}

.tarjeta {
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  background: #f4f5f7;
  color: #222;
  transition: transform 0.2s;
}

.tarjeta:hover {
  transform: translateY(-4px);
}

.tarjeta img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.tarjeta h2 {
  text-transform: capitalize;
  margin: 6px 0 12px;
}

.numero {
  color: #666;
  font-size: 0.85rem;
}

.etiquetas {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.etiquetas span {
  background: #e0e7ff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.tarjeta a {
  display: inline-block;
  background: #e63946;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
}

.mensaje {
  text-align: center;
  padding: 32px 12px;
}

.mensaje button {
  padding: 10px 16px;
  cursor: pointer;
}

@media (max-width: 375px) {
  .rejilla {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .tarjeta {
    padding: 10px;
  }

  .tarjeta img {
    max-width: 100%;
  }
}

.paginacion {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin: 28px 0;
}

.paginacion button {
  background: #e63946;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 1rem;
}

.paginacion button:disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
}

.paginacion span {
  font-weight: bold;
}
</style>
