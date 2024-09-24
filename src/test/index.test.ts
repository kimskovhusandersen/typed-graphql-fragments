import { createFragment, FieldSelectionConfig } from "../src";

interface User {
  id: number;
  name: string;
  posts: {
    title: string;
    content: string;
  }[];
}

const userConfig: FieldSelectionConfig<User> = {
  id: true,
  name: true,
  posts: {
    title: true,
    content: false, // we don't want content
  },
};

const fragment = createFragment(userConfig)();
console.log(fragment);
