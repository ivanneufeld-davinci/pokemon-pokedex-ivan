<script setup>
import { useFavoritos } from '../composables/useFavoritos'

const { favoritos, alternarFavorito } = useFavoritos()
</script>

<template>
  <main class="pagina">
    <header>
      <h1>Mis Pokémon favoritos</h1>
      <p>Tu colección personal de Pokémon.</p>
    </header>

    <p v-if="favoritos.length === 0" class="vacio">Todavía no agregaste Pokémon a favoritos.</p>

    <TransitionGroup v-else name="lista-favoritos" tag="section" class="rejilla">
      <article v-for="pokemon in favoritos" :key="pokemon.id" class="tarjeta">
        <RouterLink :to="`/detalle/${pokemon.id}`" class="enlace">
          <img :src="pokemon.imagen" :alt="pokemon.name" />

          <p class="numero">N.º {{ String(pokemon.id).padStart(3, '0') }}</p>

          <h2>{{ pokemon.name }}</h2>

          <div class="tipos">
            <span v-for="tipo in pokemon.tipos" :key="tipo">
              {{ tipo }}
            </span>
          </div>
        </RouterLink>

        <button @click="alternarFavorito(pokemon)">Quitar de favoritos</button>
      </article>
    </TransitionGroup>

    <RouterLink to="/" class="volver"> ← Volver a la Pokédex </RouterLink>
  </main>
</template>

<style scoped>
.pagina {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 16px;
}

header {
  text-align: center;
  margin-bottom: 28px;
}

h1 {
  color: #e63946;
}

.vacio {
  text-align: center;
  padding: 30px 10px;
}

.rejilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  gap: 16px;
}

.tarjeta {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f4f5f7;
  border-radius: 12px;
  text-align: center;
  color: #222;
}

.enlace {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  color: inherit;
  text-decoration: none;
}

.tarjeta img {
  display: block;
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.numero {
  color: #666;
  font-size: 0.85rem;
  margin: 6px 0;
}

.tarjeta h2 {
  text-transform: capitalize;
  margin: 4px 0 12px;
}

.tipos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-bottom: 14px;
}

.tipos span {
  background: #e0e7ff;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 0.8rem;
}

.tarjeta button {
  width: 100%;
  border: none;
  border-radius: 6px;
  padding: 10px 12px;
  background: #e63946;
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
}

.tarjeta button:hover {
  background: #c92f3b;
}

.volver {
  display: inline-block;
  margin-top: 28px;
  color: #d62839;
  text-decoration: none;
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

.lista-favoritos-enter-active,
.lista-favoritos-leave-active,
.lista-favoritos-move {
  transition: all 0.3s ease;
}

.lista-favoritos-enter-from,
.lista-favoritos-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
