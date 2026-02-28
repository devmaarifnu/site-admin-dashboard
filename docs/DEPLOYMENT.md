# 🚀 Panduan Deployment Standalone

## Build Standalone

Untuk membuat build standalone, jalankan:

```bash
npm run build:standalone
```

Command ini akan:
1. Build aplikasi Next.js dalam mode standalone
2. Copy static files ke `.next/standalone/.next/static`
3. Copy public files ke `.next/standalone/public`
4. Copy file `.env` ke `.next/standalone/.env`

## 📂 Struktur Output

Setelah build selesai, folder `.next/standalone` akan berisi:

```
.next/standalone/
├── .next/
│   └── static/          # Asset static (JS, CSS, dll)
├── public/              # File public (images, fonts, dll)
├── node_modules/        # Dependencies minimal yang diperlukan
├── server.js           # Entry point server
├── package.json
└── .env                # Environment variables
```

## 🖥️ Menjalankan di Development

Untuk test standalone build di local:

```bash
npm run start:standalone
```

Atau:

```bash
cd .next/standalone
node server.js
```

Server akan berjalan di port yang ditentukan di environment variable `PORT` (default: 3000).

## 🌐 Deployment ke Production Server

### Option 1: Manual Deploy

1. **Copy folder standalone ke server:**

```bash
# Compress folder
tar -czf standalone.tar.gz .next/standalone/

# Upload ke server (contoh dengan scp)
scp standalone.tar.gz user@server:/path/to/app/

# Di server, extract
ssh user@server
cd /path/to/app
tar -xzf standalone.tar.gz
cd .next/standalone
```

2. **Setup environment variables:**

```bash
# Edit file .env di server
nano .env
```

Pastikan konfigurasi berikut sudah benar:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
# ... variable lainnya
```

3. **Jalankan aplikasi:**

```bash
# Development/Testing
NODE_ENV=production PORT=3000 node server.js

# Production dengan PM2 (recommended)
pm2 start server.js --name "maarif-admin" -i max
pm2 save
pm2 startup
```

### Option 2: Deploy dengan Docker

1. **Buat Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy standalone build
COPY .next/standalone ./
COPY .env ./

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start server
CMD ["node", "server.js"]
```

2. **Build dan run Docker:**

```bash
# Build image
docker build -t maarif-admin .

# Run container
docker run -p 3000:3000 --env-file .env maarif-admin
```

### Option 3: Deploy dengan PM2 Ecosystem

Buat file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'maarif-admin',
    script: './.next/standalone/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Jalankan:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 Nginx Reverse Proxy (Recommended)

Setup Nginx sebagai reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## ⚡ Performance Tips

1. **Gunakan PM2 cluster mode** untuk load balancing
2. **Setup Nginx caching** untuk static assets
3. **Enable gzip compression** di Nginx
4. **Monitor dengan PM2 plus** atau tools monitoring lainnya

## 🔐 Security Checklist

- [ ] Jangan commit file `.env` ke git
- [ ] Gunakan HTTPS di production
- [ ] Set `NODE_ENV=production`
- [ ] Batasi akses SSH ke server
- [ ] Setup firewall (ufw/iptables)
- [ ] Regular update dependencies
- [ ] Setup automated backups

## 📊 Monitoring

Monitor aplikasi dengan PM2:

```bash
# Lihat status
pm2 status

# Monitor resources
pm2 monit

# Lihat logs
pm2 logs maarif-admin

# Restart aplikasi
pm2 restart maarif-admin
```

## 🆘 Troubleshooting

**Error: Cannot find module**
```bash
# Pastikan semua file tercopy dengan benar
npm run build:standalone
```

**Port sudah digunakan**
```bash
# Ubah PORT di environment
PORT=3001 node server.js
```

**Memory issues**
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" node server.js
```

## 📝 Notes

- Build size: ~50-100MB (tergantung dependencies)
- Tidak perlu install dependencies di server (sudah included)
- Support Node.js >= 18.0.0
- Compatible dengan semua platform (Linux, Windows, macOS)
