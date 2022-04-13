import { Scope, Dict, PickFunctionProperties } from '../scope';
import { StateView } from './StateView';
/**
 * All React related code should be handled in ReactAdapter
 * Framework agnostic store
 */
export declare class Store {
    rootState: Dict<Dict<any>>;
    modulesMetadata: Dict<Dict<StatefulModuleMetadata>>;
    currentMutation: Mutation | null;
    moduleRevisions: Dict<number>;
    createState<TConfigCreator>(moduleName: string, sectionName: string, configCreator: TConfigCreator): TStateControllerFor<TConfigCreator>;
    dispatchMutation(mutation: Mutation): void;
    toJSON(): void;
    currentScope: Record<string, Scope>;
    setModuleScope(moduleName: string, scope: Scope): void;
    resetModuleScope(moduleName: string): void;
    destroyModule(moduleName: string): void;
    recordingAccessors: number;
    affectedModules: Record<string, number>;
    listenAffectedModules(cb: Function): Record<string, number>;
    currentContext: Record<string, Scope>;
    setModuleContext(moduleName: string, scope: Scope): void;
    resetModuleContext(moduleName: string): void;
    getMetadata(moduleName: string, sectionName: string): StatefulModuleMetadata;
    getController(moduleName: string, sectionName: string): ModuleStateController;
    events: import("nanoevents").Emitter<StoreEvents>;
}
export interface StoreEvents {
    onMutation: (mutation: Mutation) => void;
    onAfterMutations: () => void;
}
export declare class ModuleStateController {
    store: Store;
    moduleName: string;
    sectionName: string;
    draftState: any;
    constructor(store: Store, moduleName: string, sectionName: string, config: TStateConfig);
    registerMutation(mutationName: string, mutationMethod: Function, silent?: boolean): void;
    applyMutation(mutation: Mutation): void;
    get state(): any;
    set state(val: any);
    get metadata(): StatefulModuleMetadata;
    createView(): StateView<{}>;
}
export interface Mutation {
    id: number;
    moduleName: string;
    sectionName: string;
    mutationName: string;
    payload: any;
    silent?: boolean;
}
export declare const defaultStateConfig: Partial<TStateConfig>;
export declare type TStateConfigCreator = (new (...args: any) => TStateConfigDraft) | TStateConfigDraft;
export declare type TStateConfig = {
    state: any;
    mutations: any;
    getters: any;
    getterMethods: any;
    [key: string]: any;
};
export declare type TStateConfigDraft = Partial<TStateConfig>;
export interface StatefulModuleMetadata {
    rev: number;
    config: TStateConfig;
    controller: ModuleStateController;
}
export declare type TDraftConfigFor<TConfigCreator> = TConfigCreator extends new (...args: any) => infer TDraftConfigFromConstructor ? TDraftConfigFromConstructor : TConfigCreator extends (...args: any) => infer TDraftConfigFromFunction ? TDraftConfigFromFunction : TConfigCreator;
export declare type TStateConfigFor<TDraftConfig> = {
    state: TStateFor<TDraftConfig>;
    getters: any;
    getterMethods: any;
    mutations: any;
};
export declare type TStateFor<TDraftConfig> = TDraftConfig extends {
    state: infer TState;
} ? TState : WritablePart<TDraftConfig>;
export declare type PickMethods<TDraftConfig, TRootMethods = PickFunctionProperties<TDraftConfig>, TExplicitGetters = TDraftConfig extends {
    getters: infer TGetters;
} ? TGetters : {}, TExplicitGetterMethods = TDraftConfig extends {
    getterMethods: infer TGetterMethods;
} ? TGetterMethods : {}, TExplicitMutations = TDraftConfig extends {
    getters: infer TMutations;
} ? TMutations : {}> = TRootMethods & TExplicitGetters & TExplicitGetterMethods & TExplicitMutations;
export declare type GetHeuristicGetterName<TPropName> = TPropName extends string ? `${'get' | 'is' | 'should' | 'will'}${Capitalize<TPropName>}` : never;
export declare type PickHeuristicGetters<TDraftConfig> = {
    [K in keyof TDraftConfig as GetHeuristicGetterName<K>]: (value: TDraftConfig[K]) => unknown;
};
export declare type TStateControllerFor<TConfigCreator, TDraftConfig = TDraftConfigFor<TConfigCreator>, TState = PickDefaultState<TDraftConfig>> = ModuleStateController & TState & {
    state: TState;
    nonReactiveUpdate: (patch: Partial<TState>) => unknown;
} & Omit<PickAutogeneratedMutations<TState>, keyof PickMethods<TDraftConfig>> & PickMethods<TDraftConfig> & Exclude<TDraftConfig, keyof TStateConfig>;
export declare type TStateViewForStateConfig<TConfigCreator> = Omit<TStateControllerFor<TConfigCreator>, 'state'>;
export declare type GetSetterName<TPropName> = TPropName extends string ? `set${Capitalize<TPropName>}` : never;
export declare type PickDefaultState<TDraftConfig> = TDraftConfig extends {
    state: infer TState;
} ? TState : WritablePart<TDraftConfig>;
export declare type PickAutogeneratedMutations<TState> = {
    [K in keyof TState as GetSetterName<K>]: (value: TState[K]) => unknown;
};
export declare type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
declare type WritableKeysOf<T> = {
    [P in keyof T]: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P, never>;
}[keyof T];
declare type WritablePart<T> = Pick<T, WritableKeysOf<T>>;
export {};
