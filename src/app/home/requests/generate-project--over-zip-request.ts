export class GenerateProjectOverZipRequest {
    renamePairs: KeyValuePair<string, string>[] = [];
    file: File = null;
}

export class KeyValuePair<T1, T2> {
    key: T1;
    value: T2;
}
