function Preview({ layout }) {
  const artboardId = layout.rootNodes[0];
  const artboard = layout.nodes[artboardId];
  const PREVIEW_SIZE = 300;

  const scaleX = PREVIEW_SIZE / artboard.width;
  const scaleY = PREVIEW_SIZE / artboard.height;

  const children = artboard.children || [];

  return (
    <div style={{ padding: "12px", background: "#f5f5f5", borderBottom: "1px solid #ccc" }}>
      <div style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
        🖼️ Wireframe Preview ({artboard.width} × {artboard.height})
      </div>
      <div
        style={{
          position: "relative",
          width: PREVIEW_SIZE,
          height: PREVIEW_SIZE * (artboard.height / artboard.width),
          background: artboard.data?.backgroundColor || "#fff",
          border: "2px solid #333",
          overflow: "hidden",
        }}
      >
        {children.map((childId) => {
          const node = layout.nodes[childId];
          if (!node) return null;

          const left = node.x * scaleX;
          const top = node.y * scaleY;
          const width = node.width * scaleX;
          const height = node.height * scaleY;

          if (node.type === "image") {
            return (
              <div
                key={childId}
                style={{
                  position: "absolute",
                  left, top, width, height,
                  background: node.name === "Background.png" ? "#d0e8ff" : "#ffd0a0",
                  border: "1px solid #999",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "8px",
                  color: "#555",
                  overflow: "hidden",
                }}
              >
                {node.name === "Background.png" ? "BG" : node.name.includes("Vector") ? "⭐" : "📦 Product"}
              </div>
            );
          }

          if (node.type === "text") {
            return (
              <div
                key={childId}
                style={{
                  position: "absolute",
                  left, top, width, height,
                  fontSize: Math.max(6, (node.style?.visual?.fontSize || 16) * scaleX),
                  fontWeight: node.style?.visual?.fontWeight || "normal",
                  color: "#222",
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                }}
              >
                {node.data?.content}
              </div>
            );
          }

          if (node.type === "shape") {
            return (
              <div
                key={childId}
                style={{
                  position: "absolute",
                  left, top, width, height,
                  background: node.style?.visual?.fill?.value || "#F4CF1B",
                  borderRadius: node.data?.shapeType === "circle" ? "50%" : "0",
                  border: "1px solid #999",
                }}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export default Preview;