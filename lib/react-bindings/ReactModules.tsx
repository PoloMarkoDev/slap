import React, {
  ReactNode, useContext, useEffect,
} from 'react';
import { useOnCreate } from './hooks';
import { Scope, TModuleConstructorMap } from '../scope';
import { ReactStoreAdapter } from './react-store-adapter';
import { Store } from '../store/Store';

export type TAppContext = {
  rootScope: Scope; // keeps singleton services in the root scope
  modulesScope: Scope; // keeps non-singleton modules
}

export const SlapContext = React.createContext<TAppContext|null>(null);


export function useAppContext() {
  return useContext(SlapContext)!;
}

export function useScope() {
  return useAppContext().rootScope;
}


export function createApp(Services: TModuleConstructorMap = {}): TAppContext {
  const rootScope = new Scope({ ...Services, Store, ReactStoreAdapter });
  const modulesScope = rootScope.createChildScope({}, { autoregister: true });

  rootScope.init(ReactStoreAdapter);

  return { rootScope, modulesScope };
}

export function ReactModules(p: {children: ReactNode | ReactNode[], app?: TAppContext}) {
  const appScope = useOnCreate(() => p.app || createApp());

  return (
    <SlapContext.Provider value={appScope}>
      {p.children}
    </SlapContext.Provider>
  );
}


// export function SlapModuleRoot(p: {children: ReactNode | ReactNode[], module: any }) {
//   const scope = useAppContext().modulesScope;
//
//   const { moduleName, store, moduleScope } = useOnCreate(() => {
//     const store = scope.resolve(Store);
//     const moduleName = p.module.prototype.constructor.name;
//     const moduleScope = scope.registerScope({ [moduleName]: p.module });
//     return { moduleScope, moduleName, store };
//   });
//
//   store.setModuleContext(moduleName, moduleScope);
//   useEffect(() => {
//     store.resetModuleContext(moduleName);
//   });
//   return <>{p.children}</>;
// }
