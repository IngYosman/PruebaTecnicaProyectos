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

https://www.drawdb.app/editor?shareId=7a95e36ffb6a4b3c3ba015a3ad88de3a

![MER](files/)

Ya credo y diseñado el MER se puede realizar la creacion de las entidades y las migraciones.

Con el maker bundle genere las siguientes usuarios y entidades

```bash
php bin/console make:user #Con el nombre Usuario
```
Despues de crear los campos, cree unos Traits para la realizacion de auditoria, esto lo realizo para utilizarlos en cualquier entidad y que la entidad quede mas limpia para no repetir codigo.

```txt
  BlameableTrait
  SoftDeleteTrait
  TimestampableTrait
```

ahora creo las demas entidades:

```bash
php bin/console make:entity Proyecto
php bin/console make:entity Tarifa
php bin/console make:entity UsuarioProyecto
php bin/console make:entity TareaEstado
php bin/console make:entity Tarea
```

Despues de esto se Realiza la creacion de la migracion con siguiente comando:


```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

Ya teniendo las tablas en base de datos ahora se puede realizar el api con API PLATFORM.


## 4. Creación APIS CON APIPLATFORM
Se realiza la implementacion de API SOURSE EN LAS ENTIDADES


