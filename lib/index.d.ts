import { Project } from 'ts-morph';
export interface IProcessOptions {
    shortCircuitCondition?: string;
    debug: boolean;
}
export interface IGenerateOptions {
    paths?: ReadonlyArray<string>;
    project: string;
    processOptions: Readonly<IProcessOptions>;
}
export declare function generate({ paths, project: tsConfigFilePath, processOptions, }: Readonly<IGenerateOptions>): Promise<void>;
export declare function processProject(project: Project, options?: Readonly<IProcessOptions>): Promise<void>;
//# sourceMappingURL=index.d.ts.map