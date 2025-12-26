
export interface DocuSealSubmitter {
  email: string;
  role?: string;
  name?: string;
}

export interface DocuSealSubmissionData {
  template_id: string;
  send_email: boolean;
  submitters: DocuSealSubmitter[];
}

export class DocuSealClient {
  private apiKey: string;
  private baseUrl = 'https://api.docuseal.com';

  constructor() {
    this.apiKey = process.env.DOCUSEAL_API_KEY || '';
    if (!this.apiKey) {
      console.warn('DOCUSEAL_API_KEY is not set');
    }
  }

  async createSubmission(data: DocuSealSubmissionData) {
    if (!this.apiKey) {
      throw new Error('DOCUSEAL_API_KEY is not configured');
    }

    try {
      console.log('DocuSeal Request:', JSON.stringify(data, null, 2));
      const response = await fetch(`${this.baseUrl}/submissions`, {
        method: 'POST',
        headers: {
          'X-Auth-Token': this.apiKey, // DocuSeal uses X-Auth-Token header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DocuSeal Error Response:', errorText);
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`DocuSeal API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        throw new Error(errorJson.message || errorJson.error || 'Failed to create submission');
      }

      return await response.json();
    } catch (error) {
      console.error('DocuSeal Submission Error:', error);
      throw error;
    }
  }

  /**
   * Helper to initialize a submission for a specific template
   */
  async initSigningSession(templateId: string, email: string, name?: string) {
    return this.createSubmission({
      template_id: templateId,
      send_email: false, // We create the signing session for embedding
      submitters: [
        {
          email,
          name,
          role: 'Signer', // Default role, adjust as per template
        },
      ],
    });
  }
}

export const docuSeal = new DocuSealClient();
