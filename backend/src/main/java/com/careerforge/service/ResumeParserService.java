package com.careerforge.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

@Service
public class ResumeParserService {

    public String parse(MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename().toLowerCase();

            if (fileName.endsWith(".pdf")) {
                return parsePdf(file);
            } else if (fileName.endsWith(".docx")) {
                return "DOCX parsing not yet implemented. Please use PDF.";
            } else {
                throw new RuntimeException("Unsupported file type. Please upload PDF or DOCX.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse resume: " + e.getMessage());
        }
    }

    private String parsePdf(MultipartFile file) throws Exception {
        // Create a temporary file from the uploaded file
        File tempFile = File.createTempFile("resume_", ".pdf");
        try (InputStream inputStream = file.getInputStream();
             FileOutputStream outputStream = new FileOutputStream(tempFile)) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }

        // Load the PDF from the temporary file
        try (PDDocument document = PDDocument.load(tempFile)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if (text == null || text.trim().isEmpty()) {
                throw new RuntimeException("No text found in PDF. The file may be scanned or image-based.");
            }
            return text;
        } finally {
            // Delete the temporary file
            tempFile.delete();
        }
    }
}