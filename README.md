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

El procesador de softdelete se encarga de eliminar logicamente las entidades, entonces se realiza el cambio de que no se elimine el registro de la tabla, sino que se actualice el campo estado a false.

```php
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(),
        new Get(),
        new Put(),
        new Patch(),
        new Delete(processor: SoftDeleteProcessor::class) # Procesador modificado para borrado lógico
    ]
)]
```

## 5. Implementación de un Punto de Login (Autenticación para Usuarios y Administradores)

Para establecer un punto de login seguro dentro de la API Rest y permitir la autenticación y autorización se empleara por JWT.

Instale el paquete encargado de gestionar los tokens JWT:

```bash
composer require lexik/jwt-authentication-bundle
php bin/console lexik:jwt:generate-keypair #esto es para generar las claves publica y privada
```

los tokens se generaron en la carpeta config/jwt/

El enrutamiento y la protección de accesos se configuran en `config/packages/security.yaml`. Es donde realice la configuración de los usuarios y los roles para la aplicacion .

Se parametrizo el endpoint `/api/login_check` en el archivo `config/routes.yaml` para que el sistema utilice este para el login:

```yaml
# config/routes.yaml
api_login_check:
    path: /api/login_check
```
con esto nos puede generar un token para poder acceder a las apis protegidas.

Una vez aplicadas estas configuraciones, ya tenemos un punto de acceso plenamente funcional. Enviamos una solicitud `POST` directamente hacia `/api/login_check` con las credenciales correspondientes que se crearon en la base de datos. 

**Petición HTTP:**
```json
POST /api/login_check
Content-Type: application/json

{
  "email": "[EMAIL_ADDRESS]",
  "password": "[PASSWORD]"
}
```

**Respuesta Exitosa:**
```json
{
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI..."
}
```

Con el token brindado, cualquier cliente deberá añadir este Token a la cabecera HTTP (`Authorization: Bearer <TU_TOKEN>`) para enviar peticiones futuras a las entidades protegidas por API Platform.


# Documentación: Creación de Aplicación FRONTEND

