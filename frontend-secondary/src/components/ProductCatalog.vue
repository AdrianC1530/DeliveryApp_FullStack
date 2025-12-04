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
  <div class="container">
    <h1>Catálogo de Productos</h1>
    <div class="grid">
      <div v-for="product in products" :key="product.id" class="card">
        <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="product-image" />
        <div class="card-body">
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
          <p class="price">\${{ product.price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 15px;
}

h2 {
  font-size: 1.2rem;
  margin: 0 0 10px;
}

p {
  color: #666;
  font-size: 0.9rem;
}

.price {
  color: #2c3e50;
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 10px;
}
</style>
