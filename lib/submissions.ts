import type { Submission } from "./submission-types";

export function readSubmissions(): Submission[] {
  return [];
}

export function writeSubmissions(_submissions: Submission[]): void {}

export function addSubmission(_data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Submission {
  return {
    id: "",
    name: "",
    email: "",
    subject: "",
    message: "",
    timestamp: "",
  };
}

export function deleteSubmission(_id: string): boolean {
  return false;
}

export function archiveSubmission(_id: string, _archived = true): boolean {
  return false;
}
