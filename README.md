# Prueba tecnica bemaster parte 2

Este proyecto backend proporciona una plataforma para gestionar usuarios, subir videos y almacenarlos en Cloudinary. Utiliza MongoDB como base de datos para almacenar información de usuarios, videos, likes y comentarios.

## Instalaciónes

antes de realizar estos pasos y correr el proyecto, por favor tener instalado nodejs: [https://nodejs.org/en](https://nodejs.org/en)

1. Clona este repositorio: `git clone https://github.com/guille1999utp/bemaster-part-2.git`
2. Instala las dependencias del proyecto: `npm install`

## Uso Para correr el proyecto

1. Inicia el servidor: `npm start`
2. para poder ver todos los posibles enpoints y ver las rutas con su respectiva documentacion,puedes entrar a la siguiente ruta de un servidor swagger para poder tener mas informacion: [http://localhost:4000/api-docs/](http://localhost:4000/api-docs/)
3. tambien para poder probar los enpoints si te sientes mejor familiarizado con postman puedes ir al archivo raiz llamado "postman.json" y copiar el json y importarlo en tu postman para que te quede mas facil poder hacer las pruebas

## Uso Para correr el test unitario

1. se ejecuta el siguiente comando en la consola en el directorio raiz para empezar los test: `npm run test`