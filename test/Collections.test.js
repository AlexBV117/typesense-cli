import Parser from "../src/Modules/Parser"

test("Test => Parser => Collection => Normal", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--collections',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    const token = tokens[0];
    expect(token.name).toBe("collection");
    expect(token.data.new).toBeFalsy();
    expect(token.data.remove).toBeFalsy();
    expect(token.data.name.length).toBe(0);
    expect(tokens.length).toBe(1);
});

test("Test => Parser => Collection => New", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--collections',
        'new',
        'forums'
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    const token = tokens[0];
    expect(token.name).toBe("collection");
    expect(token.data.new).toBeTruthy();
    expect(token.data.remove).toBeFalsy();
    expect(token.data.name.length).toBe(1);
    expect(tokens.length).toBe(1);
});

test("Test => Parser => Collection => Remove", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--collections',
        'remove',
        'auto'
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    const token = tokens[0];
    expect(token.name).toBe("collection");
    expect(token.data.new).toBeFalsy();
    expect(token.data.remove).toBeTruthy();
    expect(token.data.name.length).toBe(1);
    expect(tokens.length).toBe(1);
});

test("Test => Parser => Collection => Error Conflict", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--collections',
        'new',
        'remove'
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens.length).toBe(0);
});