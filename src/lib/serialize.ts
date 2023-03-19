/**
 * Copyright (c) 2023 Alex Johansson
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://github.com/trpc/trpc/blob/a0155bd3e0f9269c1a4a63c3afac9e10adb99508/LICENSE.
 *
 * @link https://github.com/trpc/trpc/blob/a0155bd3e0f9269c1a4a63c3afac9e10adb99508/packages/server/src/shared/internal/serialize.ts
 */

type JsonPrimitive = Boolean | Number | String | boolean | number | string | null;
type NonJsonPrimitive = Function | symbol | undefined;

type IsAny<T> = 0 extends T & 1 ? true : false;

type SerializeTuple<T extends [unknown, ...unknown[]]> = {
	[k in keyof T]: T[k] extends NonJsonPrimitive ? null : Serialize<T[k]>;
};

export type SerializeObject<T extends object> = {
	[k in keyof Omit<T, FilterKeys<T, NonJsonPrimitive>>]: Serialize<T[k]>;
};

type UndefinedToOptional<T extends object> = Pick<T, FilterDefinedKeys<T>> & {
	[k in keyof Omit<T, FilterDefinedKeys<T>>]?: Exclude<T[k], undefined>;
};

type FilterDefinedKeys<TObj extends object> = Exclude<
	{
		[TKey in keyof TObj]: undefined extends TObj[TKey] ? never : TKey;
	}[keyof TObj],
	undefined
>;

export type FilterKeys<TObj extends object, TFilter> = {
	[TKey in keyof TObj]: TObj[TKey] extends TFilter ? TKey : never;
}[keyof TObj];

export type Serialize<T> = IsAny<T> extends true
	? any
	: T extends JsonPrimitive
	? T
	: T extends NonJsonPrimitive
	? never
	: T extends { toJSON(): infer U }
	? U
	: T extends Map<any, any> | Set<any>
	? object
	: T extends []
	? []
	: T extends [unknown, ...unknown[]]
	? SerializeTuple<T>
	: T extends readonly (infer U)[]
	? (U extends NonJsonPrimitive ? null : Serialize<U>)[]
	: T extends object
	? SerializeObject<UndefinedToOptional<T>>
	: never;
