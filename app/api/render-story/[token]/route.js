import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

const activeRenders = new Set();

export async function GET(request, context) {
  const { token } = await context.params;

  const { searchParams } = new URL(request.url);
  const isCheck = searchParams.get("check");

  const outputDir = path.join(process.cwd(), "public/story-cache");
  const outputPath = path.join(outputDir, `${token}.mp4`);

  await fs.mkdir(outputDir, { recursive: true });

  /* =========================
     CHECK MODE
  ========================== */
  if (isCheck) {
    try {
      await fs.access(outputPath);
      return Response.json({ ready: true });
    } catch {
      return Response.json({
        ready: false,
        rendering: activeRenders.has(token),
      });
    }
  }

  /* =========================
     CACHE CHECK
  ========================== */
  try {
    await fs.access(outputPath);
    return Response.json({
      success: true,
      url: `/story-cache/${token}.mp4`,
      cached: true,
    });
  } catch {
    // continue
  }

  /* =========================
     PREVENT DOUBLE RENDER
  ========================== */
  if (activeRenders.has(token)) {
    return Response.json({
      success: true,
      rendering: true,
    });
  }

  activeRenders.add(token);

  const tempPropsPath = path.join(
    process.cwd(),
    `temp-props-${token}.json`
  );

  try {
    const backendUrl =
      process.env.LARAVEL_API_URL || "http://localhost:8000";

    const res = await fetch(
      `${backendUrl}/api/premium-gifts/view/${token}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      activeRenders.delete(token);
      return new Response("Gift not found", { status: 404 });
    }

    const data = await res.json();

    const senderName =
      data.gift?.config?.senderName ||
      data.gift?.sender_name ||
      "Someone";

    const recipientName =
      data.gift?.config?.recipientName ||
      data.gift?.recipient_name ||
      "You";

    const props = {
      senderName,
      recipientName,
      occasion: "Valentine",
    };

    // Write temp props file
    await fs.writeFile(tempPropsPath, JSON.stringify(props, null, 2));

    // Use local remotion binary (NO npx)
    const remotionPath = path.join(
      process.cwd(),
      "node_modules",
      ".bin",
      "remotion"
    );

    await new Promise((resolve, reject) => {
      exec(
        `"${remotionPath}" render remotion/index.js SoftDreamyStory "${outputPath}" \
        --codec=h264 \
        --concurrency=2 \
        --crf=28 \
        --preset=veryfast \
        --props="${tempPropsPath}"`,
        { cwd: process.cwd() },
        (error, stdout, stderr) => {
          console.log("REMOTION STDOUT:", stdout);
          console.log("REMOTION STDERR:", stderr);

          if (error) reject(error);
          else resolve(true);
        }
      );
    });

    return Response.json({
      success: true,
      url: `/story-cache/${token}.mp4`,
    });

  } catch (err) {
    console.error(err);
    return new Response("Render failed", { status: 500 });
  } finally {
    activeRenders.delete(token);

    // Always try cleanup
    try {
      await fs.unlink(tempPropsPath);
    } catch {
      // ignore if already deleted
    }
  }
}
