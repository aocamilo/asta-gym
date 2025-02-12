import { NextResponse } from "next/server";
import playwright from "playwright-core";
import chromium from "@sparticuz/chromium";
import { writeFileSync } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
    const page = await browser.newPage();

    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto(url, { waitUntil: "networkidle" });

    // Wait for a short period to ensure layout stability
    await page.waitForTimeout(500);

    const pageData = await page.evaluate(() => {
      function extractComponent(element: Element, order: number): unknown {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);

        if (
          styles.display === "none" ||
          styles.visibility === "hidden" ||
          styles.opacity === "0" ||
          rect.width === 0 ||
          rect.height === 0
        ) {
          return null;
        }

        // Calculate absolute position relative to the document
        const absoluteTop = rect.top + window.scrollY;
        const absoluteLeft = rect.left + window.scrollX;

        const dimensions = {
          x: Math.round(absoluteLeft),
          y: Math.round(absoluteTop),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };

        const children: unknown[] = [];
        let currentOrder = order;

        Array.from(element.children).forEach((child) => {
          const childComponent = extractComponent(child, ++currentOrder);
          if (childComponent) {
            children.push(childComponent);
            //@ts-expect-error fix types
            currentOrder = childComponent.properties.docOrder;
          }
        });

        let importance = 1;

        if (element.tagName.match(/^H[1-6]$/i)) {
          importance += (7 - parseInt(element.tagName[1])) * 0.5;
        }

        if (
          [
            "header",
            "nav",
            "main",
            "article",
            "footer",
            "aside",
            "section",
          ].includes(element.tagName.toLowerCase())
        ) {
          importance += 2;
        }

        const pageArea =
          document.documentElement.scrollWidth *
          document.documentElement.scrollHeight;
        importance += Math.min(
          ((dimensions.width * dimensions.height) / pageArea) * 10,
          5
        );

        importance +=
          element.querySelectorAll("a, button, input, select, textarea")
            .length * 0.2;

        const viewportWidth = Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        );
        const viewportHeight = Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        );

        const elementArea = dimensions.width * dimensions.height;
        const visibleArea = Math.min(
          Math.max(
            0,
            Math.min(dimensions.x + dimensions.width, viewportWidth) -
              Math.max(dimensions.x, 0)
          ) *
            Math.max(
              0,
              Math.min(dimensions.y + dimensions.height, viewportHeight) -
                Math.max(dimensions.y, 0)
            ),
          elementArea
        );

        importance *= (visibleArea / elementArea) * 0.5 + 0.5;

        return {
          tag: element.tagName.toLowerCase(),
          id: element.id || "",
          className: element.className || "",
          role: element.getAttribute("role") || "",
          innerText: element.textContent?.trim().substring(0, 100) || "",
          properties: {
            ...dimensions,
            docOrder: order,
            visualImportance: Math.min(Math.max(importance, 0), 10),
          },
          children,
        };
      }

      const html = document.documentElement;
      const model = extractComponent(html, 1);

      return { model };
    });

    const screenshot = await page.screenshot({ fullPage: true }); // Removed scale: "css"
    const base64Screenshot = screenshot.toString("base64");

    await browser.close();

    const filePath = path.join(process.cwd(), "vips-model.json");
    writeFileSync(filePath, JSON.stringify(pageData.model, null, 2));

    return NextResponse.json({
      vipsModel: pageData.model,
      screenshot: base64Screenshot,
    });
  } catch (error) {
    console.error("Error in analyze route:", error);
    return NextResponse.json(
      { error: "An error occurred during analysis" },
      { status: 500 }
    );
  }
}
