# PruebaTecnicaProyectos
Creación de prueba técnica para postulación a empresa del día 20/02/2026


# Documentación: Creación de Aplicación BACKEND

A continuación describo los pasos que realice para el levantamiento de este proyecto  paso por paso para demostrar lo realizado y que hice para montar todo el proyecto desde cero

## 1. Creacion de proyecto Backend

Ejecuto el comando `symfony new backend` para generar el proyecto de symfony con la estructura basica que se necesita, para tener el esqueleto del proyecto.

```bash
# desde la carpeta de trabajo principal
symfony new backend
```

### 1.1 Configuración inicial

- Ingresar al directorio `backend` y desues abre un servidor en localhost `http://localhost:8000` para la revision del proyecto:

  ```bash
  cd backend
  symfony serve
  ```

## 2. Creación de la Base de Datos

Para la creacion de base de datos utilice el .env para agregar la linea de mysql y poder crear la base de datos con el nombre sistema_proyecto

```bash
# ejemplo en .env
DATABASE_URL="mysql://root:@127.0.0.1:3306/sistema_proyecto?serverVersion=8.0.32&charset=utf8mb4"
```

Luego ejecute:

```bash
gitignore
# crear la base de datos vacía
php bin/console doctrine:database:create
```

## 3. Instalación de Paquetes Adicionales

Para realizar un desarrollo mas rapido instalare paquetes que me ayuden a crear controladores, migraciones, entidades y lo que se requiera.

```bash
composer require symfony/maker-bundle --dev
composer require symfony/orm-pack
composer require api #Comando para instalar api-platform para realizar ApiRest mas facilmente.
```

## 4. Creación de Entidades

Antes de realizar las entidades genere un MER (Modelo Entidad Relación)



Con el maker bundle genere las siguientes entidades

```bash
php bin/console make:entity
```

