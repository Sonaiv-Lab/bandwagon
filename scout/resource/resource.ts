type Info = {
  description: string;
  tags: string[];
};

export type Version = `${number}.${number}.${number}`;

type Config = Record<string, any>;

type TypeName = string;
type ResourceName = string;

export interface Metadata<
  TName extends TypeName = TypeName,
  ResourceTypeConfig extends Config = Config
> {
  readonly type: TName;
  name: ResourceName;
  version: Version;
  config: ResourceTypeConfig;
  info: Info;
}

type ResourceId = `${TypeName}::${ResourceName}@${Version}`;

type BundleHash = string;
type GitHash = string;
type Fingerprint = string;
type FilePathFromRoot = string;
type ISODateString = string;

// Resource should be generate from metadata

export interface ResourceInfo<TMetaData extends Metadata> {
  metadata: TMetaData;
  id: ResourceId;
  gitHash: GitHash;
  bundledHash: BundleHash;
  fingerPrint: Fingerprint;
  resourcePath: FilePathFromRoot;
  entryPath: FilePathFromRoot;
  buildAt: ISODateString;
}

/**
 * - 未來可能會在這裡面新增各種 lifecycle
 * - resource 可能是靜態的東西，也可能是動態的 function，就看外面怎麼用
 */
export class Resource<TMetaData extends Metadata, TResource> {
  #info: ResourceInfo<TMetaData>;
  #resource: TResource;

  constructor(info: ResourceInfo<TMetaData>, resource: TResource) {
    this.#info = info;
    this.#resource = resource;

    this.#init();
  }

  #init() {
    // todo，作一些 logger, error handler 等等的 init，然後有一部分也可以由外面注入
  }

  get id() {
    return this.#info.id;
  }
  get metadata() {
    return this.#info.metadata;
  }

  use(): TResource {
    return this.#resource;
  }
}
