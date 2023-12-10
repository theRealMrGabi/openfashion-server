import * as postmark from 'postmark'
import config from '../config'

const client = new postmark.ServerClient(config.POSTMARK_SERVER_API_KEY)

export class MailBuilder {
	private emailRecipient: string = ''
	private emailSubject: string = ''
	private htmlContent: string = ''
	private variables: Record<string, unknown> = {}

	constructor() {}

	/**
	 * Sets the recipient email address.
	 * @param email
	 */
	recipient(email: string): this {
		this.emailRecipient = email
		return this
	}

	/**
	 * Sets the email subject line.
	 * @param subject The email subject line.
	 */
	subject(subject: string): this {
		this.emailSubject = subject
		return this
	}

	/**
	 * Sets the email HTML content.
	 * @param html The email HTML content.
	 */
	html(html: string): this {
		this.htmlContent = html
		return this
	}

	/**
	 * Adds a variable to be used in the email template.
	 * @param key The variable name.
	 * @param value The variable value.
	 */
	variable(key: string, value: unknown): this {
		this.variables[key] = value
		return this
	}

	async send(): Promise<void> {
		if (!this.recipient) {
			throw new Error('Missing recipient email address.')
		}

		if (!this.subject) {
			throw new Error('Missing email subject.')
		}

		if (!this.html) {
			throw new Error('Missing email HTML content.')
		}

		try {
			await client.sendEmail({
				From: config.MAIL_SENDER_EMAIL,
				To: this.emailRecipient,
				Subject: this.emailSubject,
				HtmlBody: this.htmlContent
			})
		} catch (error) {
			throw new Error(`Failed to send email: ${error}`)
		}
	}
}
