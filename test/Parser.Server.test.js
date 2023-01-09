import Parser from "../src/Modules/Parser"

test("Test => Parser => Server => Normal", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--server',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens[0].name).toBe("server")
    expect(tokens.length).toBe(1)
});

test("Test => Parser => Server => Error", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--serverr',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens.length).toBe(0)
});