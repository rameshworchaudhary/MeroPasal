import type { Province } from "@/lib/types/nepal-address";

export const NEPAL_PROVINCES: Province[] = [
  {
    id: 1,
    name: "Koshi",
    districts: [
      {
        name: "Bhojpur",
        municipalities: [
          { name: "Bhojpur", type: "Municipality", wards: 12 },
          { name: "Shadanand", type: "Municipality", wards: 14 },
          { name: "Hatuwagadhi", type: "Rural Municipality", wards: 9 },
          { name: "Ramprasad Rai", type: "Rural Municipality", wards: 8 },
          { name: "Aamchok", type: "Rural Municipality", wards: 10 },
          { name: "Tyamke Maiyung", type: "Rural Municipality", wards: 9 },
          { name: "Arun", type: "Rural Municipality", wards: 7 },
          { name: "Pauwadungma", type: "Rural Municipality", wards: 6 },
          { name: "Salpasilichho", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Dhankuta",
        municipalities: [
          { name: "Dhankuta", type: "Municipality", wards: 10 },
          { name: "Pakhribas", type: "Municipality", wards: 10 },
          { name: "Mahalaxmi", type: "Municipality", wards: 9 },
          { name: "Sangurigadhi", type: "Rural Municipality", wards: 10 },
          { name: "Chaubise", type: "Rural Municipality", wards: 8 },
          { name: "Chhathar Jorpati", type: "Rural Municipality", wards: 6 },
          { name: "Shahidbhumi", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Ilam",
        municipalities: [
          { name: "Ilam", type: "Municipality", wards: 12 },
          { name: "Deumai", type: "Municipality", wards: 9 },
          { name: "Mai", type: "Municipality", wards: 10 },
          { name: "Suryodaya", type: "Municipality", wards: 14 },
          { name: "Phakphokthum", type: "Rural Municipality", wards: 7 },
          { name: "Mai Jogmai", type: "Rural Municipality", wards: 6 },
          { name: "Chulachuli", type: "Rural Municipality", wards: 6 },
          { name: "Rong", type: "Rural Municipality", wards: 6 },
          { name: "Mangsebung", type: "Rural Municipality", wards: 6 },
          { name: "Sandakphu", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Jhapa",
        municipalities: [
          { name: "Mechinagar", type: "Municipality", wards: 15 },
          { name: "Birtamod", type: "Municipality", wards: 10 },
          { name: "Bhadrapur", type: "Municipality", wards: 10 },
          { name: "Damak", type: "Municipality", wards: 10 },
          { name: "Kankai", type: "Municipality", wards: 9 },
          { name: "Arjundhara", type: "Municipality", wards: 11 },
          { name: "Shivasatakshi", type: "Municipality", wards: 11 },
          { name: "Gauradaha", type: "Municipality", wards: 9 },
          { name: "Kamal", type: "Rural Municipality", wards: 7 },
          { name: "Jhapa", type: "Rural Municipality", wards: 7 },
          { name: "Kachankawal", type: "Rural Municipality", wards: 7 },
          { name: "Gauriganj", type: "Rural Municipality", wards: 6 },
          { name: "Barhadashi", type: "Rural Municipality", wards: 7 },
          { name: "Haldibari", type: "Rural Municipality", wards: 5 },
          { name: "Buddhashanti", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Khotang",
        municipalities: [
          { name: "Diktel Rupakot Majhuwagadhi", type: "Municipality", wards: 15 },
          { name: "Halesi Tuwachung", type: "Municipality", wards: 11 },
          { name: "Khotehang", type: "Rural Municipality", wards: 9 },
          { name: "Diprung Chuichumma", type: "Rural Municipality", wards: 7 },
          { name: "Ainselukhark", type: "Rural Municipality", wards: 6 },
          { name: "Rawa Besi", type: "Rural Municipality", wards: 6 },
          { name: "Sakela", type: "Rural Municipality", wards: 5 },
          { name: "Jantedhunga", type: "Rural Municipality", wards: 6 },
          { name: "Barahapokhari", type: "Rural Municipality", wards: 6 },
          { name: "Kepilasgarhi", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Morang",
        municipalities: [
          { name: "Biratnagar", type: "Metropolitan City", wards: 19 },
          { name: "Belbari", type: "Municipality", wards: 11 },
          { name: "Letang", type: "Municipality", wards: 9 },
          { name: "Pathari Sanischare", type: "Municipality", wards: 10 },
          { name: "Sunvarsi", type: "Municipality", wards: 9 },
          { name: "Rangeli", type: "Municipality", wards: 9 },
          { name: "Ratuwamai", type: "Municipality", wards: 10 },
          { name: "Urlabari", type: "Municipality", wards: 9 },
          { name: "Sundarharaicha", type: "Municipality", wards: 12 },
          { name: "Budhiganga", type: "Rural Municipality", wards: 7 },
          { name: "Gramathan", type: "Rural Municipality", wards: 7 },
          { name: "Dhanpalthan", type: "Rural Municipality", wards: 7 },
          { name: "Kanepokhari", type: "Rural Municipality", wards: 7 },
          { name: "Jahada", type: "Rural Municipality", wards: 7 },
          { name: "Miklajung", type: "Rural Municipality", wards: 9 },
          { name: "Kerabari", type: "Rural Municipality", wards: 10 },
          { name: "Kattike", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Okhaldhunga",
        municipalities: [
          { name: "Siddhicharan", type: "Municipality", wards: 12 },
          { name: "Khiji Demba", type: "Rural Municipality", wards: 9 },
          { name: "Champadevi", type: "Rural Municipality", wards: 10 },
          { name: "Chisankhugadhi", type: "Rural Municipality", wards: 8 },
          { name: "Manebhanjyang", type: "Rural Municipality", wards: 9 },
          { name: "Molung", type: "Rural Municipality", wards: 8 },
          { name: "Likhu", type: "Rural Municipality", wards: 9 },
          { name: "Sunkoshi", type: "Rural Municipality", wards: 9 }
        ]
      },
      {
        name: "Panchthar",
        municipalities: [
          { name: "Phidim", type: "Municipality", wards: 14 },
          { name: "Phalelung", type: "Rural Municipality", wards: 8 },
          { name: "Phalgunanda", type: "Rural Municipality", wards: 7 },
          { name: "Hilihang", type: "Rural Municipality", wards: 7 },
          { name: "Kummayak", type: "Rural Municipality", wards: 5 },
          { name: "Miklajung", type: "Rural Municipality", wards: 8 },
          { name: "Tumbewa", type: "Rural Municipality", wards: 5 },
          { name: "Yangwarak", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Sankhuwasabha",
        municipalities: [
          { name: "Chainpur", type: "Municipality", wards: 11 },
          { name: "Dharmadevi", type: "Municipality", wards: 9 },
          { name: "Madi", type: "Municipality", wards: 9 },
          { name: "Khandbari", type: "Municipality", wards: 11 },
          { name: "Panchkhapan", type: "Municipality", wards: 9 },
          { name: "Bhotkhola", type: "Rural Municipality", wards: 5 },
          { name: "Makalu", type: "Rural Municipality", wards: 6 },
          { name: "Sabha Pokhari", type: "Rural Municipality", wards: 6 },
          { name: "Silichong", type: "Rural Municipality", wards: 5 },
          { name: "Chichila", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Solukhumbu",
        municipalities: [
          { name: "Solududhkunda", type: "Municipality", wards: 11 },
          { name: "Khumbu Pasanglhamu", type: "Rural Municipality", wards: 5 },
          { name: "Mapya Dudhkoshi", type: "Rural Municipality", wards: 7 },
          { name: "Necha Salyan", type: "Rural Municipality", wards: 5 },
          { name: "Maha Kulung", type: "Rural Municipality", wards: 5 },
          { name: "Sotang", type: "Rural Municipality", wards: 5 },
          { name: "Thulung Dudhkoshi", type: "Rural Municipality", wards: 9 },
          { name: "Likhu Pike", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Sunsari",
        municipalities: [
          { name: "Dharan", type: "Sub-Metropolitan City", wards: 20 },
          { name: "Itahari", type: "Sub-Metropolitan City", wards: 20 },
          { name: "Inaruwa", type: "Municipality", wards: 10 },
          { name: "Duhabi", type: "Municipality", wards: 12 },
          { name: "Ramdhuni", type: "Municipality", wards: 9 },
          { name: "Barahachhetra", type: "Municipality", wards: 11 },
          { name: "Koshi", type: "Rural Municipality", wards: 8 },
          { name: "Gadhi", type: "Rural Municipality", wards: 6 },
          { name: "Barju", type: "Rural Municipality", wards: 6 },
          { name: "Bhokraha Narsing", type: "Rural Municipality", wards: 8 },
          { name: "Harinagara", type: "Rural Municipality", wards: 7 },
          { name: "Dewanganj", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Taplejung",
        municipalities: [
          { name: "Phungling", type: "Municipality", wards: 11 },
          { name: "Aathrai Triveni", type: "Rural Municipality", wards: 5 },
          { name: "Sidingwa", type: "Rural Municipality", wards: 7 },
          { name: "Phaktanglung", type: "Rural Municipality", wards: 7 },
          { name: "Mikwakhola", type: "Rural Municipality", wards: 5 },
          { name: "Meringden", type: "Rural Municipality", wards: 6 },
          { name: "Maiwakhola", type: "Rural Municipality", wards: 6 },
          { name: "Pathibhara Yangwarak", type: "Rural Municipality", wards: 6 },
          { name: "Sirijangha", type: "Rural Municipality", wards: 8 }
        ]
      },
      {
        name: "Terhathum",
        municipalities: [
          { name: "Myanglung", type: "Municipality", wards: 10 },
          { name: "Laligurans", type: "Municipality", wards: 9 },
          { name: "Aathrai", type: "Rural Municipality", wards: 7 },
          { name: "Chhathar", type: "Rural Municipality", wards: 6 },
          { name: "Phepedim", type: "Rural Municipality", wards: 6 },
          { name: "Menchhayayem", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Udayapur",
        municipalities: [
          { name: "Triyuga", type: "Municipality", wards: 16 },
          { name: "Katari", type: "Municipality", wards: 14 },
          { name: "Chaudandigadhi", type: "Municipality", wards: 10 },
          { name: "Belaka", type: "Municipality", wards: 9 },
          { name: "Udayapurgadhi", type: "Rural Municipality", wards: 8 },
          { name: "Tapli", type: "Rural Municipality", wards: 5 },
          { name: "Rautamai", type: "Rural Municipality", wards: 8 },
          { name: "Limchungbung", type: "Rural Municipality", wards: 5 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Madhesh",
    districts: [
      {
        name: "Bara",
        municipalities: [
          { name: "Kalaiya", type: "Sub-Metropolitan City", wards: 27 },
          { name: "Jitpur Simara", type: "Sub-Metropolitan City", wards: 24 },
          { name: "Kolhabi", type: "Municipality", wards: 11 },
          { name: "Nijgadh", type: "Municipality", wards: 13 },
          { name: "Mahagadhimai", type: "Municipality", wards: 11 },
          { name: "Simraungadh", type: "Municipality", wards: 11 },
          { name: "Pachrauta", type: "Municipality", wards: 9 },
          { name: "Adarsh Kotwal", type: "Rural Municipality", wards: 8 },
          { name: "Karaiyamai", type: "Rural Municipality", wards: 8 },
          { name: "Devtal", type: "Rural Municipality", wards: 7 },
          { name: "Parwanipur", type: "Rural Municipality", wards: 5 },
          { name: "Prasauni", type: "Rural Municipality", wards: 6 },
          { name: "Phattepur", type: "Rural Municipality", wards: 7 },
          { name: "Baragadhi", type: "Rural Municipality", wards: 6 },
          { name: "Suwarna", type: "Rural Municipality", wards: 8 },
          { name: "Bishrampur", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Dhanusha",
        municipalities: [
          { name: "Janakpurdham", type: "Sub-Metropolitan City", wards: 25 },
          { name: "Chhireshwarnath", type: "Municipality", wards: 10 },
          { name: "Ganeshaman Charnath", type: "Municipality", wards: 11 },
          { name: "Dhanushadham", type: "Municipality", wards: 9 },
          { name: "Nagarain", type: "Municipality", wards: 9 },
          { name: "Bideha", type: "Municipality", wards: 9 },
          { name: "Mithila", type: "Municipality", wards: 11 },
          { name: "Shahidnagar", type: "Municipality", wards: 9 },
          { name: "Sabaila", type: "Municipality", wards: 13 },
          { name: "Kamala", type: "Municipality", wards: 9 },
          { name: "Mithila Bihari", type: "Municipality", wards: 10 },
          { name: "Hansapur", type: "Municipality", wards: 9 },
          { name: "Janaknandani", type: "Rural Municipality", wards: 6 },
          { name: "Bataswar", type: "Rural Municipality", wards: 5 },
          { name: "Mukhiyapatti Musaharniya", type: "Rural Municipality", wards: 6 },
          { name: "Laksminiya", type: "Rural Municipality", wards: 7 },
          { name: "Aurahi", type: "Rural Municipality", wards: 6 },
          { name: "Dhanauji", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Mahottari",
        municipalities: [
          { name: "Jaleshwar", type: "Municipality", wards: 12 },
          { name: "Bardibas", type: "Municipality", wards: 14 },
          { name: "Gaushala", type: "Municipality", wards: 12 },
          { name: "Bhangaha", type: "Municipality", wards: 9 },
          { name: "Matihani", type: "Municipality", wards: 9 },
          { name: "Manara Shiswa", type: "Municipality", wards: 10 },
          { name: "Ramgopalpur", type: "Municipality", wards: 9 },
          { name: "Aurahi", type: "Municipality", wards: 9 },
          { name: "Balawa", type: "Municipality", wards: 11 },
          { name: "Loharpatti", type: "Municipality", wards: 9 },
          { name: "Ekdara", type: "Rural Municipality", wards: 6 },
          { name: "Sonama", type: "Rural Municipality", wards: 8 },
          { name: "Samsi", type: "Rural Municipality", wards: 7 },
          { name: "Mahottari", type: "Rural Municipality", wards: 6 },
          { name: "Pipra", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Parsa",
        municipalities: [
          { name: "Birgunj", type: "Metropolitan City", wards: 32 },
          { name: "Bahudarmai", type: "Municipality", wards: 9 },
          { name: "Parsagadhi", type: "Municipality", wards: 9 },
          { name: "Pokhariya", type: "Municipality", wards: 10 },
          { name: "Thori", type: "Rural Municipality", wards: 5 },
          { name: "Jagarnathpur", type: "Rural Municipality", wards: 6 },
          { name: "Dhobini", type: "Rural Municipality", wards: 5 },
          { name: "Chhipaharmai", type: "Rural Municipality", wards: 5 },
          { name: "Pakaha Mainpur", type: "Rural Municipality", wards: 5 },
          { name: "Bindabasini", type: "Rural Municipality", wards: 5 },
          { name: "Sakhuwa Prasuni", type: "Rural Municipality", wards: 6 },
          { name: "Pattar Katti", type: "Rural Municipality", wards: 5 },
          { name: "Kalikamai", type: "Rural Municipality", wards: 5 },
          { name: "Jirabhawani", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Rautahat",
        municipalities: [
          { name: "Chandrapur", type: "Municipality", wards: 10 },
          { name: "Garuda", type: "Municipality", wards: 9 },
          { name: "Gaur", type: "Municipality", wards: 9 },
          { name: "Baudhimai", type: "Municipality", wards: 9 },
          { name: "Brindaban", type: "Municipality", wards: 9 },
          { name: "Dewahi Gonahi", type: "Municipality", wards: 9 },
          { name: "Dhamura", type: "Municipality", wards: 9 },
          { name: "Gujara", type: "Municipality", wards: 9 },
          { name: "Katahariya", type: "Municipality", wards: 9 },
          { name: "Madhav Narayan", type: "Municipality", wards: 9 },
          { name: "Maulapur", type: "Municipality", wards: 9 },
          { name: "Phatuwa Bijayapur", type: "Municipality", wards: 11 },
          { name: "Rajdevi", type: "Municipality", wards: 9 },
          { name: "Rajpur", type: "Municipality", wards: 9 },
          { name: "Ishanath", type: "Municipality", wards: 9 },
          { name: "Paroha", type: "Municipality", wards: 9 },
          { name: "Durga Bhagwati", type: "Rural Municipality", wards: 5 },
          { name: "Yamunamai", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Saptari",
        municipalities: [
          { name: "Rajbiraj", type: "Municipality", wards: 16 },
          { name: "Kanchanrup", type: "Municipality", wards: 12 },
          { name: "Dakneshwari", type: "Municipality", wards: 10 },
          { name: "Bodebarsain", type: "Municipality", wards: 10 },
          { name: "Khadak", type: "Municipality", wards: 11 },
          { name: "Shambhunath", type: "Municipality", wards: 12 },
          { name: "Surunga", type: "Municipality", wards: 11 },
          { name: "Hanumannagar Kankalini", type: "Municipality", wards: 14 },
          { name: "Saptakoshi", type: "Municipality", wards: 11 },
          { name: "Agnisair Krishna Savaran", type: "Rural Municipality", wards: 6 },
          { name: "Chhinnamasta", type: "Rural Municipality", wards: 7 },
          { name: "Mahadeva", type: "Rural Municipality", wards: 6 },
          { name: "Tirahut", type: "Rural Municipality", wards: 5 },
          { name: "Tilathi Koiladi", type: "Rural Municipality", wards: 8 },
          { name: "Rupani", type: "Rural Municipality", wards: 6 },
          { name: "Balan Bihul", type: "Rural Municipality", wards: 6 },
          { name: "Bishnupur", type: "Rural Municipality", wards: 7 },
          { name: "Rupani", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Sarlahi",
        municipalities: [
          { name: "Malangwa", type: "Municipality", wards: 12 },
          { name: "Hariwan", type: "Municipality", wards: 11 },
          { name: "Lalbandi", type: "Municipality", wards: 17 },
          { name: "Ishworpur", type: "Municipality", wards: 15 },
          { name: "Barahathwa", type: "Municipality", wards: 18 },
          { name: "Haripur", type: "Municipality", wards: 9 },
          { name: "Haripurwa", type: "Municipality", wards: 9 },
          { name: "Kabilasi", type: "Municipality", wards: 10 },
          { name: "Godaita", type: "Municipality", wards: 12 },
          { name: "Balara", type: "Municipality", wards: 11 },
          { name: "Bagmati", type: "Municipality", wards: 12 },
          { name: "Kaudena", type: "Rural Municipality", wards: 7 },
          { name: "Chakraghatta", type: "Rural Municipality", wards: 9 },
          { name: "Dhanusha", type: "Rural Municipality", wards: 7 },
          { name: "Chandranagar", type: "Rural Municipality", wards: 7 },
          { name: "Dhankaul", type: "Rural Municipality", wards: 7 },
          { name: "Brahampuri", type: "Rural Municipality", wards: 7 },
          { name: "Ramnagar", type: "Rural Municipality", wards: 7 },
          { name: "Bishnu", type: "Rural Municipality", wards: 8 },
          { name: "Basbariya", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Siraha",
        municipalities: [
          { name: "Lahan", type: "Municipality", wards: 24 },
          { name: "Siraha", type: "Municipality", wards: 22 },
          { name: "Golbazar", type: "Municipality", wards: 13 },
          { name: "Mirchaiya", type: "Municipality", wards: 12 },
          { name: "Kalyanpur", type: "Municipality", wards: 12 },
          { name: "Karjanha", type: "Municipality", wards: 11 },
          { name: "Sukhipur", type: "Municipality", wards: 10 },
          { name: "Dhangadhimai", type: "Municipality", wards: 14 },
          { name: "Aurahi", type: "Rural Municipality", wards: 5 },
          { name: "Naraha", type: "Rural Municipality", wards: 5 },
          { name: "Arnama", type: "Rural Municipality", wards: 5 },
          { name: "Bhagwanpur", type: "Rural Municipality", wards: 5 },
          { name: "Navrajpur", type: "Rural Municipality", wards: 5 },
          { name: "Bishnupur", type: "Rural Municipality", wards: 5 },
          { name: "Bariyarpatti", type: "Rural Municipality", wards: 5 },
          { name: "Laxmipur Patari", type: "Rural Municipality", wards: 6 },
          { name: "Sakhuwanankarkatti", type: "Rural Municipality", wards: 5 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Bagmati",
    districts: [
      {
        name: "Bhaktapur",
        municipalities: [
          { name: "Bhaktapur", type: "Municipality", wards: 10 },
          { name: "Changunarayan", type: "Municipality", wards: 9 },
          { name: "Madhyapur Thimi", type: "Municipality", wards: 9 },
          { name: "Suryabinayak", type: "Municipality", wards: 10 }
        ]
      },
      {
        name: "Chitwan",
        municipalities: [
          { name: "Bharatpur", type: "Metropolitan City", wards: 29 },
          { name: "Ratnanagar", type: "Municipality", wards: 16 },
          { name: "Khairahani", type: "Municipality", wards: 13 },
          { name: "Madi", type: "Municipality", wards: 9 },
          { name: "Rapti", type: "Municipality", wards: 13 },
          { name: "Kalika", type: "Municipality", wards: 11 },
          { name: "Ichchhakamana", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Dhading",
        municipalities: [
          { name: "Dhunibeshi", type: "Municipality", wards: 9 },
          { name: "Nilkantha", type: "Municipality", wards: 14 },
          { name: "Khaniyapabas", type: "Rural Municipality", wards: 5 },
          { name: "Gajuri", type: "Rural Municipality", wards: 8 },
          { name: "Galchi", type: "Rural Municipality", wards: 8 },
          { name: "Gangajamuna", type: "Rural Municipality", wards: 7 },
          { name: "Jwala Mukhi", type: "Rural Municipality", wards: 7 },
          { name: "Thakre", type: "Rural Municipality", wards: 11 },
          { name: "Netrawati Dabjong", type: "Rural Municipality", wards: 5 },
          { name: "Benighat Rorang", type: "Rural Municipality", wards: 10 },
          { name: "Ruby Valley", type: "Rural Municipality", wards: 6 },
          { name: "Siddhalek", type: "Rural Municipality", wards: 7 },
          { name: "Tripurasundari", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Dolakha",
        municipalities: [
          { name: "Bhimeshwar", type: "Municipality", wards: 9 },
          { name: "Jiri", type: "Municipality", wards: 9 },
          { name: "Kalinchok", type: "Rural Municipality", wards: 9 },
          { name: "Gauri Shankar", type: "Rural Municipality", wards: 9 },
          { name: "Baiteshwar", type: "Rural Municipality", wards: 8 },
          { name: "Sailung", type: "Rural Municipality", wards: 8 },
          { name: "Melung", type: "Rural Municipality", wards: 7 },
          { name: "Bigu", type: "Rural Municipality", wards: 8 },
          { name: "Tamakoshi", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Kathmandu",
        municipalities: [
          { name: "Kathmandu", type: "Metropolitan City", wards: 32 },
          { name: "Kageshwari Manohara", type: "Municipality", wards: 9 },
          { name: "Kirtipur", type: "Municipality", wards: 10 },
          { name: "Gokarneshwar", type: "Municipality", wards: 9 },
          { name: "Chandragiri", type: "Municipality", wards: 15 },
          { name: "Tokha", type: "Municipality", wards: 11 },
          { name: "Taranakeshwar", type: "Municipality", wards: 11 },
          { name: "Nagarjun", type: "Municipality", wards: 10 },
          { name: "Shankharapur", type: "Municipality", wards: 9 },
          { name: "Budhanilkantha", type: "Municipality", wards: 13 },
          { name: "Dakshinkali", type: "Municipality", wards: 9 }
        ]
      },
      {
        name: "Kavrepalanchok",
        municipalities: [
          { name: "Dhulikhel", type: "Municipality", wards: 12 },
          { name: "Banepa", type: "Municipality", wards: 14 },
          { name: "Panauti", type: "Municipality", wards: 12 },
          { name: "Panchkhal", type: "Municipality", wards: 13 },
          { name: "Namo Buddha", type: "Municipality", wards: 11 },
          { name: "Mandandeupur", type: "Municipality", wards: 12 },
          { name: "Khamari", type: "Rural Municipality", wards: 11 },
          { name: "Chaurideurali", type: "Rural Municipality", wards: 9 },
          { name: "Temal", type: "Rural Municipality", wards: 9 },
          { name: "Bethanchowk", type: "Rural Municipality", wards: 6 },
          { name: "Bhumlu", type: "Rural Municipality", wards: 10 },
          { name: "Mahabharat", type: "Rural Municipality", wards: 8 },
          { name: "Roshi", type: "Rural Municipality", wards: 12 }
        ]
      },
      {
        name: "Lalitpur",
        municipalities: [
          { name: "Lalitpur", type: "Metropolitan City", wards: 29 },
          { name: "Godawari", type: "Municipality", wards: 14 },
          { name: "Mahalaxmi", type: "Municipality", wards: 10 },
          { name: "Konjyosom", type: "Rural Municipality", wards: 5 },
          { name: "Bagmati", type: "Rural Municipality", wards: 7 },
          { name: "Mahankal", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Makwanpur",
        municipalities: [
          { name: "Hetauda", type: "Sub-Metropolitan City", wards: 19 },
          { name: "Thaha", type: "Municipality", wards: 12 },
          { name: "Indrasarowar", type: "Rural Municipality", wards: 5 },
          { name: "Kailash", type: "Rural Municipality", wards: 10 },
          { name: "Bakaiya", type: "Rural Municipality", wards: 12 },
          { name: "Baghmathi", type: "Rural Municipality", wards: 9 },
          { name: "Bhimfedi", type: "Rural Municipality", wards: 9 },
          { name: "Manhari", type: "Rural Municipality", wards: 9 },
          { name: "Raksirang", type: "Rural Municipality", wards: 9 },
          { name: "Makawanpurgadhi", type: "Rural Municipality", wards: 8 }
        ]
      },
      {
        name: "Nuwakot",
        municipalities: [
          { name: "Bidur", type: "Municipality", wards: 13 },
          { name: "Belkotgadhi", type: "Municipality", wards: 13 },
          { name: "Kakani", type: "Rural Municipality", wards: 8 },
          { name: "Kispang", type: "Rural Municipality", wards: 5 },
          { name: "Tadi", type: "Rural Municipality", wards: 6 },
          { name: "Tarkeshwar", type: "Rural Municipality", wards: 6 },
          { name: "Dupcheshwar", type: "Rural Municipality", wards: 7 },
          { name: "Panchakanya", type: "Rural Municipality", wards: 5 },
          { name: "Likhu", type: "Rural Municipality", wards: 6 },
          { name: "Myagang", type: "Rural Municipality", wards: 6 },
          { name: "Shivapuri", type: "Rural Municipality", wards: 8 },
          { name: "Suryagadhi", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Ramechhap",
        municipalities: [
          { name: "Manthali", type: "Municipality", wards: 14 },
          { name: "Ramechhap", type: "Municipality", wards: 9 },
          { name: "Umakunda", type: "Rural Municipality", wards: 7 },
          { name: "Khandadevi", type: "Rural Municipality", wards: 9 },
          { name: "Gokulganga", type: "Rural Municipality", wards: 6 },
          { name: "Doramba", type: "Rural Municipality", wards: 7 },
          { name: "Likhu Tamakoshi", type: "Rural Municipality", wards: 7 },
          { name: "Sunapati", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Rasuwa",
        municipalities: [
          { name: "Uttargaya", type: "Rural Municipality", wards: 5 },
          { name: "Kalika", type: "Rural Municipality", wards: 5 },
          { name: "Gosaikunda", type: "Rural Municipality", wards: 6 },
          { name: "Naukunda", type: "Rural Municipality", wards: 6 },
          { name: "Parbatikunda", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Sindhuli",
        municipalities: [
          { name: "Kamalamai", type: "Municipality", wards: 14 },
          { name: "Dudhouli", type: "Municipality", wards: 14 },
          { name: "Sunkoshi", type: "Rural Municipality", wards: 7 },
          { name: "Hariharpurgadhi", type: "Rural Municipality", wards: 8 },
          { name: "Golanjor", type: "Rural Municipality", wards: 7 },
          { name: "Ghyangkhel", type: "Rural Municipality", wards: 5 },
          { name: "Tinpatan", type: "Rural Municipality", wards: 11 },
          { name: "Marin", type: "Rural Municipality", wards: 7 },
          { name: "Phikal", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Sindhupalchok",
        municipalities: [
          { name: "Chautara Sangachokgadhi", type: "Municipality", wards: 14 },
          { name: "Barhabise", type: "Municipality", wards: 9 },
          { name: "Melamchi", type: "Municipality", wards: 13 },
          { name: "Indrawati", type: "Rural Municipality", wards: 12 },
          { name: "Jugal", type: "Rural Municipality", wards: 7 },
          { name: "Panchpokhari Thangpal", type: "Rural Municipality", wards: 8 },
          { name: "Balefi", type: "Rural Municipality", wards: 8 },
          { name: "Bhotekoshi", type: "Rural Municipality", wards: 5 },
          { name: "Lisankhu Pakhar", type: "Rural Municipality", wards: 7 },
          { name: "Sunkoshi", type: "Rural Municipality", wards: 7 },
          { name: "Helambu", type: "Rural Municipality", wards: 7 },
          { name: "Tripurasundari", type: "Rural Municipality", wards: 6 }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Gandaki",
    districts: [
      {
        name: "Baglung",
        municipalities: [
          { name: "Baglung", type: "Municipality", wards: 14 },
          { name: "Galkot", type: "Municipality", wards: 11 },
          { name: "Jaimini", type: "Municipality", wards: 10 },
          { name: "Dhorpatan", type: "Municipality", wards: 9 },
          { name: "Bareng", type: "Rural Municipality", wards: 5 },
          { name: "Kathekhola", type: "Rural Municipality", wards: 8 },
          { name: "Taman Khola", type: "Rural Municipality", wards: 6 },
          { name: "Tara Khola", type: "Rural Municipality", wards: 5 },
          { name: "Nisi Khola", type: "Rural Municipality", wards: 7 },
          { name: "Badigad", type: "Rural Municipality", wards: 10 }
        ]
      },
      {
        name: "Gorkha",
        municipalities: [
          { name: "Gorkha", type: "Municipality", wards: 14 },
          { name: "Palungtar", type: "Municipality", wards: 10 },
          { name: "Sulikot", type: "Rural Municipality", wards: 8 },
          { name: "Siranchok", type: "Rural Municipality", wards: 8 },
          { name: "Ajirkot", type: "Rural Municipality", wards: 5 },
          { name: "Tsum Nubri", type: "Rural Municipality", wards: 7 },
          { name: "Dharche", type: "Rural Municipality", wards: 7 },
          { name: "Bhimsen Thapa", type: "Rural Municipality", wards: 8 },
          { name: "Gandaki", type: "Rural Municipality", wards: 8 },
          { name: "Manakamana", type: "Rural Municipality", wards: 9 },
          { name: "Arughat", type: "Rural Municipality", wards: 10 }
        ]
      },
      {
        name: "Kaski",
        municipalities: [
          { name: "Pokhara", type: "Metropolitan City", wards: 33 },
          { name: "Annapurna", type: "Rural Municipality", wards: 11 },
          { name: "Machhapuchhre", type: "Rural Municipality", wards: 9 },
          { name: "Madi", type: "Rural Municipality", wards: 12 },
          { name: "Rupa", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Lamjung",
        municipalities: [
          { name: "Bensishahar", type: "Municipality", wards: 11 },
          { name: "Sundarbazar", type: "Municipality", wards: 11 },
          { name: "Rainas", type: "Municipality", wards: 10 },
          { name: "Madhya Nepal", type: "Municipality", wards: 10 },
          { name: "Kwhlosothar", type: "Rural Municipality", wards: 9 },
          { name: "Gaukharka", type: "Rural Municipality", wards: 9 },
          { name: "Dordi", type: "Rural Municipality", wards: 9 },
          { name: "Marsyangdi", type: "Rural Municipality", wards: 9 }
        ]
      },
      {
        name: "Manang",
        municipalities: [
          { name: "Chame", type: "Rural Municipality", wards: 5 },
          { name: "Narpa Bhumi", type: "Rural Municipality", wards: 5 },
          { name: "Nason", type: "Rural Municipality", wards: 9 },
          { name: "Manang Disang", type: "Rural Municipality", wards: 9 }
        ]
      },
      {
        name: "Mustang",
        municipalities: [
          { name: "Gharpajhong", type: "Rural Municipality", wards: 5 },
          { name: "Thasang", type: "Rural Municipality", wards: 5 },
          { name: "Lo-Ghekar Damodarkunda", type: "Rural Municipality", wards: 5 },
          { name: "Lomanthang", type: "Rural Municipality", wards: 5 },
          { name: "Varagung Muktichhetra", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Myagdi",
        municipalities: [
          { name: "Beni", type: "Municipality", wards: 10 },
          { name: "Annakot", type: "Rural Municipality", wards: 8 },
          { name: "Dhaulagiri", type: "Rural Municipality", wards: 7 },
          { name: "Mangala", type: "Rural Municipality", wards: 5 },
          { name: "Malika", type: "Rural Municipality", wards: 7 },
          { name: "Raghuganga", type: "Rural Municipality", wards: 8 }
        ]
      },
      {
        name: "Nawalpur",
        municipalities: [
          { name: "Kawasoti", type: "Municipality", wards: 17 },
          { name: "Gaindakot", type: "Municipality", wards: 18 },
          { name: "Devachuli", type: "Municipality", wards: 17 },
          { name: "Madhya Bindu", type: "Municipality", wards: 15 },
          { name: "Boudikali", type: "Rural Municipality", wards: 6 },
          { name: "Bulingtar", type: "Rural Municipality", wards: 6 },
          { name: "Binayi Triveni", type: "Rural Municipality", wards: 7 },
          { name: "Hupsekot", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Parbat",
        municipalities: [
          { name: "Kusma", type: "Municipality", wards: 14 },
          { name: "Phalebas", type: "Municipality", wards: 11 },
          { name: "Jaljala", type: "Rural Municipality", wards: 9 },
          { name: "Paiyun", type: "Rural Municipality", wards: 7 },
          { name: "Mahashila", type: "Rural Municipality", wards: 6 },
          { name: "Modi", type: "Rural Municipality", wards: 8 },
          { name: "Bihadi", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Syangja",
        municipalities: [
          { name: "Putalibazar", type: "Municipality", wards: 14 },
          { name: "Waling", type: "Municipality", wards: 14 },
          { name: "Galyang", type: "Municipality", wards: 11 },
          { name: "Chapakot", type: "Municipality", wards: 10 },
          { name: "Andhikhola", type: "Rural Municipality", wards: 6 },
          { name: "Arjun Chaupari", type: "Rural Municipality", wards: 6 },
          { name: "Kaligandaki", type: "Rural Municipality", wards: 7 },
          { name: "Phedikhola", type: "Rural Municipality", wards: 5 },
          { name: "Harinas", type: "Rural Municipality", wards: 7 },
          { name: "Biruwa", type: "Rural Municipality", wards: 8 },
          { name: "Bhangkot", type: "Rural Municipality", wards: 9 }
        ]
      },
      {
        name: "Tanahun",
        municipalities: [
          { name: "Bhanu", type: "Municipality", wards: 13 },
          { name: "Bhimad", type: "Municipality", wards: 9 },
          { name: "Vyas", type: "Municipality", wards: 14 },
          { name: "Shuklagandaki", type: "Municipality", wards: 12 },
          { name: "Anbu Khaireni", type: "Rural Municipality", wards: 6 },
          { name: "Devghat", type: "Rural Municipality", wards: 5 },
          { name: "Bandipur", type: "Rural Municipality", wards: 6 },
          { name: "Rishing", type: "Rural Municipality", wards: 8 },
          { name: "Ghiring", type: "Rural Municipality", wards: 5 },
          { name: "Myagde", type: "Rural Municipality", wards: 7 }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Lumbini",
    districts: [
      {
        name: "Arghakhanchi",
        municipalities: [
          { name: "Sandhikharka", type: "Municipality", wards: 12 },
          { name: "Sitaganga", type: "Municipality", wards: 14 },
          { name: "Bhumikasthan", type: "Municipality", wards: 10 },
          { name: "Chhatradev", type: "Rural Municipality", wards: 8 },
          { name: "Panini", type: "Rural Municipality", wards: 8 },
          { name: "Malarani", type: "Rural Municipality", wards: 9 }
        ]
      },
      {
        name: "Banke",
        municipalities: [
          { name: "Nepalgunj", type: "Sub-Metropolitan City", wards: 23 },
          { name: "Kohalpur", type: "Municipality", wards: 15 },
          { name: "Narainapur", type: "Rural Municipality", wards: 6 },
          { name: "Rapti Sonari", type: "Rural Municipality", wards: 9 },
          { name: "Baijanath", type: "Rural Municipality", wards: 8 },
          { name: "Khajura", type: "Rural Municipality", wards: 8 },
          { name: "Duduwa", type: "Rural Municipality", wards: 6 },
          { name: "Janki", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Bardia",
        municipalities: [
          { name: "Gulariya", type: "Municipality", wards: 12 },
          { name: "Madhuwan", type: "Municipality", wards: 9 },
          { name: "Rajapur", type: "Municipality", wards: 10 },
          { name: "Thakurbaba", type: "Municipality", wards: 9 },
          { name: "Bansgadhi", type: "Municipality", wards: 9 },
          { name: "Barbardiya", type: "Municipality", wards: 11 },
          { name: "Badhaiyatal", type: "Rural Municipality", wards: 9 },
          { name: "Geruwa", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Dang",
        municipalities: [
          { name: "Tulsipur", type: "Sub-Metropolitan City", wards: 19 },
          { name: "Ghorahi", type: "Sub-Metropolitan City", wards: 19 },
          { name: "Lamahi", type: "Municipality", wards: 9 },
          { name: "Gadhawa", type: "Rural Municipality", wards: 8 },
          { name: "Rajpur", type: "Rural Municipality", wards: 7 },
          { name: "Shantinagar", type: "Rural Municipality", wards: 7 },
          { name: "Saruma Rani", type: "Rural Municipality", wards: 6 },
          { name: "Dangisharan", type: "Rural Municipality", wards: 7 },
          { name: "Babai", type: "Rural Municipality", wards: 7 },
          { name: "Bunglachuli", type: "Rural Municipality", wards: 8 }
        ]
      },
      {
        name: "Gulmi",
        municipalities: [
          { name: "Resunga", type: "Municipality", wards: 14 },
          { name: "Musikot", type: "Municipality", wards: 9 },
          { name: "Isma", type: "Rural Municipality", wards: 6 },
          { name: "Kaligandaki", type: "Rural Municipality", wards: 7 },
          { name: "Gulmi Durbar", type: "Rural Municipality", wards: 7 },
          { name: "Satyawati", type: "Rural Municipality", wards: 8 },
          { name: "Chandrakot", type: "Rural Municipality", wards: 8 },
          { name: "Ruru Kshetra", type: "Rural Municipality", wards: 6 },
          { name: "Chhatrakot", type: "Rural Municipality", wards: 6 },
          { name: "Dhurkot", type: "Rural Municipality", wards: 7 },
          { name: "Madane", type: "Rural Municipality", wards: 7 },
          { name: "Malika", type: "Rural Municipality", wards: 8 }
        ]
      },
      {
        name: "Kapilvastu",
        municipalities: [
          { name: "Kapilvastu", type: "Municipality", wards: 12 },
          { name: "Buddhabhumi", type: "Municipality", wards: 10 },
          { name: "Shivaraj", type: "Municipality", wards: 11 },
          { name: "Maharajgunj", type: "Municipality", wards: 11 },
          { name: "Banganga", type: "Municipality", wards: 11 },
          { name: "Krishnanagar", type: "Municipality", wards: 12 },
          { name: "Mayadevi", type: "Rural Municipality", wards: 8 },
          { name: "Yashodhara", type: "Rural Municipality", wards: 8 },
          { name: "Suddhodhan", type: "Rural Municipality", wards: 6 },
          { name: "Bijaynagar", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Parasi",
        municipalities: [
          { name: "Ramgram", type: "Municipality", wards: 18 },
          { name: "Sunwal", type: "Municipality", wards: 13 },
          { name: "Bardaghat", type: "Municipality", wards: 16 },
          { name: "Susta", type: "Rural Municipality", wards: 5 },
          { name: "Palhinandan", type: "Rural Municipality", wards: 6 },
          { name: "Pratappur", type: "Rural Municipality", wards: 9 },
          { name: "Sarawal", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Palpa",
        municipalities: [
          { name: "Tansen", type: "Municipality", wards: 14 },
          { name: "Rampur", type: "Municipality", wards: 10 },
          { name: "Nisdi", type: "Rural Municipality", wards: 7 },
          { name: "Purba Khola", type: "Rural Municipality", wards: 6 },
          { name: "Rambha", type: "Rural Municipality", wards: 5 },
          { name: "Mathagadhi", type: "Rural Municipality", wards: 8 },
          { name: "Tinau", type: "Rural Municipality", wards: 6 },
          { name: "Bagnaskali", type: "Rural Municipality", wards: 9 },
          { name: "Ribdikot", type: "Rural Municipality", wards: 8 },
          { name: "Raina Devi Chhahara", type: "Rural Municipality", wards: 8 }
        ]
      },
      {
        name: "Pyuthan",
        municipalities: [
          { name: "Pyuthan", type: "Municipality", wards: 10 },
          { name: "Swargadwari", type: "Municipality", wards: 9 },
          { name: "Gaumukhi", type: "Rural Municipality", wards: 7 },
          { name: "Mandavi", type: "Rural Municipality", wards: 5 },
          { name: "Sarumarani", type: "Rural Municipality", wards: 6 },
          { name: "Mallarani", type: "Rural Municipality", wards: 5 },
          { name: "Nau Bahini", type: "Rural Municipality", wards: 8 },
          { name: "Jhimruk", type: "Rural Municipality", wards: 8 },
          { name: "Airawati", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Rolpa",
        municipalities: [
          { name: "Rolpa", type: "Municipality", wards: 10 },
          { name: "Runtigadhi", type: "Rural Municipality", wards: 9 },
          { name: "Triveni", type: "Rural Municipality", wards: 7 },
          { name: "Sunil Smriti", type: "Rural Municipality", wards: 8 },
          { name: "Lungri", type: "Rural Municipality", wards: 7 },
          { name: "Sunchhahari", type: "Rural Municipality", wards: 7 },
          { name: "Thawang", type: "Rural Municipality", wards: 5 },
          { name: "Duikholi", type: "Rural Municipality", wards: 6 },
          { name: "Madi", type: "Rural Municipality", wards: 6 },
          { name: "Gangadev", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Eastern Rukum",
        municipalities: [
          { name: "Bhume", type: "Rural Municipality", wards: 9 },
          { name: "Putha Uttarganga", type: "Rural Municipality", wards: 14 },
          { name: "Sisne", type: "Rural Municipality", wards: 8 }
        ]
      },
      {
        name: "Rupandehi",
        municipalities: [
          { name: "Butwal", type: "Sub-Metropolitan City", wards: 19 },
          { name: "Siddharthanagar", type: "Municipality", wards: 13 },
          { name: "Sainamaina", type: "Municipality", wards: 11 },
          { name: "Lumbini Sanskritik", type: "Municipality", wards: 13 },
          { name: "Devdaha", type: "Municipality", wards: 12 },
          { name: "Tilottama", type: "Municipality", wards: 17 },
          { name: "Gaihdahawa", type: "Rural Municipality", wards: 9 },
          { name: "Kanchan", type: "Rural Municipality", wards: 5 },
          { name: "Kotahimai", type: "Rural Municipality", wards: 7 },
          { name: "Marchawari", type: "Rural Municipality", wards: 7 },
          { name: "Mayadevi", type: "Rural Municipality", wards: 8 },
          { name: "Siyari", type: "Rural Municipality", wards: 7 },
          { name: "Sammarimai", type: "Rural Municipality", wards: 7 },
          { name: "Rohini", type: "Rural Municipality", wards: 7 },
          { name: "Omsatiya", type: "Rural Municipality", wards: 6 },
          { name: "Suddhodhan", type: "Rural Municipality", wards: 7 }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Karnali",
    districts: [
      {
        name: "Dailekh",
        municipalities: [
          { name: "Narayan", type: "Municipality", wards: 11 },
          { name: "Dullu", type: "Municipality", wards: 13 },
          { name: "Chamunda Bindrasaini", type: "Municipality", wards: 9 },
          { name: "Aathbis", type: "Municipality", wards: 9 },
          { name: "Bhagawatimai", type: "Rural Municipality", wards: 7 },
          { name: "Gurans", type: "Rural Municipality", wards: 8 },
          { name: "Dungeshwar", type: "Rural Municipality", wards: 6 },
          { name: "Naumule", type: "Rural Municipality", wards: 8 },
          { name: "Mahabu", type: "Rural Municipality", wards: 6 },
          { name: "Bhairabi", type: "Rural Municipality", wards: 7 },
          { name: "Thantikandh", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Dolpa",
        municipalities: [
          { name: "Thuli Bheri", type: "Municipality", wards: 11 },
          { name: "Tripurasundari", type: "Municipality", wards: 11 },
          { name: "Dolpo Buddha", type: "Rural Municipality", wards: 6 },
          { name: "Shey Phoksundo", type: "Rural Municipality", wards: 9 },
          { name: "Jagadulla", type: "Rural Municipality", wards: 6 },
          { name: "Mudkechula", type: "Rural Municipality", wards: 9 },
          { name: "Kaake", type: "Rural Municipality", wards: 7 },
          { name: "Chharka Tangsong", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Humla",
        municipalities: [
          { name: "Simkot", type: "Rural Municipality", wards: 8 },
          { name: "Namkha", type: "Rural Municipality", wards: 6 },
          { name: "Kharpunath", type: "Rural Municipality", wards: 5 },
          { name: "Sarkegad", type: "Rural Municipality", wards: 8 },
          { name: "Chankheli", type: "Rural Municipality", wards: 6 },
          { name: "Adanchuli", type: "Rural Municipality", wards: 6 },
          { name: "Tanjakot", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Jajarkot",
        municipalities: [
          { name: "Bheri", type: "Municipality", wards: 13 },
          { name: "Chhedagad", type: "Municipality", wards: 13 },
          { name: "Nalgad", type: "Municipality", wards: 13 },
          { name: "Kusahe", type: "Rural Municipality", wards: 9 },
          { name: "Junichande", type: "Rural Municipality", wards: 11 },
          { name: "Barekot", type: "Rural Municipality", wards: 9 },
          { name: "Shivalaya", type: "Rural Municipality", wards: 9 }
        ]
      },
      {
        name: "Jumla",
        municipalities: [
          { name: "Chandannath", type: "Municipality", wards: 10 },
          { name: "Kanakasundari", type: "Rural Municipality", wards: 8 },
          { name: "Sinja", type: "Rural Municipality", wards: 6 },
          { name: "Hima", type: "Rural Municipality", wards: 7 },
          { name: "Tila", type: "Rural Municipality", wards: 9 },
          { name: "Guthichaur", type: "Rural Municipality", wards: 5 },
          { name: "Tatopani", type: "Rural Municipality", wards: 8 },
          { name: "Patarasi", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Kalikot",
        municipalities: [
          { name: "Khandachakra", type: "Municipality", wards: 11 },
          { name: "Raskot", type: "Municipality", wards: 9 },
          { name: "Tilagufa", type: "Municipality", wards: 11 },
          { name: "Pachaljharana", type: "Rural Municipality", wards: 9 },
          { name: "Sanni Triveni", type: "Rural Municipality", wards: 9 },
          { name: "Narharinath", type: "Rural Municipality", wards: 9 },
          { name: "Shubha Kalika", type: "Rural Municipality", wards: 8 },
          { name: "Mahawai", type: "Rural Municipality", wards: 7 },
          { name: "Palata", type: "Rural Municipality", wards: 9 }
        ]
      },
      {
        name: "Mugu",
        municipalities: [
          { name: "Chhayanath Rara", type: "Municipality", wards: 14 },
          { name: "Mugum Karmarong", type: "Rural Municipality", wards: 9 },
          { name: "Soru", type: "Rural Municipality", wards: 11 },
          { name: "Khatyad", type: "Rural Municipality", wards: 11 }
        ]
      },
      {
        name: "Salyan",
        municipalities: [
          { name: "Shaarda", type: "Municipality", wards: 15 },
          { name: "Bangad Kupinde", type: "Municipality", wards: 12 },
          { name: "Bagchaur", type: "Municipality", wards: 12 },
          { name: "Kalimati", type: "Rural Municipality", wards: 7 },
          { name: "Tribeni", type: "Rural Municipality", wards: 6 },
          { name: "Kapurkot", type: "Rural Municipality", wards: 6 },
          { name: "Chhatreswari", type: "Rural Municipality", wards: 7 },
          { name: "Siddha Kumakh", type: "Rural Municipality", wards: 5 },
          { name: "Kumakh", type: "Rural Municipality", wards: 7 },
          { name: "Darma", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Western Rukum",
        municipalities: [
          { name: "Musikot", type: "Municipality", wards: 14 },
          { name: "Chaurjahari", type: "Municipality", wards: 14 },
          { name: "Aathbiskot", type: "Municipality", wards: 14 },
          { name: "Banfikot", type: "Rural Municipality", wards: 10 },
          { name: "Tribeni", type: "Rural Municipality", wards: 10 },
          { name: "Sani Bheri", type: "Rural Municipality", wards: 11 }
        ]
      },
      {
        name: "Surkhet",
        municipalities: [
          { name: "Birendranagar", type: "Municipality", wards: 16 },
          { name: "Bheriganga", type: "Municipality", wards: 13 },
          { name: "Gurbhakot", type: "Municipality", wards: 14 },
          { name: "Panchapuri", type: "Municipality", wards: 11 },
          { name: "Lekbeshi", type: "Municipality", wards: 10 },
          { name: "Chaukune", type: "Rural Municipality", wards: 10 },
          { name: "Barahatal", type: "Rural Municipality", wards: 10 },
          { name: "Chingad", type: "Rural Municipality", wards: 6 },
          { name: "Simta", type: "Rural Municipality", wards: 9 }
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Sudurpashchim",
    districts: [
      {
        name: "Achham",
        municipalities: [
          { name: "Mangalsen", type: "Municipality", wards: 14 },
          { name: "Kamalbazar", type: "Municipality", wards: 10 },
          { name: "Sanphebagar", type: "Municipality", wards: 14 },
          { name: "Panchadewal Binayak", type: "Municipality", wards: 9 },
          { name: "Chaurpati", type: "Rural Municipality", wards: 7 },
          { name: "Mellekh", type: "Rural Municipality", wards: 8 },
          { name: "Bannigadhi Jayagadh", type: "Rural Municipality", wards: 6 },
          { name: "Ramaroshan", type: "Rural Municipality", wards: 7 },
          { name: "Dhakarawal", type: "Rural Municipality", wards: 8 },
          { name: "Turmakhand", type: "Rural Municipality", wards: 8 }
        ]
      },
      {
        name: "Baitadi",
        municipalities: [
          { name: "Dasharathchand", type: "Municipality", wards: 11 },
          { name: "Patan", type: "Municipality", wards: 10 },
          { name: "Melauli", type: "Municipality", wards: 9 },
          { name: "Purchaudi", type: "Municipality", wards: 10 },
          { name: "Sunary", type: "Rural Municipality", wards: 9 },
          { name: "Sigas", type: "Rural Municipality", wards: 9 },
          { name: "Shivanath", type: "Rural Municipality", wards: 6 },
          { name: "Pancheshwar", type: "Rural Municipality", wards: 6 },
          { name: "Dogadakedar", type: "Rural Municipality", wards: 8 },
          { name: "Dilasaini", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Bajhang",
        municipalities: [
          { name: "Jaya Prithvi", type: "Municipality", wards: 11 },
          { name: "Bungal", type: "Municipality", wards: 11 },
          { name: "Talkot", type: "Rural Municipality", wards: 7 },
          { name: "Thalara", type: "Rural Municipality", wards: 9 },
          { name: "Bitthadchir", type: "Rural Municipality", wards: 9 },
          { name: "Surma", type: "Rural Municipality", wards: 5 },
          { name: "Chhabis Pathibhera", type: "Rural Municipality", wards: 7 },
          { name: "Durgathali", type: "Rural Municipality", wards: 7 },
          { name: "Kedarsyu", type: "Rural Municipality", wards: 9 },
          { name: "Khaptad Chhanna", type: "Rural Municipality", wards: 7 },
          { name: "Masta", type: "Rural Municipality", wards: 7 },
          { name: "Saipal", type: "Rural Municipality", wards: 5 }
        ]
      },
      {
        name: "Bajura",
        municipalities: [
          { name: "Badimalika", type: "Municipality", wards: 9 },
          { name: "Triveni", type: "Municipality", wards: 9 },
          { name: "Budhiganga", type: "Municipality", wards: 10 },
          { name: "Budhinanda", type: "Municipality", wards: 10 },
          { name: "Gaumul", type: "Rural Municipality", wards: 6 },
          { name: "Jagannath", type: "Rural Municipality", wards: 6 },
          { name: "Swamikartik Khapar", type: "Rural Municipality", wards: 5 },
          { name: "Khedam", type: "Rural Municipality", wards: 6 },
          { name: "Himali", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Darchula",
        municipalities: [
          { name: "Mahakali", type: "Municipality", wards: 9 },
          { name: "Shailya Shikhar", type: "Municipality", wards: 9 },
          { name: "Malikarjun", type: "Rural Municipality", wards: 8 },
          { name: "Apihimal", type: "Rural Municipality", wards: 6 },
          { name: "Duhun", type: "Rural Municipality", wards: 5 },
          { name: "Naugad", type: "Rural Municipality", wards: 6 },
          { name: "Marma", type: "Rural Municipality", wards: 6 },
          { name: "Lekam", type: "Rural Municipality", wards: 6 },
          { name: "Byas", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Doti",
        municipalities: [
          { name: "Dipayal Silgadhi", type: "Municipality", wards: 9 },
          { name: "Shikhar", type: "Municipality", wards: 11 },
          { name: "Purbichowki", type: "Rural Municipality", wards: 7 },
          { name: "Badikedar", type: "Rural Municipality", wards: 5 },
          { name: "Jorayal", type: "Rural Municipality", wards: 6 },
          { name: "Sayal", type: "Rural Municipality", wards: 6 },
          { name: "Adharsha", type: "Rural Municipality", wards: 7 },
          { name: "K.I. Singh", type: "Rural Municipality", wards: 7 },
          { name: "Boghatan Phudsil", type: "Rural Municipality", wards: 7 }
        ]
      },
      {
        name: "Kailali",
        municipalities: [
          { name: "Dhangadhi", type: "Sub-Metropolitan City", wards: 19 },
          { name: "Tikapur", type: "Municipality", wards: 9 },
          { name: "Ghodaghodi", type: "Municipality", wards: 12 },
          { name: "Lamki Chuha", type: "Municipality", wards: 10 },
          { name: "Bhajani", type: "Municipality", wards: 9 },
          { name: "Godawari", type: "Municipality", wards: 12 },
          { name: "Gauriganga", type: "Municipality", wards: 11 },
          { name: "Janaki", type: "Rural Municipality", wards: 9 },
          { name: "Bardagoriya", type: "Rural Municipality", wards: 6 },
          { name: "Mohanyal", type: "Rural Municipality", wards: 7 },
          { name: "Kailari", type: "Rural Municipality", wards: 9 },
          { name: "Joshipur", type: "Rural Municipality", wards: 7 },
          { name: "Chura", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Kanchanpur",
        municipalities: [
          { name: "Bhimdatta", type: "Municipality", wards: 19 },
          { name: "Punarbas", type: "Municipality", wards: 11 },
          { name: "Bedkot", type: "Municipality", wards: 10 },
          { name: "Mahakali", type: "Municipality", wards: 10 },
          { name: "Shuklaphanta", type: "Municipality", wards: 12 },
          { name: "Belauri", type: "Municipality", wards: 10 },
          { name: "Krishnapur", type: "Municipality", wards: 9 },
          { name: "Beldandi", type: "Rural Municipality", wards: 5 },
          { name: "Laljhadi", type: "Rural Municipality", wards: 6 }
        ]
      },
      {
        name: "Dadeldhura",
        municipalities: [
          { name: "Amargadhi", type: "Municipality", wards: 11 },
          { name: "Parshuram", type: "Municipality", wards: 12 },
          { name: "Aalital", type: "Rural Municipality", wards: 8 },
          { name: "Bhageshwar", type: "Rural Municipality", wards: 5 },
          { name: "Navadurga", type: "Rural Municipality", wards: 5 },
          { name: "Ajaymeru", type: "Rural Municipality", wards: 6 },
          { name: "Ganyapdhura", type: "Rural Municipality", wards: 5 }
        ]
      }
    ]
  }
];

export function getProvinceNames(): string[] {
  return NEPAL_PROVINCES.map((p) => p.name);
}

export function getDistrictsByProvince(provinceName: string): string[] {
  const province = NEPAL_PROVINCES.find((p) => p.name === provinceName);
  return province ? province.districts.map((d) => d.name) : [];
}

export function getMunicipalitiesByDistrict(districtName: string): string[] {
  for (const province of NEPAL_PROVINCES) {
    const district = province.districts.find((d) => d.name === districtName);
    if (district) return district.municipalities.map((m) => m.name);
  }
  return [];
}

export function getWardCount(districtName: string, municipalityName: string): number {
  for (const province of NEPAL_PROVINCES) {
    const district = province.districts.find((d) => d.name === districtName);
    if (district) {
      const muni = district.municipalities.find((m) => m.name === municipalityName);
      if (muni) return muni.wards;
    }
  }
  return 15;
}

export function getAllDistrictsFlat(): { district: string; province: string }[] {
  const result: { district: string; province: string }[] = [];
  for (const province of NEPAL_PROVINCES) {
    for (const district of province.districts) {
      result.push({ district: district.name, province: province.name });
    }
  }
  return result;
}
