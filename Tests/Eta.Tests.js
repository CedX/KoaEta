import {equal, ok} from "node:assert/strict";
import {createServer} from "node:http";
import {after, before, describe, it} from "node:test";
import app from "../Examples/Server.js";
import pkg from "../package.json" with {type: "json"};

/**
 * Tests the features of the {@link render} and {@link renderPdf} functions.
 */
describe("eta()", () => {
	const controller = new AbortController;
	after(() => controller.abort());

	let url = new URL("http://127.0.0.1:0/");
	const listenOptions = {host: url.hostname, port: Number(url.port), signal: controller.signal};
	const server = createServer(app.callback()); // eslint-disable-line @typescript-eslint/no-misused-promises
	before(() => /** @type {Promise<void>} */ (new Promise(resolve => server.listen(listenOptions, () => {
		const {address, port} = /** @type {import("node:net").AddressInfo} */ (server.address());
		url = new URL(`http://${address}:${port}/`);
		resolve();
	}))));

	describe("render()", () => {
		it("should have been added to the application context", () =>
			ok(typeof app.context.render == "function"));

		it("should render a view as HTML page", async () => {
			const response = await fetch(url, {headers: {accept: "text/html"}});
			equal(response.headers.get("content-type"), "text/html; charset=utf-8");
			equal(response.status, 200);

			const body = await response.text();
			ok(body.startsWith("<!doctype html>"));
			ok(body.includes("<title>Eta for Koa</title>"));
			ok(body.includes(`<b>${pkg.version}</b>`));
			ok(body.trimEnd().endsWith("</html>"))
		});
	});

	describe("renderPdf()", () => {
		it("should have been added to the application context", () =>
			ok(typeof app.context.renderPdf == "function"));

		it("should render a view as PDF document", async () => {
			const response = await fetch(url, {headers: {accept: "application/pdf"}});
			equal(response.headers.get("content-type"), "application/pdf");
			equal(response.status, 200);

			const body = await response.text();
			ok(body.startsWith("%PDF-"));
			ok(body.includes("/Title (Eta for Koa)"));
			ok(body.trimEnd().endsWith("%%EOF"));
		});
	});
});
