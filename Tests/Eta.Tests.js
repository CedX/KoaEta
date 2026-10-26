import {createServer} from "node:http";
import app from "../Examples/Server.js";
import pkg from "../package.json" with {type: "json"};

/**
 * Tests the features of the {@link render} and {@link renderPdf} functions.
 */
describe("eta()", () => {
	const server = createServer(app.callback()); // eslint-disable-line @typescript-eslint/no-misused-promises
	after(done => server.close(done));

	let url = new URL("http://127.0.0.1:0/");
	before(done => server.listen({host: url.hostname, port: Number(url.port)}, () => {
		const {address, port} = /** @type {import("node:net").AddressInfo} */ (server.address());
		url = new URL(`http://${address}:${port}/`);
		done();
	}));

	context("render()", () => {
		it("should have been added to the application context", () =>
			(typeof app.context.render).should.equal("function"));

		it("should render a view as HTML page", async function() {
			this.timeout(5_000);

			const response = await fetch(url, {headers: {accept: "text/html"}});
			(response.headers.get("content-type") ?? "").should.equal("text/html; charset=utf-8");
			response.status.should.equal(200);

			const body = await response.text();
			body.startsWith("<!doctype html>").should.be.true;
			body.should.include("<title>Eta for Koa</title>");
			body.should.include(`<b>${pkg.version}</b>`);
			body.trimEnd().endsWith("</html>").should.be.true;
		});
	});

	context("renderPdf()", () => {
		it("should have been added to the application context", () =>
			(typeof app.context.renderPdf).should.equal("function"));

		it("should render a view as PDF document", async function() {
			this.timeout(15_000);

			const response = await fetch(url, {headers: {accept: "application/pdf"}});
			(response.headers.get("content-type") ?? "").should.equal("application/pdf");
			response.status.should.equal(200);

			const body = await response.text();
			body.startsWith("%PDF-").should.be.true;
			body.should.include("/Title (Eta for Koa)");
			body.trimEnd().endsWith("%%EOF").should.be.true;
		});
	});
});
