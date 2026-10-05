# 🚀 AWS EC2 Deployment & Dockerization Guide (Complete Hindi / English)

यह गाइड आपके **RNT School Management System** (React Frontend + Node.js Backend + MySQL Database) को **AWS EC2** पर Docker के जरिए पूरी तरह लाइव करने के लिए तैयार की गई है।

---

## 📋 आर्किटेक्चर (Architecture Overview)

```
   [Internet / Users]
           │
           ▼
     [AWS EC2 Port 80 / 443]
           │
   ┌───────┴─────────────────────────────────────────┐
   │ Docker Network: rntschool_network               │
   │                                                 │
   │  ┌──────────────────┐    /api/   ┌────────────┐ │
   │  │ Frontend (Nginx) │ ─────────> │  Backend   │ │
   │  │   React Build    │            │  (Node.js) │ │
   │  └──────────────────┘            └─────┬──────┘ │
   │                                        │        │
   │                                        ▼        │
   │                                  ┌────────────┐ │
   │                                  │   MySQL    │ │
   │                                  │  Database  │ │
   │                                  └────────────┘ │
   └─────────────────────────────────────────────────┘
```

---

## 🛠️ Step 1: AWS EC2 Instance Launch करना

1. **AWS Console** में लॉगिन करें और **EC2** सर्विस खोलें।
2. **Launch Instance** पर क्लिक करें:
   - **Name**: `RNTSchool-Server`
   - **OS Image (AMI)**: `Ubuntu Server 24.04 LTS` (या 22.04 LTS) (64-bit x86)
   - **Instance Type**: `t3.small` (2 vCPU, 2GB RAM) या `t3.medium` (4GB RAM)
     *(कम से कम 2GB RAM वाला instance लें ताकि Vite build और MySQL smooth चलें)*
   - **Key Pair**: नया Key Pair बनाएं (जैसे `rnt-key.pem`) और अपने कंप्यूटर पर सुरक्षित डाउनलोड करें।
   - **Network Settings (Security Group)**:
     - ✅ **Allow SSH traffic from Anywhere** (Port 22)
     - ✅ **Allow HTTP traffic from the internet** (Port 80)
     - ✅ **Allow HTTPS traffic from the internet** (Port 443)
   - **Configure Storage**: कम से कम `20 GiB` or `30 GiB` (gp3).
3. **Launch Instance** पर क्लिक करें।

---

## 🔒 Step 2: Elastic IP Attach करना (Recommended)

EC2 का Public IP रीस्टार्ट होने पर बदल जाता है, इसलिए एक स्थायी (Static) IP लगाना जरूरी है:
1. EC2 डैशबोर्ड में बायीं तरफ **Network & Security** > **Elastic IPs** पर जाएं।
2. **Allocate Elastic IP address** पर क्लिक करें।
3. बने हुए IP पर Actions > **Associate Elastic IP address** चुनें और अपने Instance को सेलेक्ट करके जोड़ दें।

---

## 💻 Step 3: EC2 Instance से Connect करना

अपने कंप्यूटर के Terminal (या PowerShell / Command Prompt) में जाएं जहां आपकी `.pem` key सेव है:

```bash
# Windows PowerShell या Mac/Linux Terminal:
ssh -i "rnt-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

*(अगर Linux/Mac पर permissions एरर आए तो पहले `chmod 400 rnt-key.pem` चलाएं)*

---

## 📥 Step 4: प्रोजेक्ट कोड EC2 पर डालना

### Option A: Git Clone (सबसे आसान तरीका)
अगर आपका प्रोजेक्ट GitHub/GitLab पर है:
```bash
git clone https://github.com/Prakash8279/rntschool.git
cd rntschool
```

### Option B: Local Computer से सीधे EC2 पर कॉपी करना (SCP)
अपने लोकल Windows कंप्यूटर के PowerShell से:
```powershell
scp -i "rnt-key.pem" -r d:\rntschool ubuntu@<YOUR_EC2_PUBLIC_IP>:~/rntschool
```
इसके बाद EC2 SSH में:
```bash
cd ~/rntschool
```

---

## ⚡ Step 5: One-Click Deployment Script चलाना

प्रोजेक्ट फोल्डर के अंदर हमने `deploy.sh` स्क्रिप्ट तैयार कर रखी है:

```bash
# 1. Execute permissions दें:
chmod +x deploy.sh backup_db.sh

# 2. Deploy script रन करें:
./deploy.sh
```

### यह स्क्रिप्ट क्या करती है?
1. Ubuntu पैकेज अपडेट करती है।
2. Docker और Docker Compose ऑटोमैटिक इंस्टॉल और इनेबल करती है।
3. `.env` फ़ाइल तैयार करती है।
4. `docker-compose.yml` के सभी 3 कंटेनर्स (MySQL, Node Backend, Nginx Frontend) को बिल्ड करके बैकग्राउंड में स्टार्ट कर देती है।
5. डेटाबेस को आपके `school.sql` से पहली बार ऑटो-इनिशियलाइज़ कर देती है।

---

## 🌐 Step 6: Application टेस्ट करना

ब्राउज़र में अपना Public IP खोलें:
```
http://<YOUR_EC2_PUBLIC_IP>
```
आपका RNT School Management Portal तुरंत लोड हो जाएगा!
- Frontend सीधे Port 80 पर चलेगा।
- सभी API कॉल्स (`/api/*`) Nginx के जरिए सीधे Node Backend पर रूट होंगी।
- सभी इमेजेस और डॉक्यूमेंट्स (`/uploads/*`) परसिस्टेंट वॉल्यूम में सुरक्षित रहेंगे।

---

## 🔐 Step 7: Domain Name & Free SSL (HTTPS) सेटअप (Optional लेकिन ज़रूरी)

अगर आपके पास एक डोमेन है (जैसे `school.yourdomain.com`):

1. **DNS Mapping**:
   - अपने डोमेन प्रोवाइडर (GoDaddy / Cloudflare / Namecheap) के DNS में जाएं।
   - **Type A Record** बनाएं:
     - Name: `@` (या subdomain जैसे `portal`)
     - Value: `<YOUR_EC2_PUBLIC_IP>`

2. **Free Let's Encrypt SSL लगाना**:
   EC2 टर्मिनल पर:
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot certonly --standalone -d school.yourdomain.com
   ```

---

## 💾 Step 8: Automatic Daily Database Backup (क्रॉन जॉब)

डेटाबेस बैकअप के लिए `backup_db.sh` मौजूद है। इसे रोज़ाना रात 2 बजे ऑटोमैटिक चलाने के लिए:

```bash
crontab -e
```
सबसे नीचे यह लाइन जोड़ें:
```bash
0 2 * * * /home/ubuntu/rntschool/backup_db.sh >> /home/ubuntu/rntschool/backup.log 2>&1
```
यह रोज़ाना बैकअप बनाएगा और 14 दिन से पुराने बैकअप ऑटोमैटिक डिलीट करेगा।

---

## 📋 Useful Docker Commands

```bash
# कंटेनर्स का स्टेटस देखना:
sudo docker compose ps

# लाइव लॉग्स चेक करना (Debugging के लिए):
sudo docker compose logs -f
sudo docker compose logs -f backend
sudo docker compose logs -f frontend
sudo docker compose logs -f db

# कोड अपडेट करने के बाद री-डिप्लॉय करना:
git pull
sudo docker compose up -d --build

# सभी कंटेनर्स बंद करना:
sudo docker compose down

# कंटेनर रीस्टार्ट करना:
sudo docker compose restart
```

---

## ⚙️ Environment Configuration (`.env`)

प्रोजेक्ट के रूट में `.env` मौजूद है:
```env
DB_ROOT_PASSWORD=YourStrongPasswordHere
DB_NAME=school
DB_USER=school_user
DB_PASS=YourStrongUserPassword
JWT_SECRET=superSecretKeyForTokenGeneration
PORT=5000
VITE_API_URL=/api
```
जब भी `.env` में कोई बदलाव करें, कंटेनर्स को रीस्टार्ट करें:
```bash
sudo docker compose up -d --build
```
