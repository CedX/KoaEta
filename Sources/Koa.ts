import type {RenderingOptions} from "./Eta.ts";
import type {PdfOptions} from "./Playwright.ts";

/**
 * Declaration merging.
 */
declare module "koa" {

	/**
	 * The request context.
	 */
	interface ExtendableContext {

		/**
		 * Renders the specified view.
		 * @param view The view name.
		 * @param locals The data that should be made available in the view.
		 * @param options The rendering options.
		 * @returns The rendering result.
		 */
		render: (view: string, locals?: object, options?: RenderingOptions) => Promise<string>;

		/**
		 * Renders the specified view as a PDF document.
		 * @param view The view name.
		 * @param locals The data that should be made available in the view.
		 * @param options The rendering options.
		 * @returns The rendering result.
		 */
		renderPdf: (view: string, locals?: object, options?: PdfOptions & RenderingOptions) => Promise<Buffer>;
	}
}
