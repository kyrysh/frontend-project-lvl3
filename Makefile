install:
	npm install

lint:
	npx eslint .

fix:
	npx eslint . --fix

serve:
	npx webpack serve