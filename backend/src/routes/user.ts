import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../db/mysql";
import type { User } from "../types/index";

const router = Router();

// 根据用户 ID 获取用户信息
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "无效的用户 ID" });
  }
  try {
    const [rows] = (await db.query(
      "SELECT * FROM valuable_users WHERE id = ?",
      [userId]
    )) as unknown as [User[]];

    if (rows.length === 0) {
      return res.status(404).json({ message: "用户未找到" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "服务器内部错误" });
  }
});

export default router;
