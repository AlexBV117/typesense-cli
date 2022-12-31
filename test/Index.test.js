import Parser from "../src/Modules/Parser"
import Index_Token from "../src/Modules/index"

test("Test => parser => Index => Normal", () => {
    const args = [
        '/home/sacha/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/sacha/scripts/typesense',
        '-i',
        'auto',
        '/home/user/typesense-cli/package.json',
        '[{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}, {"title":"testing","body":"the quick brown fox jumps over the lazy dog"}]',
        './package.json',
        '../typesense-cli/package.json',
        '{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}'
      ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    const token  = tokens[0]
    expect(token).toBe(Index_Token)
    expect(token.data.data_files.length).tobe(3)
    expect(token.data.data_raw.length).tobe(3)
    expect(token.data.append).toBeFalsy()
});

test("Test => parser => Index => Append",() => {
    const args = [
        '/home/sacha/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/sacha/scripts/typesense',
        '--append',
        'auto',
        '/home/user/typesense-cli/package.json',
        '[{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}, {"title":"testing","body":"the quick brown fox jumps over the lazy dog"}]',
        './package.json',
        '../typesense-cli/package.json',
        '{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}'
      ];
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    const token  = tokens[0]
    expect(token).toBe(Index_Token)
    expect(token.data.data_files.length).tobe(3)
    expect(token.data.data_raw.length).tobe(3)
    expect(token.data.append).toBeTruthy()
});

test("Test => parser => Index => Error", () => {
    const args = [
        '/home/sacha/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/sacha/scripts/typesense',
        '--append',
        'auto',
        '/home/user/typesense-cli/package.json',
        '[{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}, {"title":"testing","body":"the quick brown fox jumps over the lazy dog"}]',
        './package.json',
        '../typesense-cli/package',
        '{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}'
      ];
    expect(() => {const parser = new Parser(args)}).toThrow('Expected a valid file path or an array of JSON objects');
});
