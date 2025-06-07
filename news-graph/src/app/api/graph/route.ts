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
    const graphData = transformDataToGraph(rawData)

    // 构建分析数据
    const analysisData = [
      {
        title: "Event Background",
        content: rawData.background_analysis,
      },
      {
        title: "Viral Potential",
        content: rawData.viral_potential,
      },
      {
        title: "Negative Event",
        content: rawData.negative_events_identification,
      },
      {
        title: "Causal Inference",
        content: rawData.causal_inference.effect,
      },
    ];

    // 返回完整数据
    const completeData = {
      graphData,
      eventTitle: rawData.event_title,
      analysisData,
      eventLines: rawData.event_lines,
      sentimentScore: rawData.sentiment_score,
    };

    return NextResponse.json(completeData)
  } catch (err) {
    console.error('Error processing graph data:', err)
    return NextResponse.json(
      { error: 'Failed to process graph data' },
      { status: 500 }
    )
  }
}
