import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { transformDataToGraph } from '@/lib/data-transformer'

// GET /api/graph
export async function GET() {
  try {
    // 读取 src/data.json 文件
    const jsonPath = path.join(process.cwd(), 'src', 'data.json')
    const fileContents = await fs.readFile(jsonPath, 'utf8')
    const rawData = JSON.parse(fileContents)

    // 使用 transformDataToGraph 转换数据
    const transformedData = transformDataToGraph(rawData)

    // 返回转换后的数据
    console.log(transformedData)
    return NextResponse.json(transformedData)
  } catch (err) {
    console.error('Error processing graph data:', err)
    return NextResponse.json(
      { error: 'Failed to process graph data' },
      { status: 500 }
    )
  }
}
