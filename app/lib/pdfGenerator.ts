// app/lib/pdfGenerator.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePdf = async (element: HTMLElement, fileName: string) => {
  if (!element) {
    console.error("PDF generation failed: element not found.");
    return;
  }

  // Capture the entire component, no matter how tall it is
  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    // The onclone fix is still best practice to avoid global CSS issues
    onclone: (clonedDoc) => {
      const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
      links.forEach((link) => link.remove());
    },
  });

  const imgData = canvas.toDataURL("image/png");

  // Get the dimensions of the captured image
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Create a new PDF in Portrait mode, using pixels as units
  const pdf = new jsPDF({
    orientation: "p",
    unit: "px",
    format: "a4", // Use A4 as the base aspect ratio
  });

  // Get the page dimensions from the PDF library
  const pdfPageWidth = pdf.internal.pageSize.getWidth();
  const pdfPageHeight = pdf.internal.pageSize.getHeight();
  
  // Calculate the aspect ratio of the captured image
  const canvasAspectRatio = imgWidth / imgHeight;
  
  // Calculate the height the image should have in the PDF to maintain its aspect ratio
  const scaledImgHeight = pdfPageWidth / canvasAspectRatio;

  // This is the core logic for splitting the image across multiple pages
  let heightLeft = scaledImgHeight;
  let position = 0;

  // Add the first page
  pdf.addImage(imgData, "PNG", 0, position, pdfPageWidth, scaledImgHeight);
  heightLeft -= pdfPageHeight;

  // Add more pages if the content is taller than one page
  while (heightLeft > 0) {
    position = -heightLeft; // The y-position is negative to "pull up" the image
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfPageWidth, scaledImgHeight);
    heightLeft -= pdfPageHeight;
  }

  // Save the complete PDF
  pdf.save(fileName);
};