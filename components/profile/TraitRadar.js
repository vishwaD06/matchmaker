"use client";

import { useEffect, useRef } from "react";
import styles from "./TraitRadar.module.css";

// Draw a radar chart for Big Five personality traits on a canvas
export default function TraitRadar({ traits }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !traits) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40; // padding for labels

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const traitKeys = ["openness", "conscientiousness", "extraversion", "agreeableness", "emotional_stability"];
    const labels = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Emotional Stability"];
    const values = traitKeys.map(k => traits[k] || 50); // fallback to 50
    const numPoints = 5;

    // Helper to get coordinates
    const getCoordinates = (value, index) => {
      const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
      const distance = (value / 100) * radius;
      return {
        x: centerX + distance * Math.cos(angle),
        y: centerY + distance * Math.sin(angle)
      };
    };

    // Draw background grid (spider web)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    for (let level = 1; level <= 5; level++) {
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const { x, y } = getCoordinates(level * 20, i);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axes and labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < numPoints; i++) {
      // Draw axis line
      const { x: endX, y: endY } = getCoordinates(100, i);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw label
      const { x: labelX, y: labelY } = getCoordinates(120, i);
      ctx.fillText(labels[i], labelX, labelY);
    }

    // Draw data polygon
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const { x, y } = getCoordinates(values[i], i);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Fill polygon
    ctx.fillStyle = "rgba(224, 169, 109, 0.3)"; // Amber with opacity
    ctx.fill();

    // Stroke polygon
    ctx.strokeStyle = "hsl(38, 85%, 60%)"; // Solid amber
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = "hsl(38, 85%, 60%)";
    for (let i = 0; i < numPoints; i++) {
      const { x, y } = getCoordinates(values[i], i);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [traits]);

  return (
    <div className={styles.container}>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        className={styles.canvas}
      />
    </div>
  );
}
