import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// GET /api/graph
export async function GET() {
  // 构造 public/graph.json 的绝对路径
  const jsonPath = path.join(process.cwd(), 'public', 'graph.json')
  try {
    // 读取并解析
    const fileContents = await fs.readFile(jsonPath, 'utf8')
    const data = JSON.parse(fileContents)
    // 返回 JSON
    return NextResponse.json(data)
  } catch (err) {
    // 读取或解析失败时返回 500
    return NextResponse.json(
      { error: 'Failed to load graph data' },
      { status: 500 }
    )
  }
}
