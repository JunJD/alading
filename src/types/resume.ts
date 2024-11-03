import { Industry } from "./interview";

export interface ResumeInfo {
  name?: string;
  age?: number;
  text?: string;
  industry?: Industry;
  pdfBase64?: string;
} 