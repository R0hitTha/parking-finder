/**
 * ParkFinder — Data Layer (India Edition)
 * 60+ parking spots across major Indian cities.
 */

const DATA_VERSION = 'v3'; // Bump to force-reset localStorage seed data

const STORAGE_KEYS = {
  SPOTS: 'pf_spots',
  USERS: 'pf_users',
  CURRENT_USER: 'pf_current_user',
  FAVORITES: 'pf_favorites',
  REVIEWS: 'pf_reviews',
  LOG: 'pf_log',
  VERSION: 'pf_data_version',
};

// ─── Seed Parking Data (All India) ──────────────────────────────────────────

const SEED_SPOTS = [
  // ── MUMBAI ──
  { id:'p001', name:'Nariman Point Parking', address:'Nariman Point, South Mumbai - 400021', lat:18.9256, lng:72.8242, pricePerHour:80, pricePerDay:500, type:'covered', totalSlots:200, availableSlots:45, rating:4.5, reviewCount:128, amenities:['CCTV','EV Charging','Security','24/7'], description:'Premium covered parking in Mumbai\'s iconic business district. Secure, well-lit and conveniently located.', openTime:'00:00', closeTime:'23:59' },
  { id:'p002', name:'BKC Corporate Hub Parking', address:'Bandra Kurla Complex, Mumbai - 400051', lat:19.0647, lng:72.8680, pricePerHour:120, pricePerDay:800, type:'covered', totalSlots:500, availableSlots:12, rating:4.8, reviewCount:342, amenities:['CCTV','EV Charging','Valet','Security','24/7','Car Wash'], description:'State-of-the-art multi-level parking in BKC with automated payment kiosks and premium amenities.', openTime:'00:00', closeTime:'23:59' },
  { id:'p003', name:'Dadar Railway Parking', address:'Dadar East, Mumbai - 400014', lat:19.0186, lng:72.8481, pricePerHour:40, pricePerDay:200, type:'open', totalSlots:150, availableSlots:78, rating:3.8, reviewCount:89, amenities:['CCTV','Security'], description:'Budget-friendly open parking near Dadar railway station. Convenient for daily commuters.', openTime:'05:00', closeTime:'23:00' },
  { id:'p004', name:'Phoenix Mills Premium Parking', address:'Lower Parel, Mumbai - 400013', lat:18.9932, lng:72.8277, pricePerHour:110, pricePerDay:700, type:'covered', totalSlots:600, availableSlots:88, rating:4.7, reviewCount:489, amenities:['CCTV','EV Charging','Valet','Security','24/7','Car Wash'], description:'World-class parking at Phoenix Mills. Automated management with real-time slot tracking.', openTime:'00:00', closeTime:'23:59' },
  { id:'p005', name:'Colaba Causeway Smart Parking', address:'Colaba, Mumbai - 400005', lat:18.9067, lng:72.8147, pricePerHour:90, pricePerDay:600, type:'covered', totalSlots:120, availableSlots:33, rating:4.6, reviewCount:178, amenities:['CCTV','EV Charging','Valet','Security','24/7'], description:'Upscale covered parking in Colaba. Ideal for tourists and shoppers at the famous causeway.', openTime:'00:00', closeTime:'23:59' },
  { id:'p006', name:'Malad Inorbit Mall Parking', address:'Malad West, Mumbai - 400064', lat:19.1873, lng:72.8480, pricePerHour:70, pricePerDay:400, type:'covered', totalSlots:800, availableSlots:345, rating:4.2, reviewCount:512, amenities:['CCTV','EV Charging','Security','24/7','Car Wash'], description:'Huge multi-level parking at Inorbit Mall. First 2 hours free with any mall purchase receipt.', openTime:'09:00', closeTime:'23:00' },

  // ── DELHI / NCR ──
  { id:'p007', name:'Connaught Place Smart Parking', address:'Connaught Place, New Delhi - 110001', lat:28.6314, lng:77.2167, pricePerHour:60, pricePerDay:400, type:'covered', totalSlots:450, availableSlots:120, rating:4.4, reviewCount:312, amenities:['CCTV','EV Charging','Security','24/7'], description:'Modern multilevel smart parking at the heart of Delhi\'s premier commercial hub.', openTime:'00:00', closeTime:'23:59' },
  { id:'p008', name:'Select CityWalk Parking', address:'Saket, New Delhi - 110017', lat:28.5275, lng:77.2137, pricePerHour:80, pricePerDay:500, type:'covered', totalSlots:700, availableSlots:230, rating:4.6, reviewCount:528, amenities:['CCTV','EV Charging','Valet','Security','24/7','Car Wash'], description:'Premium parking at Delhi\'s most popular mall. State-of-the-art facilities and easy access.', openTime:'09:00', closeTime:'23:00' },
  { id:'p009', name:'India Gate Parking', address:'Rajpath, New Delhi - 110001', lat:28.6129, lng:77.2295, pricePerHour:30, pricePerDay:150, type:'open', totalSlots:300, availableSlots:180, rating:3.9, reviewCount:145, amenities:['Security'], description:'Open parking near India Gate. Perfect for tourists visiting the landmark. Busy on weekends.', openTime:'06:00', closeTime:'22:00' },
  { id:'p010', name:'Cyber Hub Gurgaon Parking', address:'DLF Cyber Hub, Gurugram - 122002', lat:28.4948, lng:77.0888, pricePerHour:100, pricePerDay:650, type:'covered', totalSlots:600, availableSlots:95, rating:4.7, reviewCount:389, amenities:['CCTV','EV Charging','Valet','Security','24/7'], description:'Premium parking at Gurgaon\'s iconic entertainment and dining destination Cyber Hub.', openTime:'00:00', closeTime:'23:59' },
  { id:'p011', name:'Noida Sector 18 Parking', address:'Sector 18 Market, Noida - 201301', lat:28.5706, lng:77.3219, pricePerHour:50, pricePerDay:300, type:'covered', totalSlots:400, availableSlots:160, rating:4.1, reviewCount:201, amenities:['CCTV','Security','24/7'], description:'Convenient covered parking in Noida\'s busiest shopping and business district.', openTime:'00:00', closeTime:'23:59' },
  { id:'p012', name:'New Delhi Railway Station Parking', address:'Paharganj, New Delhi - 110055', lat:28.6420, lng:77.2194, pricePerHour:25, pricePerDay:120, type:'open', totalSlots:500, availableSlots:210, rating:3.5, reviewCount:287, amenities:['Security'], description:'Large open parking adjacent to New Delhi Railway Station. Budget-friendly for train travelers.', openTime:'00:00', closeTime:'23:59' },

  // ── BANGALORE ──
  { id:'p013', name:'MG Road Smart Parking', address:'MG Road, Bangalore - 560001', lat:12.9756, lng:77.6097, pricePerHour:70, pricePerDay:450, type:'covered', totalSlots:350, availableSlots:95, rating:4.3, reviewCount:267, amenities:['CCTV','EV Charging','Security','24/7'], description:'Modern multilevel parking in the heart of Bangalore\'s premier commercial and entertainment district.', openTime:'00:00', closeTime:'23:59' },
  { id:'p014', name:'UB City Mall Parking', address:'Vittal Mallya Road, Bangalore - 560001', lat:12.9718, lng:77.5973, pricePerHour:100, pricePerDay:700, type:'covered', totalSlots:400, availableSlots:55, rating:4.8, reviewCount:412, amenities:['CCTV','EV Charging','Valet','Security','24/7','Car Wash'], description:'Luxury parking at Bangalore\'s prestigious UB City. Top-class amenities for discerning visitors.', openTime:'09:00', closeTime:'23:00' },
  { id:'p015', name:'Indiranagar 100ft Road Parking', address:'Indiranagar, Bangalore - 560038', lat:12.9784, lng:77.6408, pricePerHour:60, pricePerDay:380, type:'covered', totalSlots:250, availableSlots:78, rating:4.2, reviewCount:189, amenities:['CCTV','Security','24/7'], description:'Handy covered parking in Bangalore\'s trendy Indiranagar neighbourhood.', openTime:'00:00', closeTime:'23:59' },
  { id:'p016', name:'Koramangala Forum Mall Parking', address:'Koramangala, Bangalore - 560034', lat:12.9352, lng:77.6245, pricePerHour:80, pricePerDay:500, type:'covered', totalSlots:500, availableSlots:130, rating:4.5, reviewCount:334, amenities:['CCTV','EV Charging','Security','24/7'], description:'Large covered parking at Forum Mall in Koramangala, Bangalore\'s startup hub.', openTime:'09:00', closeTime:'23:00' },
  { id:'p017', name:'Whitefield Tech Park Parking', address:'Whitefield, Bangalore - 560066', lat:12.9698, lng:77.7499, pricePerHour:50, pricePerDay:300, type:'covered', totalSlots:800, availableSlots:320, rating:4.0, reviewCount:156, amenities:['CCTV','EV Charging','Security','24/7'], description:'Spacious corporate parking in Whitefield IT corridor. EV charging for tech employees.', openTime:'00:00', closeTime:'23:59' },

  // ── CHENNAI ──
  { id:'p018', name:'Anna Salai Smart Parking', address:'Anna Salai, Chennai - 600002', lat:13.0569, lng:80.2425, pricePerHour:50, pricePerDay:300, type:'covered', totalSlots:300, availableSlots:110, rating:4.2, reviewCount:198, amenities:['CCTV','Security','24/7'], description:'Centrally located covered parking on Chennai\'s key arterial road, Anna Salai.', openTime:'00:00', closeTime:'23:59' },
  { id:'p019', name:'Express Avenue Mall Parking', address:'Whites Road, Chennai - 600014', lat:13.0608, lng:80.2673, pricePerHour:70, pricePerDay:450, type:'covered', totalSlots:600, availableSlots:220, rating:4.5, reviewCount:367, amenities:['CCTV','EV Charging','Valet','Security','24/7'], description:'Premium parking at Express Avenue, Chennai\'s premier lifestyle mall.', openTime:'09:00', closeTime:'23:00' },
  { id:'p020', name:'Marina Beach Parking', address:'Marina Beach Road, Chennai - 600005', lat:13.0503, lng:80.2824, pricePerHour:25, pricePerDay:120, type:'open', totalSlots:200, availableSlots:145, rating:3.7, reviewCount:112, amenities:['Security'], description:'Open parking near Chennai\'s iconic Marina Beach. Busy on weekends and holidays.', openTime:'06:00', closeTime:'23:00' },
  { id:'p021', name:'T. Nagar Shopping Parking', address:'T. Nagar, Chennai - 600017', lat:13.0382, lng:80.2326, pricePerHour:45, pricePerDay:250, type:'covered', totalSlots:400, availableSlots:88, rating:4.0, reviewCount:245, amenities:['CCTV','Security'], description:'Multi-level parking in T. Nagar, Chennai\'s busiest shopping district. Very convenient.', openTime:'08:00', closeTime:'22:00' },

  // ── KOLKATA ──
  { id:'p022', name:'Park Street Parking Complex', address:'Park Street, Kolkata - 700016', lat:22.5513, lng:88.3531, pricePerHour:40, pricePerDay:220, type:'covered', totalSlots:280, availableSlots:95, rating:4.1, reviewCount:178, amenities:['CCTV','Security','24/7'], description:'Covered parking in Kolkata\'s iconic Park Street area. Convenient for restaurants and entertainment.', openTime:'00:00', closeTime:'23:59' },
  { id:'p023', name:'Quest Mall Parking', address:'Syed Amir Ali Avenue, Kolkata - 700019', lat:22.5404, lng:88.3615, pricePerHour:60, pricePerDay:380, type:'covered', totalSlots:500, availableSlots:175, rating:4.5, reviewCount:289, amenities:['CCTV','EV Charging','Security','24/7'], description:'Modern parking at Quest Mall, Kolkata\'s premium fashion and lifestyle destination.', openTime:'09:00', closeTime:'22:30' },
  { id:'p024', name:'Howrah Station Parking', address:'Howrah Railway Station, Howrah - 711101', lat:22.5851, lng:88.3425, pricePerHour:20, pricePerDay:100, type:'open', totalSlots:600, availableSlots:250, rating:3.4, reviewCount:198, amenities:['Security'], description:'Large open parking at Howrah Station — India\'s busiest railway hub. Very affordable rates.', openTime:'00:00', closeTime:'23:59' },
  { id:'p025', name:'Salt Lake Sector V Parking', address:'Sector V, Salt Lake, Kolkata - 700091', lat:22.5752, lng:88.4346, pricePerHour:45, pricePerDay:260, type:'covered', totalSlots:350, availableSlots:120, rating:4.2, reviewCount:134, amenities:['CCTV','EV Charging','Security','24/7'], description:'Corporate parking hub in Salt Lake\'s IT sector. EV charging available for tech workers.', openTime:'00:00', closeTime:'23:59' },

  // ── HYDERABAD ──
  { id:'p026', name:'HITEC City Parking Hub', address:'HITEC City, Hyderabad - 500081', lat:17.4435, lng:78.3772, pricePerHour:60, pricePerDay:380, type:'covered', totalSlots:700, availableSlots:230, rating:4.4, reviewCount:312, amenities:['CCTV','EV Charging','Security','24/7'], description:'Large-scale parking in Hyderabad\'s technology hub. Serves the growing IT workforce.', openTime:'00:00', closeTime:'23:59' },
  { id:'p027', name:'Banjara Hills Parking', address:'Road No. 12, Banjara Hills - 500034', lat:17.4239, lng:78.4378, pricePerHour:80, pricePerDay:500, type:'covered', totalSlots:280, availableSlots:68, rating:4.6, reviewCount:223, amenities:['CCTV','EV Charging','Valet','Security','24/7'], description:'Premium parking in Hyderabad\'s upscale Banjara Hills. Valet service on weekends.', openTime:'00:00', closeTime:'23:59' },
  { id:'p028', name:'Charminar Parking Complex', address:'Charminar, Hyderabad - 500002', lat:17.3616, lng:78.4747, pricePerHour:30, pricePerDay:160, type:'open', totalSlots:250, availableSlots:120, rating:3.8, reviewCount:167, amenities:['Security'], description:'Open parking near the iconic Charminar. Ideal for tourists exploring the old city.', openTime:'06:00', closeTime:'22:00' },
  { id:'p029', name:'Gachibowli Stadium Parking', address:'Gachibowli, Hyderabad - 500032', lat:17.4401, lng:78.3482, pricePerHour:50, pricePerDay:300, type:'open', totalSlots:1000, availableSlots:560, rating:4.0, reviewCount:189, amenities:['CCTV','Security','24/7'], description:'Massive open parking near Gachibowli Stadium. Plenty of space even on event days.', openTime:'00:00', closeTime:'23:59' },

  // ── PUNE ──
  { id:'p030', name:'FC Road Pune Parking', address:'Fergusson College Road, Pune - 411004', lat:18.5236, lng:73.8478, pricePerHour:55, pricePerDay:320, type:'covered', totalSlots:200, availableSlots:72, rating:4.2, reviewCount:156, amenities:['CCTV','Security','24/7'], description:'Covered parking near Pune\'s vibrant FC Road with its cafes, shops and colleges.', openTime:'00:00', closeTime:'23:59' },
  { id:'p031', name:'Phoenix MarketCity Pune Parking', address:'Vimannagar, Pune - 411014', lat:18.5679, lng:73.9143, pricePerHour:70, pricePerDay:450, type:'covered', totalSlots:800, availableSlots:310, rating:4.5, reviewCount:421, amenities:['CCTV','EV Charging','Valet','Security','24/7','Car Wash'], description:'Huge parking complex at Phoenix MarketCity, Pune\'s largest shopping mall.', openTime:'09:00', closeTime:'23:00' },
  { id:'p032', name:'Hinjewadi IT Park Parking', address:'Hinjewadi Phase 1, Pune - 411057', lat:18.5912, lng:73.7381, pricePerHour:40, pricePerDay:220, type:'covered', totalSlots:1200, availableSlots:480, rating:4.1, reviewCount:287, amenities:['CCTV','EV Charging','Security','24/7'], description:'Corporate parking at Pune\'s biggest IT hub. Ample space for the tech workforce.', openTime:'00:00', closeTime:'23:59' },

  // ── AHMEDABAD ──
  { id:'p033', name:'Sabarmati Riverfront Parking', address:'Sabarmati Riverfront, Ahmedabad - 380001', lat:23.0225, lng:72.5714, pricePerHour:30, pricePerDay:150, type:'open', totalSlots:400, availableSlots:280, rating:4.0, reviewCount:198, amenities:['Security'], description:'Scenic open parking along the Sabarmati Riverfront. Perfect for evening walks and events.', openTime:'06:00', closeTime:'23:00' },
  { id:'p034', name:'Iscon Mega Mall Parking', address:'SG Highway, Ahmedabad - 380054', lat:23.0406, lng:72.5074, pricePerHour:60, pricePerDay:380, type:'covered', totalSlots:600, availableSlots:220, rating:4.4, reviewCount:312, amenities:['CCTV','EV Charging','Security','24/7'], description:'Large covered parking at Iscon Mega Mall on SG Highway. EV charging available.', openTime:'09:00', closeTime:'22:30' },
  { id:'p035', name:'GIFT City Parking', address:'GIFT City, Gandhinagar - 382355', lat:23.1611, lng:72.6803, pricePerHour:80, pricePerDay:500, type:'covered', totalSlots:500, availableSlots:190, rating:4.6, reviewCount:134, amenities:['CCTV','EV Charging','Valet','Security','24/7'], description:'Premium smart parking at Gujarat\'s international financial tech city.', openTime:'00:00', closeTime:'23:59' },

  // ── JAIPUR ──
  { id:'p036', name:'Hawa Mahal Parking', address:'Hawa Mahal Road, Jaipur - 302002', lat:26.9239, lng:75.8267, pricePerHour:25, pricePerDay:120, type:'open', totalSlots:200, availableSlots:130, rating:3.8, reviewCount:145, amenities:['Security'], description:'Open parking near the iconic Hawa Mahal. Perfect for tourists exploring the Pink City.', openTime:'07:00', closeTime:'21:00' },
  { id:'p037', name:'World Trade Park Parking', address:'Malviya Nagar, Jaipur - 302017', lat:26.8592, lng:75.8053, pricePerHour:70, pricePerDay:440, type:'covered', totalSlots:450, availableSlots:160, rating:4.5, reviewCount:267, amenities:['CCTV','EV Charging','Valet','Security','24/7'], description:'Premium parking at Jaipur\'s world-class World Trade Park mall and business center.', openTime:'09:00', closeTime:'23:00' },
  { id:'p038', name:'Sindhi Camp Bus Stand Parking', address:'Sindhi Camp, Jaipur - 302001', lat:26.9154, lng:75.8031, pricePerHour:20, pricePerDay:100, type:'open', totalSlots:300, availableSlots:145, rating:3.5, reviewCount:87, amenities:['Security'], description:'Budget-friendly open parking at Jaipur\'s main bus terminus. Ideal for travelers.', openTime:'24:00', closeTime:'23:59' },

  // ── LUCKNOW ──
  { id:'p039', name:'Hazratganj Parking Complex', address:'Hazratganj, Lucknow - 226001', lat:26.8499, lng:80.9462, pricePerHour:30, pricePerDay:160, type:'covered', totalSlots:250, availableSlots:90, rating:4.0, reviewCount:134, amenities:['CCTV','Security'], description:'Multi-level parking in Lucknow\'s most famous and historic commercial district.', openTime:'08:00', closeTime:'22:00' },
  { id:'p040', name:'Phoenix Palassio Parking', address:'Sultanpur Road, Lucknow - 226002', lat:26.8087, lng:80.9915, pricePerHour:65, pricePerDay:400, type:'covered', totalSlots:700, availableSlots:270, rating:4.6, reviewCount:312, amenities:['CCTV','EV Charging','Valet','Security','24/7'], description:'Premium covered parking at Phoenix Palassio, Lucknow\'s premier shopping destination.', openTime:'09:00', closeTime:'23:00' },

  // ── KOCHI ──
  { id:'p041', name:'Lulu Mall Kochi Parking', address:'NH 47, Edapally, Kochi - 682024', lat:10.0268, lng:76.3084, pricePerHour:60, pricePerDay:380, type:'covered', totalSlots:3000, availableSlots:1200, rating:4.7, reviewCount:678, amenities:['CCTV','EV Charging','Valet','Security','24/7','Car Wash'], description:'World-class parking at Lulu Mall — one of India\'s largest malls. Excellent facilities.', openTime:'09:00', closeTime:'23:00' },
  { id:'p042', name:'Marine Drive Kochi Parking', address:'Marine Drive, Ernakulam - 682031', lat:9.9816, lng:76.2799, pricePerHour:30, pricePerDay:150, type:'open', totalSlots:200, availableSlots:110, rating:4.0, reviewCount:156, amenities:['Security'], description:'Scenic open parking along Kochi\'s beautiful Marine Drive waterfront promenade.', openTime:'06:00', closeTime:'23:00' },

  // ── CHANDIGARH ──
  { id:'p043', name:'Sector 17 Chandigarh Parking', address:'Sector 17, Chandigarh - 160017', lat:30.7404, lng:76.7793, pricePerHour:25, pricePerDay:130, type:'covered', totalSlots:400, availableSlots:160, rating:4.3, reviewCount:189, amenities:['CCTV','Security','24/7'], description:'Smart covered parking in Chandigarh\'s planned city centre at Sector 17.', openTime:'00:00', closeTime:'23:59' },
  { id:'p044', name:'Elante Mall Parking', address:'Industrial Area Phase I, Chandigarh - 160002', lat:30.7075, lng:76.8024, pricePerHour:50, pricePerDay:300, type:'covered', totalSlots:600, availableSlots:230, rating:4.5, reviewCount:278, amenities:['CCTV','EV Charging','Security','24/7'], description:'Large parking at Elante Mall, North India\'s biggest mall in Chandigarh.', openTime:'09:00', closeTime:'23:00' },

  // ── SURAT ──
  { id:'p045', name:'Diamond Bourse Parking', address:'Surat Diamond Bourse, Surat - 394105', lat:21.2350, lng:72.9001, pricePerHour:50, pricePerDay:300, type:'covered', totalSlots:500, availableSlots:180, rating:4.4, reviewCount:145, amenities:['CCTV','EV Charging','Security','24/7'], description:'Modern parking at the world\'s largest commercial building — the Surat Diamond Bourse.', openTime:'00:00', closeTime:'23:59' },
  { id:'p046', name:'VR Surat Mall Parking', address:'Dumas Road, Surat - 395007', lat:21.1702, lng:72.7895, pricePerHour:60, pricePerDay:350, type:'covered', totalSlots:400, availableSlots:145, rating:4.3, reviewCount:189, amenities:['CCTV','EV Charging','Security','24/7'], description:'Premium parking at VR Surat, the city\'s newest lifestyle and entertainment centre.', openTime:'09:00', closeTime:'23:00' },

  // ── NAGPUR ──
  { id:'p047', name:'Sitabuldi Market Parking', address:'Sitabuldi, Nagpur - 440012', lat:21.1454, lng:79.0849, pricePerHour:25, pricePerDay:130, type:'open', totalSlots:300, availableSlots:140, rating:3.7, reviewCount:98, amenities:['Security'], description:'Open parking near Nagpur\'s commercial hub Sitabuldi Market. Affordable rates.', openTime:'08:00', closeTime:'22:00' },
  { id:'p048', name:'Empress City Mall Parking', address:'Civil Lines, Nagpur - 440001', lat:21.1481, lng:79.0822, pricePerHour:55, pricePerDay:320, type:'covered', totalSlots:400, availableSlots:170, rating:4.2, reviewCount:167, amenities:['CCTV','EV Charging','Security','24/7'], description:'Covered parking at Empress City Mall, Nagpur\'s leading lifestyle destination.', openTime:'09:00', closeTime:'23:00' },

  // ── BHOPAL ──
  { id:'p049', name:'DB City Mall Parking', address:'Arera Hills, Bhopal - 462011', lat:23.2280, lng:77.4329, pricePerHour:50, pricePerDay:280, type:'covered', totalSlots:500, availableSlots:200, rating:4.4, reviewCount:234, amenities:['CCTV','EV Charging','Security','24/7'], description:'Large covered parking at DB City, Central India\'s biggest mall in Bhopal.', openTime:'09:00', closeTime:'23:00' },
  { id:'p050', name:'New Market Bhopal Parking', address:'New Market, Bhopal - 462003', lat:23.2299, lng:77.4003, pricePerHour:20, pricePerDay:100, type:'open', totalSlots:200, availableSlots:90, rating:3.6, reviewCount:89, amenities:['Security'], description:'Open parking near Bhopal\'s popular New Market shopping area. Very economical.', openTime:'08:00', closeTime:'21:00' },

  // ── VISAKHAPATNAM ──
  { id:'p051', name:'RK Beach Parking', address:'RK Beach, Visakhapatnam - 530003', lat:17.7099, lng:83.3237, pricePerHour:20, pricePerDay:100, type:'open', totalSlots:400, availableSlots:230, rating:3.9, reviewCount:134, amenities:['Security'], description:'Open beachfront parking at RK Beach, Vizag\'s most popular tourist spot.', openTime:'05:00', closeTime:'23:00' },
  { id:'p052', name:'CMR Central Vizag Parking', address:'Dwaraka Nagar, Visakhapatnam - 530016', lat:17.7280, lng:83.3219, pricePerHour:60, pricePerDay:360, type:'covered', totalSlots:350, availableSlots:120, rating:4.3, reviewCount:178, amenities:['CCTV','EV Charging','Security','24/7'], description:'Covered parking at CMR Central Mall in Visakhapatnam\'s main commercial area.', openTime:'09:00', closeTime:'22:30' },

  // ── INDORE ──
  { id:'p053', name:'Treasure Island Mall Parking', address:'MG Road, Indore - 452001', lat:22.7196, lng:75.8577, pricePerHour:50, pricePerDay:280, type:'covered', totalSlots:450, availableSlots:170, rating:4.2, reviewCount:189, amenities:['CCTV','EV Charging','Security','24/7'], description:'Premium covered parking at Treasure Island Mall in Indore\'s central shopping zone.', openTime:'09:00', closeTime:'23:00' },
  { id:'p054', name:'Rajwada Square Parking', address:'Rajwada, Indore - 452002', lat:22.7181, lng:75.8591, pricePerHour:25, pricePerDay:130, type:'open', totalSlots:200, availableSlots:95, rating:3.8, reviewCount:112, amenities:['Security'], description:'Open parking near the historic Rajwada palace. Popular with tourists and locals.', openTime:'07:00', closeTime:'22:00' },

  // ── COIMBATORE ──
  { id:'p055', name:'Fun Republic Mall Parking', address:'Avinashi Road, Coimbatore - 641014', lat:11.0168, lng:77.0008, pricePerHour:50, pricePerDay:300, type:'covered', totalSlots:400, availableSlots:155, rating:4.3, reviewCount:198, amenities:['CCTV','EV Charging','Security','24/7'], description:'Modern covered parking at Fun Republic Mall in Coimbatore, Tamil Nadu\'s second city.', openTime:'09:00', closeTime:'22:30' },
  { id:'p056', name:'Brookefields Mall Parking', address:'Krishnasamy Road, Coimbatore - 641001', lat:11.0050, lng:76.9795, pricePerHour:55, pricePerDay:320, type:'covered', totalSlots:350, availableSlots:120, rating:4.1, reviewCount:156, amenities:['CCTV','Security','24/7'], description:'Covered parking at the popular Brookefields Mall in central Coimbatore.', openTime:'09:00', closeTime:'22:00' },

  // ── AGRA ──
  { id:'p057', name:'Taj Mahal Parking Complex', address:'Taj East Gate Road, Agra - 282001', lat:27.1751, lng:78.0421, pricePerHour:30, pricePerDay:150, type:'open', totalSlots:500, availableSlots:280, rating:3.9, reviewCount:312, amenities:['Security'], description:'Official parking complex for Taj Mahal visitors. Very well managed with shuttle service.', openTime:'06:00', closeTime:'20:00' },

  // ── VARANASI ──
  { id:'p058', name:'Dashashwamedh Ghat Parking', address:'Dashashwamedh Ghat, Varanasi - 221001', lat:25.3101, lng:83.0132, pricePerHour:20, pricePerDay:100, type:'open', totalSlots:300, availableSlots:190, rating:3.7, reviewCount:167, amenities:['Security'], description:'Open parking near one of Varanasi\'s holiest and most famous ghats. Centrally located.', openTime:'00:00', closeTime:'23:59' },

  // ── AMRITSAR ──
  { id:'p059', name:'Golden Temple Parking', address:'Golden Temple Road, Amritsar - 143001', lat:31.6200, lng:74.8765, pricePerHour:20, pricePerDay:100, type:'open', totalSlots:800, availableSlots:350, rating:4.2, reviewCount:456, amenities:['Security','24/7'], description:'Well-managed free parking facility near the sacred Golden Temple. Serves millions of pilgrims.', openTime:'00:00', closeTime:'23:59' },

  // ── MYSURU ──
  { id:'p060', name:'Mysore Palace Parking', address:'Sayyaji Rao Road, Mysuru - 570001', lat:12.3052, lng:76.6551, pricePerHour:25, pricePerDay:120, type:'open', totalSlots:400, availableSlots:220, rating:4.0, reviewCount:278, amenities:['Security'], description:'Official open parking for Mysore Palace visitors. Well-organised during Dasara festival.', openTime:'08:00', closeTime:'20:00' },
  { id:'p061', name:'Forum Mysuru Mall Parking', address:'Nazarbad Mohalla, Mysuru - 570010', lat:12.2986, lng:76.6377, pricePerHour:55, pricePerDay:330, type:'covered', totalSlots:350, availableSlots:130, rating:4.4, reviewCount:189, amenities:['CCTV','EV Charging','Security','24/7'], description:'Modern covered parking at Forum Mall in Mysuru\'s key commercial zone.', openTime:'09:00', closeTime:'22:30' },

  // ── BHUBANESWAR ──
  { id:'p062', name:'Esplanade One Mall Parking', address:'Rasulgarh, Bhubaneswar - 751010', lat:20.2985, lng:85.8344, pricePerHour:45, pricePerDay:250, type:'covered', totalSlots:400, availableSlots:160, rating:4.3, reviewCount:145, amenities:['CCTV','EV Charging','Security','24/7'], description:'Covered parking at Esplanade One, Odisha\'s biggest and most modern shopping mall.', openTime:'09:00', closeTime:'22:30' },
];

const SEED_REVIEWS = [
  { id:'rv001', spotId:'p001', userId:'u002', userName:'Priya Sharma', rating:5, comment:'Excellent parking! Very secure, clean and easy to find. Will use again.', date:'2026-03-15' },
  { id:'rv002', spotId:'p001', userId:'u003', userName:'Rahul Mehta', rating:4, comment:'Good location, slightly expensive but worth it for the peace of mind.', date:'2026-03-20' },
  { id:'rv003', spotId:'p002', userId:'u002', userName:'Priya Sharma', rating:5, comment:'The absolute best parking in BKC. Spotless, safe and great staff!', date:'2026-03-10' },
  { id:'rv004', spotId:'p007', userId:'u003', userName:'Rahul Mehta', rating:4, comment:'Great location in CP. Smart parking system works flawlessly.', date:'2026-03-18' },
  { id:'rv005', spotId:'p013', userId:'u002', userName:'Priya Sharma', rating:5, comment:'MG Road parking is top notch! Love the convenient location.', date:'2026-04-01' },
  { id:'rv006', spotId:'p026', userId:'u003', userName:'Rahul Mehta', rating:4, comment:'HITEC City parking is well-organized. EV charging is a great addition.', date:'2026-03-25' },
  { id:'rv007', spotId:'p041', userId:'u002', userName:'Priya Sharma', rating:5, comment:'Lulu Mall parking is massive and very well managed. Top-notch facilities!', date:'2026-03-28' },
  { id:'rv008', spotId:'p059', userId:'u003', userName:'Rahul Mehta', rating:5, comment:'Golden Temple parking is free and beautifully organised. A must-visit!', date:'2026-04-02' },
];

// ─── Initialization ─────────────────────────────────────────────────────────

function initData() {
  // Version check — reset if outdated seed data
  if (localStorage.getItem(STORAGE_KEYS.VERSION) !== DATA_VERSION) {
    localStorage.removeItem(STORAGE_KEYS.SPOTS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.setItem(STORAGE_KEYS.VERSION, DATA_VERSION);
  }

  if (!localStorage.getItem(STORAGE_KEYS.SPOTS)) {
    localStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(SEED_SPOTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
      { id:'u001', name:'Admin', email:'admin@parkfinder.com', password:btoa('admin123'), role:'admin', avatar:'A', createdAt:new Date().toISOString() },
      { id:'u002', name:'Priya Sharma', email:'priya@example.com', password:btoa('test123'), role:'user', avatar:'P', createdAt:new Date().toISOString() },
      { id:'u003', name:'Rahul Mehta', email:'rahul@example.com', password:btoa('test123'), role:'user', avatar:'R', createdAt:new Date().toISOString() },
    ]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify({}));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOG)) {
    localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify([]));
  }
}

// ─── Spots CRUD ─────────────────────────────────────────────────────────────

function getAllSpots() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SPOTS) || '[]');
}
function getSpotById(id) {
  return getAllSpots().find(s => s.id === id) || null;
}
function addSpot(spot) {
  const spots = getAllSpots();
  const newSpot = { ...spot, id: 'p' + Date.now(), rating: 0, reviewCount: 0 };
  spots.push(newSpot);
  localStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(spots));
  addLog('Added spot: ' + newSpot.name);
  return newSpot;
}
function updateSpot(id, updates) {
  const spots = getAllSpots();
  const idx = spots.findIndex(s => s.id === id);
  if (idx === -1) return false;
  spots[idx] = { ...spots[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(spots));
  addLog('Updated spot: ' + spots[idx].name);
  return spots[idx];
}
function deleteSpot(id) {
  const spots = getAllSpots();
  const spot = spots.find(s => s.id === id);
  if (!spot) return false;
  localStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(spots.filter(s => s.id !== id)));
  addLog('Deleted spot: ' + spot.name);
  return true;
}

// ─── Users / Auth ───────────────────────────────────────────────────────────

function getAllUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}
function registerUser(name, email, password) {
  const users = getAllUsers();
  if (users.find(u => u.email === email)) return { success: false, error: 'Email already registered.' };
  const u = { id: 'u' + Date.now(), name, email, password: btoa(password), role: 'user', avatar: name.charAt(0).toUpperCase(), createdAt: new Date().toISOString() };
  users.push(u);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  const sessionUser = { ...u, password: undefined };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
  return { success: true, user: sessionUser };
}
function loginUser(email, password) {
  const users = getAllUsers();
  const u = users.find(u => u.email === email && u.password === btoa(password));
  if (!u) return { success: false, error: 'Invalid email or password.' };
  const sessionUser = { ...u, password: undefined };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
  return { success: true, user: sessionUser };
}
function getCurrentUser() {
  const d = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return d ? JSON.parse(d) : null;
}
function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}
function isAdmin() {
  const u = getCurrentUser();
  return u && u.role === 'admin';
}

// ─── Favorites ──────────────────────────────────────────────────────────────

function getFavorites() {
  const u = getCurrentUser();
  if (!u) return [];
  const fav = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '{}');
  return fav[u.id] || [];
}
function toggleFavorite(spotId) {
  const u = getCurrentUser();
  if (!u) return null;
  const fav = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '{}');
  if (!fav[u.id]) fav[u.id] = [];
  const idx = fav[u.id].indexOf(spotId);
  if (idx === -1) { fav[u.id].push(spotId); } else { fav[u.id].splice(idx, 1); }
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(fav));
  return idx === -1;
}
function isFavorite(spotId) {
  return getFavorites().includes(spotId);
}

// ─── Reviews ────────────────────────────────────────────────────────────────

function getReviewsForSpot(spotId) {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]').filter(r => r.spotId === spotId);
}
function addReview(spotId, rating, comment) {
  const u = getCurrentUser();
  if (!u) return { success: false, error: 'Login required.' };
  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
  const newR = { id: 'rv' + Date.now(), spotId, userId: u.id, userName: u.name, rating, comment, date: new Date().toISOString().split('T')[0] };
  reviews.push(newR);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  const spotRevs = reviews.filter(r => r.spotId === spotId);
  const avg = Math.round((spotRevs.reduce((s, r) => s + r.rating, 0) / spotRevs.length) * 10) / 10;
  updateSpot(spotId, { rating: avg, reviewCount: spotRevs.length });
  return { success: true, review: newR };
}

// ─── Distance (Haversine) ───────────────────────────────────────────────────

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function getSpotsWithDistance(userLat, userLng) {
  return getAllSpots().map(s => ({ ...s, distance: calculateDistance(userLat, userLng, s.lat, s.lng) })).sort((a, b) => a.distance - b.distance);
}

// ─── Admin Log ──────────────────────────────────────────────────────────────

function addLog(action) {
  const log = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOG) || '[]');
  log.unshift({ action, timestamp: new Date().toISOString(), user: getCurrentUser()?.name || 'System' });
  if (log.length > 50) log.pop();
  localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify(log));
}
function getLog() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOG) || '[]');
}

// ─── Simulate Real-time Updates ─────────────────────────────────────────────

function simulateAvailabilityUpdate() {
  const spots = getAllSpots().map(s => ({
    ...s,
    availableSlots: Math.max(0, Math.min(s.totalSlots, s.availableSlots + Math.floor(Math.random() * 7) - 3))
  }));
  localStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(spots));
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDistance(km) {
  return km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1) + ' km';
}
function formatPrice(p) { return '₹' + p; }
function getAvailabilityStatus(spot) {
  const pct = (spot.availableSlots / spot.totalSlots) * 100;
  if (spot.availableSlots === 0) return { label: 'Full', cls: 'full', pct: 0 };
  if (pct < 20) return { label: spot.availableSlots + ' left', cls: 'limited', pct };
  return { label: spot.availableSlots + ' available', cls: 'available', pct };
}

// Run init
initData();
