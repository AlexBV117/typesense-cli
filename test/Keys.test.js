import Parser from "../src/Modules/Parser"

test("Test => Parser => Keys => Shortened", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '-k',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    const token = tokens[0];
    expect(token.name).toBe("key");
    expect(token.data.new).toBeFalsy();
    expect(token.data.remove).toBeFalsy();
    expect(tokens.length).toBe(1);
});

test("Test => Parser => Keys => Normal new args", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--key',
        'new',
        'actions="[collections:get, documents:get]"',
        'collections="[auto]"',
        'description="test key that wont break the parser"',
        'value="Ek?eLs@#ze$8N4gN"',
        'expiresAt="01/01/1000000"',
        'id="69420"',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    const token = tokens[0];
    expect(token.name).toBe("key");

    expect(token.data.actions).toContain("collections:get");
    expect(token.data.actions).toContain("documents:get");
    expect(token.data.actions.length).toBe(2);

    expect(token.data.collections).toContain("auto");
    expect(token.data.collections.length).toBe(1);

    expect(token.data.description).toBe("test key that wont break the parser");
    
    expect(token.data.value).toBe("Ek?eLs@#ze$8N4gN");
    
    expect(token.data.id).toBe(69420);

    expect(token.data.new).toBeTruthy();
    expect(token.data.remove).toBeFalsy();
    expect(tokens.length).toBe(1);
});

test("Test => Parser => Keys => remove", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '-k',
        'remove',
        'id=69420'
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    const token = tokens[0];
    expect(token.name).toBe("key");
    expect(token.data.new).toBeFalsy();
    expect(token.data.remove).toBeTruthy();
    expect(token.data.id).toBe(69420);
    expect(tokens.length).toBe(1);
});

test("Test => Parser => Keys => Error conflict", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '-k',
        'new',
        'remove'
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens()
    expect(tokens.length).toBe(0);
});

test("Test => Parser => Keys => Error spelling mistake", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--key',
        'new',
        'actions="[collections:get, documents:get]"',
        'collections="[auto]"',
        'description="test key that wont break the parser"',
        'value="Ek?eLs@#ze$8N4gN"',
        'id="sixty nine"',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens.length).toBe(0);
});

test("Test => Parser => Keys => Error unknown var", () => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
        '--key',
        'new',
        'actions="[collections:get, documents:get]"',
        'collections="[auto]"',
        'description="test key that wont break the parser"',
        'values="Ek?eLs@#ze$8N4gN"',
        'id="42069"',
    ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    expect(tokens.length).toBe(0);
});
