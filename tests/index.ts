// NOTE: https://github.com/NagRock/ts-mockito/issues/191#issuecomment-708743761
import { instance } from 'ts-mockito';
//eslint-disable-next-line @typescript-eslint/ban-types
export const resolvableInstance = <T extends object>(mock: T): T =>
  new Proxy<T>(instance(mock), {
    get(target, name: PropertyKey) {
      if (
        ['Symbol(Symbol.toPrimitive)', 'then', 'catch', 'schedule'].includes(
          name.toString(),
        )
      ) {
        return undefined;
      }

      return (target as never)[name];
    },
  });
