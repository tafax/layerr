import {
  Tree,
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  joinPathFragments,
  generateFiles,
} from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

export default async function (tree: Tree, schema: any) {
  await libraryGenerator(tree, { name: schema.name });

  tree.delete(`packages/${schema.name}/tsconfig.spec.json`);
  tree.delete(`packages/${schema.name}/src/lib/${schema.name}.spec.ts`);

  const jestConfigFilePath = `packages/${schema.name}/jest.config.js`;
  const jestConfigInput = tree.read(jestConfigFilePath).toString();
  const jestConfigOutput = jestConfigInput.replace('.spec.', '.test.');
  tree.write(jestConfigFilePath, jestConfigOutput);

  const tsConfigFilePath = `packages/${schema.name}/tsconfig.json`;
  const tsConfigInput = JSON.parse(
    tree.read(tsConfigFilePath)
      .toString()
      .replace('.spec.', '.test.')
  );
  tsConfigInput.references.push(
    {
      "path": "./tsconfig.test.editor.json"
    }
  );
  const tsConfigOutput = JSON.stringify(tsConfigInput);
  tree.write(tsConfigFilePath, tsConfigOutput);

  const projectConfiguration = readProjectConfiguration(tree, schema.name);
  generateFiles(
    tree, // the virtual file system
    joinPathFragments(__dirname, './files'), // path to the file templates
    projectConfiguration.root, // destination path of the files
    schema // config object to replace variable in file templates
  );
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
