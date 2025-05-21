"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VIPSComponent {
  tag: string;
  id: string;
  className: string;
  role: string;
  innerText: string;
  properties: {
    x: number;
    y: number;
    width: number;
    height: number;
    docOrder: number;
    visualImportance: number;
  };
  children: VIPSComponent[];
}

export default function Home() {
  useEffect(() => {
    document.title = "Analyze Page";
  }, []);

  const [url, setUrl] = useState("");
  const [vipsModel, setVipsModel] = useState<VIPSComponent | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [screenshotDimensions, setScreenshotDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [showAll, setShowAll] = useState(true); // State for showing all elements
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // State for hovered element

  // Use a ref to store the initial image dimensions and scale
  const initialImageDimensions = useRef<{
    width: number;
    height: number;
  } | null>(null);
  const initialScale = useRef<number>(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && screenshotDimensions && imgRef.current) {
        const renderedWidth = imgRef.current.offsetWidth;
        const originalWidth = screenshotDimensions.width;
        const newScale = renderedWidth / originalWidth;
        initialScale.current = newScale; // Store the initial scale
      }
    };

    if (imgRef.current) {
      imgRef.current.onload = () => {
        // Store initial dimensions and scale only once
        if (!initialImageDimensions.current) {
          initialImageDimensions.current = {
            width: imgRef.current?.offsetWidth || 0,
            height: imgRef.current?.offsetHeight || 0,
          };
          updateScale(); // Calculate initial scale after image loads
        }
      };
    }

    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (imgRef.current) {
        imgRef.current.onload = null;
      }
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [screenshotDimensions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setVipsModel(null);
    setScreenshot(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setVipsModel(data.vipsModel);
      setScreenshot(data.screenshot);
      const img = new Image();
      img.onload = () => {
        setScreenshotDimensions({ width: img.width, height: img.height });
      };
      img.src = `data:image/png;base64,${data.screenshot}`;
    } catch (err) {
      console.error("Error during analysis:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to flatten the VIPS model
  const flattenModel = (
    component: VIPSComponent,
    flatArray: VIPSComponent[] = []
  ): VIPSComponent[] => {
    flatArray.push(component);
    component.children.forEach((child) => flattenModel(child, flatArray));
    return flatArray;
  };

  // Flatten the model when it is set
  const flattenedModel = vipsModel ? flattenModel(vipsModel) : [];

  // Function to generate a unique color based on index
  const getColor = (index: number) => {
    const hue = (index * 137.508) % 360; // Golden angle approximation
    return `hsl(${hue}, 70%, 50%)`; // HSL color
  };

  const renderVIPSComponent = (component: VIPSComponent, index: number) => {
    if (!screenshotDimensions || !imgRef.current) return null;

    // Use the initial scale value
    const currentScale = initialScale.current;

    const style = {
      position: "absolute" as const,
      left: `${component.properties.x * currentScale}px`,
      top: `${component.properties.y * currentScale}px`,
      width: `${component.properties.width * currentScale}px`,
      height: `${component.properties.height * currentScale}px`,
      border: `2px solid ${getColor(index)}`, // Use unique color
      backgroundColor: `${getColor(index)}20`, // Lighten the color for background
      boxSizing: "border-box" as const,
      pointerEvents: "none" as const,
      zIndex: 1000,
    };

    const labelStyle = {
      position: "absolute" as const,
      left: "0",
      top: "-20px",
      fontSize: "12px",
      backgroundColor: `hsl(${(index * 137.508) % 360}, 70%, 50%)`,
      color: "white",
      padding: "2px 4px",
      borderRadius: "2px",
      whiteSpace: "nowrap" as const,
      pointerEvents: "none" as const,
    };

    const getLabel = () => {
      let label = component.tag;
      if (component.id) label += `#${component.id}`;
      if (component.className && typeof component.className === "string") {
        const classes = component.className.trim().split(/\s+/).filter(Boolean);
        if (classes.length) label += `.${classes[0]}`;
      }
      return label;
    };

    return (
      <div
        key={`${component.tag}-${component.id}-${component.properties.docOrder}-${index}`} // Ensure unique key
        style={style}
        onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on mouse enter
        onMouseLeave={() => setHoveredIndex(null)} // Clear hovered index on mouse leave
      >
        <div style={labelStyle}>{getLabel()}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search */}
      <div className="w-full bg-white shadow-sm py-4 px-4 mb-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-4">VIPS Analyzer</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a URL to analyze"
                required
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </form>
          <div className="flex items-center mt-4">
            <label className="mr-2">Show All Elements:</label>
            <input
              type="checkbox"
              checked={showAll}
              onChange={() => setShowAll((prev) => !prev)}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {screenshot && vipsModel && screenshotDimensions && (
          <Tabs defaultValue="visualization" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="visualization">
                Visual Segmentation
              </TabsTrigger>
              <TabsTrigger value="model">Extracted Model</TabsTrigger>
            </TabsList>

            <TabsContent value="visualization">
              <Card className="p-4">
                <div ref={containerRef} className="w-full">
                  <div
                    className="relative border overflow-auto"
                    style={{
                      maxHeight: "calc(100vh - 250px)",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        ref={imgRef}
                        src={`data:image/png;base64,${screenshot}`}
                        alt="Analyzed page"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                      >
                        {flattenedModel.map((component, index) => {
                          // Only render if showAll is true or if the component is hovered
                          if (showAll || hoveredIndex === index) {
                            return renderVIPSComponent(component, index);
                          }
                          return null; // Do not render if not hovered and showAll is false
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="model">
              <Card className="p-4">
                <div
                  className="overflow-auto bg-gray-50 p-4 rounded"
                  style={{
                    maxHeight: "calc(100vh - 250px)",
                  }}
                >
                  <pre className="text-sm">
                    {JSON.stringify(vipsModel, null, 2)}
                  </pre>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
