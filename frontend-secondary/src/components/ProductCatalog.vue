<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
}

const products = ref<Product[]>([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/products')
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products', error)
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      Catálogo de Productos
    </h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="product in products" :key="product.id" class="bg-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 border border-white/10 group">
        <div class="relative h-56 overflow-hidden">
          <img 
            v-if="product.imageUrl" 
            :src="product.imageUrl" 
            :alt="product.name" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div v-else class="w-full h-full bg-white/5 flex items-center justify-center text-muted">
            Sin Imagen
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
        </div>
        
        <div class="p-6">
          <h2 class="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{{ product.name }}</h2>
          <p class="text-muted text-sm mb-4 line-clamp-2">{{ product.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-2xl font-bold text-primary">${{ product.price }}</span>
            <button class="bg-white/10 hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles handled by Tailwind */
</style>
