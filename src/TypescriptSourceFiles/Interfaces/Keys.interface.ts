export default interface Keys_Token {
    name: "key",
    data: {
        actions?: string[],
        collections?: string[]
        description?: string,
        value?: string,
        expiresAt?: string,
        id: number
    }
    new: boolean,
    remove: boolean
}