import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class RangeImpl<T extends number> {
  private readonly _left: T;
  private readonly _right: T;

  public constructor(left: T, right: T) {
    this._left = left;
    this._right = right;
  }

  public left(): T {
    return this._left;
  }

  public right(): T {
    return this._right;
  }

  public count(): number {
    return this._right - this._left + 1;
  }

  public contains(index: T): boolean {
    return this._left <= index && index <= this._right;
  }

  public equals(other: RangeImpl<T>): boolean {
    return this._left === other.left() && this._right === other.right();
  }
}
