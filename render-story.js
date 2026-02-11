const { bundle } = require("@remotion/bundler");
const { renderMedia } = require("@remotion/renderer");
const path = require("path");
const fs = require("fs/promises");

const token = process.argv[2];
const title = process.argv[3];

async function render() {
  const outputDir = path.join(process.cwd(), "public/story-cache");
  const outputPath = path.join(outputDir, `${token}.mp4`);

  await fs.mkdir(outputDir, { recursive: true });

  const bundleLocation = await bundle({
    entryPoint: path.join(process.cwd(), "remotion/index.js"),
  });

  await renderMedia({
    composition: "SoftDreamyStory",
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: {
      title,
    },
  });

  console.log("Rendered:", outputPath);
}

render().catch((err) => {
  console.error(err);
  process.exit(1);
});
