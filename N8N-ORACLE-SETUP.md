# n8n dauerhaft kostenlos betreiben – Oracle Cloud „Always Free"

Ziel: n8n läuft rund um die Uhr auf einem kostenlosen Oracle-Server, erreichbar
über **HTTPS**, und speichert Rezepte in **Firebase Firestore** (ebenfalls gratis).

So sieht das fertige Bild aus:

```
Browser (deine Cloudflare-Seite, HTTPS)
        │  ruft Webhook auf
        ▼
n8n auf Oracle-Server (HTTPS via DuckDNS + Caddy)
        │  speichert Rezepte
        ▼
Firebase Firestore (kostenloser Spark-Plan)
```

Aufwand: einmalig ca. 45–60 Min. Danach läuft alles von selbst.

---

## Teil A – Kostenlosen Oracle-Server erstellen

1. Konto anlegen auf **https://www.oracle.com/cloud/free/**.
   - Eine Kreditkarte wird nur zur **Identitätsprüfung** verlangt – die
     „Always Free"-Ressourcen kosten dauerhaft nichts.
2. In der Oracle-Konsole: **Menu → Compute → Instances → Create Instance**.
   - **Image:** Canonical **Ubuntu 22.04**.
   - **Shape:** „Change Shape" → **Ampere (ARM) → VM.Standard.A1.Flex**,
     z. B. **2 OCPU / 12 GB RAM** (liegt im Always-Free-Rahmen).
   - **SSH-Keys:** „Generate a key pair for me" → **beide Dateien herunterladen**
     (den privaten Schlüssel brauchst du gleich zum Einloggen).
   - **Create** klicken. Notiere dir die **Public IP** der Instanz.

> Falls „Out of capacity" kommt: einfach später oder in einer anderen
> Availability Domain nochmal probieren – ARM-Kapazität ist manchmal knapp.

3. **Ports freigeben** (damit die Website n8n erreicht):
   - **Networking → Virtual Cloud Networks → dein VCN → Security Lists →
     Default Security List → Add Ingress Rules.**
   - Zwei Regeln hinzufügen, jeweils Source `0.0.0.0/0`, IP Protocol TCP:
     **Destination Port 80** und **Destination Port 443**.

---

## Teil B – Kostenlose HTTPS-Adresse (DuckDNS)

1. Auf **https://www.duckdns.org** mit Google/GitHub einloggen.
2. Eine Subdomain anlegen, z. B. `code-a-cuisine`.
3. Bei „current ip" die **Public IP deines Oracle-Servers** eintragen, **update**.
   → Deine n8n-Adresse ist dann: `https://code-a-cuisine.duckdns.org`

---

## Teil C – Mit dem Server verbinden & Docker installieren

Auf deinem Windows-Rechner (PowerShell oder Git Bash), privaten SSH-Schlüssel nutzen:

```bash
ssh -i pfad/zum/private_key ubuntu@DEINE_ORACLE_IP
```

Auf dem Server dann der Reihe nach:

```bash
sudo apt update && sudo apt -y upgrade
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
# Firewall des Servers für Web öffnen
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

Danach einmal **ab- und wieder einloggen** (damit Docker ohne `sudo` läuft).

---

## Teil D – n8n starten (mit HTTPS und Datenbank)

Auf dem Server einen Ordner anlegen und zwei Dateien erstellen:

```bash
mkdir ~/n8n && cd ~/n8n
```

**Datei `docker-compose.yml`** (`nano docker-compose.yml`, Inhalt einfügen,
`DEINE-SUBDOMAIN` und die zwei Passwörter anpassen):

```yaml
services:
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    depends_on:
      - n8n

  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    environment:
      - N8N_HOST=DEINE-SUBDOMAIN.duckdns.org
      - N8N_PROTOCOL=https
      - N8N_PORT=5678
      - WEBHOOK_URL=https://DEINE-SUBDOMAIN.duckdns.org/
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=EIN_DB_PASSWORT
      - GENERIC_TIMEZONE=Europe/Berlin
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=EIN_DB_PASSWORT
      - POSTGRES_DB=n8n
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  caddy_data:
  n8n_data:
  pg_data:
```

**Datei `Caddyfile`** (`nano Caddyfile`, Subdomain anpassen):

```
DEINE-SUBDOMAIN.duckdns.org {
    reverse_proxy n8n:5678
}
```

Starten:

```bash
docker compose up -d
```

Nach ~1 Minute ist n8n unter `https://DEINE-SUBDOMAIN.duckdns.org` erreichbar
(Caddy holt das HTTPS-Zertifikat automatisch). Beim ersten Aufruf legst du dort
dein n8n-Login an.

---

## Teil E – Deinen bestehenden Workflow einspielen

Du hast den Workflow schon im Projekt: `n8n/code-a-cuisine-recipe-generation.json`.

1. In n8n oben rechts **… → Import from File** → diese JSON-Datei wählen.
2. Firebase anbinden (Details stehen in `n8n/N8N-SETUP.md`):
   - Firebase-Projekt anlegen, **Firestore-Datenbank** erstellen (Spark-Plan, gratis).
   - In n8n den Credential **„Google Firebase Cloud Firestore API"** hinterlegen.
   - Im Node **„Save to Firestore"** `YOUR_FIREBASE_PROJECT_ID` durch deine
     echte Projekt-ID ersetzen.
3. Workflow **aktivieren**. Die produktive Webhook-URL zeigt n8n dir an – sie
   sieht so aus: `https://DEINE-SUBDOMAIN.duckdns.org/webhook/generate-recipesng`.

---

## Teil F – App auf die neue Webhook-Adresse zeigen & CORS

1. In `src/app/core/config/app-config.ts` die `n8nWebhookUrl` auf die neue
   DuckDNS-Adresse aus Teil E setzen, dann committen und pushen (Cloudflare
   baut automatisch neu).
2. In n8n beim **Webhook-Node → Options → Allowed Origins (CORS)** deine
   Cloudflare-Adresse eintragen (z. B. `https://code-a-cuisine.pages.dev`),
   damit der Browser den Aufruf machen darf. Danach Workflow neu aktivieren.

---

## Fertig

- **Website:** Cloudflare Pages – immer online, gratis.
- **n8n:** Oracle „Always Free" – läuft dauerhaft, gratis.
- **Datenbank:** Firebase Firestore – Spark-Plan, gratis.

Alles läuft unabhängig von deinem Rechner. Du kannst ihn jederzeit ausschalten.
