TESTS = test/*.js

REPORTER = nyan

test:
	@NODE_ENV=test mocha --reporter $(REPORTER) --ui tdd $(TESTS)

test-w:
	@NODE_ENV=test mocha --reporter $(REPORTER) --growl --ui tdd --watch $(TESTS)

.PHONY: test