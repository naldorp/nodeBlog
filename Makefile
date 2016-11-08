REPORTER = spec
MOCHA_OPTS = --ui bdd -c
PORT_ENV = 3000
test:
	clear
	NODE_ENV=test PORT=$(PORT_ENV) \
	./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	tests/*.js
	
.PHONY: test