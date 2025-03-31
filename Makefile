TARGET_IP?=100.104.44.59

dev-run:
	docker run \
		--rm \
		-it \
		--entrypoint sh \
		-u 1000:1000 \
		-p 3000:5173 \
		-v $(PWD):/app \
		--workdir /app \
		node:23-alpine

build:
	docker run \
		--rm \
		-v $(PWD):/app \
		-u 1000:1000 \
		-w /app \
		node \
		npm run build
	mkdir -p dist/static
	mv dist/* dist/static || true
	cp ./config/prod.json dist/static/settings.json
	CGO_ENABLED=0 GOARCH=arm64 go build -o dist/server ./

.PHONY: build

deploy:
	scp -r dist/* "kiosk@$(TARGET_IP)":/home/kiosk/frontend/
