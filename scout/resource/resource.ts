import { hashSha1 } from "./utils/getFingerprint";

type Info = {
  description: string;
  tags: string[];
};

type Path = string;

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

type SHA1Hash = `sha1:${string}`;

// Resource should be generate from metadata



export interface Resource<C extends Config = Config> extends Metadata<string, C> {
  // 從 import.meta 裡面拿 default config
  // relative from root path
  entry: string;
  // human readable ID
  // id 用來給人類作識別
  id: ResourceId;
  // fingerprint 只和功能性「有關」，用來檢查功能有沒有變化
  // hash(type, config, entry, builded entry)
  // 
  fingerprint: SHA1Hash;
  gitHash: string;
}


const getId = (
  metadata: Metadata
): ResourceId => {
  return `${metadata.type}::${metadata.name}@${metadata.version}`
};

const getFingerPrint = (resource: Resource): string => {
  const buildedEntry = fingerprintBuild;
  const factors = {
    type: resource.type,
    config: resource.config,
    entry: resource.entry,
    buildedEntry,
  };

  return hashSha1(JSON.stringify(factors));
};

class Resource2 {
  // don't not modified it
  #metadata: Metadata;
  #id: ResourceId;
  #fingerprint: ResourceId;
  #sourceDir;
  constructor(
    metadata: Metadata,
    entryPath: Path,
    sourceFilePath: Path,
    fingerprint: string
    gitHash: string,
    builtAt: string,
    id: string,
  ) {
    this.#metadata = metadata;
    this.#id = getId(metadata);
  }
}