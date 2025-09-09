/**
 * Constants and mappings for ATLAS operators catalog
 * Extracted from app.js global scope
 */

// Category-Type mapping for dynamic filtering
export const CATEGORY_TYPE_MAP = {
  'dominantni': ['Dominantni operater'],
  'mobilni_mvno': ['Mobilni operater', 'MVNO operater'],
  'regionalni_isp': ['Internet servis provajder', 'Kablovski operater'],
  'enterprise_b2b': ['B2B provajder', 'IT provajder']
};

// Technology mapping for readable names
export const TECH_NAMES = {
  // Mobilne tehnologije
  'tech_2g': 'GSM 2G',
  'tech_3g': 'UMTS 3G',
  'tech_4g': 'LTE 4G',
  'tech_4g_lte': 'LTE 4G',
  'tech_5g_ready': '5G Ready',
  'tech_5g': '5G',
  'tech_volte': 'VoLTE',
  'tech_vowifi': 'VoWiFi',
  'tech_ims_mobile': 'IMS Mobile',
  'tech_hlr_hss': 'HLR/HSS',
  'tech_eir': 'EIR',
  'tech_smsc_mmsc': 'SMSC/MMSC',
  'tech_mvno': 'MVNO Platform',
  'tech_esim': 'eSIM',
  'tech_mnp': 'MNP',

  // Fiksne tehnologije
  'tech_pstn': 'PSTN',
  'tech_isdn': 'ISDN',
  'tech_voip_fixed': 'VoIP Fixed',
  'tech_ims_fixed': 'IMS Fixed',
  'tech_softswitch_fixed': 'Softswitch',

  // Mrežne tehnologije
  'tech_ftth_fttb': 'FTTH/FTTB',
  'tech_xdsl': 'xDSL',
  'tech_docsis': 'DOCSIS',
  'tech_ipv4': 'IPv4',
  'tech_ipv6': 'IPv6',
  'tech_cgnat': 'CG-NAT',
  'tech_mpls': 'MPLS',
  'tech_sdwan': 'SD-WAN',
  'tech_cdn': 'CDN',
  'tech_fixed_wireless': 'Fixed Wireless',
  'tech_satellite': 'Satellite',
  'tech_vsat': 'VSAT',
  'tech_cable': 'Cable',
  'tech_fiber': 'Fiber Optic',
  'tech_data_center': 'Data Center',
  'tech_cloud': 'Cloud',
  'tech_cybersecurity': 'Cybersecurity',
  'tech_sip': 'SIP',
  'tech_vpn': 'VPN',
  'iptv_platform': 'IPTV Platform',
  'satellite_tv_infrastructure': 'Satellite TV',
  'tech_multiplex_d': 'Multiplex D',
  'tech_digital_terrestrial': 'Digital Terrestrial'
};

// Service mapping for readable names
export const SERVICE_NAMES = {
  // Mobilne usluge
  'mobile_prepaid': 'Mobilni Prepaid',
  'mobile_postpaid': 'Mobilni Postpaid',
  'mobile_esim': 'eSIM',
  'mobile_volte_vowifi': 'VoLTE/VoWiFi',
  'mobile_roaming': 'Roaming',
  'mobile_mnp': 'MNP',
  'roaming_internet_options': 'Roaming Internet',

  // Fiksne usluge
  'fixed_pstn': 'PSTN',
  'fixed_isdn': 'ISDN',
  'fixed_voip': 'VoIP',
  'ip_centrex': 'IP Centrex',
  'fixed_portability': 'Portabilnost Brojeva',
  'glasovna_posta': 'Glasovna Pošta',

  // Internet usluge
  'internet_ftth': 'FTTH Internet',
  'internet_flat': 'Flat Internet',
  'internet_flying': 'Flying Internet',
  'internet_adsl_vdsl': 'ADSL/VDSL',
  'internet_mobile': 'Mobilni Internet',
  'internet_business': 'Poslovni Internet',
  'internet_dedicated': 'Dedicated Internet',
  'internet_vpn': 'VPN Internet',
  'internet_fixed_wireless': 'Fixed Wireless',
  'internet_satellite': 'Satelitski Internet',
  'internet_cable': 'Kablovski Internet',
  'netbiz_packages': 'NetBiz Paketi',
  'business_internet_packages': 'Poslovni Paketi',

  // TV usluge
  'sat_tv': 'Satelitska TV',
  'iptv': 'IPTV',
  'tv_streaming': 'TV Streaming',
  'cable_tv': 'Kablovska TV',
  'digital_tv': 'Digitalna TV',
  'multiplex_d_tv': 'Multiplex D TV',

  // Cloud/Poslovne usluge
  'data_center': 'Data Center',
  'system_integration': 'Sistemska Integracija',
  'smart_city': 'Smart City',
  'smart_home': 'Smart Home',
  'cloud_hosting': 'Cloud Hosting',
  'cloud_backup': 'Cloud Backup',
  'cloud_infra': 'Cloud Infrastruktura',
  'cybersecurity': 'Cyber Security',
  'it_consulting': 'IT Konsalting',
  'colocation': 'Colocation',
  'wholesale_services': 'Veleprodajne Usluge',
  'sms_gateway': 'SMS Gateway',
  'telemach_app': 'Telemach App',

  // Dodatne usluge
  'device_sales': 'Prodaja Uređaja',
  'terminal_equipment': 'Terminalna Oprema',
  'router_sales': 'Prodaja Rutera'
};

// Technology tooltips
export const TECH_TOOLTIPS = {
  'tech_2g': 'Druga generacija mobilnih mreža (GSM 900/1800 MHz)',
  'tech_3g': 'Treća generacija mobilnih mreža (UMTS 900/2100 MHz)',
  'tech_4g': 'Četvrta generacija mobilnih mreža (LTE 800/1800/2600 MHz)',
  'tech_4g_lte': 'Long Term Evolution - napredna 4G tehnologija',
  'tech_5g_ready': '5G Ready infrastruktura spremna za nadogradnju',
  'tech_volte': 'Voice over LTE - glasovni pozivi preko 4G mreže',
  'tech_vowifi': 'Voice over WiFi - glasovni pozivi preko WiFi',
  'tech_ims_mobile': 'IP Multimedia Subsystem za mobilne usluge',
  'tech_hlr_hss': 'Home Location Register / Home Subscriber Server',
  'tech_eir': 'Equipment Identity Register - registar uređaja',
  'tech_smsc_mmsc': 'SMS/MMS Center - centri za tekstualne poruke',
  'tech_ftth_fttb': 'Fiber to the Home/Building - optika do objekta',
  'tech_xdsl': 'Digital Subscriber Line tehnologije',
  'tech_docsis': 'Data Over Cable Service Interface - kablovski internet',
  'tech_ipv4': 'Internet Protocol verzija 4',
  'tech_ipv6': 'Internet Protocol verzija 6 - nova generacija',
  'tech_cgnat': 'Carrier Grade Network Address Translation',
  'tech_mpls': 'Multi-Protocol Label Switching',
  'tech_sdwan': 'Software Defined Wide Area Network',
  'tech_fixed_wireless': 'Bežični pristup fiksnoj lokaciji',
  'tech_satellite': 'Satelitske komunikacije',
  'tech_vsat': 'Very Small Aperture Terminal',
  'tech_pstn': 'Public Switched Telephone Network',
  'tech_isdn': 'Integrated Services Digital Network',
  'tech_voip_fixed': 'Voice over IP za fiksne linije',
  'iptv_platform': 'Internet Protocol Television platforma',
  'tech_multiplex_d': 'Multiplex D - digitalna radiodifuzija',
  'tech_digital_terrestrial': 'Digitalna zemaljska radiodifuzija',
  'tech_esim': 'Embedded SIM - digitalna SIM kartica',
  'tech_mnp': 'Mobile Number Portability - prenos brojeva'
};

// Service tooltips
export const SERVICE_TOOLTIPS = {
  'mobile_prepaid': 'Mobilne usluge sa pretplatom - plaćanje unapred',
  'mobile_postpaid': 'Mobilne usluge sa pretplatom - mesečno naplaćivanje',
  'mobile_esim': 'Embedded SIM - digitalna SIM kartica',
  'mobile_volte_vowifi': 'HD glasovni pozivi preko 4G/WiFi mreža',
  'mobile_roaming': 'Korišćenje usluga van domaće mreže',
  'mobile_mnp': 'Mobile Number Portability - prenos broja',
  'internet_ftth': 'Optički internet direktno do objekta',
  'internet_flat': 'Neograničeni internet bez FUP ograničenja',
  'internet_adsl_vdsl': 'Internet preko bakarnih linija',
  'internet_business': 'Poslovni internet sa SLA garantijama',
  'internet_dedicated': 'Dedicirani internet sa garantovanom brzinom',
  'sat_tv': 'Satelitska televizija sa HD/4K kvalitetom',
  'iptv': 'Televizija preko internet protokola',
  'data_center': 'Hosting i colocation usluge',
  'cloud_hosting': 'Virtuelni serveri u oblaku',
  'cybersecurity': 'Zaštita od cyber pretnji i napada',
  'smart_city': 'IoT rešenja za pametne gradove',
  'wholesale_services': 'B2B2C usluge za druge operatere',
  'internet_cable': 'Internet preko kablovskih mreža',
  'digital_tv': 'Digitalna televizija sa HD kvalitetom',
  'cable_tv': 'Kablovska televizija',
  'fixed_voip': 'VoIP telefonija za domaćinstva i preduzeća'
};
