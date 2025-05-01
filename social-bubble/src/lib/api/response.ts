import { NextResponse } from "next/server";

export function ok<T>(data: T) {
  return NextResponse.json({ code: 0, data });
}

export function fail(message = "请求失败", status = 500) {
  return NextResponse.json({ code: -1, message }, { status });
}
