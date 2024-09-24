import { createFragment } from "../fragmentUtils";
import { FieldSelectionConfig } from "../types";

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
  posts: [
    {
      title: true,
      content: false,
    },
  ],
};

const fragment = createFragment<User>(userConfig)();
console.log(fragment);
