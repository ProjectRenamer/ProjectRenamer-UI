export class GenerateProjectRequest {
    repositoryLink: string;
    renamePairs: KeyValuePair<string, string>[] = [];
    branchName: string = 'master';
    userName: string;
    password: string;
}

export class KeyValuePair<T1, T2>
{
    key: T1;
    value: T2;
}