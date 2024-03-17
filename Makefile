build:
	docker build -t make-migrations -f Dockerfile-mm .
	docker build -t migrate-up -f Dockerfile-mu .

CMD = makemigration

makemigration:
	docker run -e CMD=$(CMD) -v ./internal/db/migrations:/app make-migrations
	
migrateup:
	docker run -v ./internal/db/migrations:/migrations --network host migrate-up


docker:
	docker-compose up --build