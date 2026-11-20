import type { GeopoliticalZone } from "@/types/database";

export interface StateSeed {
  id: number;
  code: string;
  name: string;
  zone: GeopoliticalZone;
  lgas: string[];
}

export interface WardOption {
  id: number;
  lga_id: number;
  state_id: number;
  code: string;
  name: string;
}

export interface PollingUnitOption {
  id: number;
  ward_id: number;
  lga_id: number;
  state_id: number;
  pu_code: string;
  name: string;
}

/**
 * Complete 36 States + FCT (37) and all 774 Official Local Government Areas of Nigeria.
 */
export const NIGERIA_STATES: StateSeed[] = [
  {
    id: 1,
    code: "AB",
    name: "Abia",
    zone: "South East",
    lgas: [
      "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North",
      "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma Ngwa",
      "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi",
    ],
  },
  {
    id: 2,
    code: "AD",
    name: "Adamawa",
    zone: "North East",
    lgas: [
      "Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde",
      "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North", "Mubi South", "Numan",
      "Shelleng", "Song", "Toungo", "Yola North", "Yola South",
    ],
  },
  {
    id: 3,
    code: "AK",
    name: "Akwa Ibom",
    zone: "South South",
    lgas: [
      "Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan",
      "Ibeno", "Ibesikpo Asutan", "Ibiono Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene",
      "Ini", "Itu", "Mbo", "Mkpat Enin", "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara",
      "Okobo", "Onna", "Oron", "Oruk Anam", "Udung Uko", "Ukanafun", "Uruan",
      "Urue-Offong/Oruko", "Uyo",
    ],
  },
  {
    id: 4,
    code: "AN",
    name: "Anambra",
    zone: "South East",
    lgas: [
      "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South",
      "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala",
      "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South",
      "Orumba North", "Orumba South", "Oyi",
    ],
  },
  {
    id: 5,
    code: "BA",
    name: "Bauchi",
    zone: "North East",
    lgas: [
      "Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa",
      "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira",
      "Tafawa Balewa", "Toro", "Warji", "Zaki",
    ],
  },
  {
    id: 6,
    code: "BY",
    name: "Bayelsa",
    zone: "South South",
    lgas: [
      "Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama",
      "Southern Ijaw", "Yenagoa",
    ],
  },
  {
    id: 7,
    code: "BE",
    name: "Benue",
    zone: "North Central",
    lgas: [
      "Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West",
      "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo",
      "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya",
    ],
  },
  {
    id: 8,
    code: "BO",
    name: "Borno",
    zone: "North East",
    lgas: [
      "Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa",
      "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga",
      "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar",
      "Monguno", "Ngala", "Nganzai", "Shani",
    ],
  },
  {
    id: 9,
    code: "CR",
    name: "Cross River",
    zone: "South South",
    lgas: [
      "Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki",
      "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra",
      "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala",
    ],
  },
  {
    id: 10,
    code: "DE",
    name: "Delta",
    zone: "South South",
    lgas: [
      "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West",
      "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West",
      "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North",
      "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West",
    ],
  },
  {
    id: 11,
    code: "EB",
    name: "Ebonyi",
    zone: "South East",
    lgas: [
      "Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South",
      "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha",
    ],
  },
  {
    id: 12,
    code: "ED",
    name: "Edo",
    zone: "South South",
    lgas: [
      "Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West",
      "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba-Okha", "Oredo",
      "Orhionmwon", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde",
    ],
  },
  {
    id: 13,
    code: "EK",
    name: "Ekiti",
    zone: "South West",
    lgas: [
      "Ado-Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure",
      "Gbonyin", "Ido-Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun",
      "Ise/Orun", "Moba", "Oye",
    ],
  },
  {
    id: 14,
    code: "EN",
    name: "Enugu",
    zone: "South East",
    lgas: [
      "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti",
      "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka",
      "Oji River", "Udenu", "Udi", "Uzo-Uwani",
    ],
  },
  {
    id: 15,
    code: "FC",
    name: "FCT Abuja",
    zone: "North Central",
    lgas: ["Abaji", "Abuja Municipal (AMAC)", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  },
  {
    id: 16,
    code: "GO",
    name: "Gombe",
    zone: "North East",
    lgas: [
      "Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo",
      "Kwami", "Nafada", "Shongom", "Yamaltu/Deba",
    ],
  },
  {
    id: 17,
    code: "IM",
    name: "Imo",
    zone: "South East",
    lgas: [
      "Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte Mbaise", "Ideato North",
      "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli",
      "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema",
      "Okigwe", "Onuimo", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal",
      "Owerri North", "Owerri West",
    ],
  },
  {
    id: 18,
    code: "JI",
    name: "Jigawa",
    zone: "North West",
    lgas: [
      "Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki",
      "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kaugama",
      "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim",
      "Roni", "Sule Tankarkar", "Taura", "Yankwashi",
    ],
  },
  {
    id: 19,
    code: "KD",
    name: "Kaduna",
    zone: "North West",
    lgas: [
      "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia",
      "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau",
      "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria",
    ],
  },
  {
    id: 20,
    code: "KN",
    name: "Kano",
    zone: "North West",
    lgas: [
      "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta",
      "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam",
      "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya",
      "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa",
      "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa",
      "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil",
    ],
  },
  {
    id: 21,
    code: "KT",
    name: "Katsina",
    zone: "North West",
    lgas: [
      "Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja",
      "Dan Musa", "Daura", "Dutsi", "Dutsin-Ma", "Faskari", "Funtua", "Ingawa", "Jibia",
      "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua",
      "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana",
      "Sandamu", "Zango",
    ],
  },
  {
    id: 22,
    code: "KE",
    name: "Kebbi",
    zone: "North West",
    lgas: [
      "Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi",
      "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba",
      "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru",
    ],
  },
  {
    id: 23,
    code: "KO",
    name: "Kogi",
    zone: "North Central",
    lgas: [
      "Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela-Odolu",
      "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa-Muro", "Ofu", "Ogori/Magongo",
      "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West",
    ],
  },
  {
    id: 24,
    code: "KW",
    name: "Kwara",
    zone: "North Central",
    lgas: [
      "Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South",
      "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi",
    ],
  },
  {
    id: 25,
    code: "LA",
    name: "Lagos",
    zone: "South West",
    lgas: [
      "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe",
      "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island",
      "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere",
    ],
  },
  {
    id: 26,
    code: "NA",
    name: "Nasarawa",
    zone: "North Central",
    lgas: [
      "Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia",
      "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba",
    ],
  },
  {
    id: 27,
    code: "NI",
    name: "Niger",
    zone: "North Central",
    lgas: [
      "Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara",
      "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa",
      "Munya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi",
    ],
  },
  {
    id: 28,
    code: "OG",
    name: "Ogun",
    zone: "South West",
    lgas: [
      "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South",
      "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode",
      "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu",
      "Ogun Waterside", "Remo North", "Sagamu",
    ],
  },
  {
    id: 29,
    code: "ON",
    name: "Ondo",
    zone: "South West",
    lgas: [
      "Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West",
      "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje",
      "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West",
      "Ose", "Owo",
    ],
  },
  {
    id: 30,
    code: "OS",
    name: "Osun",
    zone: "South West",
    lgas: [
      "Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe",
      "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East", "Ife North",
      "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun",
      "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade",
      "Orolu", "Osogbo",
    ],
  },
  {
    id: 31,
    code: "OY",
    name: "Oyo",
    zone: "South West",
    lgas: [
      "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East",
      "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central",
      "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa",
      "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo",
      "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East",
      "Saki West", "Surulere",
    ],
  },
  {
    id: 32,
    code: "PL",
    name: "Plateau",
    zone: "North Central",
    lgas: [
      "Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam",
      "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin",
      "Qua'an Pan", "Riyom", "Shendam", "Wase",
    ],
  },
  {
    id: 33,
    code: "RI",
    name: "Rivers",
    zone: "South South",
    lgas: [
      "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru",
      "Bonny", "Degema", "Eleme", "Emohua", "Etche", "Gokana", "Ikwerre", "Khana",
      "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro",
      "Oyigbo", "Port Harcourt", "Tai",
    ],
  },
  {
    id: 34,
    code: "SO",
    name: "Sokoto",
    zone: "North West",
    lgas: [
      "Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela",
      "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North",
      "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo",
    ],
  },
  {
    id: 35,
    code: "TA",
    name: "Taraba",
    zone: "North East",
    lgas: [
      "Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido",
      "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing",
    ],
  },
  {
    id: 36,
    code: "YO",
    name: "Yobe",
    zone: "North East",
    lgas: [
      "Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko",
      "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari",
    ],
  },
  {
    id: 37,
    code: "ZA",
    name: "Zamfara",
    zone: "North West",
    lgas: [
      "Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau",
      "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Chafe (Tsafe)", "Zurmi",
    ],
  },
];

// Curated authentic INEC Wards for anchor LGAs; all other LGAs deterministically get structured Ward 01..10 lists
// in Demo Mode (replaced by full 8,809 Wards & 176,846 PUs when seeded to Supabase via `npm run seed:inec`).
const CURATED_WARDS: Record<string, string[]> = {
  "32::Jos South": [
    "Bukuru", "Du (Rayfield / Mazaram)", "Giring", "Gyel A", "Gyel B",
    "Kuru", "Shen", "Turu", "Vwang", "Zawan A", "Zawan B",
  ],
  "32::Jos North": [
    "Abba Na Shehu", "Ali Kazaure", "Garba Daho", "Gangare", "Ibrahim Katsina",
    "Jenta Adamu", "Jenta Apata", "Jos Jarawa", "Lamingo / Tudun Wada", "Naraguta A",
    "Naraguta B", "Sarkin Arab", "Tafawa Balewa", "Vanderpuye",
  ],
  "31::Ibadan North": [
    "Ward I (Beere / Oje)", "Ward II (Inalende)", "Ward III (Yemetu / Adeoyo)",
    "Ward IV (Agodi / Mokola)", "Ward V (Bodija / Ashi)", "Ward VI (Sabo)",
    "Ward VII (Oke-Itunu)", "Ward VIII (Sango / UI)", "Ward IX (Agbowo)", "Ward X (Samonda)",
  ],
  "31::Ibadan South-West": [
    "Ring Road / Challenge", "Oluyole Estate", "Oke-Ado", "Molete", "Foko", "Oja-Oba", "Apata",
  ],
  "21::Daura": [
    "Kusugu", "Mazoji A", "Mazoji B", "Madobi A", "Madobi B", "Sabon Gari",
    "Sarkin Yara A", "Sarkin Yara B", "Tudun Wada", "Ubandawaki A", "Ubandawaki B",
  ],
  "21::Katsina": [
    "Kangiwa", "Kofar Marusa", "Kofar Sauri", "Shinkafi A", "Shinkafi B",
    "Wakilin Gabas I", "Wakilin Kudu I", "Wakilin Yamma I",
  ],
  "15::Abuja Municipal (AMAC)": [
    "City Centre", "Garki", "Gwarinpa", "Gui", "Gwagwa", "Jiwa", "Kabusa",
    "Karshi", "Karu", "Nyanya", "Orozo", "Wuse",
  ],
  "25::Ikeja": [
    "Alausa / Oregun", "Anifowoshe", "GRA Ikeja", "Ipodo / Seriki Aro",
    "Ojodu", "Oke-Ira", "Onigbongbo", "Wasimi",
  ],
  "25::Alimosho": [
    "Akowonjo", "Egbeda", "Idimu", "Igando / Egan", "Ikotun", "Ipaja North", "Ipaja South", "Shasha",
  ],
  "5::Bauchi": [
    "Dan Amar A", "Dan Amar B", "Dan Iya", "Dankade", "Dawaki",
    "Makama Sarkin Baki A", "Makama Sarkin Baki B", "Majidadi A", "Tirwun",
  ],
  "20::Kano Municipal": [
    "Chedi", "Dan Agundi", "Gandun Albasa", "Jakara", "Kankarofi", "Sharada", "Zaitawa",
  ],
  "33::Port Harcourt": [
    "Amadi-Ama", "Borokiri", "Diobu Mile I", "Diobu Mile II", "Diobu Mile III",
    "New GRA", "Old GRA / Town", "Trans-Amadi",
  ],
};

const CURATED_PUS: Record<string, string[]> = {
  "Du (Rayfield / Mazaram)": [
    "Mazaram Rayfield Primary School I",
    "Opp. Jos City Park / Rabo Plaza Open Space",
    "Rayfield Government House Gate Square",
    "Du Central Town Hall I",
    "Rayfield Civic Centre II",
    "Zarmaganda Junction Open Space",
  ],
  "Bukuru": [
    "Bukuru Central Primary School I",
    "Bukuru Low-Cost Housing Square",
    "Gyero Road Market Square",
    "Kugiya Community Hall",
  ],
  "Ward V (Bodija / Ashi)": [
    "Old Bodija Community Centre I",
    "New Bodija Housing Estate Primary School",
    "Ashi Junction Civic Hall",
    "Kongi Layout Open Space",
  ],
  "Kusugu": [
    "Kusugu Well Heritage Square I",
    "Daura Model Primary School II",
    "Emir's Palace Frontage Open Space",
    "Kofar Baru Community Hall",
  ],
  "Wuse": [
    "Wuse Zone 2 Primary School I",
    "Wuse Zone 4 Plaza Open Space",
    "Wuse II Aminu Kano Crescent Civic Point",
    "Berger Junction Transit Square",
  ],
};

export interface LgaOption {
  id: number;
  state_id: number;
  code: string;
  name: string;
}

export function getAllLgasForState(stateId: number): LgaOption[] {
  const state = NIGERIA_STATES.find((s) => s.id === stateId);
  if (!state) return [];
  return state.lgas.map((name, idx) => ({
    id: stateId * 100 + (idx + 1),
    state_id: stateId,
    code: `${state.code}-${String(idx + 1).padStart(2, "0")}`,
    name,
  }));
}

export function getStateById(stateId: number | null | undefined): StateSeed | undefined {
  if (!stateId) return undefined;
  return NIGERIA_STATES.find((s) => s.id === stateId);
}

export function getLgaById(lgaId: number | null | undefined): LgaOption | undefined {
  if (!lgaId) return undefined;
  const stateId = Math.floor(lgaId / 100);
  return getAllLgasForState(stateId).find((l) => l.id === lgaId);
}

export function getWardsForLga(stateId: number, lgaId: number): WardOption[] {
  const lga = getLgaById(lgaId);
  if (!lga) return [];
  const key = `${stateId}::${lga.name}`;
  const wardNames = CURATED_WARDS[key] ?? [
    `${lga.name} Central Ward I`,
    `${lga.name} North Ward II`,
    `${lga.name} South Ward III`,
    `${lga.name} East Ward IV`,
    `${lga.name} West Ward V`,
    `${lga.name} Township Ward VI`,
    `${lga.name} Market Ward VII`,
    `${lga.name} Rural Ward VIII`,
  ];
  return wardNames.map((name, idx) => ({
    id: lgaId * 100 + (idx + 1),
    lga_id: lgaId,
    state_id: stateId,
    code: `W${String(idx + 1).padStart(2, "0")}`,
    name,
  }));
}

export function getPollingUnitsForWard(
  stateId: number,
  lgaId: number,
  wardId: number
): PollingUnitOption[] {
  const wards = getWardsForLga(stateId, lgaId);
  const ward = wards.find((w) => w.id === wardId);
  if (!ward) return [];
  const state = getStateById(stateId);
  const stateCode = state?.code ?? "NG";
  const puNames = CURATED_PUS[ward.name] ?? [
    `${ward.name} Primary School I`,
    `${ward.name} Primary School II`,
    `${ward.name} Civic Town Hall`,
    `${ward.name} Market Square Open Space`,
    `${ward.name} Health Centre Frontage`,
    `${ward.name} Community Secondary School`,
  ];

  return puNames.map((name, idx) => ({
    id: wardId * 100 + (idx + 1),
    ward_id: wardId,
    lga_id: lgaId,
    state_id: stateId,
    pu_code: `${stateCode}/${ward.code}/PU-${String(idx + 1).padStart(3, "0")}`,
    name,
  }));
}

