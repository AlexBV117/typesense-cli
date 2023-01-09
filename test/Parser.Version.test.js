import Parser from "../src/Modules/Parser"

test("Test => Parser => Version => Normal", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--version',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens[0].name).toBe("version")
    expect(tokens.length).toBe(1)
});

test("Test => Parser => Version => Shorthand", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '-v',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens[0].name).toBe("version")
    expect(tokens.length).toBe(1)
});

test("Test => Parser => Version => Error", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--verrsion',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens.length).toBe(0)
});