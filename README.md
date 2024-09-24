# Typed GraphQL Fragments

Typed GraphQL Fragments is a TypeScript utility for generating strongly-typed GraphQL fragments from configuration objects. This package allows you to define your GraphQL fragment selections using TypeScript types, ensuring that your fragments remain consistent with your data models.

## Features

- **Type Safety**: Define your GraphQL fragments using TypeScript types, reducing the risk of errors and ensuring that your fragments align with your backend models.
- **Flexible Configuration**: Easily configure which fields to include in your fragments, even for deeply nested structures.
- **Convenient Utilities**: Provides a simple API for generating both fragment strings and configuration objects for GraphQL queries.

## Installation

You can install this package via npm:

```bash
npm install typed-graphql-fragments
```

Or with Yarn:

```bash
yarn add typed-graphql-fragments
```

## Usage

Here's a quick example of how to use Typed GraphQL Fragments:

```typescript
import { createFragment, FieldSelectionConfig } from 'typed-graphql-fragments';

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
console.log(fragment);
This would output:

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
```

## Generating a Configuration Object

If you want to generate a configuration object instead of a string, you can do so by passing true to the `asFieldConfig` parameter:

```typescript
const configResult = createFragment<User>(userConfig)(true);
console.log(configResult);
```

This will output the original `userConfig` object, , useful for cases where you might want to reuse or manipulate the configuration.

### Why Use a Configuration Object?

Creating a configuration object can be particularly useful when you want to reuse fragments across different queries or mutate the configuration dynamically. Here’s how this might look:

```typescript
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

// Reuse the base userConfig for a different fragment
const extendedUserConfig = {
  ...userConfig,
  email: true, // Add additional fields
};

const fragment = createFragment<User>(extendedUserConfig)();
console.log(fragment);

```

## API Reference

`createFragment<T>(config: FieldSelectionConfig<T>)`

Parameters:

`config`: An object defining which fields to include in the fragment.

Returns:

A function that, when called, generates either a GraphQL fragment string or the original configuration object, depending on whether asFieldConfig is true or false.

`FieldSelectionConfig<T>`: A TypeScript type representing the configuration object used to define field selections in a fragment.

## Contributing

Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (`git checkout -b feature-branch`).
Make your changes.
Commit your changes (`git commit -m 'Add new feature'`).
Push to the branch (`git push origin feature-branch`).
Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for more details.

```markdown
### Explanation:

- **Title and Introduction:** Gives a clear overview of what the package does and its main benefits.
- **Features:** Highlights the key features of the package.
- **Installation:** Provides installation instructions for both npm and Yarn.
- **Usage:** Includes a usage example that demonstrates how to use the main features of the package.
- **API Reference:** Briefly describes the main functions and types provided by the package.
- **Contributing:** Outlines the steps for contributing to the project.
- **License:** Specifies the license under which the project is distributed.
```