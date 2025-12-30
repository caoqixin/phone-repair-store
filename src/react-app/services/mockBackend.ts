import {
  Appointment,
  AppointmentStatus,
  ContactMessage,
  IssueType,
  User,
  BusinessSettings,
  ServiceItem,
  CarrierProvider,
} from "../types";

// Storage Keys
const APPOINTMENTS_KEY = "lunatech_appointments";
const CONTACTS_KEY = "lunatech_contacts";
const SESSION_KEY = "lunatech_admin_session";
const SETTINGS_KEY = "lunatech_settings";
const SERVICES_KEY = "lunatech_services";
const CARRIERS_KEY = "lunatech_carriers";

// --- Auth Service (Simulated) ---

export const authService = {
  login: async (password: string): Promise<boolean> => {
    if (password === "admin123") {
      const user: User = { id: "1", username: "admin" };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(SESSION_KEY);
  },
};

// --- Appointment Service ---

export const appointmentService = {
  create: async (
    data: Omit<Appointment, "id" | "status" | "createdAt">
  ): Promise<Appointment> => {
    const appointments = appointmentService.getAll();
    const newAppointment: Appointment = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      status: AppointmentStatus.PENDING,
      createdAt: Date.now(),
    };
    appointments.push(newAppointment);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    return newAppointment;
  },

  getAll: (): Appointment[] => {
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  updateStatus: async (
    id: string,
    status: AppointmentStatus
  ): Promise<void> => {
    const appointments = appointmentService.getAll();
    const index = appointments.findIndex((a) => a.id === id);
    if (index !== -1) {
      appointments[index].status = status;
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    }
  },

  delete: async (id: string): Promise<void> => {
    const appointments = appointmentService.getAll();
    const filtered = appointments.filter((a) => a.id !== id);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
  },
};

// --- Contact Service ---

export const contactService = {
  create: async (
    data: Omit<ContactMessage, "id" | "isRead" | "createdAt">
  ): Promise<void> => {
    const contacts = contactService.getAll();
    const newMessage: ContactMessage = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      isRead: false,
      createdAt: Date.now(),
    };
    contacts.push(newMessage);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  },

  getAll: (): ContactMessage[] => {
    const data = localStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  markAsRead: async (id: string): Promise<void> => {
    const contacts = contactService.getAll();
    const index = contacts.findIndex((c) => c.id === id);
    if (index !== -1) {
      contacts[index].isRead = true;
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    }
  },
};

// --- Services Service ---

export const servicesService = {
  getAll: (): ServiceItem[] => {
    const data = localStorage.getItem(SERVICES_KEY);
    if (data) return JSON.parse(data);

    // Default Services Seed
    const defaults: ServiceItem[] = [
      {
        id: "1",
        iconName: "Wrench",
        titleIt: "Riparazioni",
        titleCn: "手机维修",
        descriptionIt: "Schermi, batterie, connettori.",
        descriptionCn: "专业更换屏幕、电池、尾插。",
      },
      {
        id: "2",
        iconName: "Smartphone",
        titleIt: "SIM & Telefonia",
        titleCn: "电话卡办理",
        descriptionIt: "Attivazione SIM e ricariche.",
        descriptionCn: "开卡充值一站式服务。",
      },
      {
        id: "3",
        iconName: "Truck",
        titleIt: "Spedizioni",
        titleCn: "快递服务",
        descriptionIt: "Punto ritiro e spedizione.",
        descriptionCn: "包裹代收代寄。",
      },
      {
        id: "4",
        iconName: "CreditCard",
        titleIt: "Mooney",
        titleCn: "缴费支付",
        descriptionIt: "Bollettini, PagoPA.",
        descriptionCn: "缴纳水电单，PagoPA。",
      },
    ];
    localStorage.setItem(SERVICES_KEY, JSON.stringify(defaults));
    return defaults;
  },

  create: async (item: Omit<ServiceItem, "id">): Promise<void> => {
    const items = servicesService.getAll();
    const newItem = { ...item, id: Math.random().toString(36).substring(2, 9) };
    items.push(newItem);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(items));
  },

  update: async (item: ServiceItem): Promise<void> => {
    const items = servicesService.getAll();
    const index = items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      items[index] = item;
      localStorage.setItem(SERVICES_KEY, JSON.stringify(items));
    }
  },

  delete: async (id: string): Promise<void> => {
    const items = servicesService.getAll();
    const filtered = items.filter((i) => i.id !== id);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(filtered));
  },
};

// --- Carrier Service (New) ---

export const carrierService = {
  getAll: (): CarrierProvider[] => {
    const data = localStorage.getItem(CARRIERS_KEY);
    if (data) return JSON.parse(data);

    // Seed Defaults
    const defaults: CarrierProvider[] = [
      {
        id: "1",
        name: "BRT",
        searchUrl: "https://vas.brt.it/vas/sped_det_show.jsp?spediz=",
      },
      {
        id: "2",
        name: "UPS",
        searchUrl: "https://www.ups.com/track?track=yes&tracknum=",
      },
      {
        id: "3",
        name: "InPost",
        searchUrl: "https://inpost.it/trova-il-tuo-pacco?number=",
      },
      {
        id: "4",
        name: "Amazon",
        searchUrl:
          "https://www.amazon.it/progress-tracker/package/ref=pt_redirect?itemId=&orderId=&packageIndex=0&shipmentId=",
      },
      {
        id: "5",
        name: "DHL",
        searchUrl:
          "https://www.dhl.com/it-it/home/tracking/tracking-express.html?submit=1&tracking-id=",
      },
      {
        id: "6",
        name: "Poste Italiane",
        searchUrl: "https://www.poste.it/cerca/index.html#/",
      },
    ];
    localStorage.setItem(CARRIERS_KEY, JSON.stringify(defaults));
    return defaults;
  },

  create: async (carrier: Omit<CarrierProvider, "id">): Promise<void> => {
    const items = carrierService.getAll();
    const newItem = {
      ...carrier,
      id: Math.random().toString(36).substring(2, 9),
    };
    items.push(newItem);
    localStorage.setItem(CARRIERS_KEY, JSON.stringify(items));
  },

  delete: async (id: string): Promise<void> => {
    const items = carrierService.getAll();
    const filtered = items.filter((c) => c.id !== id);
    localStorage.setItem(CARRIERS_KEY, JSON.stringify(filtered));
  },
};

// --- Settings/CMS Service ---

export const settingsService = {
  get: (): BusinessSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) return JSON.parse(data);

    // Default Settings
    return {
      isOpen: true,
      announcementIt: "",
      announcementCn: "",
      openingTime: "09:30",
      closingTime: "19:30",
      weekendOpeningTime: "10:00",
      weekendClosingTime: "18:00",

      shopName: "LunaTech",
      logoUrl: "",
      address: "Via dell'Indipendenza, 99, 40121 Bologna BO",
      phone: "+39 333 123 4567",
      email: "info@lunatech.it",

      heroTitleIt: "Riparazione Smartphone Rapida a Bologna",
      heroTitleCn: "博洛尼亚专业手机快修",
      heroSubtitleIt:
        "Tecnologia avanzata per il tuo dispositivo. Schermi, batterie e assistenza software immediata.",
      heroSubtitleCn:
        "为您的设备提供先进技术支持。屏幕更换，电池续航，系统维护，立等可取。",
      aboutTextIt:
        "Siamo un centro riparazioni specializzato a Bologna, focalizzato sulla velocità e sulla qualità.",
      aboutTextCn:
        "LunaTech 是博洛尼亚的一家专业手机维修中心，致力于提供快速、高质量的维修服务。",

      facebookUrl: "",
      instagramUrl: "",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2845.890696956784!2d11.3409!3d44.5005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDMwJzAxLjgiTiAxMcKwMjAnMjcuMiJF!5e0!3m2!1sen!2sit!4v1620000000000!5m2!1sen!2sit",
    };
  },

  update: async (settings: BusinessSettings): Promise<void> => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
};

// Seed
const seedData = () => {
  if (!localStorage.getItem(APPOINTMENTS_KEY)) {
    // Seed appointments...
  }
  // Ensure default data exist
  servicesService.getAll();
  carrierService.getAll();
};
seedData();
