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
});
