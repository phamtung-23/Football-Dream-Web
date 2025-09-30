# Google OAuth Setup Guide

Hướng dẫn thiết lập đăng nhập bằng Google với NextAuth.js

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo một project mới hoặc chọn project hiện có
3. Đảm bảo billing được bật cho project

## Bước 2: Kích hoạt Google+ API

1. Trong Google Cloud Console, đi tới **APIs & Services** > **Library**
2. Tìm kiếm "Google+ API" hoặc "Google Identity"
3. Kích hoạt API này

## Bước 3: Tạo OAuth 2.0 Credentials

1. Đi tới **APIs & Services** > **Credentials**
2. Nhấn **Create Credentials** > **OAuth 2.0 Client IDs**
3. Chọn **Web application** làm application type
4. Đặt tên cho client ID (ví dụ: "My Dream Football OAuth")
5. Thêm **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

## Bước 4: Cấu hình Environment Variables

1. Copy file `env.example` thành `.env.local`
2. Thêm các biến môi trường sau:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## Bước 5: Lấy Client ID và Secret

1. Trong Google Cloud Console, đi tới **APIs & Services** > **Credentials**
2. Nhấn vào OAuth 2.0 Client ID vừa tạo
3. Copy **Client ID** và **Client Secret**
4. Paste vào file `.env.local`

## Bước 6: Test Google OAuth

1. Khởi động ứng dụng: `npm run dev`
2. Đi tới trang đăng nhập
3. Nhấn "Continue with Google"
4. Đăng nhập bằng tài khoản Google của bạn

## Lưu ý quan trọng

- **Không bao giờ commit file `.env.local`** vào git
- Đảm bảo redirect URI chính xác
- Trong production, sử dụng HTTPS
- Kiểm tra domain được authorized trong Google Console

## Troubleshooting

### Lỗi "redirect_uri_mismatch"
- Kiểm tra redirect URI trong Google Console
- Đảm bảo URL chính xác (bao gồm protocol và port)

### Lỗi "invalid_client"
- Kiểm tra Client ID và Client Secret
- Đảm bảo không có khoảng trắng thừa

### Lỗi "access_denied"
- Kiểm tra OAuth consent screen
- Đảm bảo user được thêm vào test users (nếu app chưa verify)
