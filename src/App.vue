<script setup>
import { useFavoritos } from './composables/useFavoritos'

const { favoritos } = useFavoritos()
</script>

<template>
  <div class="app">
    <nav class="navbar">
      <RouterLink to="/" class="logo">
        <span class="pokeball">◉</span>
        Pokédex
      </RouterLink>

      <div class="enlaces">
        <RouterLink to="/" class="enlace"> Inicio </RouterLink>

        <RouterLink to="/favoritos" class="enlace">
          ❤️ Favoritos
          <span class="contador">{{ favoritos.length }}</span>
        </RouterLink>
      </div>
    </nav>

    <RouterView v-slot="{ Component, route }">
      <Transition name="cambio-pagina" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #ffffff;
  color: #222;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 6%;
  background: #e63946;
  color: white;
  box-shadow: 0 3px 10px #00000020;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.pokeball {
  font-size: 1.7rem;
}

.enlaces {
  display: flex;
  align-items: center;
  gap: 12px;
}

.enlace {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border-radius: 8px;
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.2s;
}

.enlace:hover {
  background: #c92d3a;
}

.enlace.router-link-exact-active {
  background: #b92331;
}

.contador {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  border-radius: 50px;
  background: white;
  color: #c92d3a;
  font-size: 0.8rem;
}

@media (max-width: 400px) {
  .navbar {
    padding: 12px;
    gap: 8px;
  }

  .logo {
    font-size: 1.1rem;
  }

  .enlaces {
    gap: 4px;
  }

  .enlace {
    padding: 8px;
    font-size: 0.85rem;
  }
}

.cambio-pagina-enter-active,
.cambio-pagina-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.cambio-pagina-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.cambio-pagina-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
