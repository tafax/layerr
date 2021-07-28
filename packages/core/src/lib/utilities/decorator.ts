import { ClassType } from './class-type';
import { CTor } from './ctor';

/**
 * Represents a decorator function.
 */
export declare type Decorator<T, U extends ClassType<any>> = (options: T) => CTor<U>;
