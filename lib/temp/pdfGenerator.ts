// app/lib/pdfGenerator.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePdf = async (element: HTMLElement, fileName: string) => {
  if (!element) {
    console.error("PDF generation failed: element not found.");
    return;
  }

  // Wait for charts to render fully before capturing
  await new Promise((resolve) => setTimeout(resolve, 1000));  // Adjust delay as needed for chart rendering

  // Capture the entire element as a canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    onclone: (clonedDoc) => {
      const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
      links.forEach((link) => link.remove());  // Remove external stylesheets to avoid issues
    },
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "p",
    unit: "px",
    format: "a4",
    hotfixes: ["px_scaling"], // Important for accurate pixel scaling
  });

  const pdfPageWidth = pdf.internal.pageSize.getWidth();
  const pdfPageHeight = pdf.internal.pageSize.getHeight();
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate the aspect ratio of the captured image
  const ratio = canvasWidth / canvasHeight;
  
  // Calculate the height the image should have in the PDF to fit the width
  const scaledImgHeight = pdfPageWidth / ratio;

  let heightLeft = scaledImgHeight;
  let position = 0;

  // Add the first page
  pdf.addImage(imgData, "PNG", 0, position, pdfPageWidth, scaledImgHeight);
  heightLeft -= pdfPageHeight;

  // --- THIS IS THE CORRECTED LOOP LOGIC ---
  while (heightLeft > 0) {
    position -= pdfPageHeight; // Move to the next page
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfPageWidth, scaledImgHeight);
    heightLeft -= pdfPageHeight;
  }
  // --- END OF CORRECTED LOGIC ---

  // Save the generated PDF
  pdf.save(fileName);
};
