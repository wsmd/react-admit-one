const INITIAL_ENV_VALUES: { [key: string]: string | undefined } = {};

export function setEnvironmentVariable(name: string, value: string) {
  if (!(name in INITIAL_ENV_VALUES)) {
    INITIAL_ENV_VALUES[name] = process.env[name];
  }
  Object.defineProperty(process.env, name, { value });
  return restoreEnvironmentVariable.bind(null, name);
}

export function restoreEnvironmentVariable(name: string) {
  const original = INITIAL_ENV_VALUES[name];
  if (!(name in INITIAL_ENV_VALUES)) {
    throw new Error(
      `Cannot restore environment variable "${name}". ` +
        `The environment variable must be set using "setEnvironmentVariable" ` +
        `before it can be reset`,
    );
  }
  Object.defineProperty(process.env, name, { value: original });
}

export function setEnvironmentForAllTests(name: string, value: string) {
  beforeAll(() => setEnvironmentVariable(name, value));
  afterAll(() => restoreEnvironmentVariable(name));
}

export function createConsoleSpy(method: keyof Console, impl = () => {}) {
  const spy = jest
    .spyOn(global.console, method as any)
    .mockImplementation(impl);
  return spy;
}

export function mockConsoleErrorForEachTest() {
  let spy: jest.SpyInstance;
  beforeEach(() => {
    spy = createConsoleSpy('error');
  });
  afterEach(() => spy.mockRestore());
}
