# 🚀 DeliveryApp FullStack System
### Una experiencia de delivery moderna, inmersiva y totalmente dockerizada.

Este proyecto representa un sistema integral de gestión de pedidos y delivery de última generación. Combina una arquitectura backend robusta con interfaces de usuario (Frontends) diseñadas bajo la estética **Glassmorphism** y **Magic UI**, ofreciendo una experiencia visual premium y fluida.

---

## 🌟 Características Destacadas

### 🎨 Frontend Principal (Cliente)
Una interfaz construida para impresionar y retener al usuario.
- **Estética Glassmorphism**: Paneles translúcidos, desenfoques en tiempo real (backdrop-filter) y sombras suaves.
- **Animaciones Fluidas**: Transiciones de página, micro-interacciones en botones y efectos de carga con **Framer Motion**.
- **Diseño Responsivo**: Adaptable a cualquier dispositivo con **Tailwind CSS**.
- **Gestión de Estado**: Carrito de compras en tiempo real y autenticación de usuarios.
- **Contenedores Aislados**: Backend, Frontends y Base de Datos corriendo en armonía.
- **Persistencia de Datos**: Volúmenes de Docker configurados para PostgreSQL.
- **Red Interna**: Comunicación segura entre servicios.

---

## 🛠️ Stack Tecnológico

Este proyecto ha sido construido utilizando los estándares más altos de la industria:

### Frontend
- **React 18** (Main) & **Vue 3** (Secondary)
- **TypeScript**: Tipado estático para código más seguro.
- **Tailwind CSS**: Framework de utilidad para diseño rápido y moderno.
- **Framer Motion**: Librería de animaciones para React.
- **Vite**: Build tool de próxima generación.

### Backend
- **Node.js & Express**: Servidor rápido y escalable.
- **Prisma ORM**: Capa de acceso a datos moderna.
- **PostgreSQL**: Base de datos relacional robusta.
- **JWT**: JSON Web Tokens para autenticación stateless.

### DevOps
- **Docker & Docker Compose**: Orquestación de contenedores.

---

## 🚀 Instalación y Uso

### Prerrequisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y corriendo.

### Despliegue Rápido (Recomendado)

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/AdrianC1530/DeliveryApp_FullStack.git
    cd DeliveryApp_FullStack
    ```

2.  **Levantar la aplicación**:
    Ejecuta el siguiente comando en la raíz del proyecto:
    ```bash
    docker-compose up --build
    ```
    *Este comando descargará las imágenes, construirá los contenedores, ejecutará las migraciones de base de datos y poblará la base de datos con datos de prueba (Seed).*

3.  **Acceder a la Aplicación**:
    - **Cliente Principal**: [http://localhost:5173](http://localhost:5173)
    - **Panel Secundario**: [http://localhost:5174](http://localhost:5174)
    - **API Backend**: [http://localhost:3000](http://localhost:3000)

### 🔐 Credenciales de Acceso (Demo)

| Rol         | Email              | Contraseña |
| :---------- | :----------------- | :--------- |
| **Cliente** | `cliente@demo.com` | `123456`   |
| **Admin**   | `admin@demo.com`   | `123456`   |

---

## 📄 Estructura del Proyecto

```
DeliveryApp_FullStack/
├── 📂 backend/             # API Node.js + Express + Prisma
├── 📂 frontend-main/       # Cliente React + Tailwind + Framer Motion
├── 📂 frontend-secondary/  # Cliente Vue.js + Tailwind
├── 📄 docker-compose.yml   # Configuración de servicios Docker
└── 📄 README.md            # Documentación del proyecto
```

---

## 👤 Autor

Hecho con ❤️ y ☕ por **Adrian Carrillo**.

---
*© 2025 DeliveryApp System. Todos los derechos reservados.*
