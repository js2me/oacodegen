export interface FileSystem {
  isExist(path: string): boolean;
  isDir(path: string): boolean;
  isFile(path: string): boolean;
  writeFile(path: string, content: string): void;
  readFile(path: string): string;
}
