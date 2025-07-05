package com.tood.servlet;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * Servlet implementation class ImageUploadServlet
 * Handles image uploads from the Quill editor
 */
@WebServlet("/upload/image")
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024,    // 1 MB
    maxFileSize = 1024 * 1024 * 10,     // 10 MB
    maxRequestSize = 1024 * 1024 * 15   // 15 MB
)
public class ImageUploadServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String UPLOAD_DIR = "uploads/images";
    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"};
    private static final String[] ALLOWED_MIME_TYPES = {
        "image/jpeg", "image/png", "image/gif", "image/webp"
    };
    
    private Gson gson = new Gson();

    /**
     * @see HttpServlet#HttpServlet()
     */
    public ImageUploadServlet() {
        super();
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Enable CORS for frontend integration
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();
        
        try {
            // Get the uploaded file part
            Part filePart = request.getPart("image");
            
            if (filePart == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "이미지 파일이 선택되지 않았습니다.");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(jsonResponse));
                return;
            }
            
            // Get file info
            String fileName = getSubmittedFileName(filePart);
            String contentType = filePart.getContentType();
            long fileSize = filePart.getSize();
            
            // Validate file
            String validationError = validateFile(fileName, contentType, fileSize);
            if (validationError != null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", validationError);
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(jsonResponse));
                return;
            }
            
            // Create upload directory if it doesn't exist
            String uploadPath = getServletContext().getRealPath("") + File.separator + UPLOAD_DIR;
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            
            // Generate unique filename
            String fileExtension = getFileExtension(fileName);
            String uniqueFileName = generateUniqueFileName(fileExtension);
            
            // Save the file
            Path filePath = Paths.get(uploadPath, uniqueFileName);
            Files.copy(filePart.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Generate the image URL
            String imageUrl = request.getContextPath() + "/" + UPLOAD_DIR + "/" + uniqueFileName;
            
            // Success response
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("imageUrl", imageUrl);
            jsonResponse.addProperty("message", "이미지가 성공적으로 업로드되었습니다.");
            
            response.setStatus(HttpServletResponse.SC_OK);
            out.print(gson.toJson(jsonResponse));
            
        } catch (Exception e) {
            // Error response
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "이미지 업로드 중 오류가 발생했습니다: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(jsonResponse));
            
            // Log the error
            e.printStackTrace();
        } finally {
            out.close();
        }
    }
    
    /**
     * Handle OPTIONS request for CORS preflight
     */
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setStatus(HttpServletResponse.SC_OK);
    }
    
    /**
     * Extract filename from Part header
     */
    private String getSubmittedFileName(Part part) {
        String contentDisposition = part.getHeader("content-disposition");
        if (contentDisposition != null) {
            for (String content : contentDisposition.split(";")) {
                if (content.trim().startsWith("filename")) {
                    return content.substring(content.indexOf('=') + 1).trim().replace("\"", "");
                }
            }
        }
        return "unknown";
    }
    
    /**
     * Validate uploaded file
     */
    private String validateFile(String fileName, String contentType, long fileSize) {
        // Check file size (max 10MB)
        if (fileSize > 10 * 1024 * 1024) {
            return "파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다.";
        }
        
        // Check if file is empty
        if (fileSize == 0) {
            return "빈 파일은 업로드할 수 없습니다.";
        }
        
        // Check file extension
        String fileExtension = getFileExtension(fileName);
        boolean validExtension = false;
        for (String allowedExt : ALLOWED_EXTENSIONS) {
            if (allowedExt.equalsIgnoreCase(fileExtension)) {
                validExtension = true;
                break;
            }
        }
        
        if (!validExtension) {
            return "지원하지 않는 파일 형식입니다. JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다.";
        }
        
        // Check MIME type
        boolean validMimeType = false;
        for (String allowedMime : ALLOWED_MIME_TYPES) {
            if (allowedMime.equalsIgnoreCase(contentType)) {
                validMimeType = true;
                break;
            }
        }
        
        if (!validMimeType) {
            return "지원하지 않는 파일 형식입니다. 이미지 파일만 업로드 가능합니다.";
        }
        
        return null; // No validation errors
    }
    
    /**
     * Extract file extension from filename
     */
    private String getFileExtension(String fileName) {
        if (fileName != null && fileName.lastIndexOf(".") != -1) {
            return fileName.substring(fileName.lastIndexOf("."));
        }
        return "";
    }
    
    /**
     * Generate unique filename to prevent overwrites
     */
    private String generateUniqueFileName(String extension) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().replace("-", "");
        return timestamp + "_" + uuid + extension;
    }
}