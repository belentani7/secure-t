# Seguridad

Este repositorio no contiene pesos binarios ni secretos. Los tokens de Hugging Face deben proporcionarse mediante `HF_TOKEN` en el entorno local y nunca deben escribirse en scripts, issues o commits.

Los modelos se ejecutan localmente dentro de un usuario sin privilegios de root. El servidor de inferencia no debe exponerse a Internet sin autenticación, límite de red y registro de accesos.

La generación de vídeo y el tutor son servicios separados. El tutor no puede ejecutar comandos del sistema directamente; las operaciones sobre repositorios deben pasar por una política de permisos, una rama temporal y tests.
