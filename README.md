# Delivery System

Sistema de Delivery completo, modular y dockerizado.

## Estructura del Proyecto (Monorepo)

- **/backend**: API REST (Node.js + Express + Prisma + PostgreSQL).
- **/frontend-main**: Cliente Principal (React + TypeScript).
- **/frontend-secondary**: Catálogo de Productos (Vue.js).
- **docker-compose.yml**: Orquestación de contenedores.

## Requisitos Previos

- Docker y Docker Compose
- Node.js (v18+)
- npm

## Instrucciones de Ejecución Rápida

1.  **Clonar el repositorio** (o descargar los archivos).
2.  **Configurar variables de entorno**:
    - El backend ya tiene valores por defecto en `docker-compose.yml` para desarrollo.
3.  **Levantar la infraestructura**:
    ```bash
    docker-compose up --build
    ```
    Esto levantará la base de datos y el backend.

4.  **Correr Frontends Localmente** (Opcional si no están dockerizados aún):
    - **Frontend Main**:
      ```bash
      cd frontend-main
      npm install
      npm run dev
      ```
    - **Frontend Secondary**:
      ```bash
      cd frontend-secondary
      npm install
      npm run dev
      ```

## Manual de Usuario (Flujo Básico)

1.  **Registro/Login**: Ingrese al Frontend Principal y cree una cuenta.
2.  **Catálogo**: Navegue por los productos disponibles.
3.  **Carrito**: Añada productos al carrito.
4.  **Checkout**: Confirme su pedido.
5.  **Seguimiento**: Vea el estado de su pedido en la sección de "Mis Pedidos".

## Manual Técnico

### Base de Datos
- PostgreSQL corriendo en puerto 5432.
- Prisma ORM gestiona el esquema en `backend/prisma/schema.prisma`.

### Comandos Útiles
- `npx prisma migrate dev`: Crear nueva migración (desde `/backend`).
- `npx prisma studio`: Ver datos de la BD (desde `/backend`).
