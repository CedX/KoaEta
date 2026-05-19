import {Eta, type EtaConfig} from "eta";
import type {Context, default as Koa} from "koa";
import type {LaunchOptions} from "playwright-core";
import {htmlToPdf, type PdfOptions} from "./Playwright.js";

/**
 * Attaches a view renderer to the context of the specified application.
 * @param application The application instance.
 * @param rendererOptions The renderer options.
 * @returns The newly created view renderer.
 */
export function eta(application: Koa, rendererOptions: RendererOptions = {}): Eta {
	const renderer = new Eta(rendererOptions);

	/**
	 * Renders the specified view.
	 * @param view The view name.
	 * @param locals The data that should be made available in the view.
	 * @param renderingOptions The rendering options.
	 * @returns The rendering result.
	 */
	async function render(this: Context, view: string, locals: object = {}, renderingOptions: RenderingOptions = {}): Promise<string> {
		const data = {...this.state, ...locals};
		const html = await (renderingOptions.async ? renderer.renderAsync(view, data) : Promise.resolve(renderer.render(view, data)));

		if (renderingOptions.writeResponse ?? true) {
			this.body = html;
			this.type = "html";
		}

		return html;
	}

	/**
	 * Renders the specified view as a PDF document.
	 * @param view The view name.
	 * @param locals The data that should be made available in the view.
	 * @param renderingOptions The rendering options.
	 * @returns The rendering result.
	 */
	async function renderPdf(this: Context, view: string, locals: object = {}, renderingOptions: PdfOptions & RenderingOptions = {}): Promise<Buffer> {
		const data = {...this.state, ...locals};
		const html = await (renderingOptions.async ? renderer.renderAsync(view, data) : Promise.resolve(renderer.render(view, data)));

		const pdf = await htmlToPdf(html, {browser: rendererOptions.browser, pdf: renderingOptions});
		if (renderingOptions.writeResponse ?? true) {
			this.body = pdf;
			this.type = "pdf";
		}

		return pdf;
	}

	// Attach the rendering functions to the application context.
	Object.defineProperties(application.context, {
		render: {value: render},
		renderPdf: {value: renderPdf}
	});

	return renderer;
}

/**
 * Defines the renderer options.
 */
export type RendererOptions = Partial<EtaConfig & {

	/**
	 * The launch options for the browser used to render PDF documents.
	 */
	browser: LaunchOptions;
}>;

/**
 * Defines the rendering options.
 */
export type RenderingOptions = Partial<{

	/**
	 * Value indicating whether the template is asynchronous.
	 */
	async: boolean;

	/**
	 * Value indicating whether to write the rendering result to the response.
	 */
	writeResponse: boolean;
}>;
