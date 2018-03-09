export class CustomError implements Error {
    name: string;
    message: string;
    stack?: string;
    friendlyMessage: string;

    constructor(friendlyMessage: string, name?: string, message?: string, stack?: string) {
        this.friendlyMessage = friendlyMessage;
        this.name = name;
        this.message = message;
        this.stack = stack;
    }
}
