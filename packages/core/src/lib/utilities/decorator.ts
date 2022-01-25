import { ClassType } from './class-type';
import { CTor } from './ctor';

/**
 * Represents a decorator function
 */
export declare type Decorator<T, U extends ClassType<unknown>> = (options: T) => CTor<U>;
