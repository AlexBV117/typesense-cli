import Parser from "../src/Modules/Parser"

test("Test => Parser => Schemas => Normal", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--schemas',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens[0].name).toBe("schemas")
    expect(tokens.length).toBe(1)
});

test("Test => Parser => Schemas => Shorthand", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '-s',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens[0].name).toBe("schemas")
    expect(tokens.length).toBe(1)
});

test("Test => Parser => Schemas => Error", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--schema',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens.length).toBe(0)
});