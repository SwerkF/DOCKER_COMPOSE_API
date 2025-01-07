import fs from 'fs';
import path from 'path';
import handlebars, { TemplateDelegate } from 'handlebars';

class TemplateService {
  private templateDir: string;

  constructor(templateDir: string) {
    this.templateDir = templateDir;
    this.registerPartials();
  }

  /**
   * Registers common partial templates (e.g., header, footer).
   */
  private registerPartials(): void {
    const partialsDir = path.join(this.templateDir, 'components');

    const headerPath = path.join(partialsDir, 'header.html');
    const footerPath = path.join(partialsDir, 'footer.html');

    try {
      if (fs.existsSync(headerPath)) {
        const headerTemplate = fs.readFileSync(headerPath, 'utf8');
        handlebars.registerPartial('HeaderEmail', headerTemplate);
      }

      if (fs.existsSync(footerPath)) {
        const footerTemplate = fs.readFileSync(footerPath, 'utf8');
        handlebars.registerPartial('FooterEmail', footerTemplate);
      }
    } catch (error) {
      console.error('Error registering partial templates:', error);
    }
  }

  /**
   * Loads a Handlebars template from the file system.
   * @param templateName - The name of the template file (without extension).
   * @returns A compiled Handlebars template function.
   */
  private loadTemplate(templateName: string): TemplateDelegate {
    const templatePath = path.join(this.templateDir, `${templateName}.html`);

    try {
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file ${templateName}.html not found in ${this.templateDir}`);
      }

      const source = fs.readFileSync(templatePath, 'utf8');
      return handlebars.compile(source);
    } catch (error) {
      console.error('Error loading template:', error);
      throw error;
    }
  }

  /**
   * Renders a Handlebars template with the provided data.
   * @param templateName - The name of the template file (without extension).
   * @param data - An object containing data to inject into the template.
   * @returns The rendered HTML string.
   */
  public renderTemplate(templateName: string, data: Record<string, any>): string {
    try {
      const template = this.loadTemplate(templateName);
      return template(data);
    } catch (error) {
      console.error(`Error rendering template ${templateName}:`, error);
      throw error;
    }
  }

  /**
   * Optional: Prepares a Tailwind-compatible template by processing styles.
   * This requires an additional library like `inline-css` or a Tailwind preprocessor.
   * @param html - The HTML content to process.
   * @returns The processed HTML with inline styles.
   */
  public processWithTailwind(html: string): string {
    // Integration with a tool like Maizzle or inline-css can be added here.
    return html; // Placeholder for now.
  }
}

export default TemplateService;
