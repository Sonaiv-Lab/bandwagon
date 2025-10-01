type Context = Record<string, any>;

type Apply<TC extends Context> = <TProps extends unknown[], TReturn>(
  impl: (context: TC, ...props: TProps) => TReturn
) => (...props: TProps) => TReturn;

type Container<T extends Context> = {
  context: T | undefined;
  apply: Apply<T>;
  init: () => Promise<T>;
};

export function containerFactor<TContext extends Record<string, any>>({
  initContext,
}: {
  initContext: () => Promise<TContext>;
}) {
  let context: Container<TContext>['context'];

  const init = async () => {
    context = await initContext();

    return context;
  };

  const apply: Apply<TContext> = <TProps extends unknown[], TReturn>(
    impl: (context: TContext, ...props: TProps) => TReturn
  ) => {
    if (context === undefined) {
      throw new Error('context not init yet');
    }

    function call(...props: TProps) {
      return impl(context!, ...props);
    }

    call.with =
      (deps: Partial<Context>) =>
      (...props: TProps) => {
        return impl({ ...context!, ...deps }, ...props);
      };

    return call;
  };

  const container: Container<TContext> = {
    context,
    apply,
    init,
  };

  return container;
}
