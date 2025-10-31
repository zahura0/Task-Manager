# Quick Checklist - After CORS Fix

## ✅ Before Testing

- [ ] Frontend built and deployed to Vercel
- [ ] Backend deployed to Vercel
- [ ] `frontend/.env` has correct `VITE_API_URL`
- [ ] Backend CORS middleware updated
- [ ] Browser cache cleared

## 🧪 Testing on Desktop

1. Open DevTools (F12)
2. Go to Console tab
3. Clear all messages (right-click → Clear console)
4. Go to Network tab
5. Refresh page (F5)
6. Try to login
7. Check for CORS errors in Network tab and Console

## 📱 Testing on Mobile

1. Open Vercel frontend URL on mobile
2. Open DevTools (if on Android with remote debugging via USB)
3. Or monitor console errors via log statements
4. Try to login
5. If error persists, check the desktop console first

## 🔗 Important URLs

- **Frontend**: https://task-manager-frontend-psi-ten.vercel.app
- **Backend**: https://task-manager-backend-flax-nu.vercel.app
- **Backend Health**: https://task-manager-backend-flax-nu.vercel.app/api/health

## 📋 Expected Success Signs

✓ Login page loads without errors  
✓ No red errors in browser console  
✓ Login request shows in Network tab with status 200/201  
✓ Redirects to dashboard after successful login  
✓ Dashboard loads with tasks  

## ⚠️ Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| Still seeing CORS error | Restart backend, clear cache, hard refresh (Ctrl+Shift+Del + Ctrl+F5) |
| Double slashes in URL | Redeploy frontend, check that `.env` URL doesn't have trailing slash |
| Blank page | Check console for JavaScript errors, verify backend health endpoint |
| 404 Not Found | Check backend API routes are correct |
| Timeout errors | Check internet connection, verify backend is running |

