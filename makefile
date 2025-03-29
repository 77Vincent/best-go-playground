# local dev
client:
	cd client && npm run dev

# for backend
log:
	docker logs -f go-sandbox-server
exec:
	docker exec -it go-sandbox-server /bin/sh
server:
	docker-compose up -d
build:
	docker-compose build server
down:
	docker-compose down --volumes --remove-orphans

.PHONY: client server down build
