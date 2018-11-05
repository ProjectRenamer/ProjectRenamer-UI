import { KeyValuePair } from "./generate-project--over-zip-request";

export class GenerateProjectOverGitRequest {
    repositoryLink: string;
    renamePairs: KeyValuePair<string, string>[] = [];
    branchName = 'master';
    userName: string;
    password: string;
}


