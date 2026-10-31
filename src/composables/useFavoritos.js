import { ref, watch } from 'vue'

const favoritos = ref([])

const guardados = localStorage.getItem('pokemon-favoritos')

if (guardados) {
  try {
    favoritos.value = JSON.parse(guardados)
  } catch {
    favoritos.value = []
  }
}

watch(
  favoritos,
  (nuevosFavoritos) => {
    localStorage.setItem('pokemon-favoritos', JSON.stringify(nuevosFavoritos))
  },
  { deep: true },
)

function esFavorito(id) {
  return favoritos.value.some((pokemon) => pokemon.id === Number(id))
}

function alternarFavorito(pokemon) {
  if (esFavorito(pokemon.id)) {
    favoritos.value = favoritos.value.filter((favorito) => favorito.id !== pokemon.id)
  } else {
    favoritos.value.push({
      id: pokemon.id,
      name: pokemon.name,
      imagen:
        pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default,
      tipos: pokemon.types.map((tipo) => tipo.type.name),
    })
  }
}

export function useFavoritos() {
  return {
    favoritos,
    esFavorito,
    alternarFavorito,
  }
}
