import { createFragment } from "../fragmentUtils";
import { FieldSelectionConfig } from "../types";

interface User {
  id: number;
  name: string;
  posts: {
    title: string;
    content: string;
    comments?: {
      text: string;
      author: {
        name: string;
        email: string;
      };
    }[];
  }[];
}

describe("createFragment", () => {
  it("should handle an empty configuration", () => {
    const emptyConfig: FieldSelectionConfig<User> = {};
    const fragment = createFragment<User>(emptyConfig)();
    expect(fragment).toBe(`

`);
  });

  it("should match the snapshot for a typical User fragment", () => {
    const userConfig: FieldSelectionConfig<User> = {
      id: true,
      name: true,
      posts: [
        {
          title: true,
          content: false,
        },
      ],
    };

    const fragment = createFragment<User>(userConfig)();
    expect(fragment).toMatchSnapshot();
  });

  it("should generate a correctly formatted GraphQL fragment string", () => {
    const userConfig: FieldSelectionConfig<User> = {
      id: true,
      name: true,
      posts: [
        {
          title: true,
          content: false,
        },
      ],
    };

    const fragment = createFragment<User>(userConfig)();

    const expectedFragment = `
  id
  name
  posts {
    title
  }
`;

    expect(fragment).toBe(expectedFragment);
  });

  it("should generate a correct GraphQL fragment string for deeply nested structures", () => {
    const userConfig: FieldSelectionConfig<User> = {
      id: true,
      name: true,
      posts: [
        {
          title: true,
          content: false,
          comments: [
            {
              text: true,
              author: {
                name: true,
                email: true,
              },
            },
          ],
        },
      ],
    };

    const fragment = createFragment<User>(userConfig)();

    const expectedFragment = `
  id
  name
  posts {
    title
    comments {
      text
      author {
        name
        email
      }
    }
  }
`;

    expect(fragment).toBe(expectedFragment);
  });

  it("should generate a correct GraphQL fragment string", () => {
    const userConfig: FieldSelectionConfig<User> = {
      id: true,
      name: true,
      posts: [
        {
          title: true,
          content: false,
        },
      ],
    };

    const fragment = createFragment<User>(userConfig)();
    expect(fragment).toContain("id");
    expect(fragment).toContain("name");
    expect(fragment).toContain("posts");
    expect(fragment).toContain("title");
    expect(fragment).not.toContain("content");
  });

  it("should return a FieldSelectionConfig when asFieldConfig is true", () => {
    const userConfig: FieldSelectionConfig<User> = {
      id: true,
      name: true,
      posts: [
        {
          title: true,
          content: false,
        },
      ],
    };

    const configResult = createFragment<User>(userConfig)(true);
    expect(configResult).toEqual(userConfig);
  });
  it("should allow reusing and extending the configuration object for different fragments", () => {
    const baseUserConfig: FieldSelectionConfig<User> = {
      id: true,
      name: true,
      posts: [
        {
          title: true,
          content: false,
          comments: [
            {
              text: true,
              author: {
                name: true,
                email: true,
              },
            },
          ],
        },
      ],
    };

    // Extend the base configuration to include the email field
    const extendedUserConfig = {
      ...baseUserConfig,
      email: true, // Add the email field to the fragment
    };

    const fragment = createFragment<User>(extendedUserConfig)();

    const expectedFragment = `
  id
  name
  posts {
    title
    comments {
      text
      author {
        name
        email
      }
    }
  }
  email
`;

    expect(fragment).toBe(expectedFragment);
  });
  it("should exclude fields set to false from the fragment", () => {
    const userConfig: FieldSelectionConfig<User> = {
      id: false, // Exclude this field
      name: true,
      posts: [
        {
          title: true,
          content: false, // Exclude this field
        },
      ],
    };

    const fragment = createFragment<User>(userConfig)();

    const expectedFragment = `
  name
  posts {
    title
  }
`;

    expect(fragment).toBe(expectedFragment);
  });
  it("should ignore undefined fields in the configuration", () => {
    const userConfig: FieldSelectionConfig<User> = {
      id: undefined, // Undefined should be ignored
      name: true,
      posts: undefined, // Undefined should be ignored
    };

    const fragment = createFragment<User>(userConfig)();

    const expectedFragment = `
  name
`;

    expect(fragment).toBe(expectedFragment);
  });
  it("should correctly merge two simple fragments", () => {
    const userConfig1: FieldSelectionConfig<User> = {
      id: true,
      name: true,
    };

    const userConfig2: FieldSelectionConfig<User> = {
      posts: [
        {
          title: true,
        },
      ],
    };

    const mergedConfig = {
      ...userConfig1,
      ...userConfig2,
    };

    const fragment = createFragment<User>(mergedConfig)();

    const expectedFragment = `
  id
  name
  posts {
    title
  }
`;

    expect(fragment).toBe(expectedFragment);
  });
  it("should correctly handle conflicting fields during merge", () => {
    const userConfig1: FieldSelectionConfig<User> = {
      id: true,
      name: true,
    };

    const userConfig2: FieldSelectionConfig<User> = {
      name: false, // Conflict: 'name' is true in userConfig1 and false in userConfig2
      posts: [
        {
          title: true,
          content: true,
        },
      ],
    };

    const mergedConfig = {
      ...userConfig1,
      ...userConfig2,
    };

    const fragment = createFragment<User>(mergedConfig)();

    const expectedFragment = `
  id
  posts {
    title
    content
  }
`;

    expect(fragment).toBe(expectedFragment);
  });
});
