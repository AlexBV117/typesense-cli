import Parser from "../src/Modules/Parser";
import Index from "../src/Modules/Index-files";

beforeAll(() => {
    const args = [
        '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
        '/home/user/scripts/typesense',
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
    const token = tokens[0];
});

test.todo("Test => Function => Index => Normal");