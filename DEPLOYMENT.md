# Deployment Guide — Oracle Cloud Always Free + Custom Domain

End-to-end, zero-cost deployment. Time: ~60–90 minutes for the first deploy.

---

## What you'll build

```
GitHub  ──push──►  GitHub Actions  ──SSH──►  Oracle Cloud A1.Flex VM
                                              │
                                              ├─ Nginx (reverse proxy + SSL)
                                              ├─ PM2 (process manager)
                                              └─ Next.js production server (port 3000)
                                                       ▲
                                                       │
                                              Public Internet (HTTPS)
                                                       ▲
                                                       │
                                              Cloudflare DNS (your domain)
```

---

## Phase 8 — Oracle Cloud Deployment

### Step 1: Create Oracle Cloud account

1. Go to https://signup.cloud.oracle.com.
2. Sign up — requires a credit card for verification (no charge on Always Free resources).
3. **Important:** during signup, choose a **home region** close to your users (e.g., Mumbai for India). You can't change it later.
4. Confirm email, finish onboarding.

> **Why Oracle?** It's the only major cloud with a genuine, perpetual free tier that gives you a real VM with 4 OCPUs and 24 GB RAM (across the A1.Flex shape). Vercel's free tier has bandwidth limits; Oracle doesn't.

---

### Step 2: Provision a VM (A1.Flex — Always Free)

1. From the OCI console: **Compute → Instances → Create Instance**.
2. Configure:
   | Setting | Value |
   |---------|-------|
   | Name | `portfolio-prod` |
   | Image | **Canonical Ubuntu 22.04** (or 24.04) |
   | Shape | **VM.Standard.A1.Flex** (Ampere ARM — Always Free) |
   | OCPUs | 1 |
   | Memory | 6 GB |
   | Networking | Use default VCN + subnet (or create new) |
   | Public IP | **Assign a public IPv4** ← critical |
   | SSH | Upload your **public key** (`~/.ssh/id_ed25519.pub` from your local machine) |

3. Click **Create**. Wait ~60 seconds for state = **Running**.
4. Copy the **Public IP address**. You'll use it everywhere below.

---

### Step 3: Open ports on Oracle's network firewall

Oracle has TWO firewalls. You need both open.

#### A. VCN Security List
1. Console → **Networking → Virtual Cloud Networks → (your VCN) → Security Lists → Default Security List**.
2. **Add Ingress Rule** (twice):
   | Source CIDR | IP Protocol | Dest. Port |
   |-------------|-------------|------------|
   | 0.0.0.0/0 | TCP | 80 |
   | 0.0.0.0/0 | TCP | 443 |

The setup script handles the second firewall (iptables on the VM itself).

---

### Step 4: First SSH + harden

From your **local machine**:

```bash
ssh ubuntu@<your-public-ip>
```

Should connect on first try (Ubuntu image already trusts your key).

---

### Step 5: Run the setup script

Copy the bootstrap script and run it. From your local machine:

```bash
scp scripts/setup-server.sh ubuntu@<your-public-ip>:~/
ssh ubuntu@<your-public-ip>
bash setup-server.sh
```

The script does:
- System updates + security packages (fail2ban, ufw, unattended-upgrades)
- Installs Node.js 20 + PM2 + nginx + Certbot
- Creates a non-root `deploy` user (and copies your SSH keys to it)
- Hardens SSH (disables root login + password auth)
- Configures UFW + opens iptables for ports 80/443 (Oracle quirk)
- Creates `/var/www/portfolio/{releases,shared}` directory structure

When done, switch to the deploy user:
```bash
exit
ssh deploy@<your-public-ip>
```

---

### Step 6: Install nginx config

From your **local machine**:
```bash
scp scripts/nginx.conf deploy@<your-public-ip>:/tmp/
ssh deploy@<your-public-ip>
sudo mv /tmp/nginx.conf /etc/nginx/sites-available/portfolio
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo nginx -t
sudo systemctl reload nginx
```

Now visiting `http://<your-public-ip>` should reach nginx (will 502 because the app isn't running yet — that's fine).

---

### Step 7: First deploy

From your **local machine** (project root):
```bash
bash scripts/deploy.sh deploy@<your-public-ip>
```

This builds locally → tars artifacts → ships to server → installs prod deps → starts PM2.

After ~2 minutes:
```bash
curl -I http://<your-public-ip>
# Should return HTTP 200
```

Visit `http://<your-public-ip>` in a browser — you should see the portfolio.

---

### Step 8: Make PM2 survive reboots

```bash
ssh deploy@<your-public-ip>
pm2 startup systemd
# Copy & run the sudo command it prints
pm2 save
```

Now if the VM reboots, the app comes back up automatically.

---

## Phase 9 — Domain Mapping

### Step 1: Buy a domain

If you don't have one yet:
- **Cloudflare Registrar** — at-cost pricing, free DNS, no upsells. Recommended.
- Namecheap, Google Domains, GoDaddy all work.

Suggested: `siddharthakumar.dev` (or `.com`, `.io`).

---

### Step 2: Set up DNS

#### Option A — Cloudflare (recommended; free, fast, includes DDoS protection)

1. Sign up at cloudflare.com.
2. Add your domain → choose **Free plan**.
3. Cloudflare gives you 2 nameservers — go back to your registrar and update the nameservers to those.
4. Wait 5–30 min for propagation.
5. In Cloudflare → **DNS** → Add records:

   | Type | Name | Target | Proxy | TTL |
   |------|------|--------|-------|-----|
   | A | `@` | `<your-public-ip>` | DNS only (gray cloud) | Auto |
   | A | `www` | `<your-public-ip>` | DNS only (gray cloud) | Auto |

   > **Important:** Use **DNS only (gray cloud)** for the initial setup. After Let's Encrypt issues your certificate, you can flip to **Proxied (orange cloud)** for CDN benefits. If you proxy first, Certbot's HTTP-01 challenge can fail.

6. Verify: `dig +short siddharthakumar.dev` should return your VM's public IP.

#### Option B — Namecheap / GoDaddy / others

In your registrar's DNS panel, add:
| Host | Type | Value | TTL |
|------|------|-------|-----|
| @ | A | `<your-public-ip>` | 1 hour |
| www | A | `<your-public-ip>` | 1 hour |

Verify with `dig +short siddharthakumar.dev`.

#### Option C — Oracle DNS

OCI also offers free public DNS (`Networking → DNS Management → Zones`). Same A record setup. Less common — Cloudflare is usually better.

---

### Step 3: Get the SSL certificate

Once DNS resolves to your VM:

```bash
ssh deploy@<your-public-ip>
sudo certbot --nginx -d siddharthakumar.dev -d www.siddharthakumar.dev
```

Answer the prompts:
- Email: yours (for renewal alerts)
- Terms: agree
- Redirect HTTP→HTTPS: **yes** (option 2)

Certbot will:
1. Verify domain ownership via HTTP-01 challenge.
2. Get a Let's Encrypt cert (90-day validity).
3. Auto-edit your nginx config to add the HTTPS server block.
4. Set up a systemd timer that auto-renews twice daily.

Verify:
```bash
curl -I https://siddharthakumar.dev
# HTTP/2 200
```

---

### Step 4: Switch on Cloudflare proxy (optional, recommended)

After SSL is working:
1. Cloudflare → DNS → flip both records from **DNS only (gray)** to **Proxied (orange)**.
2. Cloudflare → SSL/TLS → Set mode to **Full (strict)** — this is critical.
3. (Optional) Cloudflare → Speed → Optimization → enable **Auto Minify**, **Brotli**.

You now get:
- Hidden origin IP (extra security)
- Edge caching of static assets
- Free DDoS protection
- ~30% faster response times globally

---

### Step 5: Wire up CI/CD

In your GitHub repo settings → **Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|--------|-------|
| `ORACLE_SSH_PRIVATE_KEY` | Contents of your `~/.ssh/id_ed25519` (the **private** key) |
| `ORACLE_SSH_HOST` | Your domain or public IP |
| `ORACLE_SSH_USER` | `deploy` |
| `SITE_DOMAIN` | `siddharthakumar.dev` |

Now `git push origin main` triggers an auto-deploy. Watch it run in the **Actions** tab.

---

## Operations

### View logs
```bash
ssh deploy@<your-public-ip>
pm2 logs siddhartha-portfolio        # app stdout/stderr
sudo tail -f /var/log/nginx/access.log   # nginx requests
sudo tail -f /var/log/nginx/error.log
```

### Roll back a bad deploy
```bash
ssh deploy@<your-public-ip>
ls /var/www/portfolio/releases/      # see all kept releases (default: 3)
ln -sfn /var/www/portfolio/releases/<previous-timestamp> /var/www/portfolio/current
pm2 reload siddhartha-portfolio
```

### Restart everything
```bash
pm2 restart siddhartha-portfolio
sudo systemctl restart nginx
```

### Update the app manually (without GitHub Actions)
From your local machine:
```bash
bash scripts/deploy.sh deploy@<your-public-ip>
```

### Backup
The whole app fits in a tarball:
```bash
ssh deploy@<your-public-ip> 'tar -czf /tmp/portfolio-backup.tar.gz -C /var/www portfolio'
scp deploy@<your-public-ip>:/tmp/portfolio-backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz
```

### Renew SSL (auto, but verify)
```bash
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```

### Upgrade the OS
```bash
sudo apt update && sudo apt upgrade -y
sudo reboot   # only if kernel updated
```

---

## Monitoring

Lightweight, free options:

| Tool | What | How |
|------|------|-----|
| **UptimeRobot** | HTTPS uptime checks every 5 min, free for 50 monitors | uptimerobot.com — add your domain, get email/SMS alerts |
| **Better Stack (Logtail)** | Centralized logs, free 1 GB/month | Configure rsyslog to forward `/var/log/portfolio/*` |
| **Plausible / Umami** | Privacy-friendly analytics | Self-host on the same VM (Docker), or use their hosted tier |
| **PM2 Plus** | Process metrics dashboard | `pm2 link <secret> <public>` from pm2.io |

---

## Troubleshooting

### "502 Bad Gateway" from nginx
- App isn't running. `pm2 status` to check.
- App is on wrong port. `lsof -i :3000` should show node.
- Logs: `pm2 logs siddhartha-portfolio --lines 50`.

### Certbot fails with "DNS problem"
- DNS hasn't propagated yet. Wait, then `dig +short siddharthakumar.dev` to confirm IP.
- If using Cloudflare, ensure proxy is **off (gray cloud)** during cert issuance.

### Site is slow
- Check VM CPU: `htop`. A1.Flex 1 OCPU should easily handle a portfolio.
- Enable Cloudflare proxy for edge caching.
- Review nginx error log for slow upstream timeouts.

### "Permission denied" during deploy
- Ensure you've run the setup script (creates `deploy` user with SSH access).
- Verify `~/.ssh/authorized_keys` exists on `deploy` user with your public key.

### GitHub Actions deploy fails on SSH
- The `ORACLE_SSH_PRIVATE_KEY` secret must include the `-----BEGIN/END-----` lines.
- Use ED25519 (`ssh-keygen -t ed25519`) — not RSA.

### App crashes after a few hours
- Check `pm2 logs`. If OOM: bump `max_memory_restart` in `ecosystem.config.js`.
- A1.Flex with 6 GB should be plenty for a Next.js portfolio.

---

## Cost reality check

Always Free A1.Flex tier:
- ✅ 4 OCPUs + 24 GB RAM (across all A1 instances)
- ✅ 200 GB block storage
- ✅ 10 TB/month outbound data transfer
- ✅ Forever, no expiration

Your portfolio uses ~1 OCPU + 6 GB RAM + ~5 GB disk + <50 GB/month bandwidth. **Comfortably free.**

The only paid item: your domain name (~$10–15/year). Everything else is $0 forever.
