# Levanta la base de datos con Docker
start-db:
	docker-compose up -d

# Detiene la base de datos
stop-db:
	docker-compose down

# Corre el backend con nodemon desde la carpeta backend/
run-backend:
	cd backend && npm run dev

# Levanta todo junto: base de datos + backend
start-all: start-db run-backend
