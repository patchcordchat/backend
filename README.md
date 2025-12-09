<div align="center">
    <h1>Patchcord Backend</h1>
</div>

## Руководство по разработке

### **📋 Перед началом работы вам необходимо установить:**

- Docker
- Docker Compose (или Docker с Compose V2)
- make (для удобства, но команды можно запускать и вручную)

### **⚙️ Настройка**

1. Клонируйте репозиторий:

    ```bash
    git clone https://github.com/patchcordchat/backend.git patchcord-backend
    cd patchcord-backend
    ```

2. Создайте файл `.env`

    Создайте файл .env в корневом каталоге проекта для хранения переменных окружения, таких как порты и учетные данные базы данных.

    ```yaml
    # Server
    SERVER_PORT=3000

    # Crypto
    APP_KEY=change-me

    # MongoDB
    MONGO_HOST=mongodb
    MONGO_PORT=27017
    MONGO_DATABASE=patchcord
    MONGO_USERNAME=patchcord
    MONGO_PASSWORD=change-me

    # Redis
    REDIS_HOST=redis
    REDIS_PORT=6379
    ```

3. Запустите окружение:

    ```bash
    make up
    # Или вручную: docker compose -f compose.dev.yml up -d
    ```

    Будут запущены три сервиса:
    - api: NodeJS-сервер в режиме nodemon с горячей перезагрузкой.
    - mongodb: Контейнер MongoDB.
    - redis: Контейнер Redis.

### 🟢 Полезные Команды

Все команды используют конфигурацию разработки (compose.dev.yml).

|Команда make|Docker Compose Эквивалент|Описание|
| -------------- | ------------------------------ | ------------------------------------------- |
| `make up`      | `$(DC_DEV) up -d`              | Запуск всех сервисов в фоновом режиме.         |
| `make down`    | `$(DC_DEV) down`               | Остановка и удаление контейнеров.              |
| `make restart` | `make down && make up`         | Перезапуск окружения.                         |
| `make logs`    | `$(DC_DEV) logs -f`            | Просмотр логов всех сервисов в реальном времени.|
| `make shell`   | `$(DC_DEV) exec api /bin/bash` | Вход в оболочку (shell) контейнера api.       |
| `make build`   | `$(DC_DEV) build`              | Пересборка Docker-образов для разработки.      |
| `make help`    | `@echo ...`                    | Выводит список доступных команд.               |

### 🔬 Скрипты NPM

Вы также можете использовать стандартные NPM-скрипты внутри контейнера:

- `npm run build`: Компиляция TypeScript в JavaScript (tsc && tsc-alias).
- `npm run start`: Сборка и запуск скомпилированного кода (node ./dist/server.js).
- `npm run dev`: Запуск с nodemon (используется в Docker Compose).
- `npm run lint`: Запуск линтера (ESLint).
- `npm run test`: Запуск тестов (Jest).
- `npm run test:watch`: Запуск тестов в режиме отслеживания изменений.