import { GetProps, StateView } from '../StateView';
import { traverse } from '../../utils/traverse';
import { ModuleStateController, Store } from '../Store';
import { forEach, getInstanceMetadata } from '../../scope';


export type PickState<TView, TModule> = StateView<GetProps<TView> & GetModuleState<TModule>>
export type GetModuleState<TModule> = TModule extends { state: infer TState } ? TState : {}



export function pickState<TView extends StateView<any>, TModule>(module: TModule): (props: GetProps<TView>, view: TView) => PickState<TView, TModule> {

  return function (props, view) {

    const provider = getInstanceMetadata(module).provider;
    const store = provider.scope.resolve(Store);
    const moduleName = provider.instanceId;
    const stateController = store.getController(moduleName, 'state'); // TODO allow picking multiple states?
    if (!(stateController instanceof ModuleStateController)) return view;

    const stateView = stateController.createView();
    view = view.mergeView(stateView);

    // const config = stateController.metadata.config;
    // const controller = stateController as any;

    // traverse(config.state, stateKey => {
    //   view.defineProp({
    //     type: 'StateProp',
    //     name: stateKey,
    //     reactive: true,
    //     getValue: () => controller[stateKey],
    //   });
    // });
    //
    // traverse(config.mutations, stateKey => {
    //   view.defineProp({
    //     type: 'StateMutation',
    //     name: stateKey,
    //     reactive: false,
    //     getValue: () => controller[stateKey],
    //   });
    // });
    //
    // traverse(config.getters, (propName) => {
    //   view.defineProp({
    //     type: 'StateGetter',
    //     name: propName,
    //     reactive: true,
    //     getValue: () => controller[propName],
    //   });
    // });
    //
    // traverse(config.getterMethods, (propName) => {
    //   view.defineProp({
    //     type: 'StateGetterMethod',
    //     name: propName,
    //     reactive: true,
    //     getValue: () => controller[propName],
    //   });
    // });

    return view;
  }
}
