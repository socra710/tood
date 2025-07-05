# Image Upload Servlet - Deployment Guide

This document explains how to deploy the Java servlet for handling image uploads from the Quill editor.

## Files Included

1. **ImageUploadServlet.java** - The main servlet class for handling image uploads
2. **web.xml** - Web application deployment descriptor
3. **Frontend API endpoint** - `/src/routes/api/upload/image/+server.ts` - SvelteKit proxy endpoint

## Dependencies Required

The servlet requires the following dependencies:

```xml
<!-- For Maven projects (pom.xml) -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>4.0.1</version>
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
</dependency>
```

## Installation Steps

### 1. Java Backend Setup

1. **Copy the servlet file**: Place `ImageUploadServlet.java` in your Java web application's source directory:
   ```
   src/main/java/com/tood/servlet/ImageUploadServlet.java
   ```

2. **Update web.xml**: Merge the provided `web.xml` configuration with your existing web.xml file, or use it as a complete replacement.

3. **Create upload directory**: Ensure the uploads directory exists in your web application:
   ```
   webapp/uploads/images/
   ```

4. **Set permissions**: Make sure the servlet container has write permissions to the upload directory.

### 2. Build and Deploy

1. **Compile the servlet**: 
   ```bash
   javac -cp "lib/*" src/main/java/com/tood/servlet/ImageUploadServlet.java
   ```

2. **Package the web application**:
   ```bash
   jar -cvf tood.war *
   ```

3. **Deploy to servlet container** (Tomcat, Jetty, etc.)

### 3. Frontend Configuration

The frontend is already configured to use the `/api/upload/image` endpoint, which acts as a proxy to the Java backend.

Make sure your `VITE_API_URL` environment variable points to your Java backend:
```env
VITE_API_URL=http://your-java-backend-url
```

## Features

### Image Upload Handling
- Accepts multipart/form-data requests
- Validates file type (JPEG, PNG, GIF, WEBP)
- Validates file size (max 10MB)
- Generates unique filenames to prevent overwrites
- Returns JSON response with image URL

### Security Features
- CORS headers for frontend integration
- File type validation
- File size limits
- Unique filename generation
- Error handling and logging

### Response Format

**Success Response:**
```json
{
  "success": true,
  "imageUrl": "/uploads/images/1234567890_uuid.jpg",
  "message": "이미지가 성공적으로 업로드되었습니다."
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message in Korean"
}
```

## Integration with Quill Editor

The servlet is designed to work seamlessly with the Quill editor's image upload functionality:

1. User clicks the image button in Quill toolbar
2. File picker opens for image selection
3. Selected image is uploaded to `/api/upload/image` (frontend proxy)
4. Frontend proxy forwards to Java backend `/upload/image`
5. Java servlet processes the upload and returns image URL
6. Frontend receives response and inserts image into Quill editor

## Error Handling

The servlet handles various error scenarios:
- Missing or invalid files
- Unsupported file types
- File size limits exceeded
- Server errors during upload
- CORS preflight requests

## Directory Structure

```
webapp/
├── WEB-INF/
│   ├── web.xml
│   └── classes/
│       └── com/
│           └── tood/
│               └── servlet/
│                   └── ImageUploadServlet.class
├── uploads/
│   └── images/
│       └── (uploaded images)
└── ...
```

## Testing

You can test the servlet using curl:

```bash
curl -X POST \
  -F "image=@test-image.jpg" \
  http://your-backend-url/upload/image
```

## Troubleshooting

1. **403 Forbidden**: Check directory permissions
2. **404 Not Found**: Verify servlet mapping in web.xml
3. **500 Internal Server Error**: Check servlet container logs
4. **CORS Issues**: Ensure CORS headers are properly configured

## Notes

- The servlet generates unique filenames using timestamp and UUID
- Uploaded images are stored in the `/uploads/images/` directory
- The servlet supports common image formats (JPEG, PNG, GIF, WEBP)
- Maximum file size is set to 10MB (configurable in web.xml)
- The frontend proxy handles authentication and forwards requests to the Java backend