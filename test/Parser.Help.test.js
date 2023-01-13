import Parser from "../src/Modules/Parser"

test("Test => Parser => Help => Normal", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--help',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens[0].name).toBe("help");
    expect(tokens.length).toBe(1);
});

test("Test => Parser => Help => Shorthand", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '-h',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens[0].name).toBe("help");
    expect(tokens.length).toBe(1);
});

test("Test => Parser => Help => Error Name", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--helps',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens.length).toBe(0);
});
