# 🎵 **RESPECT UYGULAMASI - ROADMAP & VERİTABANI TASARIMI**

## 📋 **UYGULAMA GENEL MANTIĞI**

Respect uygulaması, müzik tutkunlarının sanatçıları ve şarkıları destekleyebileceği, topluluk oluşturabileceği ve gerçek zamanlı iletişim kurabileceği bir platformdur.

### **🎯 Ana Özellikler:**
1. **Kullanıcı Kayıt & Profil Sistemi** - Email ile kayıt, profil oluşturma
2. **Sanatçı & Şarkı Takip Sistemi** - Favori ekleme, takip etme
3. **Respect Ekonomisi** - Sanatçılara ve şarkılara respect gönderme
4. **Topluluk Feed'i** - Genel ve kişiselleştirilmiş aktivite akışı
5. **Gerçek Zamanlı Chat** - Ortak ilgi alanlarına sahip kullanıcılar arası iletişim
6. **Ortak Topluluklar** - Benzer zevklere sahip kullanıcıların bir araya gelmesi

---

## 🗄️ **VERİTABANI ŞEMASI TASARIMI**

### **📊 Ana Tablolar**

#### **1. Kullanıcı Profilleri (profiles)**
```sql
CREATE TABLE public.profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  full_name text,
  bio text,
  avatar_url text,
  respect_balance integer default 1000,
  total_respect_sent bigint default 0,
  total_respect_received bigint default 0,
  followers_count integer default 0,
  following_count integer default 0,
  favorite_songs_count integer default 0,
  followed_artists_count integer default 0,
  is_verified boolean default false,
  last_active timestamp default now(),
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

#### **2. Sanatçılar (artists)**
```sql
CREATE TABLE public.artists (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  bio text,
  avatar_url text,
  cover_url text,
  total_respect bigint default 0,
  followers_count integer default 0,
  songs_count integer default 0,
  spotify_id text,
  apple_music_id text,
  youtube_channel_id text,
  is_verified boolean default false,
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

#### **3. Şarkılar (songs)**
```sql
CREATE TABLE public.songs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  artist_id uuid references artists(id) on delete cascade,
  album text,
  duration integer, -- saniye cinsinden
  cover_url text,
  spotify_id text,
  apple_music_id text,
  youtube_video_id text,
  total_respect bigint default 0,
  favorites_count integer default 0,
  plays_count bigint default 0,
  release_date date,
  is_explicit boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

#### **4. Sanatçı Takip Sistemi (artist_follows)**
```sql
CREATE TABLE public.artist_follows (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  artist_id uuid references artists(id) on delete cascade,
  created_at timestamp default now(),
  
  -- Duplicate follow'ları engelle
  UNIQUE(user_id, artist_id)
);
```

#### **5. Şarkı Favorileri (song_favorites)**
```sql
CREATE TABLE public.song_favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  song_id uuid references songs(id) on delete cascade,
  created_at timestamp default now(),
  
  -- Duplicate favorileri engelle
  UNIQUE(user_id, song_id)
);
```

#### **6. Respect İşlemleri (respect_transactions)**
```sql
CREATE TABLE public.respect_transactions (
  id uuid primary key default uuid_generate_v4(),
  from_user_id uuid references auth.users(id) on delete cascade,
  to_artist_id uuid references artists(id) on delete cascade,
  song_id uuid references songs(id) on delete cascade,
  amount integer not null check (amount > 0),
  message text,
  transaction_type text check (transaction_type in ('artist', 'song')),
  is_anonymous boolean default false,
  created_at timestamp default now()
);
```

#### **7. Feed Aktiviteleri (feed_items)**
```sql
CREATE TABLE public.feed_items (
  id uuid primary key default uuid_generate_v4(),
  type text check (type in (
    'respect_sent', 
    'song_favorited', 
    'artist_followed', 
    'song_shared', 
    'chat_message',
    'daily_bonus_claimed',
    'milestone_reached'
  )),
  user_id uuid references auth.users(id) on delete cascade,
  artist_id uuid references artists(id) on delete cascade,
  song_id uuid references songs(id) on delete cascade,
  content jsonb, -- Esnek veri saklama (amount, message, milestone_type vb.)
  is_public boolean default true,
  created_at timestamp default now()
);
```

#### **8. Chat Mesajları (chat_messages)**
```sql
CREATE TABLE public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  room_id text not null, -- artist_id veya song_id
  room_type text check (room_type in ('artist', 'song')),
  user_id uuid references auth.users(id) on delete cascade,
  message text not null,
  message_type text check (message_type in ('text', 'image', 'gif', 'emoji')) default 'text',
  is_edited boolean default false,
  edited_at timestamp,
  is_deleted boolean default false,
  deleted_at timestamp,
  created_at timestamp default now()
);
```

#### **9. Chat Odaları (chat_rooms)**
```sql
CREATE TABLE public.chat_rooms (
  id uuid primary key default uuid_generate_v4(),
  room_id text not null unique, -- artist_id veya song_id
  room_type text check (room_type in ('artist', 'song')),
  room_name text,
  room_description text,
  member_count integer default 0,
  last_message_at timestamp,
  is_active boolean default true,
  created_at timestamp default now()
);
```

#### **10. Kullanıcı İstatistikleri (user_stats)**
```sql
CREATE TABLE public.user_stats (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  stat_type text check (stat_type in (
    'daily_respect_sent',
    'weekly_respect_sent', 
    'monthly_respect_sent',
    'total_respect_sent',
    'daily_respect_received',
    'weekly_respect_received',
    'monthly_respect_received',
    'total_respect_received',
    'chat_messages_sent',
    'favorites_added',
    'artists_followed'
  )),
  stat_value bigint default 0,
  stat_date date,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  
  -- Her kullanıcı için günlük istatistik tekrarını engelle
  UNIQUE(user_id, stat_type, stat_date)
);
```

#### **11. Günlük Bonus Sistemi (daily_bonuses)**
```sql
CREATE TABLE public.daily_bonuses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  bonus_amount integer not null,
  bonus_type text check (bonus_type in ('daily_login', 'streak_bonus', 'special_event')),
  claimed_at timestamp default now(),
  claim_date date default current_date,
  
  -- Her kullanıcı günde bir kez bonus alabilir
  UNIQUE(user_id, claim_date)
);
```

#### **12. Bildirimler (notifications)**
```sql
CREATE TABLE public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  type text check (type in (
    'respect_received',
    'new_follower',
    'chat_message',
    'daily_bonus',
    'milestone_reached',
    'system_announcement'
  )),
  title text not null,
  message text not null,
  data jsonb, -- Ek veri (artist_id, song_id, amount vb.)
  is_read boolean default false,
  read_at timestamp,
  created_at timestamp default now()
);
```

### **🔐 Row Level Security (RLS) Politikaları**

#### **Profiles RLS**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Herkes profil bilgilerini görebilir
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

-- Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Kullanıcılar kendi profillerini oluşturabilir
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

#### **Artist Follows RLS**
```sql
ALTER TABLE artist_follows ENABLE ROW LEVEL SECURITY;

-- Herkes takip ilişkilerini görebilir
CREATE POLICY "Artist follows are viewable by everyone" 
ON artist_follows FOR SELECT USING (true);

-- Kullanıcılar kendi takip işlemlerini yapabilir
CREATE POLICY "Users can manage own follows" 
ON artist_follows FOR ALL USING (auth.uid() = user_id);
```

#### **Respect Transactions RLS**
```sql
ALTER TABLE respect_transactions ENABLE ROW LEVEL SECURITY;

-- Herkes respect işlemlerini görebilir
CREATE POLICY "Respect transactions are viewable by everyone" 
ON respect_transactions FOR SELECT USING (true);

-- Kullanıcılar kendi respect işlemlerini yapabilir
CREATE POLICY "Users can create own transactions" 
ON respect_transactions FOR INSERT WITH CHECK (auth.uid() = from_user_id);
```

#### **Chat Messages RLS**
```sql
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Herkes chat mesajlarını görebilir
CREATE POLICY "Chat messages are viewable by everyone" 
ON chat_messages FOR SELECT USING (true);

-- Kullanıcılar kendi mesajlarını gönderebilir
CREATE POLICY "Users can send own messages" 
ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi mesajlarını düzenleyebilir/silebilir
CREATE POLICY "Users can manage own messages" 
ON chat_messages FOR UPDATE USING (auth.uid() = user_id);
```

### **⚡ Veritabanı Fonksiyonları ve Trigger'lar**

#### **1. Respect Balance Güncelleme Fonksiyonu**
```sql
CREATE OR REPLACE FUNCTION process_respect_transaction(
  p_from_user_id uuid,
  p_to_artist_id uuid,
  p_song_id uuid,
  p_amount integer,
  p_message text,
  p_transaction_type text
) RETURNS void AS $$
BEGIN
  -- Kullanıcının respect balance'ını kontrol et
  IF (SELECT respect_balance FROM profiles WHERE id = p_from_user_id) < p_amount THEN
    RAISE EXCEPTION 'Insufficient respect balance';
  END IF;

  -- Kullanıcıdan respect düş
  UPDATE profiles 
  SET 
    respect_balance = respect_balance - p_amount,
    total_respect_sent = total_respect_sent + p_amount
  WHERE id = p_from_user_id;

  -- Sanatçıya respect ekle
  UPDATE artists 
  SET total_respect = total_respect + p_amount
  WHERE id = p_to_artist_id;

  -- Şarkıya respect ekle (eğer şarkı transaction ise)
  IF p_song_id IS NOT NULL THEN
    UPDATE songs 
    SET total_respect = total_respect + p_amount
    WHERE id = p_song_id;
  END IF;

  -- Transaction kaydı oluştur
  INSERT INTO respect_transactions (
    from_user_id, to_artist_id, song_id, amount, message, transaction_type
  ) VALUES (
    p_from_user_id, p_to_artist_id, p_song_id, p_amount, p_message, p_transaction_type
  );

  -- Feed item oluştur
  INSERT INTO feed_items (type, user_id, artist_id, song_id, content)
  VALUES (
    'respect_sent',
    p_from_user_id,
    p_to_artist_id,
    p_song_id,
    jsonb_build_object('amount', p_amount, 'message', p_message)
  );
END;
$$ LANGUAGE plpgsql;
```

#### **2. Takip Sayısı Güncelleme Trigger'ı**
```sql
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Kullanıcının following_count'unu artır
    UPDATE profiles 
    SET following_count = following_count + 1
    WHERE id = NEW.user_id;
    
    -- Sanatçının followers_count'unu artır
    UPDATE artists 
    SET followers_count = followers_count + 1
    WHERE id = NEW.artist_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Kullanıcının following_count'unu azalt
    UPDATE profiles 
    SET following_count = following_count - 1
    WHERE id = OLD.user_id;
    
    -- Sanatçının followers_count'unu azalt
    UPDATE artists 
    SET followers_count = followers_count - 1
    WHERE id = OLD.artist_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_follow_counts
    AFTER INSERT OR DELETE ON artist_follows
    FOR EACH ROW
    EXECUTE FUNCTION update_follow_counts();
```

#### **3. Favori Sayısı Güncelleme Trigger'ı**
```sql
CREATE OR REPLACE FUNCTION update_favorite_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Kullanıcının favorite_songs_count'unu artır
    UPDATE profiles 
    SET favorite_songs_count = favorite_songs_count + 1
    WHERE id = NEW.user_id;
    
    -- Şarkının favorites_count'unu artır
    UPDATE songs 
    SET favorites_count = favorites_count + 1
    WHERE id = NEW.song_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Kullanıcının favorite_songs_count'unu azalt
    UPDATE profiles 
    SET favorite_songs_count = favorite_songs_count - 1
    WHERE id = OLD.user_id;
    
    -- Şarkının favorites_count'unu azalt
    UPDATE songs 
    SET favorites_count = favorites_count - 1
    WHERE id = OLD.song_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_favorite_counts
    AFTER INSERT OR DELETE ON song_favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_favorite_counts();
```

---

## 🗺️ **GELİŞTİRME ROADMAP**

### **📅 Phase 1: Temel Altyapı (Hafta 1-2)**

#### **1.1 Veritabanı Kurulumu**
- [ ] Supabase projesi oluşturma
- [ ] Veritabanı şeması migration'ları
- [ ] RLS politikaları uygulama
- [ ] Trigger'lar ve fonksiyonlar oluşturma
- [ ] Örnek veri ekleme

#### **1.2 Authentication Sistemi**
- [ ] Email/password authentication
- [ ] Profil oluşturma akışı
- [ ] Kullanıcı doğrulama
- [ ] Session yönetimi

#### **1.3 Temel API Servisleri**
- [ ] User service
- [ ] Artist service
- [ ] Song service
- [ ] Respect service

### **📅 Phase 2: Core Features (Hafta 3-4)**

#### **2.1 Respect Sistemi**
- [ ] Respect gönderme/alma
- [ ] Balance yönetimi
- [ ] Transaction geçmişi
- [ ] Günlük bonus sistemi

#### **2.2 Takip ve Favori Sistemi**
- [ ] Sanatçı takip etme/bırakma
- [ ] Şarkı favori ekleme/çıkarma
- [ ] Takip listesi yönetimi
- [ ] Favori şarkılar listesi

#### **2.3 Profil Sistemi**
- [ ] Profil düzenleme
- [ ] Avatar yükleme
- [ ] Kullanıcı istatistikleri
- [ ] Aktivite geçmişi

### **📅 Phase 3: Feed ve Topluluk (Hafta 5-6)**

#### **3.1 Feed Sistemi**
- [ ] Genel feed (tüm aktiviteler)
- [ ] Kişiselleştirilmiş feed
- [ ] Feed filtreleme
- [ ] Pagination

#### **3.2 Aktivite Takibi**
- [ ] Feed item oluşturma
- [ ] Aktivite türleri
- [ ] Real-time feed güncellemeleri
- [ ] Feed optimizasyonu

#### **3.3 Topluluk Özellikleri**
- [ ] Ortak ilgi alanları
- [ ] Kullanıcı eşleştirme
- [ ] Topluluk önerileri
- [ ] Sosyal özellikler

### **📅 Phase 4: Chat Sistemi (Hafta 7-8)**

#### **4.1 Real-time Chat**
- [ ] Chat odaları oluşturma
- [ ] Mesaj gönderme/alma
- [ ] Real-time mesajlaşma
- [ ] Chat geçmişi

#### **4.2 Chat Özellikleri**
- [ ] Emoji desteği
- [ ] Görsel paylaşım
- [ ] Mesaj düzenleme/silme
- [ ] Online durumu

#### **4.3 Chat Yönetimi**
- [ ] Oda moderasyonu
- [ ] Spam koruması
- [ ] Kullanıcı engelleme
- [ ] Chat kuralları

### **📅 Phase 5: Gelişmiş Özellikler (Hafta 9-10)**

#### **5.1 Bildirim Sistemi**
- [ ] Push notifications
- [ ] Email bildirimleri
- [ ] In-app bildirimler
- [ ] Bildirim tercihleri

#### **5.2 İstatistik ve Analytics**
- [ ] Kullanıcı istatistikleri
- [ ] Sanatçı performans analizi
- [ ] Şarkı trend analizi
- [ ] Topluluk metrikleri

#### **5.3 Gamification**
- [ ] Başarı rozetleri
- [ ] Seviye sistemi
- [ ] Liderlik tabloları
- [ ] Özel etkinlikler

### **📅 Phase 6: Optimizasyon ve Test (Hafta 11-12)**

#### **6.1 Performance Optimizasyonu**
- [ ] Database indexleme
- [ ] Query optimizasyonu
- [ ] Caching stratejileri
- [ ] CDN entegrasyonu

#### **6.2 Güvenlik ve Test**
- [ ] Güvenlik testleri
- [ ] Penetrasyon testleri
- [ ] Load testing
- [ ] User acceptance testing

#### **6.3 Deployment ve Monitoring**
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Error tracking
- [ ] Performance monitoring

---

## 🔧 **TEKNİK MİMARİ**

### **Frontend (React + Vite)**
```
src/
├── components/          # UI bileşenleri
├── pages/              # Sayfa bileşenleri
├── api/                # API servisleri
├── hooks/              # Custom hooks
├── context/            # React context'leri
├── utils/              # Yardımcı fonksiyonlar
├── styles/             # CSS dosyaları
└── assets/             # Statik dosyalar
```

### **Backend (Supabase)**
```
supabase/
├── migrations/         # Database migration'ları
├── functions/          # Edge functions
├── storage/            # File storage buckets
└── config.toml         # Supabase konfigürasyonu
```

### **API Endpoints**
```
/api/
├── auth/               # Authentication
├── users/              # User management
├── artists/            # Artist operations
├── songs/              # Song operations
├── respect/            # Respect transactions
├── feed/               # Feed operations
├── chat/               # Chat operations
└── notifications/      # Notification system
```

---

## 📊 **VERİ AKIŞI DIAGRAMI**

```
Kullanıcı Kayıt → Profil Oluşturma → Sanatçı/Şarkı Takip → Respect Gönderme
       ↓                    ↓                    ↓                    ↓
   Auth System         Profile System      Follow System       Respect System
       ↓                    ↓                    ↓                    ↓
   User Session        User Data          Follow Relations    Transactions
       ↓                    ↓                    ↓                    ↓
   Feed Items ←─────────────┼────────────────────┼────────────────────┘
       ↓
   Real-time Chat ←─────────┼────────────────────┘
       ↓
   Notifications
```

---

## 🎯 **BAŞARI KRİTERLERİ**

### **Teknik Kriterler**
- [ ] Tüm API endpoint'leri çalışıyor
- [ ] Real-time özellikler stabil
- [ ] Database performansı optimal
- [ ] Güvenlik standartları karşılanıyor
- [ ] Error handling tamamlanmış

### **Kullanıcı Deneyimi Kriterleri**
- [ ] Smooth onboarding akışı
- [ ] Intuitive navigation
- [ ] Fast loading times
- [ ] Responsive design
- [ ] Accessibility standartları

### **İş Kriterleri**
- [ ] Respect ekonomisi çalışıyor
- [ ] Topluluk oluşumu başarılı
- [ ] User engagement yüksek
- [ ] Retention rate pozitif
- [ ] Viral growth potansiyeli

---

## 🚀 **SONRAKI ADIMLAR**

1. **Veritabanı Migration'larını Oluştur**
2. **API Servislerini Güncelle**
3. **Frontend Component'lerini Entegre Et**
4. **Real-time Özellikleri Test Et**
5. **User Testing Başlat**

Bu dokümantasyon, Respect uygulamanızın geliştirilmesi için kapsamlı bir yol haritası sunmaktadır. Her phase'in tamamlanmasından sonra test ve değerlendirme yapılması önerilir. 