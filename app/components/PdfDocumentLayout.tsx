"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import IrisLogo from "./IrisLogo";
import { Message, UiComponent } from "./ChatMessages";
import Image from "next/image";

// Import chart components
import { StockPriceChart } from "./charts/StockPriceChart";
import { RankingBarChart } from "./charts/RankingBarChart";
import { ShareholdingPieChart } from "./charts/ShareholdingPieChart";

// Define props
interface PdfDocumentLayoutProps {
  message: Message | null;
  forwardedRef: React.Ref<HTMLDivElement>;
}

// Helper function to render charts
const renderPdfUiComponent = (component: UiComponent, index: number) => {
  switch (component.type) {
    case "stock_price_chart":
      return (
        <StockPriceChart
          key={index}
          data={component.data}
          title={component.title}
          animationDuration={0}
        />
      );
    case "ranking_bar_chart":
      return (
        <RankingBarChart
          key={index}
          data={component.data}
          title={component.title}
          labelKey={component.labelKey}
          valueKey={component.valueKey}
          animationDuration={0}
        />
      );
    case "pie_chart":
      return (
        <ShareholdingPieChart
          key={index}
          data={component.data}
          title={component.title}
          animationDuration={0}
        />
      );
    case "clarification_options":
    case "vertical_suggestions":
      return null;
    default:
      return null;
  }
};

export const PdfDocumentLayout = ({
  message,
  forwardedRef,
}: PdfDocumentLayoutProps) => {
  if (!message) {
    return null;
  }

  return (
    <div
      ref={forwardedRef}
      className="absolute -top-[9999px] -left-[9999px]"
      style={{
        fontFamily: "'Roboto', Helvetica, sans-serif",
        color: "#2A2A2A",
        width: "800px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        backgroundColor: "#F9FAFB",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Cover Page */}
      <div
        style={{
          position: "relative",
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 40px",
          background: "linear-gradient(145deg, #4B5EAA 0%, #00FFFF 100%)",
          color: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Decorative Shapes */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "-50px",
            width: "200px",
            height: "200px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            zIndex: 1,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            background: "rgba(255, 255, 255, 0.15)",
            transform: "rotate(45deg)",
            zIndex: 1,
          }}
        ></div>

        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            width: "100%",
            zIndex: 2,
          }}
        >
          <div
            style={{
              marginBottom: "30px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IrisLogo style={{ filter: "brightness(0) invert(1)" }} />
          </div>

          <h1
            style={{
              fontSize: "48px",
              fontWeight: "700",
              marginBottom: "20px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            AI Insights Report
          </h1>
          <p
            style={{
              fontSize: "10px",
              marginBottom: "20px",
              lineHeight: "1.5",
              fontWeight: "300",
            }}
          >
            Unlocking Strategic Decisions with Cutting-Edge AI Analysis from
            IRIS
          </p>
          <p
            style={{
              fontSize: "16px",
              fontStyle: "italic",
              opacity: 0.9,
            }}
          >
            Generated on:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Decorative Line */}
        <div
          style={{
            width: "150px",
            height: "4px",
            background: "#FFFFFF",
            marginTop: "40px",
            borderRadius: "2px",
            opacity: 0.8,
          }}
        ></div>
      </div>

      {/* Content Section */}
      <div
        style={{
          padding: "60px 50px",
          backgroundColor: "#FFFFFF",
          minHeight: "auto",
          pageBreakBefore: "always",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100px",
            height: "100px",
            background: "linear-gradient(45deg, #4B5EAA,#00FFFF )",
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
            opacity: 0.3,
          }}
        ></div>

        {/* Message Content */}
        <div
          style={{
            fontSize: "16px",
            lineHeight: "1.8",
            color: "#2A2A2A",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ node, ...props }) => (
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    marginBottom: "30px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  {...props}
                />
              ),
              thead: ({ node, ...props }) => (
                <thead
                  style={{
                    background: "linear-gradient(90deg, #4B5EAA, #6B7280)",
                    color: "#FFFFFF",
                  }}
                  {...props}
                />
              ),
              th: ({ node, ...props }) => (
                <th
                  style={{
                    border: "1px solid #E5E7EB",
                    padding: "14px",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  style={{
                    border: "1px solid #E5E7EB",
                    padding: "14px",
                    fontSize: "14px",
                  }}
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  style={{
                    listStyleType: "circle",
                    paddingLeft: "30px",
                    marginBottom: "20px",
                    color: "#374151",
                  }}
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  style={{
                    listStyleType: "decimal",
                    paddingLeft: "30px",
                    marginBottom: "20px",
                    color: "#374151",
                  }}
                  {...props}
                />
              ),
              h1: ({ node, ...props }) => (
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    marginBottom: "25px",
                    color: "#4B5EAA",
                    borderLeft: "4px solid #8B5CF6",
                    paddingLeft: "15px",
                  }}
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  style={{
                    fontSize: "26px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#4B5EAA",
                  }}
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "15px",
                    color: "#374151",
                  }}
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  style={{
                    marginBottom: "20px",
                    color: "#374151",
                    fontSize: "16px",
                  }}
                  {...props}
                />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Charts */}
        {message.uiComponents && message.uiComponents.length > 0 && (
          <div
            style={{
              marginTop: "50px",
              display: "flex",
              flexDirection: "column",
              gap: "50px",
              maxWidth: "700px",
              margin: "50px auto",
            }}
          >
            {message.uiComponents.map(renderPdfUiComponent)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          textAlign: "center",
          color: "#FFFFFF",
          fontSize: "12px",
          padding: "30px 50px",
          background: "linear-gradient(90deg, #4B5EAA, #00FFFF )",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "150px",
            height: "150px",
            background: "rgba(255, 255, 255, 0.1)",
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        ></div>
        <p style={{ fontWeight: "500", marginBottom: "10px" }}>
          &copy; {new Date().getFullYear()} Brainfog Inc. All rights reserved.
        </p>
        <p style={{ fontWeight: "300" }}>
          Confidential Information | Contact us at{" "}
          <a
            href="mailto:info@brainfog.com"
            style={{ color: "#FFFFFF", textDecoration: "underline" }}
          >
            info@brainfog.com
          </a>
        </p>
      </div>
    </div>
  );
};
