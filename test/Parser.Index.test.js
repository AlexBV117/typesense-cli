import Parser from "../src/Modules/Parser"

test("Test => parser => Index => Normal", () => {
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
  expect(token.name).toBe("index")
  expect(token.data.data_files.length).toBe(3);
  expect(token.data.data_raw.length).toBe(3);
  expect(token.data.append).toBeFalsy();
});

test("Test => parser => Index => Append", () => {
  const args = [
    '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
    '/home/user/scripts/typesense',
    '--append',
    'auto',
    '/home/user/typesense-cli/package.json',
    '[{"title":"testing","body:the quick brown fox jumps over the lazy dog}, {title:testing,body:the quick brown fox jumps over the lazy dog", "nested":{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}}]',
    './package.json',
    '../typesense-cli/package.json',
    '{"title":"testing","body":"the quick brown fox jumps over the lazy dog", "nested":{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}}'
  ];
  const parser = new Parser(args);
  const tokens = parser.getTokens();
  const token = tokens[0];
  expect(token.name).toBe("index")
  expect(token.data.data_files.length).toBe(3);
  expect(token.data.data_raw.length).toBe(3);
  expect(token.data.append).toBeTruthy();
});

test("Test => parser => Index => Error", () => {
  const args = [
    '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
    '/home/user/scripts/typesense',
    '--append',
    'auto',
    '/home/user/typesense-cli/package.json',
    '[{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}, {"title":"testing","body":"the quick brown fox jumps over the lazy dog"}]',
    './package.json',
    '../typesense-cli/package',
    '{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}'
  ];
  const parser = new Parser(args);
  const tokens = parser.getTokens();
  expect(tokens.length).toBe(0)
});

test("Test => parser => Index => Index and Append", () => {
  const args = [
    '/home/user/.fnm/node-versions/v18.12.1/installation/bin/node',
    '/home/user/scripts/typesense',
    '-i',
    'auto',
    '/home/user/typesense-cli/package.json',
    '[{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}, {"title":"testing","body":"the quick brown fox jumps over the lazy dog"}]',
    './package.json',
    '../typesense-cli/package.json',
    '{"title":"testing","body":"the quick brown fox jumps over the lazy dog"}',
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
  expect(tokens.length).toBe(2)
  expect(tokens[0].name).toBe("index")
  expect(tokens[0].data.append).toBeFalsy()
  expect(tokens[1].name).toBe("index")
  expect(tokens[1].data.append).toBeTruthy()
});